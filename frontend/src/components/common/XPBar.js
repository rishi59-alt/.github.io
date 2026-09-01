import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export function XPBar({ progress, compact = false }) {
  if (!progress) return null;
  const pct = Math.round((progress.xp_into_level / progress.xp_for_level) * 100);
  return (
    <div className="w-full">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-display text-lg font-bold leading-none" data-testid="level-label">
            Level {progress.level} — {progress.title}
          </div>
          {!compact && <div className="mt-1 text-xs text-muted-foreground">Keep grinding to level up ♔</div>}
        </div>
        <div className="font-mono text-sm tabular-nums text-muted-foreground">
          {progress.xp_into_level} / {progress.xp_for_level} XP
        </div>
      </div>
      <div className="relative mt-2">
        <Progress value={pct} className="h-2.5" data-testid="xp-progress-bar" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-0 top-0 h-2.5 rounded-full bg-action"
        />
      </div>
      <div className="mt-1 text-right text-[11px] text-muted-foreground">{progress.xp_to_next} XP to next level</div>
    </div>
  );
}
