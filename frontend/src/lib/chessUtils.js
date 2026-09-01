import { Chess } from "chess.js";

// FEN after applying the first `count` SAN moves (or all if count is null)
export function fenAfterMoves(moves, count = null) {
  const g = new Chess();
  const n = count == null ? moves.length : count;
  for (let i = 0; i < n && i < moves.length; i++) {
    try { g.move(moves[i]); } catch (e) { break; }
  }
  return g.fen();
}

// Group SAN moves into numbered pairs for display
export function toMovePairs(moves) {
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({ no: i / 2 + 1, white: moves[i], black: moves[i + 1] || "" });
  }
  return pairs;
}
