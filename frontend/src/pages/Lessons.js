import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { LessonCard } from "@/components/LessonCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["Basics", "Opening", "Strategy", "Tactics", "Checkmate", "Endgame"];

export default function Lessons() {
  const [lessons, setLessons] = useState(null);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/lessons").then(({ data }) => { if (active) setLessons(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!lessons) return [];
    return lessons.filter((l) =>
      (category === "all" || l.category === category) &&
      (difficulty === "all" || l.difficulty === difficulty) &&
      (q.trim() === "" || l.title.toLowerCase().includes(q.toLowerCase()))
    );
  }, [lessons, category, difficulty, q]);

  return (
    <PageContainer>
      <SectionHeading emoji="📖" title="LESSONS" subtitle="From your first move to deep strategy. Learn step by step." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search lessons..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" data-testid="lessons-search" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[150px]" data-testid="lessons-category-filter"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[150px]" data-testid="lessons-difficulty-filter"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!lessons ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No lessons match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l, i) => <LessonCard key={l.id} lesson={l} index={i} />)}
        </div>
      )}
    </PageContainer>
  );
}
