import { useCallback, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";

// Unicode for captured piece rendering
export const PIECE_UNICODE = {
  wp: "\u2659", wn: "\u2658", wb: "\u2657", wr: "\u2656", wq: "\u2655", wk: "\u2654",
  bp: "\u265F", bn: "\u265E", bb: "\u265D", br: "\u265C", bq: "\u265B", bk: "\u265A",
};

/**
 * Reusable interactive chess logic (validated in POC).
 * options: { fen?: string, onMove?: (move, game) => void, playable?: bool }
 */
export function useChessGame({ initialFen, onMove } = {}) {
  const gameRef = useRef(initialFen ? new Chess(initialFen) : new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [orientation, setOrientation] = useState("white");
  const [moveFrom, setMoveFrom] = useState("");
  const [legalTargets, setLegalTargets] = useState([]); // {to, capture}
  const [lastMove, setLastMove] = useState(null);
  const [history, setHistory] = useState([]);
  const [captured, setCaptured] = useState({ w: [], b: [] });

  const sync = useCallback(() => {
    const g = gameRef.current;
    setFen(g.fen());
    const verbose = g.history({ verbose: true });
    setHistory(g.history());
    const cap = { w: [], b: [] };
    for (const mv of verbose) {
      if (mv.captured) {
        const capturedColor = mv.color === "w" ? "b" : "w";
        cap[mv.color].push(capturedColor + mv.captured);
      }
    }
    setCaptured(cap);
  }, []);

  const computeTargets = useCallback((square) => {
    const moves = gameRef.current.moves({ square, verbose: true });
    return moves.map((m) => ({ to: m.to, capture: !!(m.captured || m.flags.includes("e")) }));
  }, []);

  const selectSquare = useCallback((square) => {
    const t = computeTargets(square);
    if (t.length === 0) { setLegalTargets([]); return false; }
    setLegalTargets(t);
    setMoveFrom(square);
    return true;
  }, [computeTargets]);

  const clearSelection = useCallback(() => { setMoveFrom(""); setLegalTargets([]); }, []);

  const makeMove = useCallback((from, to, promotion = "q") => {
    try {
      const mv = gameRef.current.move({ from, to, promotion });
      if (!mv) return false;
      setLastMove({ from: mv.from, to: mv.to });
      clearSelection();
      sync();
      if (onMove) onMove(mv, gameRef.current);
      return true;
    } catch {
      return false;
    }
  }, [sync, onMove, clearSelection]);

  const onPieceDrop = useCallback(({ sourceSquare, targetSquare }) => {
    if (!targetSquare) return false;
    return makeMove(sourceSquare, targetSquare);
  }, [makeMove]);

  const onSquareClick = useCallback(({ square, piece }) => {
    if (!moveFrom) { if (piece) selectSquare(square); return; }
    if (square === moveFrom) { clearSelection(); return; }
    const ok = makeMove(moveFrom, square);
    if (!ok) { if (piece) selectSquare(square); else clearSelection(); }
  }, [moveFrom, selectSquare, makeMove, clearSelection]);

  const undo = useCallback(() => {
    gameRef.current.undo();
    setLastMove(null); clearSelection(); sync();
  }, [sync, clearSelection]);

  const reset = useCallback((toFen) => {
    gameRef.current = toFen ? new Chess(toFen) : (initialFen ? new Chess(initialFen) : new Chess());
    setLastMove(null); clearSelection(); sync();
  }, [sync, clearSelection, initialFen]);

  const loadFen = useCallback((f) => {
    gameRef.current = new Chess(f);
    setLastMove(null); clearSelection(); sync();
  }, [sync, clearSelection]);

  const flip = useCallback(() => setOrientation((o) => (o === "white" ? "black" : "white")), []);

  const game = gameRef.current;
  const turn = game.turn() === "w" ? "White" : "Black";
  const status = game.isCheckmate()
    ? "Checkmate. GG."
    : game.isStalemate()
    ? "Stalemate"
    : game.isDraw()
    ? "Draw"
    : game.inCheck()
    ? `${turn} in check`
    : `${turn} to move`;

  const checkSquare = useMemo(() => {
    if (!game.inCheck()) return null;
    const color = game.turn();
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = board[r][c];
        if (sq && sq.type === "k" && sq.color === color) {
          return "abcdefgh"[c] + (8 - r);
        }
      }
    }
    return null;
  }, [game, fen]); // eslint-disable-line

  return {
    gameRef, game, fen, orientation, moveFrom, legalTargets, lastMove, history, captured,
    status, turn, checkSquare,
    onPieceDrop, onSquareClick, undo, reset, flip, loadFen, makeMove, selectSquare, clearSelection, setOrientation,
  };
}
