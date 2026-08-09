import { useState, type ButtonHTMLAttributes } from "react";
import { chamfer, vo, voFontDisplay } from "./theme";

export interface ChamferButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  corner?: number;
}

/**
 * "Carved Block" button: raised terra-cotta block, golden glow on hover,
 * content shifts 2px down-right on press (per DESIGN.md Components).
 */
export function ChamferButton({
  variant = "primary",
  corner = 8,
  style,
  children,
  ...rest
}: ChamferButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const clip = chamfer(corner);

  const isPrimary = variant === "primary";
  const bg = isPrimary ? vo.primaryContainer : vo.surfaceContainerHighest;
  const fg = isPrimary ? vo.onPrimaryContainer : vo.onSurface;

  return (
    <button
      {...rest}
      onMouseEnter={(e) => {
        setHovered(true);
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        setPressed(false);
        rest.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setPressed(true);
        rest.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setPressed(false);
        rest.onMouseUp?.(e);
      }}
      style={{
        clipPath: clip,
        background: bg,
        color: fg,
        border: "none",
        padding: "12px 24px",
        fontFamily: voFontDisplay,
        fontSize: 14,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        cursor: "pointer",
        boxShadow: hovered
          ? `inset 0 0 0 2px ${vo.secondaryFixed}, 6px 6px 0 rgba(0,0,0,.8)`
          : "6px 6px 0 rgba(0,0,0,.8)",
        transform: pressed ? "translate(2px, 2px)" : undefined,
        transition: "box-shadow 120ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
