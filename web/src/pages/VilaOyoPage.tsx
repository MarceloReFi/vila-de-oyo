import { useState } from "react";
import { VillageGate } from "@/village/Gate/VillageGate";
import { VillageMap } from "@/village/map/VillageMap";
import { ForgeInterior } from "@/village/buildings/forge/ForgeInterior";
import { MangueInterior } from "@/village/buildings/mangue/MangueInterior";
import { MercadoInterior } from "@/village/buildings/mercado/MercadoInterior";
import { KingdomPanel } from "@/village/kingdom/KingdomPanel";
import "@/village/theme.css";

type Screen = "gate" | "map" | "forge" | "mangue" | "mercado";

export default function VilaOyoPage() {
  const [screen, setScreen] = useState<Screen>("gate");
  const [kingdomOpen, setKingdomOpen] = useState(false);

  if (screen === "gate") {
    return <VillageGate onEnter={() => setScreen("map")} />;
  }
  if (screen === "forge") {
    return <ForgeInterior onBack={() => setScreen("map")} />;
  }
  if (screen === "mangue") {
    return <MangueInterior onBack={() => setScreen("map")} />;
  }
  if (screen === "mercado") {
    return <MercadoInterior onBack={() => setScreen("map")} />;
  }
  return (
    <>
      <VillageMap
        onEnterBuilding={(id) => {
          if (id === "forge") setScreen("forge");
          if (id === "grove") setScreen("mangue");
          if (id === "market") setScreen("mercado");
        }}
        onOpenKingdom={() => setKingdomOpen(true)}
      />
      {kingdomOpen && <KingdomPanel onClose={() => setKingdomOpen(false)} />}
    </>
  );
}
