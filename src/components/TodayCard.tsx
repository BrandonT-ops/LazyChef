"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { sectionForWeekday } from "@/data/sections";
import type { DishSummary } from "@/data/types";
import { SectionIcon } from "./icons";

/** A slim "today" bar. The day comes from the visitor's own clock, so it renders client-side. */
export function TodayCard({ dishes }: { dishes: DishSummary[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => setDay(new Date().getDay()), []);

  if (day === null) return <div className="h-[68px] rounded-xl2 border border-line" aria-hidden />;

  const section = sectionForWeekday(day);
  const picks = dishes.filter((d) => d.section === section.id).slice(0, 3);
  const dayName = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 rounded-xl2 border border-line bg-surface px-5 py-4 sm:flex-row sm:items-center"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tomato/[0.08] text-tomato">
        <SectionIcon id={section.id} className="h-[18px] w-[18px]" />
      </span>
      <p className="min-w-0 flex-1 text-sm">
        <span className="font-semibold capitalize">{dayName}</span>
        <span className="text-muted"> · {t(`sections.${section.id}.theme`)}</span>
        <span className="hidden text-muted md:inline"> · {picks.map((d) => d.name).join(", ")}</span>
      </p>
      <Link href={`/sections/${section.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-tomato hover:underline">
        {t("home.seeToday")}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </motion.div>
  );
}
