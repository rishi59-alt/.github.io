import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Zap, Play, Check } from "lucide-react";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/context/ProgressContext";

export function LessonCard({ lesson, index = 0 }) {
  const { isDone } = useProgress();
  const done = isDone("lesson", lesson.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.26, delay: Math.min(index * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-4 transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
      data-testid="lesson-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {lesson.category}
          </span>
        </div>
        <DifficultyBadge level={lesson.difficulty} />
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{lesson.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {lesson.est_minutes} min</span>
        <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> {lesson.xp_reward} XP</span>
      </div>

      <div className="mt-3">
        <Progress value={done ? 100 : 0} className="h-1.5" data-testid="lesson-card-progress" />
      </div>

      <div className="mt-4 flex-1" />
      <Button asChild variant={done ? "secondary" : "default"} className={done ? "w-full" : "w-full bg-action hover:brightness-110"} data-testid="lesson-card-start-button">
        <Link to={`/lessons/${lesson.id}`}>
          {done ? <><Check className="mr-1.5 h-4 w-4" /> Completed — Replay</> : <><Play className="mr-1.5 h-4 w-4" /> Start Lesson</>}
        </Link>
      </Button>
    </motion.div>
  );
}
