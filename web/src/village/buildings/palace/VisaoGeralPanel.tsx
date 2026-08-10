import { Castle, Coins, Hammer, Heart, Sparkles, Store, Trees } from "lucide-react";
import type { ReactNode } from "react";
import { ChamferBadge } from "../../ui/ChamferBadge";
import { ChamferPanel } from "../../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "../../ui/theme";

interface Node {
  id: string;
  icon: ReactNode;
  iconBg: string;
  iconFg: string;
  iconBorder: string;
  name: string;
  desc: string;
  level: number;
}

// Ported from the old KingdomPanel modal (now removed — the Palace is a
// full building). Still placeholder data, no live Hermes source yet.
const NODES: Node[] = [
  { id: "palace", icon: <Castle size={24} />, iconBg: vo.tertiaryContainer, iconFg: "#680016", iconBorder: "#680016", name: "Palácio", desc: "Sede do Alaafin. Prosperidade estável.", level: 3 },
  { id: "forge", icon: <Hammer size={24} />, iconBg: vo.secondaryFixed, iconFg: "#725f00", iconBorder: "#725f00", name: "Ferraria", desc: "Forja de Ogum. GitHub, Vercel, Supabase.", level: 2 },
  { id: "mangue", icon: <Trees size={24} />, iconBg: "#1b4332", iconFg: "#74c69d", iconBorder: "#74c69d", name: "Mangue", desc: "Águas de Nanã. Obsidian, Drive, arquivos.", level: 4 },
  { id: "mercado", icon: <Store size={24} />, iconBg: vo.primaryContainer, iconFg: vo.onPrimaryContainer, iconBorder: vo.onPrimaryContainer, name: "Mercado", desc: "Domínio de Exu. Gmail, Telegram.", level: 1 },
];

const METRICS = [
  { icon: <Coins size={20} />, color: vo.secondaryFixed, label: "Riqueza", value: "1.250" },
  { icon: <Heart size={20} />, color: "#ff8a80", label: "Saúde", value: "85%" },
  { icon: <Sparkles size={20} />, color: vo.tertiary, label: "Ritual", value: "3/5" },
];

export function VisaoGeralPanel() {
  return (
    <ChamferPanel corner={14} shadow={8} style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", maxHeight: "70vh" }}>
      <div style={{ padding: "16px 20px", borderBottom: `2px solid ${vo.outlineVariant}` }}>
        <h1 style={{ fontFamily: voFontDisplay, fontSize: 24, fontWeight: 700, color: vo.primary, margin: 0 }}>
          Status do Reino
        </h1>
        <div style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant, marginTop: 2 }}>
          Resumo das construções
        </div>
      </div>

      <div className="vo-leather" style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {NODES.map((node) => (
          <div
            key={node.id}
            style={{
              clipPath: chamfer(6),
              background: "rgba(42,42,42,.92)",
              border: `2px solid ${vo.outlineVariant}`,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow: "3px 3px 0 rgba(0,0,0,.8)",
            }}
          >
            <div
              style={{
                clipPath: chamfer(6),
                width: 48,
                height: 48,
                flexShrink: 0,
                background: node.iconBg,
                color: node.iconFg,
                border: `2px solid ${node.iconBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {node.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontFamily: voFontDisplay, fontSize: 18, fontWeight: 700, color: vo.primary, margin: 0 }}>
                {node.name}
              </h2>
              <p style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant, margin: "2px 0 0" }}>
                {node.desc}
              </p>
            </div>
            <ChamferBadge>Lvl {node.level}</ChamferBadge>
          </div>
        ))}
      </div>

      <div style={{ background: vo.surfaceContainerHighest, borderTop: `4px solid ${vo.outlineVariant}`, padding: 16, display: "flex", justifyContent: "space-around" }}>
        {METRICS.map((m, i) => (
          <div key={m.label} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && <div style={{ width: 1, height: 32, background: vo.outlineVariant, marginRight: 16 }} />}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ color: m.color }}>{m.icon}</div>
              <span style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 1 }}>
                {m.label}
              </span>
              <span style={{ fontFamily: voFontDisplay, fontSize: 18, fontWeight: 700, color: vo.primary }}>
                {m.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChamferPanel>
  );
}
