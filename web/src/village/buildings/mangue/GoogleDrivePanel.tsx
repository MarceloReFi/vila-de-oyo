import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder data source — swap for a real call to
 * `POST /api/vila-oyo/forge/drive/files` once the Hermes-side endpoint
 * exists. Item shape (title/meta/time) mirrors the real Google Drive
 * `list_recent_files` response validated during design (title, mimeType,
 * modifiedTime) — titles below are generic placeholders, not the real
 * account's file names.
 */
async function fetchFiles(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "Planejamento — Parcerias", meta: "Google Doc", time: "editado há 1h" },
    { id: "2", title: "Orçamento — Grant XRPL", meta: "Google Doc", time: "editado ontem" },
    { id: "3", title: "Currículo — Consultoria", meta: "Google Doc", time: "há 2 dias" },
  ];
}

export function GoogleDrivePanel() {
  return (
    <SourcePanel
      name="Google Drive"
      subtitle="Arquivos recentes"
      icon="☁"
      loadingText="Emergindo das águas do mangue..."
      fetchItems={fetchFiles}
    />
  );
}
