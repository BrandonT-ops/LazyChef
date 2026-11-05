"use client";

import { motion } from "framer-motion";

/** Rotation that brings each value to the front of the cube. */
const FACE: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 },
};

/** Where each face sits on the cube. */
const PLACE: Record<number, string> = {
  1: "rotateY(0deg)",
  2: "rotateX(90deg)",
  3: "rotateY(90deg)",
  4: "rotateY(-90deg)",
  5: "rotateX(-90deg)",
  6: "rotateY(180deg)",
};

/** Pip positions on a 3×3 grid (0–8, reading order). */
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export interface DieThrow {
  /** Increases on every throw, so the die spins further each time. */
  turn: number;
  value: number;
  /** Where it lands on the table, in px from the centre. */
  dx: number;
  /** Small twist on the table, in degrees. */
  spin: number;
}

/**
 * A real-looking die: a CSS 3D cube that is thrown across the table, bounces, tumbles and
 * settles showing `value`. `variant` picks the cream or the tomato die.
 */
export function Die({
  roll,
  size = 68,
  variant = "cream",
  duration = 1.6,
  calm = false,
}: {
  roll: DieThrow;
  size?: number;
  variant?: "cream" | "tomato";
  duration?: number;
  calm?: boolean;
}) {
  const half = size / 2;
  const face = FACE[roll.value];
  // Several full turns on both axes, ending exactly on the chosen face.
  const turnsX = roll.turn * 2 + (roll.turn % 2);
  const turnsY = roll.turn * 2 + 1;
  const rotateX = face.x + 360 * turnsX;
  const rotateY = face.y + 360 * turnsY;
  const thrown = roll.turn > 0 && !calm;

  const faceCls =
    variant === "tomato"
      ? "bg-gradient-to-br from-[rgb(var(--tomato))] to-[#b8401f] border-white/20"
      : "bg-gradient-to-br from-white to-[#efe6d8] border-black/5";
  const pipCls = variant === "tomato" ? "bg-white" : "bg-[#2A1A12]";

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      initial={thrown ? { x: -260, y: -140, rotate: 0 } : false}
      animate={
        thrown
          ? { x: [-260, roll.dx * 0.6, roll.dx], y: [-140, 0, -34, 0, -10, 0], rotate: [0, roll.spin * 2, roll.spin] }
          : { x: roll.dx, y: 0, rotate: roll.spin }
      }
      transition={
        thrown
          ? {
              x: { duration, times: [0, 0.55, 1], ease: "easeOut" },
              y: { duration, times: [0, 0.35, 0.55, 0.72, 0.86, 1], ease: "easeOut" },
              rotate: { duration, ease: "easeOut" },
            }
          : { duration: 0 }
      }
      key={roll.turn}
    >
      {/* Shadow on the table, smaller while the die is in the air. */}
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-full block h-3 -translate-x-1/2 -translate-y-1 rounded-[50%] bg-black/25 blur-[3px]"
        style={{ width: size * 0.9 }}
        initial={thrown ? { scale: 0.3, opacity: 0.15 } : false}
        animate={thrown ? { scale: [0.3, 1, 0.7, 1, 0.9, 1], opacity: [0.15, 0.5, 0.3, 0.5, 0.45, 0.5] } : { scale: 1, opacity: 0.5 }}
        transition={thrown ? { duration, times: [0, 0.35, 0.55, 0.72, 0.86, 1], ease: "easeOut" } : { duration: 0 }}
      />
      <div className="h-full w-full" style={{ perspective: size * 9 }}>
        {/* A small fixed tilt so three faces show, like a real die on a table. */}
        <div className="h-full w-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(-22deg) rotateY(28deg)" }}>
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
            initial={thrown ? { rotateX: rotateX - 720, rotateY: rotateY - 1080 } : false}
            animate={{ rotateX, rotateY }}
            transition={thrown ? { duration, ease: [0.15, 0.7, 0.3, 1] } : { duration: 0 }}
          >
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <div
                key={v}
                className={`absolute inset-0 grid grid-cols-3 grid-rows-3 rounded-[18%] border p-[14%] shadow-[inset_0_0_10px_rgba(0,0,0,0.12)] ${faceCls}`}
                style={{ transform: `${PLACE[v]} translateZ(${half}px)`, backfaceVisibility: "hidden" }}
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} className="grid place-items-center">
                    {PIPS[v].includes(i) && <span className={`block h-[62%] w-[62%] rounded-full shadow-inner ${pipCls}`} />}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
