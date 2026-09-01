import React from "react";
import { cn } from "@/lib/utils";

const MAP = {
  Beginner: "text-emerald-400 border-emerald-400/30",
  Intermediate: "text-amber-400 border-amber-400/30",
  Advanced: "text-rose-400 border-rose-400/30",
};

export function DifficultyBadge({ level, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide bg-background/40",
        MAP[level] || "text-muted-foreground border-border",
        className
      )}
      data-testid="difficulty-badge"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}
