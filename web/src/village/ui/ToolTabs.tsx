import { chamfer, vo, voFontLabel } from "./theme";

export interface ToolTabDef<T extends string = string> {
  id: T;
  label: string;
  disabled?: boolean;
}

export interface ToolTabsProps<T extends string = string> {
  tools: ToolTabDef<T>[];
  active: T;
  onChange: (id: T) => void;
}

/**
 * Generic chamfered tab bar shared by any building interior that needs a
 * source/tool switcher (Forge: GitHub/Vercel/Supabase; Mangue: Obsidian/
 * Arquivos locais/Drive/GitBook; ...). Same chamfer + label-font
 * vocabulary as the rest of "Sacred Sovereignty" — deliberately plain so
 * the panels themselves stay the visual focus.
 *
 * The Forge currently still uses its own local `ForgeToolTabs` (shipped
 * before this generic version existed) — left untouched to avoid touching
 * working code. New buildings should use this one instead of copying it.
 */
export function ToolTabs<T extends string>({ tools, active, onChange }: ToolTabsProps<T>) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
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
