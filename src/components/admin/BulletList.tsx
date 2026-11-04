"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";

/**
 * Edits a list of lines as bullets (or numbered steps).
 * Enter adds a line below, Backspace on an empty line removes it,
 * and pasting several lines at once splits them into separate bullets.
 */
export function BulletList({
  value,
  onChange,
  numbered = false,
  placeholder,
  addLabel,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  numbered?: boolean;
  placeholder?: string;
  addLabel: string;
}) {
  const refs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const rows = value.length ? value : [""];

  // Grow each line to fit its text.
  useEffect(() => {
    refs.current.forEach((el) => {
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight + 2}px`;
    });
  });

  const focus = (i: number) => setTimeout(() => refs.current[i]?.focus(), 0);
  const set = (i: number, text: string) => onChange(rows.map((r, j) => (j === i ? text : r)));
  const insert = (i: number, lines: string[]) => onChange([...rows.slice(0, i), ...lines, ...rows.slice(i)]);
  const remove = (i: number) => onChange(rows.filter((_, j) => j !== i));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <ol className="space-y-2">
        {rows.map((line, i) => (
          <li key={i} className="group flex items-start gap-2">
            <span className="mt-2.5 w-6 shrink-0 text-right text-sm font-semibold tabular-nums text-muted">
              {numbered ? `${i + 1}.` : <span className="mr-1 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-tomato" />}
            </span>
            <textarea
              ref={(el) => {
                refs.current[i] = el;
              }}
              rows={1}
              value={line}
              placeholder={i === 0 ? placeholder : undefined}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  insert(i + 1, [""]);
                  focus(i + 1);
                } else if (e.key === "Backspace" && line === "" && rows.length > 1) {
                  e.preventDefault();
                  remove(i);
                  focus(Math.max(0, i - 1));
                }
              }}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text");
                if (!text.includes("\n")) return;
                e.preventDefault();
                const lines = text
                  .split(/\r?\n/)
                  .map((l) => l.replace(/^\s*(?:[-*•·]|\d+[.)])\s*/, "").trim())
                  .filter(Boolean);
                const merged = [...rows.slice(0, i), ...(line ? [line] : []), ...lines, ...rows.slice(i + 1)];
                onChange(merged);
              }}
              className="min-h-[42px] w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <div className="mt-1 flex shrink-0 opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
              <IconBtn label="Up" onClick={() => move(i, -1)} disabled={i === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="Down" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                <ArrowDown className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="Remove" onClick={() => remove(i)} disabled={rows.length === 1 && !line}>
                <X className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => {
          onChange([...rows, ""]);
          focus(rows.length);
        }}
        className="ml-8 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
      >
        <Plus className="h-4 w-4" aria-hidden />
        {addLabel}
      </button>
    </div>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-8 w-7 place-items-center rounded-md text-muted hover:bg-subtle hover:text-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}
