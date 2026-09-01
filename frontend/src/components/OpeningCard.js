import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { MiniBoard } from "@/components/chess/MiniBoard";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { fenAfterMoves } from "@/lib/chessUtils";
import { useProgress } from "@/context/ProgressContext";

export function OpeningCard({ opening, index = 0 }) {
  const { isDone } = useProgress();
  const done = isDone("opening", opening.id);
  const previewFen = useMemo(() => fenAfterMoves(opening.moves), [opening.moves]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.26, delay: Math.min(index * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
      data-testid="opening-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">{opening.name}</h3>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {opening.side === "white" ? "White opening" : "Black response"}
          </span>
        </div>
        <DifficultyBadge level={opening.difficulty} />
      </div>

      <div className="my-4 mx-auto w-full max-w-[220px]">
        <MiniBoard fen={previewFen} orientation={opening.side === "black" ? "black" : "white"} id={`op-${opening.id}`} />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">{opening.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">
          For: {opening.recommended_for}
        </span>
      </div>

      <div className="mt-4 flex-1" />
      <Button asChild className="w-full bg-action hover:brightness-110" data-testid="opening-card-learn-button">
        <Link to={`/openings/${opening.id}`}>
          {done ? <><Check className="mr-1.5 h-4 w-4" /> Review Opening</> : <>Learn Opening <ArrowRight className="ml-1.5 h-4 w-4" /></>}
        </Link>
      </Button>
    </motion.div>
  );
}
