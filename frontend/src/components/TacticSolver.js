import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, RotateCcw, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { PuzzleBoard } from "@/components/chess/PuzzleBoard";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/context/ProgressContext";

export function TacticSolver({ tactic, onNext, nextLabel = "Next Tactic" }) {
  const { solveTactic } = useProgress();
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const orientation = tactic.side_to_move === "black" ? "black" : "white";

  const handleCorrect = () => {
    setFeedback("correct");
    setSolved(true);
    solveTactic(tactic.id, true).catch(() => {});
  };
  const handleWrong = () => {
    setFeedback("wrong");
    setAttempts((a) => a + 1);
    solveTactic(tactic.id, false).catch(() => {});
  };
  const retry = () => {
    setFeedback(null);
    setSolved(false);
    setShowHint(false);
    setResetKey((k) => k + 1);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="board-frame mx-auto w-full max-w-[560px]">
          <PuzzleBoard
            key={`${tactic.id}-${resetKey}`}
            fen={tactic.fen}
            orientation={orientation}
            expected={tactic.solution}
            accept={tactic.accept || []}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
            showHint={showHint && !solved}
          />
        </div>
        <div className="mx-auto mt-3 flex max-w-[560px] items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowHint((s) => !s)} disabled={solved} data-testid="tactics-hint-button">
            <Lightbulb className="mr-1.5 h-4 w-4" /> Hint
          </Button>
          <Button variant="secondary" size="sm" onClick={retry} data-testid="tactics-reset-button">
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tactic — {tactic.theme}</span>
            <DifficultyBadge level={tactic.difficulty} />
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold">Find the best move.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {orientation === "white" ? "White" : "Black"} to play. Make your move on the board.
          </p>

          {feedback === "correct" && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-start gap-2 rounded-xl border border-action/40 bg-action/10 p-3" data-testid="tactics-feedback-correct">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-action" />
              <div>
                <div className="font-semibold text-action">Correct Move — You Found It.</div>
                <p className="mt-1 text-sm text-muted-foreground" data-testid="tactics-explanation">{tactic.explanation}</p>
              </div>
            </motion.div>
          )}
          {feedback === "wrong" && !solved && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3" data-testid="tactics-feedback-wrong">
              <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <div className="font-semibold text-destructive">Blunder Detected 💀 — Try Again</div>
                <p className="mt-1 text-sm text-muted-foreground">That's not the strongest move. Look for the most forcing option.</p>
              </div>
            </motion.div>
          )}

          {solved && onNext && (
            <Button className="mt-5 w-full bg-action hover:brightness-110" onClick={onNext} data-testid="tactics-next-button">
              {nextLabel} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
