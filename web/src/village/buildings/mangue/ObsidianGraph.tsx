import { useEffect, useMemo, useState } from "react";
import { fetchJSON } from "@/lib/api";
import { ChamferPanel } from "../../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "../../ui/theme";
import { SHOWCASE_MODE, mockDelay } from "../../lib/showcase";

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

interface MemoryCheckResult {
  notePath: string;
  noteUpdatedAt: string;
  repo: string;
  lastCommit: {
    sha: string;
    message: string;
    date: string;
  };
  newer: "note" | "repo";
}

const SIZE = 560;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 60;

// Showcase-only stand-in for the real Obsidian vault graph — used
// exclusively when SHOWCASE_MODE is on, never in the real dashboard build.
const MOCK_GRAPH: GraphData = {
  nodes: [
    { path: "vila-de-oyo.md", title: "Vila de Oyó", github: "MarceloReFi/vila-de-oyo" },
    { path: "hermes-agent.md", title: "Hermes Agent", github: "NousResearch/hermes-agent" },
    { path: "sacred-sovereignty.md", title: "Sacred Sovereignty", github: null },
    { path: "ferraria-notas.md", title: "Notas da Ferraria", github: null },
    { path: "mangue-notas.md", title: "Notas do Mangue", github: null },
    { path: "refaz-xrpl.md", title: "ReFaz XRPL", github: "MarceloReFi/refaz-xrpl" },
  ],
  edges: [
    { source: "vila-de-oyo.md", target: "sacred-sovereignty.md" },
    { source: "vila-de-oyo.md", target: "ferraria-notas.md" },
    { source: "vila-de-oyo.md", target: "mangue-notas.md" },
    { source: "hermes-agent.md", target: "vila-de-oyo.md" },
    { source: "refaz-xrpl.md", target: "vila-de-oyo.md" },
  ],
};

export function ObsidianGraph() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [memoryCheck, setMemoryCheck] = useState<MemoryCheckResult | null>(null);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [memoryError, setMemoryError] = useState("");

  useEffect(() => {
    if (SHOWCASE_MODE) {
      mockDelay(300).then(() => {
        setData(MOCK_GRAPH);
        setLoading(false);
      });
      return;
    }
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

  const handleMemoryCheck = async () => {
    if (!selectedNode?.github) return;
    setMemoryLoading(true);
    setMemoryError("");
    setMemoryCheck(null);
    if (SHOWCASE_MODE) {
      await mockDelay(600);
      setMemoryCheck({
        notePath: selectedNode.path,
        noteUpdatedAt: new Date().toISOString(),
        repo: selectedNode.github,
        lastCommit: {
          sha: "a1b2c3d",
          message: "Ajustes de conteúdo",
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        newer: "repo",
      });
      setMemoryLoading(false);
      return;
    }
    try {
      const result = await fetchJSON<MemoryCheckResult>(
        `/api/vila-oyo/forge/obsidian/memory?path=${encodeURIComponent(selectedNode.path)}&repo=${encodeURIComponent(selectedNode.github)}`
      );
      setMemoryCheck(result);
    } catch (err: unknown) {
      setMemoryError(err instanceof Error ? err.message : String(err));
    } finally {
      setMemoryLoading(false);
    }
  };

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
            {selectedNode ? (
              <>
                <div>Selecionado: {selectedNode.title}{selectedNode.github ? ` — ${selectedNode.github}` : ""}</div>
                {selectedNode.github && (
                  <button
                    onClick={handleMemoryCheck}
                    disabled={memoryLoading}
                    style={{
                      marginTop: 8,
                      padding: "6px 12px",
                      fontFamily: voFontLabel,
                      fontSize: 11,
                      background: vo.secondary,
                      color: vo.onSurface,
                      border: "none",
                      borderRadius: 4,
                      cursor: memoryLoading ? "not-allowed" : "pointer",
                      opacity: memoryLoading ? 0.7 : 1,
                    }}
                  >
                    {memoryLoading ? "Consultando..." : "Atualizar memória"}
                  </button>
                )}
              </>
            ) : (
              "Toque num nó pra selecionar um projeto ou nota."
            )}
          </div>

          {memoryCheck && (
            <div
              style={{
                clipPath: chamfer(6),
                background: vo.surfaceContainer,
                border: `2px solid ${vo.outlineVariant}`,
                padding: 12,
                fontFamily: voFontLabel,
                fontSize: 11,
                color: vo.onSurfaceVariant,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ fontWeight: 700, color: vo.primary }}>Comparação de Memória</div>
              <div>Nota: {memoryCheck.notePath}</div>
              <div>Atualizada: {new Date(memoryCheck.noteUpdatedAt).toLocaleString("pt-BR")}</div>
              <div>Repositório: {memoryCheck.repo}</div>
              <div>Último commit: {memoryCheck.lastCommit.sha} — {memoryCheck.lastCommit.message}</div>
              <div>Data commit: {new Date(memoryCheck.lastCommit.date).toLocaleString("pt-BR")}</div>
              <div style={{ fontWeight: 600, color: memoryCheck.newer === "note" ? "#ff8a4c" : "#4ade80" }}>
                Mais recente: {memoryCheck.newer === "note" ? "Nota do Obsidian" : "Repositório GitHub"}
              </div>
            </div>
          )}

          {memoryError && (
            <div
              style={{
                clipPath: chamfer(6),
                background: "#5a0000",
                border: `2px solid ${vo.tertiaryContainer}`,
                padding: 12,
                fontFamily: voFontLabel,
                fontSize: 11,
                color: vo.tertiaryContainer,
              }}
            >
              Erro ao consultar: {memoryError}
            </div>
          )}
        </>
      )}
    </ChamferPanel>
  );
}
