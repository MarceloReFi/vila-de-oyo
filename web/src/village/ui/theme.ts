/**
 * Shared tokens + the 45° chamfer clip-path used across the Vila de Oyó
 * "Sacred Sovereignty" components. DESIGN.md forbids standard border-radius
 * on containers/buttons in favor of stair-stepped corner cuts, so every
 * panel/button/badge in this feature routes through `chamfer()`.
 */
export const vo = {
  surface: "#131313",
  surfaceContainer: "#20201f",
  surfaceContainerHigh: "#2a2a2a",
  surfaceContainerHighest: "#353535",
  onSurface: "#e5e2e1",
  onSurfaceVariant: "#d6c2ba",
  outline: "#9f8d85",
  outlineVariant: "#52443d",
  primary: "#fbb796",
  onPrimary: "#4e250e",
  primaryContainer: "#c78a6b",
  onPrimaryContainer: "#4e250d",
  secondary: "#fff9ef",
  secondaryContainer: "#ffdb3c",
  secondaryFixed: "#ffe16d",
  tertiary: "#ffb3b4",
  tertiaryContainer: "#ff636f",
  onTertiaryContainer: "#680016",
  error: "#ffb4ab",
} as const;

export const voFontDisplay = "'VO Space Mono', monospace";
export const voFontBody = "'VO Fira Sans', sans-serif";
export const voFontLabel = "'VO JetBrains Mono', monospace";

/** 45°-chamfered rectangle clip-path. `corner` is the cut size in px. */
export function chamfer(corner = 10): string {
  return (
    `polygon(${corner}px 0, calc(100% - ${corner}px) 0, 100% ${corner}px, ` +
    `100% calc(100% - ${corner}px), calc(100% - ${corner}px) 100%, ${corner}px 100%, ` +
    `0 calc(100% - ${corner}px), 0 ${corner}px)`
  );
}
