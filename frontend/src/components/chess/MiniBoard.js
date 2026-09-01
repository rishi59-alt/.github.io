import React from "react";
import { ChessBoard } from "@/components/chess/ChessBoard";

// Static, non-interactive preview board
export function MiniBoard({ fen, orientation = "white", id = "mini" }) {
  return (
    <div className="pointer-events-none select-none">
      <ChessBoard fen={fen} orientation={orientation} allowDragging={false} id={id} />
    </div>
  );
}
