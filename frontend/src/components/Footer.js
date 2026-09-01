import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background font-display font-bold">♟</span>
            <span className="font-display text-lg font-bold tracking-tight">CHESS</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link to="/openings" className="hover:text-foreground">Openings</Link>
            <Link to="/lessons" className="hover:text-foreground">Lessons</Link>
            <Link to="/tactics" className="hover:text-foreground">Tactics</Link>
            <Link to="/puzzles" className="hover:text-foreground">Puzzles</Link>
            <Link to="/board" className="hover:text-foreground">Board</Link>
            <Link to="/progress" className="hover:text-foreground">Progress</Link>
          </nav>
          <p className="text-xs text-muted-foreground">Stop guessing. Start playing. ♔</p>
        </div>
      </div>
    </footer>
  );
}
