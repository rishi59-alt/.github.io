import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TacticCard } from "@/components/TacticCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Tactics() {
  const [tactics, setTactics] = useState(null);
  const [difficulty, setDifficulty] = useState("all");

  useEffect(() => {
    let active = true;
    api.get("/tactics").then(({ data }) => { if (active) setTactics(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!tactics) return [];
    return tactics.filter((t) => difficulty === "all" || t.difficulty === difficulty);
  }, [tactics, difficulty]);

  return (
    <PageContainer>
      <SectionHeading
        emoji="🧠"
        title="CHESS TRICKS"
        subtitle="Interactive tactical challenges. Find the best move, get instant feedback."
        action={
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[150px]" data-testid="tactics-difficulty-filter"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {!tactics ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t, i) => <TacticCard key={t.id} tactic={t} index={i} />)}
        </div>
      )}
    </PageContainer>
  );
}
