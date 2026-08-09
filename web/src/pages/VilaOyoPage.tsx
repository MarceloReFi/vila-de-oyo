import { useState } from "react";
import { VillageGate } from "@/village/Gate/VillageGate";
import { VillageMap } from "@/village/map/VillageMap";
import { ForgeInterior } from "@/village/buildings/forge/ForgeInterior";

type Screen = "gate" | "map" | "forge";

export default function VilaOyoPage() {
  const [screen, setScreen] = useState<Screen>("gate");

  if (screen === "gate") {
    return <VillageGate onEnter={() => setScreen("map")} />;
  }
  if (screen === "forge") {
    return <ForgeInterior onBack={() => setScreen("map")} />;
  }
  return (
    <VillageMap
      onEnterBuilding={(id) => {
        if (id === "forge") setScreen("forge");
      }}
    />
  );
}
