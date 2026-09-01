import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle, Trophy, Info } from "lucide-react";
import api from "@/lib/api";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { PuzzleBoard } from "@/components/chess/PuzzleBoard";
import { PageContainer } from "@/components/PageContainer";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/context/ProgressContext";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useProgress();
  const [lesson, setLesson] = useState(null);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false); // current move-step solved / info auto-done
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let active = true;
    api.get(`/lessons/${id}`).then(({ data }) => { if (active) { setLesson(data); setIdx(0); } }).catch(() => {});
    return () => { active = false; };
  }, [id]);

  const steps = lesson?.steps || [];
  const step = steps[idx];

  useEffect(() => {
    if (!step) return;
    setDone(step.type === "info");
    setFeedback(null);
    setShowHint(false);
  }, [idx, step]);

  const pct = steps.length ? Math.round(((idx + (done ? 1 : 0)) / steps.length) * 100) : 0;
  const isLast = idx === steps.length - 1;

  const goNext = async () => {
    if (isLast) {
      await completeLesson(lesson.id);
      setFinished(true);
      return;
    }
    setIdx((i) => i + 1);
  };

  const restart = () => { setIdx(0); setFinished(false); };

  if (!lesson) {
    return <PageContainer><Skeleton className="h-8 w-48" /><Skeleton className="mt-4 h-96 w-full max-w-xl" /></PageContainer>;
  }

  return (
    <PageContainer>
      <Link to="/lessons" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All lessons
      </Link>

      <div className="mb-5">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
          <DifficultyBadge level={lesson.difficulty} />
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {Math.min(idx + 1, steps.length)} of {steps.length}</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="mt-1.5 h-2" data-testid="lesson-progress" />
        </div>
      </div>

      {finished ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg rounded-2xl border border-action/40 bg-action/5 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-action/15 text-action"><Trophy className="h-7 w-7" /></div>
          <h2 className="mt-4 font-display text-2xl font-bold">Lesson complete. GG.</h2>
          <p className="mt-1 text-muted-foreground">You earned +{lesson.xp_reward} XP. Time to Grind the next one.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={restart} data-testid="lesson-replay-button"><RotateCcw className="mr-1.5 h-4 w-4" /> Replay</Button>
            <Button className="bg-action hover:brightness-110" onClick={() => navigate("/lessons")} data-testid="lesson-more-button">More Lessons</Button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="board-frame mx-auto w-full max-w-[560px]">
              {step.type === "move" ? (
                <PuzzleBoard
                  key={`${lesson.id}-${idx}`}
                  fen={step.fen}
                  orientation={step.fen.split(" ")[1] === "b" ? "black" : "white"}
                  expected={step.expected}
                  accept={[]}
                  showHint={showHint && !done}
                  onCorrect={() => { setFeedback("correct"); setDone(true); }}
                  onWrong={() => setFeedback("wrong")}
                />
              ) : (
                <ChessBoard fen={step.fen} allowDragging={false} id={`lesson-info-${idx}`} orientation={step.fen.split(" ")[1] === "b" ? "black" : "white"} />
              )}
            </div>
            {step.type === "move" && (
              <div className="mx-auto mt-3 flex max-w-[560px] items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowHint((s) => !s)} disabled={done}>Hint</Button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border/70 bg-card/60 p-5" data-testid="lesson-explanation-panel">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {step.type === "move" ? <><span className="text-action">Your turn</span></> : <><Info className="h-3.5 w-3.5" /> Concept</>}
              </div>
              <h2 className="mt-2 font-display text-xl font-bold" data-testid="lesson-step-title">{step.prompt}</h2>

              <AnimatePresence mode="wait">
                {step.type === "move" && !done && feedback === "wrong" && (
                  <motion.div key="wrong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    <XCircle className="h-4 w-4" /> Not quite — Try Again.
                  </motion.div>
                )}
                {(done || step.type === "info") && (
                  <motion.p key="exp" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm leading-relaxed text-muted-foreground" data-testid="lesson-step-body">
                    {step.type === "move" && <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-action" />}
                    {step.explanation}
                  </motion.p>
                )}
                {step.type === "move" && !done && feedback !== "wrong" && (
                  <motion.p key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-muted-foreground">
                    Make the best move on the board to continue.
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-6 flex items-center gap-2">
                <Button variant="secondary" onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} data-testid="lesson-prev-button">
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button className="bg-action hover:brightness-110" onClick={goNext} disabled={!done} data-testid="lesson-next-button">
                  {isLast ? "Finish" : "Next"} <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={restart} data-testid="lesson-restart-button" aria-label="Restart lesson"><RotateCcw className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
