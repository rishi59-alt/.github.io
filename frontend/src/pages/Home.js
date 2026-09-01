import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Target, GraduationCap, Flame, Zap, Trophy } from "lucide-react";
import api from "@/lib/api";
import { useChessGame } from "@/hooks/useChessGame";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { OpeningCard } from "@/components/OpeningCard";
import { LessonCard } from "@/components/LessonCard";
import { TacticCard } from "@/components/TacticCard";
import { Button } from "@/components/ui/button";

function HeroBoard() {
  const g = useChessGame();
  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="board-frame">
        <ChessBoard
          fen={g.fen}
          orientation={g.orientation}
          onPieceDrop={g.onPieceDrop}
          onSquareClick={g.onSquareClick}
          legalTargets={g.legalTargets}
          moveFrom={g.moveFrom}
          lastMove={g.lastMove}
          checkSquare={g.checkSquare}
          id="hero-board"
        />
      </div>
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-sm text-muted-foreground" data-testid="hero-board-status">{g.status}</span>
        <div className="flex gap-2">
          <button onClick={g.undo} className="rounded-lg border border-border/70 px-3 py-1 text-xs hover:bg-accent/60">Undo</button>
          <button onClick={() => g.reset()} className="rounded-lg border border-border/70 px-3 py-1 text-xs hover:bg-accent/60">Reset</button>
        </div>
      </div>
    </div>
  );
}

function Row({ children }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {children}
    </div>
  );
}

const VALUE_PROPS = [
  { icon: BookOpen, title: "14 Openings", text: "Real main lines you can play tomorrow." },
  { icon: GraduationCap, title: "16 Lessons", text: "From first move to deep strategy." },
  { icon: Target, title: "Live Tactics", text: "Solve on the board, get instant feedback." },
  { icon: Trophy, title: "XP & Streaks", text: "Level up every time you train." },
];

export default function Home() {
  const [openings, setOpenings] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tactics, setTactics] = useState([]);

  useEffect(() => {
    api.get("/openings").then(({ data }) => setOpenings(data)).catch(() => {});
    api.get("/lessons").then(({ data }) => setLessons(data)).catch(() => {});
    api.get("/tactics").then(({ data }) => setTactics(data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero-checkerboard border-b border-border/60">
        <PageContainer className="relative z-10 py-14 sm:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground"
              >
                <Sparkles className="h-3.5 w-3.5 text-action" /> Learn chess like a game, not a textbook
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
                className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
              >
                CHESS
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
                className="mt-4 max-w-md text-lg text-muted-foreground"
              >
                Stop guessing. Start playing like you know what you're doing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
                className="mt-7 flex flex-wrap gap-3"
              >
                <Button asChild size="lg" className="bg-action hover:brightness-110" data-testid="start-learning-button">
                  <Link to="/lessons">Start Learning <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="secondary" data-testid="explore-openings-button">
                  <Link to="/openings">Explore Openings</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" data-testid="practice-tactics-button">
                  <Link to="/tactics">Practice Tactics</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" data-testid="learn-chess-button">
                  <Link to="/lessons/chess-basics">Learn Chess</Link>
                </Button>
              </motion.div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Flame className="h-4 w-4 text-amber-400" /> Daily streaks</span>
                <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-action" /> XP & levels</span>
                <span className="inline-flex items-center gap-1.5"><Target className="h-4 w-4" /> Instant feedback</span>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <HeroBoard />
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* VALUE PROPS */}
      <PageContainer className="py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {VALUE_PROPS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.26, delay: i * 0.04 }}
              className="rounded-2xl border border-border/70 bg-card/60 p-4"
            >
              <v.icon className="h-5 w-5 text-action" />
              <div className="mt-3 font-display text-lg font-semibold">{v.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </PageContainer>

      {/* OPENINGS */}
      <PageContainer className="py-8">
        <SectionHeading
          emoji="🔥" title="OPENINGS" subtitle="Pick your weapon. Learn the plan."
          action={<Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/openings">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}
        />
        <Row>
          {openings.slice(0, 8).map((o, i) => (
            <div key={o.id} className="w-[290px] shrink-0 snap-start"><OpeningCard opening={o} index={i} /></div>
          ))}
        </Row>
      </PageContainer>

      {/* LESSONS */}
      <PageContainer className="py-8">
        <SectionHeading
          emoji="📖" title="LESSONS" subtitle="Level up one concept at a time."
          action={<Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/lessons">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}
        />
        <Row>
          {lessons.slice(0, 8).map((l, i) => (
            <div key={l.id} className="w-[300px] shrink-0 snap-start"><LessonCard lesson={l} index={i} /></div>
          ))}
        </Row>
      </PageContainer>

      {/* TACTICS */}
      <PageContainer className="py-8">
        <SectionHeading
          emoji="🧠" title="CHESS TRICKS" subtitle="Cook the position. Find the winning move."
          action={<Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/tactics">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>}
        />
        <Row>
          {tactics.slice(0, 8).map((t, i) => (
            <div key={t.id} className="w-[210px] shrink-0 snap-start"><TacticCard tactic={t} index={i} /></div>
          ))}
        </Row>
      </PageContainer>

      {/* CTA */}
      <PageContainer className="py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground"><Target className="h-3.5 w-3.5" /> Daily Puzzle</div>
              <h3 className="mt-2 font-display text-2xl font-bold">Your daily brain rep</h3>
              <p className="mt-1 text-muted-foreground">A fresh position every day. Keep the streak alive.</p>
            </div>
            <Button asChild className="w-fit bg-action hover:brightness-110"><Link to="/puzzles">Solve today's puzzle <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/70 bg-card/60 p-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground"><span aria-hidden>♜</span> Free Board</div>
              <h3 className="mt-2 font-display text-2xl font-bold">Just want to play?</h3>
              <p className="mt-1 text-muted-foreground">Open the interactive board. Drag, drop, undo, flip — your move.</p>
            </div>
            <Button asChild variant="secondary" className="w-fit"><Link to="/board">Open the board</Link></Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
