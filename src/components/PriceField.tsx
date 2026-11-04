"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Pencil } from "lucide-react";
import { CURRENCY } from "@/data/prices";

/** A price you can tap to change. Shows "~" while it's still an estimate. */
export function PriceField({
  value,
  onChange,
  custom = false,
  suffix,
  placeholder,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  custom?: boolean;
  suffix?: string;
  placeholder?: string;
}) {
  const t = useTranslations("prices");
  const locale = useLocale();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) input.current?.select();
  }, [editing]);

  const commit = () => {
    const n = Number(draft.replace(/[^\d]/g, ""));
    if (draft.trim() !== "" && Number.isFinite(n)) onChange(n);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={input}
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        aria-label={t("edit")}
        className="w-24 rounded-md border border-tomato bg-surface px-1.5 py-0.5 text-xs text-ink outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value !== undefined ? String(value) : "");
        setEditing(true);
      }}
      title={t("edit")}
      className="inline-flex items-center gap-1 rounded-md px-1 underline decoration-dotted underline-offset-2 hover:bg-mango/15 hover:text-ink"
    >
      {value !== undefined ? (
        <>
          {custom ? "" : "~"}
          {new Intl.NumberFormat(locale).format(value)} {CURRENCY}
          {suffix ? ` ${suffix}` : ""}
        </>
      ) : (
        placeholder ?? t("add")
      )}
      <Pencil className="h-3 w-3 opacity-60" aria-hidden />
    </button>
  );
}
