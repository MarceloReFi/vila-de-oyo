import { useEffect, useState } from "react";
import { fetchJSON } from "@/lib/api";
import { ChamferButton } from "../../ui/ChamferButton";
import { ChamferPanel } from "../../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel, voFontBody } from "../../ui/theme";

interface ForgeAction {
  id: number;
  title: string;
  subtitle: string;
  icon: "hammer" | "bellows" | "tongs" | "whetstone" | "shears";
  prompt: string;
  result: string;
}

interface GithubRepo {
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
  updatedAt: string;
}

interface CommitFileResult {
  htmlUrl: string;
  path: string;
  created: boolean;
}

interface DeleteFileResult {
  path: string;
  deleted: boolean;
}

type GithubReposState = "idle" | "loading" | "success" | "error";
type CommitState = "idle" | "loading" | "success" | "error";
type DeleteState = "idle" | "confirming" | "loading" | "success" | "error";

// "Consultar a forja" (id 3), "Temperar novo commit" (id 0) and "Deletar
// arquivo" (id 4) are wired to real backend calls — GET/POST
// /api/vila-oyo/forge/github/{repos,commit,delete}, which hit the GitHub
// API with VILA_OYO_GITHUB_TOKEN server-side. Sync/rebuild (ids 1, 2)
// stay simulated — they need their own design pass (no local working
// copy in this remote-API model).
const GITHUB_REPOS_ACTION_ID = 3;
const COMMIT_ACTION_ID = 0;
const DELETE_ACTION_ID = 4;

const ACTIONS: ForgeAction[] = [
  { id: 0, title: "Temperar novo commit", subtitle: "git commit", icon: "hammer", prompt: "O ferro está pronto para ser moldado...", result: "Hermes: commit forjado — 3 arquivos temperados no fogo do repositório." },
  { id: 1, title: "Soprar o fole", subtitle: "git sync", icon: "bellows", prompt: "O fole aviva as chamas...", result: "Hermes: sincronizado com a origem — 2 commits recebidos, 1 enviado." },
  { id: 2, title: "Puxar do fogo", subtitle: "git rebuild", icon: "tongs", prompt: "O metal aquece novamente sob as pinças...", result: "Hermes: rebuild completo — a lâmina saiu mais afiada." },
  { id: 3, title: "Consultar a forja", subtitle: "git log", icon: "whetstone", prompt: "As marcas do martelo contam a história...", result: "Hermes: últimos 5 commits exibidos no registro da forja." },
  { id: 4, title: "Deletar arquivo", subtitle: "git rm", icon: "shears", prompt: "A tesoura de ferro aguarda o corte...", result: "" },
];

