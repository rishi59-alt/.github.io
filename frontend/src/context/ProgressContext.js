import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/progress");
      setProgress(data);
    } catch (e) {
      console.error("progress load failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleResult = useCallback((data) => {
    setProgress(data);
    if (data.xp_gained > 0) {
      toast.success(`+${data.xp_gained} XP`, { description: "Clean Move \uD83D\uDD25", duration: 2200 });
    }
    if (data.leveled_up) {
      setTimeout(() => {
        toast(`You've leveled up! Level ${data.level}`, {
          description: `${data.title} unlocked \u2654`,
          duration: 3500,
        });
      }, 300);
    }
    return data;
  }, []);

  const completeLesson = useCallback(async (id) => {
    const { data } = await api.post("/progress/lesson", { item_id: id });
    return handleResult(data);
  }, [handleResult]);

  const completeOpening = useCallback(async (id) => {
    const { data } = await api.post("/progress/opening", { item_id: id });
    return handleResult(data);
  }, [handleResult]);

  const solveTactic = useCallback(async (id, correct) => {
    const { data } = await api.post("/progress/tactic", { tactic_id: id, correct });
    return handleResult(data);
  }, [handleResult]);

  const resetProgress = useCallback(async () => {
    const { data } = await api.post("/progress/reset");
    setProgress(data);
    toast("Progress reset");
    return data;
  }, []);

  const isDone = useCallback((type, id) => {
    if (!progress) return false;
    if (type === "lesson") return progress.completed_lessons?.includes(id);
    if (type === "opening") return progress.completed_openings?.includes(id);
    if (type === "tactic") return progress.solved_tactics?.includes(id);
    return false;
  }, [progress]);

  return (
    <ProgressContext.Provider value={{ progress, loading, refresh, completeLesson, completeOpening, solveTactic, resetProgress, isDone }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
