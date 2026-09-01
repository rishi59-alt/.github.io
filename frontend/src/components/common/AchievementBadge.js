import React from "react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AchievementBadge({ achievement }) {
  const Icon = Icons[achievement.icon] || Icons.Trophy;
  const earned = achievement.earned;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          data-testid="achievement-badge"
          className={cn(
            "relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors",
            earned
              ? "border-action/40 bg-action/5"
              : "border-border/70 bg-card/50 opacity-60"
          )}
        >
          {earned && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-action" />
          )}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              earned ? "bg-action/15 text-action" : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">{achievement.name}</div>
            {!earned && (
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {achievement.current}/{achievement.threshold}
              </div>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{achievement.description}</TooltipContent>
    </Tooltip>
  );
}
