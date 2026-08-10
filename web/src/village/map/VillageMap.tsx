import { useEffect, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { BuildingMarker } from "./BuildingMarker";
import { chamfer, vo, voFontBody, voFontDisplay } from "../ui/theme";

export interface VillageBuilding {
  id: string;
  name: string;
  sub: string;
  left: string;
  top: string;
  color: string;
  built: boolean;
}

const BUILDINGS: VillageBuilding[] = [
  { id: "forge", name: "Ferraria de Ogum", sub: "Ogum · GitHub", left: "14%", top: "38%", color: "#ff8a4c", built: true },
  { id: "palace", name: "Palácio do Alaafin", sub: "Xangô · Administração", left: "49%", top: "20%", color: "#ffe16d", built: true },
  { id: "grove", name: "Mangue de Nanã", sub: "Nanã · Obsidian", left: "84%", top: "38%", color: "#c8a2c8", built: true },
  { id: "market", name: "Mercado de Exu", sub: "Exu · Telegram", left: "50%", top: "72%", color: "#ff6b6b", built: true },
];

export interface VillageMapProps {
  onEnterBuilding: (id: string) => void;
}

export function VillageMap({ onEnterBuilding }: VillageMapProps) {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleClick = (b: VillageBuilding) => {
    if (b.built) {
      onEnterBuilding(b.id);
      return;
    }
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(`${b.name}: em construção nesta rodada`);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="vo-root" style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        @keyframes vila-marker-pulse { 0%,100% { transform: translate(-50%,-50%) rotate(45deg) scale(1); } 50% { transform: translate(-50%,-50%) rotate(45deg) scale(1.25); } }
        @keyframes vila-toast-in { from { opacity: 0; transform: translate(-50%,10px); } to { opacity: 1; transform: translate(-50%,0); } }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/sprites/vila-de-oyo-map.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.4) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          clipPath: chamfer(6),
          background: "rgba(14,14,14,.75)",
          border: `2px solid ${vo.outlineVariant}`,
          padding: "6px 14px",
          fontFamily: voFontDisplay,
          fontSize: 14,
          fontWeight: 700,
          color: vo.primary,
          textTransform: "uppercase",
          letterSpacing: 1,
          boxShadow: "3px 3px 0 rgba(0,0,0,.6)",
        }}
      >
        Vila de Oyó
      </div>

      <button
        onClick={() => onEnterBuilding("palace")}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          clipPath: chamfer(6),
          background: vo.primaryContainer,
          border: `2px solid ${vo.outlineVariant}`,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: voFontDisplay,
          fontSize: 13,
          fontWeight: 700,
          color: vo.onPrimaryContainer,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          cursor: "pointer",
          boxShadow: "3px 3px 0 rgba(0,0,0,.6)",
        }}
      >
        <LayoutGrid size={16} />
        Status do Reino
      </button>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          clipPath: chamfer(6),
          background: "rgba(14,14,14,.7)",
          border: `2px solid ${vo.outlineVariant}`,
          padding: "8px 18px",
          fontFamily: voFontBody,
          fontSize: 14,
          color: vo.onSurface,
          whiteSpace: "nowrap",
        }}
      >
        Toque em uma construção para entrar
      </div>

      {BUILDINGS.map((b) => (
        <BuildingMarker key={b.id} {...b} onClick={() => handleClick(b)} />
      ))}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            clipPath: chamfer(8),
            background: vo.surface,
            border: `3px solid ${vo.outlineVariant}`,
            padding: "12px 20px",
            fontFamily: voFontBody,
            fontSize: 14,
            color: vo.secondaryFixed,
            boxShadow: "4px 4px 0 rgba(0,0,0,.8)",
            animation: "vila-toast-in .25s ease-out",
            zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
