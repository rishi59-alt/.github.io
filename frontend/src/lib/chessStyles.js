// Board styling per design guidelines (monochrome + mint accents)
export const BOARD_THEME = {
  dark: {
    light: "#E7E7EA",
    dark: "#2B2C33",
    selected: "#3A3B45",
    lastMove: "rgba(62,230,178,0.22)",
    dot: "rgba(242,242,243,0.55)",
    captureRing: "rgba(62,230,178,0.55)",
    check: "rgba(229,72,77,0.30)",
    notation: "rgba(242,242,243,0.55)",
  },
  light: {
    light: "#F4F4F6",
    dark: "#3A3B44",
    selected: "#C9CAD2",
    lastMove: "rgba(48,160,120,0.28)",
    dot: "rgba(13,13,15,0.35)",
    captureRing: "rgba(48,160,120,0.55)",
    check: "rgba(229,72,77,0.28)",
    notation: "rgba(13,13,15,0.55)",
  },
};

export const dotStyle = (color) => ({
  backgroundImage: `radial-gradient(circle at center, ${color} 0 18%, transparent 19%)`,
});
export const ringStyle = (color) => ({
  backgroundImage: `radial-gradient(circle at center, transparent 0 56%, ${color} 57% 66%, transparent 67%)`,
});
