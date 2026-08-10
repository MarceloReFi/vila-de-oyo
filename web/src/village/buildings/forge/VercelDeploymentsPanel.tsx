import { useEffect, useState } from "react";
import { ChamferButton } from "../../ui/ChamferButton";
import { ChamferPanel } from "../../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "../../ui/theme";

type DeployState = "QUEUED" | "BUILDING" | "READY" | "ERROR";

interface Deployment {
  id: string;
  branch: string;
  message: string;
  state: DeployState;
}

// Personal Vercel projects, validated live against the Vercel API during
// design (list_projects / list_deployments) — kept as the placeholder list
// until the Hermes-side project selector is wired to the real account.
const PROJECTS = ["v0-balaio-q9", "rastawallet", "v0-balaio-xrpl"];

const STATE_LABEL: Record<DeployState, string> = {
  QUEUED: "Em fila",
  BUILDING: "Em forja",
  READY: "Sucesso",
  ERROR: "Erro",
};

const STATE_COLOR: Record<DeployState, string> = {
  QUEUED: vo.outline,
  BUILDING: "#ff8a4c",
  READY: vo.successEmber,
  ERROR: vo.tertiaryContainer,
};

/**
 * Placeholder data source — swap for a real call to
 * `POST /api/vila-oyo/forge/vercel/deployments` once the Hermes-side
 * endpoint exists (see HERMES_GUIDE.md connection model). Shape mirrors
 * the real Vercel `list_deployments` response validated during design:
 * `state` maps 1:1 to the ember/badge colors below, no new fields needed.
 */
async function fetchDeployments(_project: string): Promise<Deployment[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", branch: "main", message: "refactor: move config into lib/chain/", state: "READY" },
    { id: "2", branch: "main", message: "docs: update smart-contracts.md", state: "READY" },
    { id: "3", branch: "claude-cleanup-test-branch-delete-me", message: "test commit", state: "ERROR" },
  ];
}

export function VercelDeploymentsPanel() {
  const [project, setProject] = useState(PROJECTS[0]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = (p: string) => {
    setLoading(true);
    fetchDeployments(p).then((d) => {
      setDeployments(d);
      setLoading(false);
    });
  };

  useEffect(() => {
    load(project);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

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
            Vercel
          </h1>
          <div style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant, marginTop: 2 }}>
            Status dos deployments
          </div>
        </div>
        <ChamferButton
          variant="secondary"
          corner={6}
          onClick={() => load(project)}
          style={{ fontSize: 11, padding: "8px 14px" }}
        >
          Atualizar
        </ChamferButton>
      </header>

      <select
        value={project}
        onChange={(e) => setProject(e.target.value)}
        style={{
          fontFamily: voFontLabel,
          fontSize: 13,
          padding: 10,
          background: vo.secondary,
          color: vo.onPrimary,
          border: "2px solid #0e0e0e",
          clipPath: chamfer(4),
        }}
      >
        {PROJECTS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loading && (
          <div style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant }}>
            Consultando a Vercel...
          </div>
        )}
        {!loading &&
          deployments.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: vo.surfaceContainer,
                border: `2px solid ${vo.outlineVariant}`,
                padding: 12,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  transform: "rotate(45deg)",
                  background: STATE_COLOR[d.state],
                  border: "2px solid #0e0e0e",
                  boxShadow: d.state !== "QUEUED" ? `0 0 10px ${STATE_COLOR[d.state]}` : undefined,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: voFontLabel, fontSize: 13, color: vo.onSurface }}>{d.branch}</div>
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
                  {d.message}
                </div>
              </div>
              <span
                style={{
                  fontFamily: voFontLabel,
                  fontSize: 10,
                  padding: "4px 8px",
                  border: `1px solid ${STATE_COLOR[d.state]}`,
                  color: STATE_COLOR[d.state],
                  whiteSpace: "nowrap",
                }}
              >
                {STATE_LABEL[d.state].toUpperCase()}
              </span>
            </div>
          ))}
      </div>
    </ChamferPanel>
  );
}
