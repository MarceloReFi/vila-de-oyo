import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder — swap for a real call to
 * `POST /api/vila-oyo/forge/flows/status` once the Hermes-side endpoint
 * exists. Operational health per building/tool group, distinct from
 * AccessPanel (that's what's configured; this is whether it's working).
 */
async function fetchFlows(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "Ferraria → GitHub/Vercel/Supabase", meta: "Última sincronização", time: "há 5min" },
    { id: "2", title: "Mangue → Drive/Obsidian", meta: "Última leitura", time: "há 1h" },
    { id: "3", title: "Mercado → Gmail/Telegram", meta: "Última leitura", time: "não configurado" },
  ];
}

export function FlowsPanel() {
  return (
    <SourcePanel
      name="Fluxos"
      subtitle="Status das conexões"
      icon="↻"
      loadingText="Consultando os registros do reino..."
      fetchItems={fetchFlows}
    />
  );
}
