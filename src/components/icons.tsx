import {
  Baby,
  CakeSlice,
  Coffee,
  CookingPot,
  Cookie,
  CupSoda,
  Drumstick,
  Egg,
  Flame,
  PartyPopper,
  Soup,
  Sprout,
  Wallet,
  Wheat,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { SectionId, Tag } from "@/data/types";

/** One icon per section (Lucide). Shared by server and client components. */
export const SECTION_ICON: Record<SectionId, LucideIcon> = {
  breakfast: Coffee,
  monday: Egg,
  tuesday: CookingPot,
  wednesday: CakeSlice,
  thursday: Drumstick,
  friday: Soup,
  saturday: Flame,
  sunday: Wheat,
  drinks: CupSoda,
};

export const TAG_ICON: Record<Tag, LucideIcon> = {
  budget: Wallet,
  quick: Zap,
  kids: Baby,
  snack: Cookie,
  vegetarian: Sprout,
  occasion: PartyPopper,
};

export function SectionIcon({ id, ...props }: { id: SectionId } & LucideProps) {
  const Icon = SECTION_ICON[id];
  return <Icon aria-hidden strokeWidth={1.9} {...props} />;
}

export function TagIcon({ tag, ...props }: { tag: Tag } & LucideProps) {
  const Icon = TAG_ICON[tag];
  return <Icon aria-hidden strokeWidth={2} {...props} />;
}
