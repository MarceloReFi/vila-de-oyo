import { useEffect, useMemo, useState } from "react";
import { fetchJSON } from "@/lib/api";
import { ChamferPanel } from "../../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "../../ui/theme";

interface GraphNode {
  path: string;
  title: string;
  github: string | null;
}
interface GraphEdge {
  source: string;
  target: string;
}
interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const SIZE = 560;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 60;

export function ObsidianGraph() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchJSON<GraphData>("/api/vila-oyo/forge/obsidian/graph")
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
  }, []);

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    if (!data) return map;
    data.nodes.forEach((n, i) => {
      const angle = (i / data.nodes.length) * Math.PI * 2 - Math.PI / 2;
      map.set(n.path, {
        x: CENTER + RADIUS * Math.cos(angle),
        y: CENTER + RADIUS * Math.sin(angle),
      });
    });
    return map;
  }, [data]);

  const showLabels = (data?.nodes.length ?? 0) <= 40;
  const selectedNode = data?.nodes.find((n) => n.path === selected) ?? null;

  return (
    <ChamferPanel corner={14} shadow={8} style={{ width: "100%", maxWidth: 640, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ borderBottom: `2px solid ${vo.outlineVariant}`, paddingBottom: 16 }}>
        <h1 style={{ fontFamily: voFontDisplay, fontSize: 24, fontWeight: 700, color: vo.primary, margin: 0 }}>
          Grafo do Vault
        </h1>
        <div style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant, marginTop: 2 }}>
          Notas em laranja têm um repositório GitHub vinculado
        </div>
      </header>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
          <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant }}>
            Emergindo das águas do mangue...
          </span>
        </div>
      )}

      {!loading && error && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: vo.tertiaryContainer }}>
          <span style={{ fontFamily: voFontLabel, fontSize: 12, textAlign: "center" }}>{error}</span>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: "100%", height: "auto" }}>
            {data.edges.map((e, i) => {
              const a = positions.get(e.source);
              const b = positions.get(e.target);
              if (!a || !b) return null;
              return (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={vo.outlineVariant} strokeWidth={1} opacity={0.5} />
              );
            })}
            {data.nodes.map((n) => {
              const p = positions.get(n.path);
              if (!p) return null;
              const isProject = !!n.github;
              const isSelected = n.path === selected;
              return (
                <g key={n.path} onClick={() => setSelected(n.path)} style={{ cursor: "pointer" }}>
                  <rect
                    x={p.x - 5}
                    y={p.y - 5}
                    width={10}
                    height={10}
                    transform={`rotate(45 ${p.x} ${p.y})`}
                    fill={isSelected ? vo.secondaryFixed : isProject ? "#ff8a4c" : vo.surfaceContainerHighest}
                    stroke={isSelected ? vo.secondaryFixed : vo.outlineVariant}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {(showLabels || isSelected) && (
                    <text
                      x={p.x}
                      y={p.y + (p.y > CENTER ? 18 : -10)}
                      textAnchor="middle"
                      fontFamily="'VO JetBrains Mono', monospace"
                      fontSize={9}
                      fill={isSelected ? vo.secondaryFixed : vo.onSurfaceVariant}
                    >
                      {n.title}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div
            style={{
              clipPath: chamfer(6),
              background: vo.surface,
              border: `2px solid ${vo.outlineVariant}`,
              padding: 12,
              fontFamily: voFontLabel,
              fontSize: 12,
              color: vo.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            {selectedNode
              ? `Selecionado: ${selectedNode.title}${selectedNode.github ? ` — ${selectedNode.github}` : ""}`
              : "Toque num nó pra selecionar um projeto ou nota."}
          </div>
        </>
      )}
    </ChamferPanel>
  );
}
