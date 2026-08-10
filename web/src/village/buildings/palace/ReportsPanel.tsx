import { useState } from "react";
import { ChamferButton } from "../../ui/ChamferButton";
import { ChamferPanel } from "../../ui/ChamferPanel";
import { chamfer, vo, voFontDisplay, voFontLabel } from "../../ui/theme";

type ReportState = "idle" | "loading" | "success" | "error";

/**
 * Placeholder — swap for a real call to
 * `POST /api/vila-oyo/forge/reports/generate` once the Hermes-side
 * endpoint exists. No real report data source defined yet; returns
 * static illustrative text. Action-based (button + result), not a list,
 * so it doesn't reuse SourcePanel — same button/result-box pattern as
 * SupabaseQueryPanel minus the SQL input.
 */
async function generateReport(): Promise<{ ok: true; text: string } | { ok: false; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return {
    ok: true,
    text: "4 construções ativas · 8 fontes conectadas · sem incidentes nas últimas 24h. Ferraria: 6 ações disponíveis. Mangue: 3 fontes de leitura. Mercado: 2 fontes de leitura.",
  };
}

export function ReportsPanel() {
  const [state, setState] = useState<ReportState>("idle");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const run = async () => {
    setState("loading");
    const outcome = await generateReport();
    if (outcome.ok) {
      setText(outcome.text);
      setState("success");
    } else {
      setError(outcome.message);
      setState("error");
    }
  };

  return (
    <ChamferPanel corner={14} shadow={8} style={{ width: "100%", maxWidth: 640, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ borderBottom: `2px solid ${vo.outlineVariant}`, paddingBottom: 16 }}>
        <h1 style={{ fontFamily: voFontDisplay, fontSize: 24, fontWeight: 700, color: vo.primary, margin: 0 }}>
          Relatórios
        </h1>
        <div style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant, marginTop: 2 }}>
          Resumo geral do reino
        </div>
      </header>

      <ChamferButton
        variant="primary"
        corner={8}
        onClick={run}
        disabled={state === "loading"}
        style={{ alignSelf: "flex-start", fontSize: 13, opacity: state === "loading" ? 0.6 : 1 }}
      >
        Gerar relatório
      </ChamferButton>

      <div
        style={{
          background: vo.surface,
          border: `4px solid ${vo.outlineVariant}`,
          padding: 16,
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {state === "idle" && (
          <span style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurfaceVariant }}>
            Nenhum relatório gerado ainda.
          </span>
        )}
        {state === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#ff8a4c", clipPath: chamfer(6), boxShadow: "0 0 24px #ff8a4c" }} />
            <span style={{ fontFamily: voFontLabel, fontSize: 11, color: vo.onSurfaceVariant }}>
              Compilando o relatório...
            </span>
          </div>
        )}
        {state === "success" && (
          <p style={{ fontFamily: voFontLabel, fontSize: 12, color: vo.onSurface, lineHeight: 1.6, margin: 0 }}>
            {text}
          </p>
        )}
        {state === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: vo.tertiaryContainer }}>
            <div style={{ width: 36, height: 36, background: "#5a0000", border: `2px solid ${vo.tertiaryContainer}`, clipPath: chamfer(6) }} />
            <span style={{ fontFamily: voFontLabel, fontSize: 11, textAlign: "center" }}>{error}</span>
          </div>
        )}
      </div>
    </ChamferPanel>
  );
}
