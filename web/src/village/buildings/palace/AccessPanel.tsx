import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder — swap for a real call to
 * `POST /api/vila-oyo/forge/access/credentials` once the Hermes-side
 * endpoint exists. IMPORTANT: this is a read-only overview of which
 * credentials are configured — NOT the partner-permission/distribution
 * system discussed during the Forge design (that needs its own login
 * layer for partners, still undesigned). Don't conflate the two.
 */
async function fetchAccess(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "GitHub", meta: "PAT fine-grained · repos selecionados", time: "ativo" },
    { id: "2", title: "Vercel", meta: "Token de API pessoal", time: "ativo" },
    { id: "3", title: "Supabase", meta: "Service role key", time: "ativo" },
    { id: "4", title: "Google (Drive/Gmail)", meta: "OAuth conta pessoal", time: "ativo" },
    { id: "5", title: "Telegram", meta: "Bot token", time: "não configurado" },
  ];
}

export function AccessPanel() {
  return (
    <SourcePanel
      name="Acesso"
      subtitle="Credenciais conectadas (somente leitura)"
      icon="⚿"
      loadingText="Consultando os registros do reino..."
      fetchItems={fetchAccess}
    />
  );
}
