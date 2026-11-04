import type { Section, SectionId } from "./types";

export const SECTIONS: Section[] = [
  { id: "breakfast", accent: "mango" },
  { id: "monday", weekday: 1, accent: "leaf" },
  { id: "tuesday", weekday: 2, accent: "tomato" },
  { id: "wednesday", weekday: 3, accent: "hibiscus" },
  { id: "thursday", weekday: 4, accent: "mango" },
  { id: "friday", weekday: 5, accent: "tomato" },
  { id: "saturday", weekday: 6, accent: "leaf" },
  { id: "sunday", weekday: 0, accent: "hibiscus" },
  { id: "drinks", accent: "mango" },
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
