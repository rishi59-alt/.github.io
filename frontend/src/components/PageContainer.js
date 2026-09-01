import React from "react";
import { cn } from "@/lib/utils";

export function PageContainer({ children, className }) {
  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10", className)}>
      {children}
    </div>
  );
}
