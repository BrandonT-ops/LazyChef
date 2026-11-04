"use client";

import { MotionConfig } from "framer-motion";

/** reducedMotion="user" turns animations off for people who ask their OS for less motion. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 26 }}>
      {children}
    </MotionConfig>
  );
}
