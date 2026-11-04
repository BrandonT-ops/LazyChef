/**
 * Nearby food shops and markets from OpenStreetMap (free, no API key).
 * Overpass finds the places; Nominatim turns a typed city or area into coordinates.
 */

export type PlaceKind = "market" | "supermarket" | "grocery" | "produce" | "butcher" | "fish" | "bakery";
export const PLACE_KINDS: PlaceKind[] = ["market", "supermarket", "grocery", "produce", "butcher", "fish", "bakery"];

export interface Place {
  id: string;
  kind: PlaceKind;
  name?: string;
  lat: number;
  lon: number;
  distance: number; // metres from the search centre
  hours?: string;
  address?: string;
}

export interface LatLon {
  lat: number;
  lon: number;
}

const OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];

const SHOP_KIND: Record<string, PlaceKind> = {
  supermarket: "supermarket",
  convenience: "grocery",
  grocery: "grocery",
  general: "grocery",
  deli: "grocery",
  spices: "grocery",
  frozen_food: "grocery",
  greengrocer: "produce",
  farm: "produce",
  butcher: "butcher",
  seafood: "fish",
  bakery: "bakery",
};

export function distanceMeters(a: LatLon, b: LatLon): number {
  const R = 6371000;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export function parseOverpass(elements: OverpassElement[], origin: LatLon): Place[] {
  const places: Place[] = [];
  for (const el of elements) {
    const tags = el.tags ?? {};
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat === undefined || lon === undefined) continue;
    const kind: PlaceKind | undefined = tags.amenity === "marketplace" ? "market" : SHOP_KIND[tags.shop ?? ""];
    if (!kind) continue;
    const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
    places.push({
      id: `${el.type}/${el.id}`,
      kind,
      name: tags.name,
      lat,
      lon,
      distance: distanceMeters(origin, { lat, lon }),
      hours: tags.opening_hours,
      address: street || tags["addr:city"] || undefined,
    });
  }
  return places.sort((a, b) => a.distance - b.distance);
}

export async function findPlaces(origin: LatLon, radiusMeters: number, signal?: AbortSignal): Promise<Place[]> {
  const shops = Object.keys(SHOP_KIND).join("|");
  const around = `(around:${Math.round(radiusMeters)},${origin.lat},${origin.lon})`;
  const query = `[out:json][timeout:25];(nwr["amenity"="marketplace"]${around};nwr["shop"~"^(${shops})$"]${around};);out center 300;`;

  let lastError: unknown;
  for (const endpoint of OVERPASS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal,
      });
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = (await res.json()) as { elements: OverpassElement[] };
      return parseOverpass(json.elements, origin);
    } catch (e) {
      if ((e as Error).name === "AbortError") throw e;
      lastError = e;
    }
  }
  throw lastError;
}

export interface GeocodeResult extends LatLon {
  label: string;
}

export async function geocode(q: string, lang: string, signal?: AbortSignal): Promise<GeocodeResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { "Accept-Language": lang }, signal });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const rows = (await res.json()) as { lat: string; lon: string; display_name: string }[];
  return rows.map((r) => ({ lat: Number(r.lat), lon: Number(r.lon), label: r.display_name }));
}

export function directionsUrl(p: LatLon): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`;
}

export function formatDistance(m: number, locale: string): string {
  return m < 1000
    ? `${Math.round(m / 10) * 10} m`
    : `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(m / 1000)} km`;
}
