import { useState } from "react";
import { ChamferButton } from "../../ui/ChamferButton";
import { ChamferPanel } from "../../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "../../ui/theme";

// Only Supabase project connected during design — placeholder list until
// the Hermes-side project selector is wired to the real account.
const PROJECTS = ["tasks-balaio"];

const DEFAULT_QUERY = `SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name LIMIT 10;`;

type QueryState = "idle" | "forging" | "success" | "error";

interface QueryResult {
  columns: string[];
  rows: string[][];
}

/**
 * Placeholder data source — swap for a real call to
 * `POST /api/vila-oyo/forge/supabase/query` once the Hermes-side endpoint
 * exists. IMPORTANT: the SELECT-only check below is a client-side
 * convenience, not the real guardrail — Supabase's own query execution
 * does not enforce it, so the Hermes endpoint must validate/reject
 * non-SELECT statements server-side too (see HERMES_GUIDE.md connection
 * model). Result shape (columns + string rows) mirrors the real SELECT
 * response validated during design.
 */
async function runQuery(
  _project: string,
  sql: string,
): Promise<{ ok: true; result: QueryResult } | { ok: false; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (!sql.trim().toUpperCase().startsWith("SELECT")) {
    return { ok: false, message: "Somente consultas SELECT são permitidas nesta ação." };
  }
  return {
    ok: true,
    result: {
      columns: ["table_name"],
      rows: [
        ["organization_members"],
        ["organizations"],
        ["projects"],
        ["stats_daily"],
        ["stats_sync_state"],
        ["task_claims"],
        ["task_templates"],
        ["tasks"],
        ["wallet_connections"],
        ["xrpl_escrows"],
      ],
    },
  };
}

export function SupabaseQueryPanel() {
  const [project, setProject] = useState(PROJECTS[0]);
  const [sql, setSql] = useState(DEFAULT_QUERY);
  const [state, setState] = useState<QueryState>("idle");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const run = async () => {
    setState("forging");
    const outcome = await runQuery(project, sql);
    if (outcome.ok) {
      setResult(outcome.result);
      setState("success");
    } else {
      setErrorMsg(outcome.message);
      setState("error");
    }
  };

  const inputStyle = {
    width: "100%",
    fontFamily: voFontLabel,
    fontSize: 13,
    padding: 10,
    background: vo.secondary,
    color: vo.onPrimary,
    border: "2px solid #0e0e0e",
    clipPath: chamfer(4),
  } as const;

  return (
    <ChamferPanel corner={14} shadow={8} style={{ width: "100%", maxWidth: 640, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ borderBottom: `2px solid ${vo.outlineVariant}`, paddingBottom: 16 }}>
        <h1 style={{ fontFamily: voFontDisplay, fontSize: 24, fontWeight: 700, color: vo.primary, margin: 0 }}>
          Supabase
        </h1>
        <div style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant, marginTop: 2 }}>
          Consulta (somente leitura)
        </div>
      </header>

      <select value={project} onChange={(e) => setProject(e.target.value)} style={inputStyle}>
        {PROJECTS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <div>
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        <div style={{ fontFamily: voFontLabel, fontSize: 10, color: vo.onSurfaceVariant, marginTop: 6 }}>
          INSERT / UPDATE / DELETE bloqueados nesta versão — vira ação separada depois.
        </div>
      </div>

      <ChamferButton
        variant="primary"
        corner={8}
        onClick={run}
        disabled={state === "forging"}
        style={{ alignSelf: "flex-start", fontSize: 13, opacity: state === "forging" ? 0.6 : 1 }}
      >
        Consultar
      </ChamferButton>

      <div
        style={{
          background: vo.surface,
          border: `4px solid ${vo.outlineVariant}`,
          padding: 16,
          minHeight: 100,
          display: "flex",
          alignItems: state === "success" ? "stretch" : "center",
          justifyContent: "center",
        }}
      >
        {state === "idle" && (
          <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant }}>
            Aguardando consulta.
          </span>
        )}

        {state === "forging" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#ff8a4c", clipPath: chamfer(6), boxShadow: "0 0 24px #ff8a4c" }} />
            <span style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant }}>
              Forjando resposta do banco...
            </span>
          </div>
        )}

        {state === "success" && result && (
          <table style={{ width: "100%", fontSize: 12, fontFamily: voFontLabel, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {result.columns.map((c) => (
                  <th
                    key={c}
                    style={{ textAlign: "left", color: vo.secondaryFixed, borderBottom: `2px solid ${vo.outlineVariant}`, padding: "6px 8px" }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "6px 8px", borderBottom: `1px solid ${vo.outlineVariant}`, color: vo.onSurface }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {state === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: vo.tertiaryContainer }}>
            <div style={{ width: 36, height: 36, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
            <span style={{ fontFamily: voFontLabel, fontSize: 11, textAlign: "center" }}>{errorMsg}</span>
          </div>
        )}
      </div>
    </ChamferPanel>
  );
}
