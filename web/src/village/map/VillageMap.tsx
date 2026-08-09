import { useEffect, useRef, useState } from "react";
import { BuildingMarker } from "./BuildingMarker";

export interface VillageBuilding {
  id: string;
  name: string;
  sub: string;
  left: string;
  top: string;
  color: string;
  built: boolean;
}

// Positions are tuned to the real "Vista da Vila" isometric art at
// /sprites/vista-da-vila.png — Ferraria top-left, Palácio top-center,
// Bosque right by the water, Mercado bottom-center. Re-tune if the art changes.
const BUILDINGS: VillageBuilding[] = [
  { id: "forge", name: "Ferraria de Ogum", sub: "Ogum · GitHub", left: "14%", top: "34%", color: "#ff8a4c", built: true },
  { id: "palace", name: "Palácio do Alaafin", sub: "Xangô · Painel do Reino", left: "49%", top: "15%", color: "#ffe16d", built: false },
  { id: "grove", name: "Bosque de Nanã", sub: "Nanã · Obsidian", left: "85%", top: "35%", color: "#c8a2c8", built: false },
  { id: "market", name: "Mercado de Exu", sub: "Exu · Telegram", left: "51%", top: "68%", color: "#ff6b6b", built: false },
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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        @keyframes vila-marker-pulse { 0%,100% { transform: translate(-50%,-50%) rotate(45deg) scale(1); } 50% { transform: translate(-50%,-50%) rotate(45deg) scale(1.25); } }
        @keyframes vila-toast-in { from { opacity: 0; transform: translate(-50%,10px); } to { opacity: 1; transform: translate(-50%,0); } }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/sprites/vista-da-vila.png')",
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
          background: "rgba(14,14,14,.75)",
          border: "2px solid #52443d",
          padding: "6px 14px",
          fontFamily: "'Space Mono',monospace",
          fontSize: 14,
          fontWeight: 700,
          color: "#fbb796",
          textTransform: "uppercase",
          letterSpacing: 1,
          boxShadow: "3px 3px 0 rgba(0,0,0,.6)",
        }}
      >
        Vila de Oyó
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(14,14,14,.7)",
          border: "2px solid #52443d",
          padding: "8px 18px",
          fontFamily: "'Fira Sans',sans-serif",
          fontSize: 14,
          color: "#e5e2e1",
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
            background: "#0e0e0e",
            border: "3px solid #52443d",
            padding: "12px 20px",
            fontFamily: "'Fira Sans',sans-serif",
            fontSize: 14,
            color: "#ffe16d",
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
