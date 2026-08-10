import { SourcePanel, type SourceItem } from "../../ui/SourcePanel";

/**
 * Placeholder data source — swap for a real call to
 * `POST /api/vila-oyo/forge/local/files` once Hermes wires this to its own
 * filesystem access. IMPORTANT: this source was scoped as unrestricted
 * (no folder confinement) — see HERMES_GUIDE.md connection model. This
 * round only covers listing (read); the eventual delete action should use
 * a soft-delete (move to a Hermes-managed trash folder) rather than a
 * hard delete, precisely because there's no path restriction to contain
 * a mistake.
 */
async function fetchFiles(): Promise<SourceItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: "1", title: "orcamento_2026.xlsx", meta: "C:\\Users\\marce\\Documents", time: "500 KB" },
    { id: "2", title: "logo-refaz.png", meta: "C:\\Users\\marce\\Pictures", time: "1.2 MB" },
    { id: "3", title: "notas-reuniao.txt", meta: "C:\\Users\\marce\\Desktop", time: "4 KB" },
  ];
}

export function LocalFilesPanel() {
  return (
    <SourcePanel
      name="Arquivos locais"
      subtitle="Sistema de arquivos (sem restrição de pasta)"
      icon="▤"
      loadingText="Emergindo das águas do mangue..."
      fetchItems={fetchFiles}
    />
  );
}
