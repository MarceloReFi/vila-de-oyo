import type { ReactNode } from "react";
import { chamfer, vo, voFontLabel } from "./theme";

export function ChamferBadge({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        clipPath: chamfer(4),
        background: vo.surface,
        border: `1px solid ${vo.outline}`,
        padding: "4px 10px",
        fontFamily: voFontLabel,
        fontSize: 12,
        fontWeight: 700,
        color: vo.secondary,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}
