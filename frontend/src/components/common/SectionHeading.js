import React from "react";
import { motion } from "framer-motion";

export function SectionHeading({ emoji, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2"
        >
          {emoji && <span className="opacity-90">{emoji}</span>}
          {title}
        </motion.h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
