"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function IngredientList({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <ul className="space-y-1">
      {items.map((item, i) => {
        const on = checked.has(i);
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={on}
              className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-mango/10"
            >
              <motion.span
                aria-hidden
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 text-xs text-white ${
                  on ? "border-leaf bg-leaf" : "border-line"
                }`}
                animate={{ scale: on ? [1, 1.25, 1] : 1 }}
              >
                {on && "✓"}
              </motion.span>
              <span className={on ? "text-muted line-through" : ""}>{item}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
