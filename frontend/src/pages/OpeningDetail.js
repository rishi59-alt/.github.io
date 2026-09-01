import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Chess } from "chess.js";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Play, Pause, Check, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { BoardControls } from "@/components/chess/BoardControls";
import { PageContainer } from "@/components/PageContainer";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/context/ProgressContext";

function replay(moves, ply) {
  const g = new Chess();
  let last = null;
  for (let i = 0; i < ply && i < moves.length; i++) {
    try { const m = g.move(moves[i]); last = { from: m.from, to: m.to }; } catch { break; }
  }
  return { fen: g.fen(), lastMove: last };
}

export default function OpeningDetail() {
  const { id } = useParams();
  const { completeOpening, isDone } = useProgress();
  const [opening, setOpening] = useState(null);
  const [ply, setPly] = useState(0);
  const [orientation, setOrientation] = useState("white");
  const [autoplay, setAutoplay] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    api.get(`/openings/${id}`).then(({ data }) => {
      if (!active) return;
      setOpening(data);
      setOrientation(data.side === "black" ? "black" : "white");
      setPly(0);
    }).catch(() => {});
    return () => { active = false; };
  }, [id]);

  useEffect(() => { if (opening) setCompleted(isDone("opening", opening.id)); }, [opening, isDone]);

  const total = opening?.moves.length ?? 0;
  const { fen, lastMove } = useMemo(() => opening ? replay(opening.moves, ply) : { fen: undefined, lastMove: null }, [opening, ply]);

  const next = useCallback(() => setPly((p) => Math.min(p + 1, total)), [total]);
  const prev = () => setPly((p) => Math.max(p - 1, 0));

  useEffect(() => {
    if (!autoplay) return;
    if (ply >= total) { setAutoplay(false); return; }
    const t = setTimeout(() => next(), 900);
    return () => clearTimeout(t);
  }, [autoplay, ply, total, next]);

  const markComplete = async () => {
    await completeOpening(opening.id);
    setCompleted(true);
  };

  if (!opening) {
    return <PageContainer><Skeleton className="h-8 w-48" /><Skeleton className="mt-4 h-96 w-full max-w-xl" /></PageContainer>;
  }

  return (
    <PageContainer>
      <Link to="/openings" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All openings
      </Link>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="board-frame mx-auto w-full max-w-[560px]">
            <ChessBoard fen={fen} orientation={orientation} lastMove={lastMove} allowDragging={false} id="opening-board" />
          </div>
          <div className="mx-auto mt-4 flex max-w-[560px] flex-col gap-3">
            <div className="flex items-center justify-center gap-1.5">
              <Button variant="secondary" size="icon" onClick={() => setPly(0)} data-testid="opening-first" aria-label="First"><ChevronsLeft className="h-4 w-4" /></Button>
              <Button variant="secondary" size="icon" onClick={prev} data-testid="opening-prev" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="secondary" size="icon" onClick={() => setAutoplay((a) => !a)} data-testid="opening-autoplay" aria-label="Autoplay">{autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
              <Button variant="secondary" size="icon" onClick={next} data-testid="opening-next" aria-label="Next"><ChevronRight className="h-4 w-4" /></Button>
              <Button variant="secondary" size="icon" onClick={() => setPly(total)} data-testid="opening-last" aria-label="Last"><ChevronsRight className="h-4 w-4" /></Button>
              <span className="ml-2 text-sm text-muted-foreground tabular-nums">{ply}/{total}</span>
            </div>
            <BoardControls onFlip={() => setOrientation((o) => o === "white" ? "black" : "white")} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">{opening.name}</h1>
            <DifficultyBadge level={opening.difficulty} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{opening.eco} · {opening.side === "white" ? "White opening" : "Black response"}</p>
          <p className="mt-4 leading-relaxed">{opening.description}</p>

          <div className="mt-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Main line</h3>
            <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-sm" data-testid="opening-moves">
              {opening.moves.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setPly(i + 1)}
                  className={`rounded-md px-2 py-1 transition-colors ${ply === i + 1 ? "bg-action text-[hsl(var(--accent-action-foreground))]" : "bg-muted hover:bg-accent"}`}
                >
                  {i % 2 === 0 ? `${i / 2 + 1}.` : ""} {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Key ideas</h3>
            <ul className="mt-2 space-y-2">
              {opening.ideas.map((idea, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-action" />{idea}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-xl bg-muted/60 p-3 text-sm"><span className="font-semibold">Recommended for:</span> {opening.recommended_for}</div>

          <Button className="mt-5 w-full bg-action hover:brightness-110" onClick={markComplete} disabled={completed} data-testid="opening-complete-button">
            {completed ? <><Check className="mr-1.5 h-4 w-4" /> Learned (+{opening.xp_reward} XP)</> : <>Mark as Learned (+{opening.xp_reward} XP)</>}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
