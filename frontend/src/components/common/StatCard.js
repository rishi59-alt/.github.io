import React from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export function StatCard({ icon = "Activity", label, value, sub, testid }) {
  const Icon = Icons[icon] || Icons.Activity;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5"
      data-testid={testid}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </motion.div>
  );
}
