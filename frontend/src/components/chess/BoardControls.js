import React from "react";
import { Undo2, RotateCcw, FlipVertical2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BoardControls({ onUndo, onReset, onFlip }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onUndo && (
        <Button variant="secondary" size="sm" onClick={onUndo} data-testid="board-undo" aria-label="Undo move">
          <Undo2 className="mr-1.5 h-4 w-4" /> Undo
        </Button>
      )}
      {onReset && (
        <Button variant="secondary" size="sm" onClick={onReset} data-testid="board-reset" aria-label="Reset board">
          <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
        </Button>
      )}
      {onFlip && (
        <Button variant="secondary" size="sm" onClick={onFlip} data-testid="board-flip" aria-label="Flip board">
          <FlipVertical2 className="mr-1.5 h-4 w-4" /> Flip
        </Button>
      )}
    </div>
  );
}
