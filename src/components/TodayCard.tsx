"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { sectionForWeekday } from "@/data/sections";
import type { DishSummary } from "@/data/types";

/** Shows today's theme. The day comes from the visitor's own clock, so it runs client-side. */
export function TodayCard({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => setDay(new Date().getDay()), []);

  if (day === null) {
    return <div className="card h-64 animate-pulse" aria-hidden />;
  }

  const section = sectionForWeekday(day);
  const picks = dishes.filter((d) => d.section === section.id).slice(0, 4);
  const dayName = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card relative overflow-hidden p-6"
    >
      <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 text-[7rem] opacity-15">
        {section.emoji}
      </div>
      <p className="text-sm font-semibold uppercase tracking-wider text-tomato">
        {t("home.todayIs", { day: dayName })}
      </p>
      <h2 className="heading mt-1 text-2xl">{t(`sections.${section.id}.theme`)}</h2>
      <ul className="mt-4 space-y-2">
        {picks.map((d, i) => (
          <motion.li
            key={d.slug}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
          >
            <Link
              href={`/dishes/${d.slug}`}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-tomato/10"
            >
              <span aria-hidden className="text-mango">●</span>
              {d.name}
            </Link>
          </motion.li>
        ))}
      </ul>
      <Link href={`/sections/${section.id}`} className="btn-ghost mt-5">
        {t("home.seeToday")} →
      </Link>
    </motion.div>
  );
}