/** Pixel-flat SVG renditions of the real forge tools — no icon-font glyphs, per the design brief. */
function ForgeIcon({ kind }: { kind: ForgeAction["icon"] }) {
  const common = { width: 40, height: 40, shapeRendering: "crispEdges" as const };
  if (kind === "hammer") {
    return (
      <svg viewBox="0 0 40 40" {...common}>
        <rect x="16" y="16" width="6" height="20" fill="#8a5a38" stroke="#3a220f" strokeWidth={1} />
        <rect x="14" y="30" width="10" height="4" fill="#3a220f" />
        <rect x="6" y="4" width="24" height="12" fill="#6b6b6b" stroke="#0e0e0e" strokeWidth={1.5} />
        <rect x="6" y="4" width="24" height="4" fill="#9a9a9a" />
        <rect x="2" y="6" width="6" height="8" fill="#4a4a4a" stroke="#0e0e0e" strokeWidth={1} />
      </svg>
    );
  }
  if (kind === "bellows") {
    return (
      <svg viewBox="0 0 40 40" {...common}>
        <polygon points="4,8 4,32 26,22 26,18" fill="#8a5a38" stroke="#3a220f" strokeWidth={1.5} />
        <line x1="10" y1="12" x2="10" y2="28" stroke="#3a220f" strokeWidth={1.5} />
        <line x1="15" y1="14" x2="15" y2="26" stroke="#3a220f" strokeWidth={1.5} />
        <line x1="20" y1="16" x2="20" y2="24" stroke="#3a220f" strokeWidth={1.5} />
        <rect x="26" y="18" width="12" height="4" fill="#4a4a4a" stroke="#0e0e0e" strokeWidth={1} />
      </svg>
    );
  }
  if (kind === "tongs") {
    return (
      <svg viewBox="0 0 40 40" {...common}>
        <rect x="17" y="4" width="6" height="16" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(-18 20 12)" />
        <rect x="17" y="4" width="6" height="16" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(18 20 12)" />
        <rect x="12" y="2" width="6" height="6" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(-30 15 5)" />
        <rect x="22" y="2" width="6" height="6" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(30 25 5)" />
        <circle cx="20" cy="18" r="3" fill="#4a4a4a" stroke="#0e0e0e" strokeWidth={1} />
      </svg>
    );
  }
  if (kind === "shears") {
    return (
      <svg viewBox="0 0 40 40" {...common}>
        <rect x="4" y="5" width="22" height="5" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(32 15 7)" />
        <rect x="4" y="30" width="22" height="5" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(-32 15 33)" />
        <rect x="24" y="12" width="10" height="4" fill="#3a220f" transform="rotate(18 29 14)" />
        <rect x="24" y="24" width="10" height="4" fill="#3a220f" transform="rotate(-18 29 26)" />
        <circle cx="19" cy="20" r="3.5" fill="#4a4a4a" stroke="#0e0e0e" strokeWidth={1} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" {...common}>
      <rect x="4" y="24" width="32" height="8" fill="#5a3a20" stroke="#3a220f" strokeWidth={1} />
      <rect x="6" y="10" width="28" height="12" fill="#a8a2a0" stroke="#0e0e0e" strokeWidth={1.5} transform="rotate(-4 20 16)" />
      <rect x="6" y="14" width="28" height="3" fill="#7d7876" transform="rotate(-4 20 16)" />
    </svg>
  );
}

export function ForgeCommandWindow() {
  const [selected, setSelected] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [particleKey, setParticleKey] = useState(0);
  const [reposState, setReposState] = useState<GithubReposState>("idle");
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [reposError, setReposError] = useState("");

  // Repo dropdown for "Temperar novo commit" and "Deletar arquivo" —
  // fetched once on mount so it's ready by the time either action opens.
  const [repoOptions, setRepoOptions] = useState<GithubRepo[]>([]);
  const [commitRepo, setCommitRepo] = useState("");
  const [commitPath, setCommitPath] = useState("");
  const [commitContent, setCommitContent] = useState("");
  const [commitState, setCommitState] = useState<CommitState>("idle");
  const [commitResult, setCommitResult] = useState<CommitFileResult | null>(null);
  const [commitError, setCommitError] = useState("");

  const [deleteRepo, setDeleteRepo] = useState("");
  const [deletePath, setDeletePath] = useState("");
  const [deleteState, setDeleteState] = useState<DeleteState>("idle");
  const [deleteResult, setDeleteResult] = useState<DeleteFileResult | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchJSON<{ repos: GithubRepo[] }>("/api/vila-oyo/forge/github/repos")
      .then((data) => {
        setRepoOptions(data.repos);
        setCommitRepo((prev) => prev || data.repos[0]?.fullName || "");
        setDeleteRepo((prev) => prev || data.repos[0]?.fullName || "");
      })
      .catch(() => {
        // Dropdowns just stay empty — the user will see the real error
        // anyway if they try "Consultar a forja" instead.
      });
  }, []);

  const action = ACTIONS[selected];

  const select = (id: number) => {
    setSelected(id);
    setConfirmed(false);
    setReposState("idle");
    setCommitState("idle");
    setDeleteState("idle");
  };

  const runDelete = () => {
    setDeleteState("loading");
    fetchJSON<DeleteFileResult>("/api/vila-oyo/forge/github/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo: deleteRepo, path: deletePath }),
    })
      .then((data) => {
        setDeleteResult(data);
        setDeleteState("success");
      })
      .catch((err: unknown) => {
        setDeleteError(err instanceof Error ? err.message : String(err));
        setDeleteState("error");
      });
  };

  const confirm = () => {
    setConfirmed(true);
    setParticleKey((k) => k + 1);
    if (action.id === GITHUB_REPOS_ACTION_ID) {
      setReposState("loading");
      fetchJSON<{ repos: GithubRepo[] }>("/api/vila-oyo/forge/github/repos")
        .then((data) => {
          setRepos(data.repos);
          setReposState("success");
        })
        .catch((err: unknown) => {
          setReposError(err instanceof Error ? err.message : String(err));
          setReposState("error");
        });
    } else if (action.id === COMMIT_ACTION_ID) {
      setCommitState("loading");
      fetchJSON<CommitFileResult>("/api/vila-oyo/forge/github/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: commitRepo, path: commitPath, content: commitContent }),
      })
        .then((data) => {
          setCommitResult(data);
          setCommitState("success");
        })
        .catch((err: unknown) => {
          setCommitError(err instanceof Error ? err.message : String(err));
          setCommitState("error");
        });
    } else if (action.id === DELETE_ACTION_ID) {
      // First click only opens the double-confirm warning — the real
      // DELETE call only fires from runDelete(), triggered by the
      // in-panel "Confirmar exclusão" button. Irreversible action, per
      // design decision.
      setDeleteState("confirming");
    }
  };
  const cancel = () => {
    setConfirmed(false);
    setReposState("idle");
    setCommitState("idle");
    setDeleteState("idle");
  };
  const commitFieldsIncomplete = !commitRepo.trim() || !commitPath.trim() || !commitContent.trim();
  const deleteFieldsIncomplete = !deleteRepo.trim() || !deletePath.trim();

  return (
    <ChamferPanel corner={14} shadow={8} style={{ width: "100%", maxWidth: 800, padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`
        @keyframes vila-typing { from { width: 0; } to { width: 100%; } }
        @keyframes vila-pulse-opacity { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes vila-spark1 { to { transform: translate(-70px,-50px) scale(0); opacity: 0; } }
        @keyframes vila-spark2 { to { transform: translate(60px,-55px) scale(0); opacity: 0; } }
        @keyframes vila-spark3 { to { transform: translate(-40px,20px) scale(0); opacity: 0; } }
        @keyframes vila-spark4 { to { transform: translate(50px,25px) scale(0); opacity: 0; } }
        @keyframes vila-spark5 { to { transform: translate(-15px,-75px) scale(0); opacity: 0; } }
        @keyframes vila-spark6 { to { transform: translate(20px,-80px) scale(0); opacity: 0; } }
      `}</style>

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
          <h1 style={{ fontFamily: voFontDisplay, fontSize: 32, fontWeight: 700, letterSpacing: -0.5, color: vo.primary, margin: 0 }}>
            FERRARIA DE OGUM
          </h1>
          <div
            style={{
              fontFamily: voFontLabel,
              fontSize: 12,
              fontWeight: 500,
              color: vo.tertiaryContainer,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            Status: O fogo está aceso
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {ACTIONS.map((a) => {
          const active = a.id === selected;
          return (
            <button
              key={a.id}
              onClick={() => select(a.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 16,
                textAlign: "left",
                clipPath: chamfer(8),
                border: `2px solid ${active ? vo.tertiaryContainer : vo.outlineVariant}`,
                background: active ? "rgba(255,99,111,0.12)" : vo.surfaceContainer,
                boxShadow: "inset 2px 2px 0 rgba(255,255,255,.1), inset -2px -2px 0 rgba(0,0,0,.5), 4px 4px 0 rgba(0,0,0,.8)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  clipPath: chamfer(6),
                  background: vo.surfaceContainerHighest,
                  border: `2px solid ${active ? vo.tertiaryContainer : vo.outlineVariant}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "inset 2px 2px 0 rgba(0,0,0,.5)",
                }}
              >
                <ForgeIcon kind={a.icon} />
              </div>
              <div>
                <h3 style={{ fontFamily: voFontDisplay, fontSize: 18, fontWeight: 700, color: active ? vo.tertiaryContainer : vo.onSurface, margin: 0 }}>
                  {a.title}
                </h3>
                <p style={{ fontFamily: voFontLabel, fontSize: 12, fontWeight: 500, color: vo.onSurfaceVariant, margin: "4px 0 0" }}>
                  {a.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 4,
          clipPath: chamfer(8),
          background: vo.surface,
          border: `4px solid ${vo.outlineVariant}`,
          padding: 16,
          position: "relative",
          boxShadow: "inset 0 0 10px rgba(0,0,0,.8)",
        }}
      >
        {action.id === DELETE_ACTION_ID && confirmed ? (
          <>
            {deleteState === "confirming" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <div style={{ width: 40, height: 40, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.tertiaryContainer, textAlign: "center" }}>
                  Tem certeza que deseja deletar <strong>{deletePath}</strong> de <strong>{deleteRepo}</strong>?
                  <br />
                  Essa ação não pode ser desfeita.
                </span>
                <ChamferButton
                  variant="primary"
                  corner={6}
                  onClick={runDelete}
                  style={{ fontSize: 12, padding: "8px 20px", background: vo.tertiaryContainer, borderColor: "#680016" }}
                >
                  Confirmar exclusão
                </ChamferButton>
              </div>
            )}
            {deleteState === "loading" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div style={{ width: 36, height: 36, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant }}>
                  Cortando o arquivo da forja...
                </span>
              </div>
            )}
            {deleteState === "success" && deleteResult && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "8px 0" }}>
                <div style={{ width: 36, height: 36, background: "#3a1010", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant, textAlign: "center" }}>
                  {deleteResult.path} foi removido do repositório.
                </span>
              </div>
            )}
            {deleteState === "error" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: vo.tertiaryContainer, padding: "8px 0" }}>
                <div style={{ width: 36, height: 36, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 11, textAlign: "center" }}>{deleteError}</span>
              </div>
            )}
          </>
        ) : action.id === COMMIT_ACTION_ID && confirmed ? (
          <>
            {commitState === "loading" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div style={{ width: 36, height: 36, background: "#ff8a4c", clipPath: chamfer(6), boxShadow: "0 0 24px #ff8a4c" }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant }}>
                  Temperando o commit...
                </span>
              </div>
            )}
            {commitState === "success" && commitResult && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: vo.surfaceContainer,
                  border: `2px solid ${vo.outlineVariant}`,
                  padding: 10,
                }}
              >
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
                    {commitResult.path}
                  </div>
                  <a
                    href={commitResult.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.secondaryFixed }}
                  >
                    Ver no GitHub
                  </a>
                </div>
                <span
                  style={{
                    fontFamily: voFontLabel,
                    fontSize: 10,
                    padding: "4px 8px",
                    border: `1px solid ${vo.outlineVariant}`,
                    color: vo.onSurfaceVariant,
                    whiteSpace: "nowrap",
                  }}
                >
                  {commitResult.created ? "CRIADO" : "ATUALIZADO"}
                </span>
              </div>
            )}
            {commitState === "error" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: vo.tertiaryContainer, padding: "8px 0" }}>
                <div style={{ width: 36, height: 36, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 11, textAlign: "center" }}>{commitError}</span>
              </div>
            )}
          </>
        ) : action.id === GITHUB_REPOS_ACTION_ID && confirmed ? (
          <>
            {reposState === "loading" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div style={{ width: 36, height: 36, background: "#ff8a4c", clipPath: chamfer(6), boxShadow: "0 0 24px #ff8a4c" }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant }}>
                  Consultando os repositórios reais...
                </span>
              </div>
            )}
            {reposState === "success" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                {repos.map((r) => (
                  <div
                    key={r.fullName}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: vo.surfaceContainer,
                      border: `2px solid ${vo.outlineVariant}`,
                      padding: 10,
                    }}
                  >
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
                        {r.fullName}
                      </div>
                      <div style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant }}>
                        {r.defaultBranch}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: voFontLabel,
                        fontSize: 10,
                        padding: "4px 8px",
                        border: `1px solid ${vo.outlineVariant}`,
                        color: vo.onSurfaceVariant,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.private ? "PRIVADO" : "PÚBLICO"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {reposState === "error" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: vo.tertiaryContainer, padding: "8px 0" }}>
                <div style={{ width: 36, height: 36, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
                <span style={{ fontFamily: voFontLabel, fontSize: 11, textAlign: "center" }}>{reposError}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <p
              key={`${action.id}-${confirmed}`}
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                animation: "vila-typing 1.6s steps(40,end)",
                fontFamily: voFontBody,
                fontSize: 18,
                color: vo.secondaryFixed,
                margin: 0,
              }}
            >
              {confirmed ? action.result : action.prompt}
            </p>
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                width: 10,
                height: 10,
                background: vo.secondaryFixed,
                borderRadius: "50%",
                animation: "vila-pulse-opacity 1.2s infinite",
              }}
            />
          </>
        )}
      </div>

      {action.id === COMMIT_ACTION_ID && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <select
            value={commitRepo}
            onChange={(e) => setCommitRepo(e.target.value)}
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
            {repoOptions.length === 0 && <option value="">Carregando repositórios...</option>}
            {repoOptions.map((r) => (
              <option key={r.fullName} value={r.fullName}>
                {r.fullName}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={commitPath}
            onChange={(e) => setCommitPath(e.target.value)}
            placeholder="caminho/do/arquivo.md"
            style={{
              fontFamily: voFontLabel,
              fontSize: 13,
              padding: 10,
              background: vo.secondary,
              color: vo.onPrimary,
              border: "2px solid #0e0e0e",
              clipPath: chamfer(4),
            }}
          />
          <textarea
            value={commitContent}
            onChange={(e) => setCommitContent(e.target.value)}
            rows={4}
            placeholder="Conteúdo completo do arquivo..."
            style={{
              fontFamily: voFontLabel,
              fontSize: 13,
              padding: 10,
              background: vo.secondary,
              color: vo.onPrimary,
              border: "2px solid #0e0e0e",
              clipPath: chamfer(4),
              resize: "vertical",
            }}
          />
        </div>
      )}

      {action.id === DELETE_ACTION_ID && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <select
            value={deleteRepo}
            onChange={(e) => setDeleteRepo(e.target.value)}
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
            {repoOptions.length === 0 && <option value="">Carregando repositórios...</option>}
            {repoOptions.map((r) => (
              <option key={r.fullName} value={r.fullName}>
                {r.fullName}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={deletePath}
            onChange={(e) => setDeletePath(e.target.value)}
            placeholder="caminho/do/arquivo.md"
            style={{
              fontFamily: voFontLabel,
              fontSize: 13,
              padding: 10,
              background: vo.secondary,
              color: vo.onPrimary,
              border: "2px solid #0e0e0e",
              clipPath: chamfer(4),
            }}
          />
        </div>
      )}

      {confirmed && action.id !== DELETE_ACTION_ID && (
        <div key={particleKey} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 70, right: 70, width: 8, height: 8, borderRadius: "50%", background: "#ff8a4c", animation: "vila-spark1 .7s ease-out forwards" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 8, height: 8, borderRadius: "50%", background: "#ffe16d", animation: "vila-spark2 .7s ease-out forwards" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 6, height: 6, borderRadius: "50%", background: "#ff8a4c", animation: "vila-spark3 .6s ease-out forwards .05s" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 6, height: 6, borderRadius: "50%", background: "#ffe16d", animation: "vila-spark4 .6s ease-out forwards .05s" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 7, height: 7, borderRadius: "50%", background: "#ff636f", animation: "vila-spark5 .75s ease-out forwards .1s" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 7, height: 7, borderRadius: "50%", background: "#ff636f", animation: "vila-spark6 .75s ease-out forwards .1s" }} />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
        <ChamferButton variant="secondary" corner={6} onClick={cancel} style={{ fontSize: 13, padding: "10px 24px" }}>
          Cancelar
        </ChamferButton>
        <ChamferButton
          variant="primary"
          corner={6}
          onClick={confirm}
          disabled={
            (action.id === COMMIT_ACTION_ID && commitFieldsIncomplete) ||
            (action.id === DELETE_ACTION_ID && (deleteFieldsIncomplete || deleteState === "confirming"))
          }
          style={{
            fontSize: 13,
            padding: "10px 24px",
            opacity:
              (action.id === COMMIT_ACTION_ID && commitFieldsIncomplete) ||
              (action.id === DELETE_ACTION_ID && (deleteFieldsIncomplete || deleteState === "confirming"))
                ? 0.5
                : 1,
          }}
        >
          Confirmar
        </ChamferButton>
      </div>
    </ChamferPanel>
  );
}
