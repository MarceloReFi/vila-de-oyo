import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder data source — swap for a real call to
 * `POST /api/vila-oyo/forge/obsidian/notes` once Hermes exposes vault
 * access (most likely via the Obsidian Local REST API community plugin,
 * since Obsidian has no official cloud API of its own). Treated as a
 * source distinct from "Arquivos locais" per the connection model — same
 * machine, different scope.
 */
async function fetchNotes(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "Reunião Semanal — Notas", meta: "Projetos/ReFaz", time: "2h atrás" },
    { id: "2", title: "Ideias — Vila de Oyó", meta: "Brainstorm", time: "ontem" },
    { id: "3", title: "Glossário Yorubá", meta: "Referência", time: "3d atrás" },
  ];
}

export function ObsidianPanel() {
  return (
    <SourcePanel
      name="Obsidian"
      subtitle="Notas do vault"
      icon="◆"
      loadingText="Emergindo das águas do mangue..."
      fetchItems={fetchNotes}
    />
  );
}
