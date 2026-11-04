"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Apple,
  Beef,
  Croissant,
  Fish,
  LocateFixed,
  MapPinned,
  Navigation,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Store,
  type LucideIcon,
} from "lucide-react";
import {
  PLACE_KINDS,
  directionsUrl,
  findPlaces,
  formatDistance,
  geocode,
  type GeocodeResult,
  type LatLon,
  type Place,
  type PlaceKind,
} from "@/lib/places";

export const KIND_ICON: Record<PlaceKind, LucideIcon> = {
  market: Store,
  supermarket: ShoppingCart,
  grocery: ShoppingBasket,
  produce: Apple,
  butcher: Beef,
  fish: Fish,
  bakery: Croissant,
};

/** Marker colors per kind, from the palette tokens. */
const KIND_COLOR: Record<PlaceKind, string> = {
  market: "var(--tomato)",
  supermarket: "var(--hibiscus)",
  grocery: "var(--mango)",
  produce: "var(--leaf)",
  butcher: "var(--tomato)",
  fish: "var(--leaf)",
  bakery: "var(--mango)",
};

const RADII = [1000, 3000, 5000];

type Status = "idle" | "locating" | "loading" | "done" | "error" | "denied";

export function NearbyMap() {
  const t = useTranslations("markets");
  const locale = useLocale();
  const [center, setCenter] = useState<LatLon | null>(null);
  const [radius, setRadius] = useState(3000);
  const [status, setStatus] = useState<Status>("idle");
  const [places, setPlaces] = useState<Place[]>([]);
  const [kinds, setKinds] = useState<Set<PlaceKind>>(new Set(PLACE_KINDS));
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const markers = useRef(new Map<string, import("leaflet").Marker>());

  const shown = useMemo(() => places.filter((p) => kinds.has(p.kind)), [places, kinds]);

  // Search whenever the centre or radius changes.
  useEffect(() => {
    if (!center) return;
    const ctrl = new AbortController();
    setStatus("loading");
    findPlaces(center, radius, ctrl.signal)
      .then((p) => {
        setPlaces(p);
        setStatus("done");
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setStatus("error");
      });
    return () => ctrl.abort();
  }, [center, radius]);

  // Create the map once we have a centre (Leaflet needs the browser, so it's loaded here).
  useEffect(() => {
    if (!center || !mapEl.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;
      if (!map.current) {
        map.current = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: false });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map.current);
        layer.current = L.layerGroup().addTo(map.current);
        setReady(true);
      }
      map.current.setView([center.lat, center.lon], radius <= 1000 ? 15 : radius <= 3000 ? 14 : 13);
    })();
    return () => {
      cancelled = true;
    };
  }, [center, radius]);

  // Draw markers.
  useEffect(() => {
    (async () => {
      if (!map.current || !layer.current || !center) return;
      const L = (await import("leaflet")).default;
      layer.current.clearLayers();
      markers.current.clear();
      L.marker([center.lat, center.lon], {
        icon: L.divIcon({ className: "", html: '<span class="chop-you"></span>', iconSize: [18, 18] }),
        zIndexOffset: 1000,
      })
        .bindTooltip(t("you"))
        .addTo(layer.current);
      for (const p of shown) {
        const m = L.marker([p.lat, p.lon], {
          icon: L.divIcon({
            className: "",
            html: `<span class="chop-pin" style="--pin: rgb(${KIND_COLOR[p.kind]})"></span>`,
            iconSize: [16, 16],
          }),
        })
          .bindPopup(`<strong>${escapeHtml(p.name ?? t(`kinds.${p.kind}`))}</strong><br/>${t(`kinds.${p.kind}`)} · ${formatDistance(p.distance, locale)}`)
          .on("click", () => setActive(p.id))
          .addTo(layer.current);
        markers.current.set(p.id, m);
      }
    })();
  }, [ready, shown, center, t, locale]);

  useEffect(() => () => {
    map.current?.remove();
    map.current = null;
  }, []);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  };

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const r = await geocode(query, locale);
      setResults(r);
      if (r.length === 1) choose(r[0]);
    } catch {
      setStatus("error");
    }
  };

  const choose = (r: GeocodeResult) => {
    setResults([]);
    setQuery(r.label.split(",")[0]);
    setCenter({ lat: r.lat, lon: r.lon });
  };

  const focus = useCallback((p: Place) => {
    setActive(p.id);
    map.current?.setView([p.lat, p.lon], 17, { animate: true });
    markers.current.get(p.id)?.openPopup();
    mapEl.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const toggleKind = (k: PlaceKind) =>
    setKinds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  return (
    <div>
      {/* Where are you? */}
      <div className="card mx-auto max-w-2xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={locate} className="btn-primary shrink-0" disabled={status === "locating"}>
            <LocateFixed className="h-4 w-4" aria-hidden />
            {status === "locating" ? t("locating") : t("useLocation")}
          </button>
          <form onSubmit={search} className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlace")}
              aria-label={t("searchPlace")}
              className="w-full rounded-full border border-line bg-bg py-2.5 pl-10 pr-4 outline-none transition-colors focus:border-tomato"
            />
            <AnimatePresence>
              {results.length > 1 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="card absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-auto p-1.5"
                >
                  {results.map((r) => (
                    <li key={`${r.lat},${r.lon}`}>
                      <button
                        type="button"
                        onClick={() => choose(r)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-tomato/10"
                      >
                        {r.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </form>
        </div>
        <p className="mt-3 text-xs text-muted">{t("privacy")}</p>
        {status === "denied" && <p className="mt-2 text-sm text-tomato">{t("denied")}</p>}
        {status === "error" && <p className="mt-2 text-sm text-tomato">{t("error")}</p>}
      </div>

      {center && (
        <div className="mt-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PLACE_KINDS.map((k) => {
              const Icon = KIND_ICON[k];
              const on = kinds.has(k);
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleKind(k)}
                  className={`chip gap-1.5 ${on ? "border-ink/20 text-ink" : "opacity-50"}`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${KIND_COLOR[k]})` }} aria-hidden />
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {t(`kinds.${k}`)}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <span className="text-muted">{t("radius")}</span>
            {RADII.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadius(r)}
                className={`chip ${radius === r ? "chip-active" : "hover:border-tomato"}`}
              >
                {r / 1000} km
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="card relative isolate z-0 overflow-hidden">
              <div ref={mapEl} className="h-[420px] w-full lg:h-[560px]" />
              {status === "loading" && (
                <div className="absolute inset-0 z-[500] grid place-items-center bg-bg/50 backdrop-blur-[1px]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="h-10 w-10 rounded-full border-4 border-line border-t-tomato"
                    aria-label={t("loading")}
                  />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="mb-3 text-sm font-semibold text-tomato" aria-live="polite">
                {status === "done" && t("found", { count: shown.length })}
              </p>
              {status === "done" && shown.length === 0 && (
                <div className="card p-6 text-center text-sm text-muted">
                  <MapPinned className="mx-auto mb-2 h-8 w-8 text-mango" aria-hidden />
                  {t("none")}
                </div>
              )}
              <ul className="space-y-2 lg:max-h-[520px] lg:overflow-auto lg:pr-1">
                {shown.slice(0, 60).map((p) => {
                  const Icon = KIND_ICON[p.kind];
                  return (
                    <li key={p.id}>
                      <div
                        className={`card flex items-center gap-3 p-3 transition-colors ${
                          active === p.id ? "border-tomato" : ""
                        }`}
                      >
                        <button type="button" onClick={() => focus(p)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                          <span
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                            style={{ background: `rgb(${KIND_COLOR[p.kind]})` }}
                          >
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">{p.name ?? t(`kinds.${p.kind}`)}</span>
                            <span className="block truncate text-xs text-muted">
                              {t(`kinds.${p.kind}`)} · {formatDistance(p.distance, locale)}
                              {p.hours ? ` · ${p.hours}` : ""}
                            </span>
                          </span>
                        </button>
                        <a
                          href={directionsUrl(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line hover:border-tomato hover:text-tomato"
                          aria-label={t("directions")}
                          title={t("directions")}
                        >
                          <Navigation className="h-4 w-4" aria-hidden />
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-muted">
                {t("dataNote")}{" "}
                <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-tomato">
                  openstreetmap.org
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
