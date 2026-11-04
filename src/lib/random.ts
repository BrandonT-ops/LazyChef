/** Random item from a list, avoiding `avoid` (by slug) when there's another choice. */
export function pickRandom<T extends { slug: string }>(list: T[], avoid?: string | null): T {
  const choices = list.length > 1 && avoid ? list.filter((x) => x.slug !== avoid) : list;
  return choices[Math.floor(Math.random() * choices.length)];
}
