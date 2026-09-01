import React, { useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { useTheme } from "@/context/ThemeContext";
import { BOARD_THEME, dotStyle, ringStyle } from "@/lib/chessStyles";

export function ChessBoard({
  fen,
  orientation = "white",
  onPieceDrop,
  onSquareClick,
  legalTargets = [],
  moveFrom,
  lastMove,
  checkSquare,
  allowDragging = true,
  id = "board",
}) {
  const { theme } = useTheme();
  const t = BOARD_THEME[theme] || BOARD_THEME.dark;

  const squareStyles = useMemo(() => {
    const s = {};
    if (lastMove) {
      s[lastMove.from] = { backgroundColor: t.lastMove };
      s[lastMove.to] = { backgroundColor: t.lastMove };
    }
    if (checkSquare) s[checkSquare] = { backgroundColor: t.check };
    if (moveFrom) s[moveFrom] = { backgroundColor: t.selected };
    for (const mv of legalTargets) {
      s[mv.to] = mv.capture ? ringStyle(t.captureRing) : dotStyle(t.dot);
    }
    return s;
  }, [t, lastMove, checkSquare, moveFrom, legalTargets]);

  const options = useMemo(() => ({
    position: fen,
    boardOrientation: orientation,
    squareStyles,
    darkSquareStyle: { backgroundColor: t.dark },
    lightSquareStyle: { backgroundColor: t.light },
    darkSquareNotationStyle: { color: t.notation, fontSize: "11px" },
    lightSquareNotationStyle: { color: t.notation, fontSize: "11px" },
    animationDurationInMs: 200,
    allowDragging,
    id,
    ...(onPieceDrop ? { onPieceDrop } : {}),
    ...(onSquareClick ? { onSquareClick } : {}),
  }), [fen, orientation, squareStyles, t, allowDragging, id, onPieceDrop, onSquareClick]);

  return <Chessboard options={options} />;
}
