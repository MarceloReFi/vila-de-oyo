import { useEffect, useRef, useState } from "react";
import { ToolTabs, type ToolTabDef } from "../../ui/ToolTabs";
import { chamfer, vo, voFontDisplay } from "../../ui/theme";
import { GoogleDrivePanel } from "./GoogleDrivePanel";
import { LocalFilesPanel } from "./LocalFilesPanel";
import { ObsidianPanel } from "./ObsidianPanel";

export interface MangueInteriorProps {
  onBack: () => void;
}

type MangueSource = "obsidian" | "local" | "drive" | "gitbook";
type MangueSelection = MangueSource | "left" | "right";

const SOURCES: ToolTabDef<MangueSource>[] = [
  { id: "obsidian", label: "Obsidian" },
  { id: "local", label: "Arquivos locais" },
  { id: "drive", label: "Google Drive" },
  { id: "gitbook", label: "GitBook (futuro)", disabled: true },
];

// Which tree in the background art highlights for each selection. Every
// tree (including the two reserved extremities) has its own highlighted
// art — only obsidian/local/drive additionally open a panel below.
const TREE_BACKGROUNDS: Record<MangueSelection, string> = {
  obsidian: "/sprites/mangue-obsidian-selecionado.jpg",
  local: "/sprites/mangue-arquivos-locais-selecionado.jpg",
  drive: "/sprites/mangue-google-drive-selecionado.jpg",
  gitbook: "/sprites/mangue-de-nana.jpg",
  left: "/sprites/mangue-extremidade-esquerda-selecionado.jpg",
  right: "/sprites/mangue-extremidade-direita-selecionado.jpg",
};

const DEFAULT_BACKGROUND = "/sprites/mangue-de-nana.jpg";

// Source art is 1376x768 (16:9). Hotspot left/top % are measured against
// THAT image, not the viewport — so the image must render at its exact
// aspect ratio (no backgroundSize:cover crop) or the percentages drift
// off the visible tree the moment the container isn't exactly 16:9.
const IMAGE_ASPECT = 16 / 9;

// Click hotspots over the tree art itself — exact left/top % (hotspot
// center) from the approved HTML prototype, not re-estimated. Each covers
// the wooden sign at that tree's feet. Every hotspot selects/highlights
// its tree; extremity trees (reserved) just don't open a panel.
interface TreeHotspot {
  id: MangueSelection;
  left: number;
  top: number;
  hasPanel: boolean;
}

const TREE_HOTSPOTS: TreeHotspot[] = [
  { id: "left", left: 14.2, top: 69.7, hasPanel: false },
  { id: "local", left: 30.5, top: 66.4, hasPanel: true },
  { id: "obsidian", left: 53.6, top: 71, hasPanel: true },
  { id: "drive", left: 70.1, top: 65.8, hasPanel: true },
  { id: "right", left: 89.4, top: 68.4, hasPanel: false },
];

export function MangueInterior({ onBack }: MangueInteriorProps) {
  const [selection, setSelection] = useState<MangueSelection | null>(null);
  const frameHostRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ width: 0, height: 0, left: 0, top: 0 });

  useEffect(() => {
    const el = frameHostRef.current;
    if (!el) return;
    const compute = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (!cw || !ch) return;
      let w = cw;
      let h = w / IMAGE_ASPECT;
      if (h > ch) {
        h = ch;
        w = h * IMAGE_ASPECT;
      }
      setFrame({ width: w, height: h, left: (cw - w) / 2, top: (ch - h) / 2 });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const backgroundSrc = selection ? TREE_BACKGROUNDS[selection] : DEFAULT_BACKGROUND;

  const activeTab = (
    selection === "obsidian" || selection === "local" || selection === "drive" ? selection : ""
  ) as MangueSource;

  return (
    <div className="vo-root" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={frameHostRef} style={{ position: "absolute", inset: 0, background: vo.surface }}>
        <div
          style={{
            position: "absolute",
            left: frame.left,
            top: frame.top,
            width: frame.width,
            height: frame.height,
            backgroundImage: `url('${backgroundSrc}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {TREE_HOTSPOTS.map((h) => (
            <div
              key={h.id}
              onClick={() => setSelection(h.id)}
              style={{
                position: "absolute",
                left: `${h.left}%`,
                top: `${h.top}%`,
                transform: "translate(-50%, -50%)",
                width: 64,
                height: 44,
                zIndex: 5,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 20,
          clipPath: chamfer(6),
          background: "rgba(14,14,14,.8)",
          border: `2px solid ${vo.outlineVariant}`,
          padding: "8px 16px",
          fontFamily: voFontDisplay,
          fontSize: 13,
          fontWeight: 700,
          color: vo.primary,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        ‹ Vila
      </button>
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          padding: 20,
          gap: 12,
          overflowY: "auto",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <ToolTabs tools={SOURCES} active={activeTab} onChange={setSelection} />
        </div>
        {selection === "obsidian" && (
          <div style={{ pointerEvents: "auto" }}>
            <ObsidianPanel />
          </div>
        )}
        {selection === "local" && (
          <div style={{ pointerEvents: "auto" }}>
            <LocalFilesPanel />
          </div>
        )}
        {selection === "drive" && (
          <div style={{ pointerEvents: "auto" }}>
            <GoogleDrivePanel />
          </div>
        )}
      </div>
    </div>
  );
}
