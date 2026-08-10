import { useState } from "react";
import { ToolTabs, type ToolTabDef } from "../../ui/ToolTabs";
import { chamfer, vo, voFontDisplay } from "../../ui/theme";
import { GoogleDrivePanel } from "./GoogleDrivePanel";
import { LocalFilesPanel } from "./LocalFilesPanel";
import { ObsidianPanel } from "./ObsidianPanel";

export interface MangueInteriorProps {
  onBack: () => void;
}

type MangueSource = "obsidian" | "local" | "drive" | "gitbook";

const SOURCES: ToolTabDef<MangueSource>[] = [
  { id: "obsidian", label: "Obsidian" },
  { id: "local", label: "Arquivos locais" },
  { id: "drive", label: "Google Drive" },
  { id: "gitbook", label: "GitBook (futuro)", disabled: true },
];

export function MangueInterior({ onBack }: MangueInteriorProps) {
  const [source, setSource] = useState<MangueSource>("obsidian");

  return (
    <div className="vo-root" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/sprites/mangue-de-nana.jpg')",
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
        }}
      >
        <ToolTabs tools={SOURCES} active={source} onChange={setSource} />
        {source === "obsidian" && <ObsidianPanel />}
        {source === "local" && <LocalFilesPanel />}
        {source === "drive" && <GoogleDrivePanel />}
      </div>
    </div>
  );
}
