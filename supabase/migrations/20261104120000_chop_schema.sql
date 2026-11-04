-- Chop: accounts, recipes, community submissions, photos and synced kitchen data.
-- Row Level Security is on for every table: people only see and change what they're allowed to.

-- ---------------------------------------------------------------------------
-- Profiles and roles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Every new account gets a profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Accounts created before this migration.
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: update own name" on public.profiles;
create policy "profiles: update own name" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- People can change their display name, never their role.
revoke update on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Admin management (only admins can call these).
create or replace function public.admin_list()
returns table (id uuid, email text, display_name text)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can see the admin list.';
  end if;
  return query
    select p.id, u.email::text, p.display_name
    from public.profiles p join auth.users u on u.id = p.id
    where p.role = 'admin'
    order by u.email;
end;
$$;

create or replace function public.set_admin(target_email text, make_admin boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  if not public.is_admin() then
    raise exception 'Only admins can change roles.';
  end if;
  select u.id into target from auth.users u where lower(u.email) = lower(trim(target_email));
  if target is null then
    raise exception 'No account uses this email yet. Ask them to create an account first.';
  end if;
  if not make_admin and (select count(*) from public.profiles where role = 'admin') <= 1
     and exists (select 1 from public.profiles where id = target and role = 'admin') then
    raise exception 'There must always be at least one admin.';
  end if;
  update public.profiles set role = case when make_admin then 'admin' else 'user' end where id = target;
end;
$$;

revoke execute on function public.admin_list() from public, anon;
revoke execute on function public.set_admin(text, boolean) from public, anon;
grant execute on function public.admin_list() to authenticated;
grant execute on function public.set_admin(text, boolean) to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Official recipes (written by admins, one per dish)
-- ---------------------------------------------------------------------------
create table if not exists public.recipes (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  -- Only for dishes that aren't in the family menu list.
  name text check (char_length(name) <= 120),
  section text check (section in ('breakfast', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'drinks')),
  tags text[] not null default '{}',
  prep_minutes integer not null default 0 check (prep_minutes between 0 and 10000),
  cook_minutes integer not null default 0 check (cook_minutes between 0 and 10000),
  servings integer not null default 4 check (servings between 1 and 1000),
  ingredients jsonb not null default '{"en": [], "fr": []}'::jsonb,
  steps jsonb not null default '{"en": [], "fr": []}'::jsonb,
  serving jsonb not null default '{"en": [], "fr": []}'::jsonb,
  images text[] not null default '{}',
  video text,
  sources jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.recipes enable row level security;

drop trigger if exists recipes_touch on public.recipes;
create trigger recipes_touch before update on public.recipes
  for each row execute function public.touch_updated_at();

drop policy if exists "recipes: anyone reads published" on public.recipes;
create policy "recipes: anyone reads published" on public.recipes
  for select using (published or public.is_admin());

drop policy if exists "recipes: admins write" on public.recipes;
create policy "recipes: admins write" on public.recipes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.recipes to anon, authenticated;
grant insert, update, delete on public.recipes to authenticated;

-- ---------------------------------------------------------------------------
-- People's own recipes: private, or submitted for review and then public once approved
-- ---------------------------------------------------------------------------
create table if not exists public.user_recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text,
  dish_slug text check (dish_slug is null or dish_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  section text not null check (section in ('breakfast', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'drinks')),
  tags text[] not null default '{}',
  prep_minutes integer not null default 0 check (prep_minutes between 0 and 10000),
  cook_minutes integer not null default 0 check (cook_minutes between 0 and 10000),
  servings integer not null default 4 check (servings between 1 and 1000),
  ingredients text[] not null default '{}',
  steps text[] not null default '{}',
  serving text[] not null default '{}',
  lang text not null default 'en' check (lang in ('en', 'fr')),
  images text[] not null default '{}',
  video text,
  links jsonb not null default '[]'::jsonb,
  status text not null default 'private' check (status in ('private', 'submitted', 'approved', 'rejected')),
  review_note text,
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists user_recipes_owner on public.user_recipes (owner_id);
create index if not exists user_recipes_status on public.user_recipes (status);
create index if not exists user_recipes_dish on public.user_recipes (dish_slug) where status = 'approved';
alter table public.user_recipes enable row level security;

-- Review rules: only admins approve or reject; editing an approved recipe sends it back for review.
create or replace function public.user_recipes_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  content_changed boolean;
begin
  new.author_name := (select display_name from public.profiles where id = new.owner_id);
  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  if public.is_admin() then
    if tg_op = 'UPDATE' and new.status is distinct from old.status and new.status in ('approved', 'rejected') then
      new.reviewed_by := auth.uid();
      new.reviewed_at := now();
    end if;
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.status not in ('private', 'submitted') then
      new.status := 'private';
    end if;
    new.review_note := null;
    new.reviewed_by := null;
    new.reviewed_at := null;
    return new;
  end if;

  -- Owner updates.
  new.owner_id := old.owner_id;
  new.review_note := old.review_note;
  new.reviewed_by := old.reviewed_by;
  new.reviewed_at := old.reviewed_at;
  if new.status is distinct from old.status and new.status in ('approved', 'rejected') then
    raise exception 'Only admins can approve or reject recipes.';
  end if;
  content_changed :=
    (to_jsonb(new) - array['status', 'review_note', 'reviewed_by', 'reviewed_at', 'updated_at', 'author_name'])
    is distinct from
    (to_jsonb(old) - array['status', 'review_note', 'reviewed_by', 'reviewed_at', 'updated_at', 'author_name']);
  if old.status = 'approved' and new.status = 'approved' and content_changed then
    new.status := 'submitted';
  end if;
  return new;
end;
$$;

drop trigger if exists user_recipes_guard on public.user_recipes;
create trigger user_recipes_guard before insert or update on public.user_recipes
  for each row execute function public.user_recipes_guard();

drop policy if exists "user_recipes: read own, approved or as admin" on public.user_recipes;
create policy "user_recipes: read own, approved or as admin" on public.user_recipes
  for select using (owner_id = auth.uid() or status = 'approved' or public.is_admin());

drop policy if exists "user_recipes: create own" on public.user_recipes;
create policy "user_recipes: create own" on public.user_recipes
  for insert to authenticated with check (owner_id = auth.uid());

drop policy if exists "user_recipes: edit own or as admin" on public.user_recipes;
create policy "user_recipes: edit own or as admin" on public.user_recipes
  for update to authenticated
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "user_recipes: delete own or as admin" on public.user_recipes;
create policy "user_recipes: delete own or as admin" on public.user_recipes
  for delete to authenticated using (owner_id = auth.uid() or public.is_admin());

grant select on public.user_recipes to anon, authenticated;
grant insert, update, delete on public.user_recipes to authenticated;

-- ---------------------------------------------------------------------------
-- "I made it!" photos
-- ---------------------------------------------------------------------------
create table if not exists public.made_photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text,
  dish_slug text,
  user_recipe_id uuid references public.user_recipes (id) on delete set null,
  dish_name text not null check (char_length(dish_name) <= 160),
  -- Path inside the "photos" storage bucket: <owner id>/<file>.
  path text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists made_photos_owner on public.made_photos (owner_id);
create index if not exists made_photos_dish on public.made_photos (dish_slug) where is_public;
alter table public.made_photos enable row level security;

create or replace function public.made_photos_author()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    new.owner_id := old.owner_id;
    new.path := old.path;
  end if;
  new.author_name := (select display_name from public.profiles where id = new.owner_id);
  return new;
end;
$$;

drop trigger if exists made_photos_author on public.made_photos;
create trigger made_photos_author before insert or update on public.made_photos
  for each row execute function public.made_photos_author();

drop policy if exists "made_photos: read public or own" on public.made_photos;
create policy "made_photos: read public or own" on public.made_photos
  for select using (is_public or owner_id = auth.uid() or public.is_admin());

drop policy if exists "made_photos: add own" on public.made_photos;
create policy "made_photos: add own" on public.made_photos
  for insert to authenticated
  with check (owner_id = auth.uid() and path like auth.uid()::text || '/%');

drop policy if exists "made_photos: change own" on public.made_photos;
create policy "made_photos: change own" on public.made_photos
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "made_photos: delete own or as admin" on public.made_photos;
create policy "made_photos: delete own or as admin" on public.made_photos
  for delete to authenticated using (owner_id = auth.uid() or public.is_admin());

grant select on public.made_photos to anon, authenticated;
grant insert, update, delete on public.made_photos to authenticated;

-- ---------------------------------------------------------------------------
-- Synced kitchen: favorites, shopping list, prices, week plan, event plan
-- ---------------------------------------------------------------------------
create table if not exists public.user_data (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key text not null check (key in ('favorites', 'shopping', 'prices', 'plan', 'event')),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.user_data enable row level security;

drop policy if exists "user_data: own only" on public.user_data;
create policy "user_data: own only" on public.user_data
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select, insert, update, delete on public.user_data to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: photos (I made it) and recipe media (official and personal recipes)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('photos', 'photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('recipe-media', 'recipe-media', true, 52428800,
   array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- photos/<user id>/... : each person manages their own folder.
drop policy if exists "photos: upload to own folder" on storage.objects;
create policy "photos: upload to own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "photos: delete own or as admin" on storage.objects;
create policy "photos: delete own or as admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- recipe-media/official/... : admins.  recipe-media/users/<user id>/... : each person.
drop policy if exists "recipe-media: upload" on storage.objects;
create policy "recipe-media: upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'recipe-media' and (
      public.is_admin()
      or ((storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );

drop policy if exists "recipe-media: delete" on storage.objects;
create policy "recipe-media: delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'recipe-media' and (
      public.is_admin()
      or ((storage.foldername(name))[1] = 'users' and (storage.foldername(name))[2] = auth.uid()::text)
    )
  );
