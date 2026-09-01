import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Target } from "lucide-react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "openings", label: "Openings" },
  { key: "lessons", label: "Lessons" },
  { key: "tactics", label: "Tactics" },
];

const ICON = { opening: BookOpen, lesson: GraduationCap, tactic: Target };
const ROUTE = { opening: "/openings", lesson: "/lessons", tactic: "/tactics" };

export function GlobalSearch({ open, setOpen }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    let active = true;
    const run = async () => {
      try {
        const { data } = await api.get(`/search`, { params: { q, filter } });
        if (active) setResults(data.results || []);
      } catch (e) { /* noop */ }
    };
    const t = setTimeout(run, 150);
    return () => { active = false; clearTimeout(t); };
  }, [q, filter, open]);

  const grouped = useMemo(() => {
    const g = { opening: [], lesson: [], tactic: [] };
    for (const r of results) g[r.type]?.push(r);
    return g;
  }, [results]);

  const go = (r) => {
    setOpen(false);
    setQ("");
    navigate(`${ROUTE[r.type]}/${r.id}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search openings, tricks, or lessons..."
        value={q}
        onValueChange={setQ}
        data-testid="global-search-input"
      />
      <div className="px-3 pt-2">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.key} value={f.key} data-testid={`search-filter-${f.key}`}>{f.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <CommandList>
        <CommandEmpty>No results. Try another term.</CommandEmpty>
        {["opening", "lesson", "tactic"].map((type) => (
          grouped[type].length > 0 && (
            <CommandGroup key={type} heading={type === "opening" ? "Openings" : type === "lesson" ? "Lessons" : "Tactics"}>
              {grouped[type].map((r) => {
                const Icon = ICON[r.type];
                return (
                  <CommandItem key={`${r.type}-${r.id}`} value={`${r.title} ${r.id}`} onSelect={() => go(r)} data-testid="global-search-result-item">
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{r.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{r.subtitle}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )
        ))}
      </CommandList>
    </CommandDialog>
  );
}
