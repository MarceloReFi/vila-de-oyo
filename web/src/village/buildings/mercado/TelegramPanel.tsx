import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder data source — swap for a real call to
 * `POST /api/vila-oyo/forge/telegram/messages` once the Hermes-side
 * endpoint exists. Requires a Telegram Bot API token on the Hermes side —
 * no connector was available to validate this during design, shape is a
 * best guess (chat name/last message/time).
 */
async function fetchMessages(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "Grupo ReFaz Dev", meta: "Marcelo: build passou ✅", time: "há 10min" },
    { id: "2", title: "Simon", meta: "Vamos alinhar amanhã?", time: "há 1h" },
    { id: "3", title: "Grupo Vila de Oyó", meta: "Novo protótipo no ar", time: "há 1d" },
  ];
}

export function TelegramPanel() {
  return (
    <SourcePanel
      name="Telegram"
      subtitle="Mensagens recentes"
      icon="➤"
      loadingText="Abrindo os caminhos..."
      fetchItems={fetchMessages}
    />
  );
}
