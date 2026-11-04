/** "Œuf bouillie" -> "oeuf-bouillie" */
export function slugify(text: string): string {
  return text
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Accent- and case-insensitive text used for search. */
export function searchKey(text: string): string {
  return slugify(text).replace(/-/g, " ");
}
