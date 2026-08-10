import { useState } from "react";
import { fetchJSON } from "@/lib/api";
import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";
import { ToolTabs, type ToolTabDef } from "../../ui/ToolTabs";
import { ObsidianGraph } from "./ObsidianGraph";

async function fetchNotes(): Promise<SourceItem[]> {
  const data = await fetchJSON<{ notes: SourceItem[] }>("/api/vila-oyo/forge/obsidian/notes");
  return data.notes;
}

type ObsidianView = "graph" | "lista";

const VIEWS: ToolTabDef<ObsidianView>[] = [
  { id: "graph", label: "Grafo" },
  { id: "lista", label: "Lista" },
];

export function ObsidianPanel() {
  const [view, setView] = useState<ObsidianView>("graph");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", alignItems: "center" }}>
      <ToolTabs tools={VIEWS} active={view} onChange={setView} />
      {view === "graph" ? (
        <ObsidianGraph />
      ) : (
        <SourcePanel
          name="Obsidian"
          subtitle="Notas do vault"
          icon="◆"
          loadingText="Emergindo das águas do mangue..."
          fetchItems={fetchNotes}
        />
      )}
    </div>
  );
}
