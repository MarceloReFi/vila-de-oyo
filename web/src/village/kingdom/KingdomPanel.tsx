import { Castle, Coins, Hammer, Heart, Sparkles, Store, Trees, X } from "lucide-react";
import type { ReactNode } from "react";
import { ChamferBadge } from "../ui/ChamferBadge";
import { ChamferPanel } from "../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "../ui/theme";

export interface KingdomPanelProps {
  onClose: () => void;
}

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

// Placeholder values ported from the Claude Design mockup (code.html). No
// live Hermes data source has been wired up yet — see integration notes.
const NODES: Node[] = [
  {
    id: "palace",
    icon: <Castle size={24} />,
    iconBg: vo.tertiaryContainer,
    iconFg: vo.onTertiaryContainer,
    iconBorder: vo.onTertiaryContainer,
    name: "Palácio",
    desc: "Sede do Alaafin. Prosperidade estável.",
    level: 3,
  },
  {
    id: "forge",
    icon: <Hammer size={24} />,
    iconBg: vo.secondaryContainer,
    iconFg: "#725f00",
    iconBorder: "#725f00",
    name: "Ferraria",
    desc: "Forja de Ogum. Armas quentes.",
    level: 2,
  },
  {
    id: "grove",
    icon: <Trees size={24} />,
    iconBg: "#1b4332",
    iconFg: "#74c69d",
    iconBorder: "#74c69d",
    name: "Bosque",
    desc: "Mistérios de Nanã. Essência alta.",
    level: 4,
  },
  {
    id: "market",
    icon: <Store size={24} />,
    iconBg: vo.primaryContainer,
    iconFg: vo.onPrimaryContainer,
    iconBorder: vo.onPrimaryContainer,
    name: "Mercado",
    desc: "Domínio de Exu. Trocas ativas.",
    level: 1,
  },
];

const METRICS = [
  { icon: <Coins size={20} />, color: vo.secondaryFixed, label: "Riqueza", value: "1.250" },
  { icon: <Heart size={20} />, color: "#ff8a80", label: "Saúde", value: "85%" },
  { icon: <Sparkles size={20} />, color: vo.tertiary, label: "Ritual", value: "3/5" },
];

export function KingdomPanel({ onClose }: KingdomPanelProps) {
  return (
    <div
      className="vo-root"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div style={{ width: "100%", maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <ChamferPanel corner={14} shadow={8} style={{ display: "flex", flexDirection: "column", maxHeight: "85vh" }}>
          <div
            style={{
              background: vo.primaryContainer,
              padding: "16px 20px",
              borderBottom: `4px solid ${vo.outlineVariant}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontFamily: voFontDisplay,
                fontSize: 24,
                fontWeight: 700,
                color: vo.onPrimaryContainer,
                margin: 0,
              }}
            >
              Painel Kingdom
            </h1>
            <button
              onClick={onClose}
              aria-label="Fechar"
              style={{
                background: "none",
                border: "none",
                color: vo.onPrimaryContainer,
                cursor: "pointer",
                padding: 4,
                display: "flex",
              }}
            >
              <X size={22} />
            </button>
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

          <div
            style={{
              background: vo.surfaceContainerHighest,
              borderTop: `4px solid ${vo.outlineVariant}`,
              padding: 16,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {METRICS.map((m, i) => (
              <div key={m.label} style={{ display: "flex", alignItems: "center", gap: i > 0 ? 0 : 0 }}>
                {i > 0 && <div style={{ width: 1, height: 32, background: vo.outlineVariant, marginRight: 16 }} />}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ color: m.color }}>{m.icon}</div>
                  <span
                    style={{
                      fontFamily: voFontLabel,
                      fontSize: 11,
                      color: vo.onSurfaceVariant,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
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
      </div>
    </div>
  );
}
