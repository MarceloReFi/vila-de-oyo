import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder — swap for a real call to
 * `POST /api/vila-oyo/forge/storage/usage` once the Hermes-side endpoint
 * exists. Aggregates quota/usage across every source the Vila touches.
 */
async function fetchUsage(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "Google Drive", meta: "Cota da conta Google", time: "8.2 GB / 15 GB" },
    { id: "2", title: "Obsidian (vault)", meta: "Tamanho do vault local", time: "340 MB" },
    { id: "3", title: "Arquivos locais", meta: "Sem limite definido", time: "—" },
  ];
}

export function StoragePanel() {
  return (
    <SourcePanel
      name="Armazenamento"
      subtitle="Limites por fonte"
      icon="▦"
      loadingText="Consultando os registros do reino..."
      fetchItems={fetchUsage}
    />
  );
}
