import { fetchJSON } from "@/lib/api";
import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Real vault listing via the Hermes-side route, which hits the Obsidian
 * Local REST API community plugin with VILA_OYO_OBSIDIAN_API_KEY
 * server-side (Obsidian has no official cloud API of its own). Treated as
 * a source distinct from "Arquivos locais" per the connection model —
 * same machine, different scope.
 */
async function fetchNotes(): Promise<SourceItem[]> {
  const data = await fetchJSON<{ notes: SourceItem[] }>("/api/vila-oyo/forge/obsidian/notes");
  return data.notes;
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
