import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder data source — swap for a real call to
 * `POST /api/vila-oyo/forge/gmail/messages` once the Hermes-side endpoint
 * exists. Not testable from a chat session (no Gmail MCP tool was
 * available during design) — shape is a best-guess (subject/sender/time),
 * confirm against the real Gmail API response when the endpoint is built.
 */
async function fetchMessages(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "Re: Proposta de parceria", meta: "simon@refaz.studio", time: "há 2h" },
    { id: "2", title: "Confirmação de reunião", meta: "calendar@google.com", time: "ontem" },
    { id: "3", title: "Fatura Vercel", meta: "billing@vercel.com", time: "há 3 dias" },
  ];
}

export function GmailPanel() {
  return (
    <SourcePanel
      name="Gmail"
      subtitle="Mensagens recentes"
      icon="✉"
      loadingText="Abrindo os caminhos..."
      fetchItems={fetchMessages}
    />
  );
}
