import { useEffect, useState } from "react";
import { ChamferButton } from "./ChamferButton";
import { ChamferPanel } from "./ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "./theme";

export interface SourceItem {
  id: string;
  title: string;
  meta: string;
  time: string;
}

export interface SourcePanelProps {
  name: string;
  subtitle: string;
  icon: string;
  loadingText: string;
  fetchItems: () => Promise<SourceItem[]>;
}

/**
 * Generic read-only "list a source's recent items" panel. Shared by every
 * building's source tabs (Mangue: Obsidian/Arquivos locais/Drive; Mercado:
 * Gmail/Telegram, later) so the list/loading/error scaffolding is written
 * once. Each source supplies its own name, icon and loading flavor text —
 * see HERMES_GUIDE.md connection model for the per-source data contract
 * this is meant to eventually call.
 */
export function SourcePanel({ name, subtitle, icon, loadingText, fetchItems }: SourcePanelProps) {
  const [items, setItems] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchItems()
      .then((d) => {
        setItems(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateBoxStyle = {
    background: vo.surface,
    border: `4px solid ${vo.outlineVariant}`,
    padding: 16,
    minHeight: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  return (
    <ChamferPanel corner={14} shadow={8} style={{ width: "100%", maxWidth: 640, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${vo.outlineVariant}`,
          paddingBottom: 16,
        }}
      >
        <div>
          <h1 style={{ fontFamily: voFontDisplay, fontSize: 24, fontWeight: 700, color: vo.primary, margin: 0 }}>
            {name}
          </h1>
          <div style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant, marginTop: 2 }}>
            {subtitle}
          </div>
        </div>
        <ChamferButton variant="secondary" corner={6} onClick={load} style={{ fontSize: 11, padding: "8px 14px" }}>
          Atualizar
        </ChamferButton>
      </header>

      {loading && (
        <div style={stateBoxStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#ff8a4c", clipPath: chamfer(6), boxShadow: "0 0 24px #ff8a4c" }} />
            <span style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant }}>{loadingText}</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div style={stateBoxStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: vo.tertiaryContainer }}>
            <div style={{ width: 36, height: 36, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
            <span style={{ fontFamily: voFontLabel, fontSize: 11, textAlign: "center" }}>Não foi possível acessar {name}.</span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: vo.surfaceContainer,
                border: `2px solid ${vo.outlineVariant}`,
                padding: 12,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: vo.surfaceContainerHighest,
                  border: `2px solid ${vo.outlineVariant}`,
                  fontSize: 14,
                }}
              >
                {icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: voFontLabel,
                    fontSize: 13,
                    color: vo.onSurface,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.title}
                </div>
                <div
                  style={{
                    fontFamily: voFontLabel,
                    fontSize: 11,
                    color: vo.onSurfaceVariant,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {it.meta}
                </div>
              </div>
              <div style={{ fontFamily: voFontLabel, fontSize: 10, color: vo.onSurfaceVariant, whiteSpace: "nowrap" }}>
                {it.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </ChamferPanel>
  );
}
