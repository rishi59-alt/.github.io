import React from "react";
import { PIECE_UNICODE } from "@/hooks/useChessGame";

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export function CapturedPieces({ captured }) {
  const whiteScore = captured.w.reduce((a, p) => a + VALUE[p[1]], 0);
  const blackScore = captured.b.reduce((a, p) => a + VALUE[p[1]], 0);
  const diff = whiteScore - blackScore;

  const Row = ({ label, pieces, testid }) => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground w-16">{label}</span>
      <div className="flex flex-wrap text-xl leading-none" data-testid={testid}>
        {pieces.length === 0 ? (
          <span className="text-muted-foreground/40 text-xs">—</span>
        ) : (
          pieces.map((p, i) => <span key={i} className="-mr-0.5">{PIECE_UNICODE[p]}</span>)
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-1.5">
      <Row label="White" pieces={captured.w} testid="captured-white" />
      <Row label="Black" pieces={captured.b} testid="captured-black" />
      {diff !== 0 && (
        <div className="text-xs font-mono text-action">{diff > 0 ? `+${diff}` : diff} material</div>
      )}
    </div>
  );
}
