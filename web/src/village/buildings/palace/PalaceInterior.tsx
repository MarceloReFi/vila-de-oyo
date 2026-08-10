import { useState } from "react";
import { ToolTabs, type ToolTabDef } from "../../ui/ToolTabs";
import { chamfer, vo, voFontDisplay } from "../../ui/theme";
import { AccessPanel } from "./AccessPanel";
import { FlowsPanel } from "./FlowsPanel";
import { HermesAdminPanel } from "./HermesAdminPanel";
import { ReportsPanel } from "./ReportsPanel";
import { StoragePanel } from "./StoragePanel";
import { VisaoGeralPanel } from "./VisaoGeralPanel";

export interface PalaceInteriorProps {
  onBack: () => void;
}

type PalaceSection =
  | "geral"
  | "hermes"
  | "armazenamento"
  | "acesso"
  | "fluxos"
  | "financeiro"
  | "construcoes"
  | "relatorios";

const SECTIONS: ToolTabDef<PalaceSection>[] = [
  { id: "geral", label: "Visão Geral" },
  { id: "hermes", label: "Hermes" },
  { id: "armazenamento", label: "Armazenamento" },
  { id: "acesso", label: "Acesso" },
  { id: "fluxos", label: "Fluxos" },
  { id: "financeiro", label: "Financeiro (futuro)", disabled: true },
  { id: "construcoes", label: "Novas Construções (futuro)", disabled: true },
  { id: "relatorios", label: "Relatórios" },
];

export function PalaceInterior({ onBack }: PalaceInteriorProps) {
  const [section, setSection] = useState<PalaceSection>("geral");

  return (
    <div className="vo-root" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/sprites/kingdom-backdrop.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
          opacity: 0.55,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(19,19,19,.55)" }} />
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 20,
          clipPath: chamfer(6),
          background: "rgba(14,14,14,.8)",
          border: `2px solid ${vo.outlineVariant}`,
          padding: "8px 16px",
          fontFamily: voFontDisplay,
          fontSize: 13,
          fontWeight: 700,
          color: vo.primary,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        ‹ Vila
      </button>
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 24,
          gap: 16,
          overflowY: "auto",
        }}
      >
        <ToolTabs tools={SECTIONS} active={section} onChange={setSection} />
        {section === "geral" && <VisaoGeralPanel />}
        {section === "hermes" && <HermesAdminPanel />}
        {section === "armazenamento" && <StoragePanel />}
        {section === "acesso" && <AccessPanel />}
        {section === "fluxos" && <FlowsPanel />}
        {section === "relatorios" && <ReportsPanel />}
      </div>
    </div>
  );
}
