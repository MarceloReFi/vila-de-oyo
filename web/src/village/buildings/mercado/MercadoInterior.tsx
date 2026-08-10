import { useState } from "react";
import { ToolTabs, type ToolTabDef } from "../../ui/ToolTabs";
import { chamfer, vo, voFontDisplay } from "../../ui/theme";
import { GmailPanel } from "./GmailPanel";
import { TelegramPanel } from "./TelegramPanel";

export interface MercadoInteriorProps {
  onBack: () => void;
}

type MercadoSource = "gmail" | "telegram";

const SOURCES: ToolTabDef<MercadoSource>[] = [
  { id: "gmail", label: "Gmail" },
  { id: "telegram", label: "Telegram" },
];

export function MercadoInterior({ onBack }: MercadoInteriorProps) {
  const [source, setSource] = useState<MercadoSource>("gmail");

  return (
    <div className="vo-root" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/sprites/mercado-de-exu.jpg')",
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
          justifyContent: "flex-start",
          height: "100%",
          padding: 24,
          gap: 16,
          overflowY: "auto",
        }}
      >
        <ToolTabs tools={SOURCES} active={source} onChange={setSource} />
        {source === "gmail" && <GmailPanel />}
        {source === "telegram" && <TelegramPanel />}
      </div>
    </div>
  );
}
