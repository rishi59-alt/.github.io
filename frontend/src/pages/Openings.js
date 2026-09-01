import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { OpeningCard } from "@/components/OpeningCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Openings() {
  const [openings, setOpenings] = useState(null);
  const [side, setSide] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/openings").then(({ data }) => { if (active) setOpenings(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!openings) return [];
    return openings.filter((o) =>
      (side === "all" || o.side === side) &&
      (difficulty === "all" || o.difficulty === difficulty) &&
      (q.trim() === "" || o.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [openings, side, difficulty, q]);

  return (
    <PageContainer>
      <SectionHeading emoji="🔥" title="OPENINGS" subtitle="Master the first moves. Pick a weapon and learn it cold." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search openings..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" data-testid="openings-search" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={side} onValueChange={setSide}>
            <TabsList data-testid="openings-side-filter">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="white">White</TabsTrigger>
              <TabsTrigger value="black">Black</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[150px]" data-testid="openings-difficulty-filter"><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!openings ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No openings match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o, i) => <OpeningCard key={o.id} opening={o} index={i} />)}
        </div>
      )}
    </PageContainer>
  );
}
