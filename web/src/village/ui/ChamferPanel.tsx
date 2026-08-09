import type { CSSProperties, ReactNode } from "react";
import { chamfer, vo } from "./theme";

export interface ChamferPanelProps {
  children: ReactNode;
  corner?: number;
  shadow?: number;
  shadowColor?: string;
  style?: CSSProperties;
  className?: string;
}

/**
 * "Palace Tablet" surface: chamfered 45° corners with a hard-edged pixel
 * shadow that follows the same silhouette (a plain CSS box-shadow would be
 * square, so the shadow is a second clipped layer offset behind instead).
 */
export function ChamferPanel({
  children,
  corner = 10,
  shadow = 8,
  shadowColor = "#000",
  style,
  className,
}: ChamferPanelProps) {
  const clip = chamfer(corner);
  return (
    <div style={{ position: "relative" }} className={className}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          clipPath: clip,
          background: shadowColor,
          transform: `translate(${shadow}px, ${shadow}px)`,
        }}
      />
      <div
        style={{
          position: "relative",
          clipPath: clip,
          background: vo.surfaceContainerHigh,
          border: `2px solid ${vo.outlineVariant}`,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
