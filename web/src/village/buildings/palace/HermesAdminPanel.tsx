import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder — swap for a real call to
 * `POST /api/vila-oyo/forge/hermes/stats` once the Hermes-side endpoint
 * exists (modelo ativo, consumo de tokens, sessões ativas).
 */
async function fetchStats(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "Modelo ativo", meta: "Motor de linguagem em uso", time: "claude-sonnet-5" },
    { id: "2", title: "Tokens usados (mês)", meta: "Limite mensal do plano", time: "42.300 / 100.000" },
    { id: "3", title: "Sessões ativas", meta: "CLI + dashboard", time: "2" },
  ];
}

export function HermesAdminPanel() {
  return (
    <SourcePanel
      name="Hermes"
      subtitle="Modelo, tokens e sessões"
      icon="⚙"
      loadingText="Consultando os registros do reino..."
      fetchItems={fetchStats}
    />
  );
}
