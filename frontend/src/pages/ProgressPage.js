import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Target, BookOpen, GraduationCap, Trophy, RotateCcw } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { XPBar } from "@/components/common/XPBar";
import { StatCard } from "@/components/common/StatCard";
import { AchievementBadge } from "@/components/common/AchievementBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProgress } from "@/context/ProgressContext";
import { Skeleton } from "@/components/ui/skeleton";

function Breakdown({ label, done, total, icon: Icon }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-medium"><Icon className="h-4 w-4 text-muted-foreground" /> {label}</span>
        <span className="font-mono text-sm tabular-nums">{done}/{total}</span>
      </div>
      <Progress value={pct} className="mt-3 h-2" />
    </div>
  );
}

export default function ProgressPage() {
  const { progress, loading, resetProgress } = useProgress();

  if (loading || !progress) {
    return <PageContainer><Skeleton className="h-40 w-full rounded-2xl" /><div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-28 rounded-2xl" />)}</div></PageContainer>;
  }

  const s = progress.stats;

  return (
    <PageContainer>
      <SectionHeading emoji="📊" title="Your Progress" subtitle="Track your grind. Level up. Keep the streak alive." />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-action/15 font-display text-2xl font-bold text-action">
              {progress.level}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Current rank</div>
              <div className="font-display text-xl font-bold">{progress.title}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-amber-400"><Flame className="h-4 w-4" /> {progress.streak} day streak</div>
            </div>
          </div>
          <div className="flex-1"><XPBar progress={progress} /></div>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="GraduationCap" label="Lessons" value={s.lessons_completed} sub={`of ${s.total_lessons}`} testid="stat-lessons" />
        <StatCard icon="BookOpen" label="Openings" value={s.openings_learned} sub={`of ${s.total_openings}`} testid="stat-openings" />
        <StatCard icon="Target" label="Tactics" value={s.tactics_solved} sub={`of ${s.total_tactics}`} testid="stat-tactics" />
        <StatCard icon="Crosshair" label="Accuracy" value={`${progress.accuracy}%`} sub={`${progress.tactics_correct}/${progress.tactics_attempts} tries`} testid="stat-accuracy" />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Learning progress</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Breakdown label="Lessons" done={s.lessons_completed} total={s.total_lessons} icon={GraduationCap} />
          <Breakdown label="Openings" done={s.openings_learned} total={s.total_openings} icon={BookOpen} />
          <Breakdown label="Tactics" done={s.tactics_solved} total={s.total_tactics} icon={Target} />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-action" />
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Achievements</h3>
          <span className="text-xs text-muted-foreground">({progress.achievements.filter(a=>a.earned).length}/{progress.achievements.length})</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {progress.achievements.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/40 p-5">
        <div>
          <div className="font-medium">Keep going</div>
          <p className="text-sm text-muted-foreground">Jump back in and stack more XP.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-action hover:brightness-110"><Link to="/lessons">Continue Learning</Link></Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="reset-progress-button" aria-label="Reset progress"><RotateCcw className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                <AlertDialogDescription>This clears your XP, level, streak and completed items. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => resetProgress()}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </PageContainer>
  );
}
