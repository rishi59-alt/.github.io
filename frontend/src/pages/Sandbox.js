import React, { useMemo } from "react";
import { useChessGame } from "@/hooks/useChessGame";
import { ChessBoard } from "@/components/chess/ChessBoard";
import { BoardControls } from "@/components/chess/BoardControls";
import { CapturedPieces } from "@/components/chess/CapturedPieces";
import { PageContainer } from "@/components/PageContainer";
import { SectionHeading } from "@/components/common/SectionHeading";
import { toMovePairs } from "@/lib/chessUtils";

export default function Sandbox() {
  const g = useChessGame();
  const pairs = useMemo(() => toMovePairs(g.history), [g.history]);

  return (
    <PageContainer>
      <SectionHeading emoji="♜" title="Interactive Board" subtitle="Free play. Drag or tap to move — only legal moves allowed. Your Move." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="board-frame mx-auto w-full max-w-[600px]">
            <ChessBoard
              fen={g.fen}
              orientation={g.orientation}
              onPieceDrop={g.onPieceDrop}
              onSquareClick={g.onSquareClick}
              legalTargets={g.legalTargets}
              moveFrom={g.moveFrom}
              lastMove={g.lastMove}
              checkSquare={g.checkSquare}
              id="sandbox-board"
            />
          </div>
          <div className="mx-auto mt-4 flex max-w-[600px] items-center justify-between gap-3">
            <span className="text-sm font-semibold" data-testid="board-status">{g.status}</span>
            <BoardControls onUndo={g.undo} onReset={() => g.reset()} onFlip={g.flip} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Captured</h3>
            <div className="mt-2"><CapturedPieces captured={g.captured} /></div>
          </div>
          <div className="mt-4 rounded-2xl border border-border/70 bg-card/60 p-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Move History</h3>
            <div className="mt-2 max-h-[360px] overflow-auto font-mono text-sm" data-testid="move-history">
              {pairs.length === 0 ? (
                <p className="text-muted-foreground/60">No moves yet. Make your first move.</p>
              ) : (
                <table className="w-full">
                  <tbody>
                    {pairs.map((p) => (
                      <tr key={p.no} className="border-b border-border/40 last:border-0">
                        <td className="w-8 py-1 text-muted-foreground">{p.no}.</td>
                        <td className="py-1">{p.white}</td>
                        <td className="py-1">{p.black}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
