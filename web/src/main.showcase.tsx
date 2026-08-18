import { createRoot } from "react-dom/client";
import VilaOyoPage from "@/pages/VilaOyoPage";

// @/lib/api.ts (pulled in transitively by ForgeCommandWindow, ObsidianPanel
// and ObsidianGraph, which still import fetchJSON for their real — but
// showcase-guarded, never-executed — API path) reads these at module load
// time. The showcase never calls a real /api/* endpoint, but stub them so
// that read doesn't hit `undefined`.
window.__HERMES_SESSION_TOKEN__ = "";
window.__HERMES_BASE_PATH__ = "";

// VilaOyoPage already starts on its own "gate" screen (VillageGate) and
// walks Gate → Map → building interiors internally — no extra wrapper
// needed, and deliberately none of the real app's providers
// (BrowserRouter/I18nProvider/ThemeProvider/SystemActionsProvider): the
// whole village/ tree doesn't reference any of them.
createRoot(document.getElementById("root")!).render(<VilaOyoPage />);
