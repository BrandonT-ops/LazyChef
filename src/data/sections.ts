import type { Section, SectionId } from "./types";

export const SECTIONS: Section[] = [
  { id: "breakfast", emoji: "☕", accent: "mango" },
  { id: "monday", emoji: "🥚", weekday: 1, accent: "leaf" },
  { id: "tuesday", emoji: "🍳", weekday: 2, accent: "tomato" },
  { id: "wednesday", emoji: "🧁", weekday: 3, accent: "hibiscus" },
  { id: "thursday", emoji: "🍗", weekday: 4, accent: "mango" },
  { id: "friday", emoji: "🍲", weekday: 5, accent: "tomato" },
  { id: "saturday", emoji: "🍢", weekday: 6, accent: "leaf" },
  { id: "sunday", emoji: "🌿", weekday: 0, accent: "hibiscus" },
  { id: "drinks", emoji: "🥤", accent: "mango" },
];

export const WEEKDAY_SECTIONS = SECTIONS.filter((s) => s.weekday !== undefined);

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function sectionForWeekday(day: number): Section {
  return WEEKDAY_SECTIONS.find((s) => s.weekday === day) ?? SECTIONS[1];
}

export function isSectionId(id: string): id is SectionId {
  return SECTIONS.some((s) => s.id === id);
}
