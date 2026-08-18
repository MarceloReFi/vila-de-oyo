import { useState } from "react";
import { fetchJSON } from "@/lib/api";
import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";
import { ToolTabs, type ToolTabDef } from "../../ui/ToolTabs";
import { ObsidianGraph } from "./ObsidianGraph";
import { SHOWCASE_MODE, mockDelay } from "../../lib/showcase";

const MOCK_NOTES: SourceItem[] = [
  { id: "1", title: "Vila de Oyó — visão geral", meta: "Vault raiz", time: "há 2 dias" },
  { id: "2", title: "Sacred Sovereignty — design system", meta: "design/", time: "há 5 dias" },
  { id: "3", title: "Ferraria de Ogum — notas de conexão", meta: "projetos/hermes/", time: "há 1 semana" },
  { id: "4", title: "Backlog Palácio do Alaafin", meta: "projetos/hermes/", time: "há 2 semanas" },
];

async function fetchNotes(): Promise<SourceItem[]> {
  if (SHOWCASE_MODE) {
    await mockDelay();
    return MOCK_NOTES;
  }
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
