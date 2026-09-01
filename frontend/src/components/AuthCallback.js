import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { CLIENT_ID } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";

export function AuthCallback() {
  const processed = useRef(false);
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const progress = useProgress();

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const hash = window.location.hash || "";
    const m = hash.match(/session_id=([^&]+)/);
    const sid = m ? decodeURIComponent(m[1]) : null;
    (async () => {
      if (!sid) { navigate("/login"); return; }
      try {
        const { data } = await api.post("/auth/session", { session_id: sid, client_id: CLIENT_ID });
        setSession(data.token, data.user);
        window.history.replaceState(null, "", window.location.pathname);
        try { await progress.refresh(); } catch (e) { /* noop */ }
        navigate("/progress");
      } catch (e) {
        navigate("/login?error=google");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background font-display text-2xl font-bold animate-pulse">♟</div>
      <p className="text-muted-foreground">Signing you in… Lock In ♟️</p>
    </div>
  );
}
