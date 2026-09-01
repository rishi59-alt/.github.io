import React, { useCallback, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/chess/ChessBoard";

/**
 * Interactive puzzle board: user must play one of `expected` (or `accept`) SAN moves.
 * Remount with key={fen} to load a new position.
 */
export function PuzzleBoard({ fen, orientation = "white", expected = [], accept = [], onCorrect, onWrong, showHint = false }) {
  const gameRef = useRef(new Chess(fen));
  const [pos, setPos] = useState(fen);
  const [moveFrom, setMoveFrom] = useState("");
  const [legalTargets, setLegal] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [locked, setLocked] = useState(false);

  const targetsFor = useCallback((square) => {
    const moves = gameRef.current.moves({ square, verbose: true });
    return moves.map((m) => ({ to: m.to, capture: !!(m.captured || m.flags.includes("e")) }));
  }, []);

  const clearSel = () => { setMoveFrom(""); setLegal([]); };

  const attempt = useCallback((from, to) => {
    if (locked) return false;
    const clone = new Chess(gameRef.current.fen());
    let mv;
    try { mv = clone.move({ from, to, promotion: "q" }); } catch { return false; }
    if (!mv) return false;
    const ok = expected.includes(mv.san) || accept.includes(mv.san);
    if (ok) {
      gameRef.current.move(mv.san);
      setPos(gameRef.current.fen());
      setLastMove({ from: mv.from, to: mv.to });
      setLocked(true);
      onCorrect && onCorrect(mv);
    } else {
      onWrong && onWrong(mv);
    }
    clearSel();
    return ok;
  }, [locked, expected, accept, onCorrect, onWrong]);

  const onPieceDrop = useCallback(({ sourceSquare, targetSquare }) => {
    if (!targetSquare) return false;
    return attempt(sourceSquare, targetSquare);
  }, [attempt]);

  const onSquareClick = useCallback(({ square, piece }) => {
    if (locked) return;
    if (!moveFrom) {
      if (piece) { const t = targetsFor(square); if (t.length) { setMoveFrom(square); setLegal(t); } }
      return;
    }
    if (square === moveFrom) { clearSel(); return; }
    const ok = attempt(moveFrom, square);
    if (!ok && piece) { const t = targetsFor(square); if (t.length) { setMoveFrom(square); setLegal(t); } else clearSel(); }
  }, [locked, moveFrom, attempt, targetsFor]);

  const hintFrom = useMemo(() => {
    if (!showHint) return null;
    const c = new Chess(fen);
    const ms = c.moves({ verbose: true });
    const m = ms.find((x) => expected.includes(x.san) || accept.includes(x.san));
    return m ? m.from : null;
  }, [showHint, fen, expected, accept]);

  return (
    <ChessBoard
      fen={pos}
      orientation={orientation}
      onPieceDrop={onPieceDrop}
      onSquareClick={onSquareClick}
      legalTargets={legalTargets}
      moveFrom={showHint && hintFrom ? hintFrom : moveFrom}
      lastMove={lastMove}
      id="puzzle-board"
    />
  );
}
