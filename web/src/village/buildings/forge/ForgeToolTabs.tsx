import { chamfer, vo, voFontLabel } from "../../ui/theme";

export type ForgeTool = "github" | "vercel" | "supabase";

export interface ForgeToolTabDef {
  id: ForgeTool;
  label: string;
  disabled?: boolean;
}

export interface ForgeToolTabsProps {
  tools: ForgeToolTabDef[];
  active: ForgeTool;
  onChange: (tool: ForgeTool) => void;
}

/**
 * Tool switcher for the Forge's multi-tool layout (GitHub / Vercel /
 * Supabase, per the connection model in HERMES_GUIDE.md). Same chamfer +
 * label-font vocabulary as the rest of "Sacred Sovereignty" — deliberately
 * plain so the tool panels themselves stay the visual focus.
 */
export function ForgeToolTabs({ tools, active, onChange }: ForgeToolTabsProps) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {tools.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            disabled={t.disabled}
            onClick={() => onChange(t.id)}
            style={{
              clipPath: chamfer(6),
              padding: "8px 18px",
              fontFamily: voFontLabel,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              border: `2px solid ${vo.outlineVariant}`,
              background: isActive ? vo.surfaceContainerHigh : vo.surfaceContainer,
              color: isActive ? vo.primary : vo.onSurfaceVariant,
              cursor: t.disabled ? "not-allowed" : "pointer",
              opacity: t.disabled ? 0.4 : 1,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
