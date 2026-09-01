import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Flame } from "lucide-react";
import api from "@/lib/api";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TacticSolver } from "@/components/TacticSolver";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/context/ProgressContext";

export default function Puzzles() {
  const { progress } = useProgress();
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    api.get(`/puzzles/daily`).then(({ data }) => { if (active) setData(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const dateLabel = data ? new Date(data.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }) : "";

  return (
    <PageContainer>
      <SectionHeading
        emoji="🧩"
        title="Daily Puzzle"
        subtitle="One fresh position every day. Keep your streak alive. Lock In ♟️"
        action={
          <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-sm sm:flex">
            <Flame className="h-4 w-4 text-amber-400" /> {progress?.streak ?? 0} day streak
          </div>
        }
      />

      {!data ? (
        <Skeleton className="h-96 w-full max-w-xl" />
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> {dateLabel}
          </div>
          <TacticSolver tactic={data.puzzle} />
        </motion.div>
      )}
    </PageContainer>
  );
}
