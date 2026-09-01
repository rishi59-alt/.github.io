import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Check } from "lucide-react";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/context/ProgressContext";

export function TacticCard({ tactic, index = 0 }) {
  const { isDone } = useProgress();
  const done = isDone("tactic", tactic.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.26, delay: Math.min(index * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-4 transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
      data-testid="tactic-card"
    >
      {done && <span className="absolute right-3 top-3 rounded-full bg-action/15 p-1 text-action"><Check className="h-3.5 w-3.5" /></span>}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
        <Target className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{tactic.theme}</h3>
      <p className="mt-1 text-sm text-muted-foreground">Find the best move.</p>
      <div className="mt-3"><DifficultyBadge level={tactic.difficulty} /></div>
      <div className="mt-4 flex-1" />
      <Button asChild variant="secondary" className="w-full" data-testid="tactic-card-solve-button">
        <Link to={`/tactics/${tactic.id}`}>{done ? "Solve Again" : "Solve Tactic"}</Link>
      </Button>
    </motion.div>
  );
}
