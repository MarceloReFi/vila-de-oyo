import { ForgeCommandWindow } from "./ForgeCommandWindow";
import { chamfer, vo, voFontDisplay } from "../../ui/theme";

export interface ForgeInteriorProps {
  onBack: () => void;
}

export function ForgeInterior({ onBack }: ForgeInteriorProps) {
  return (
    <div className="vo-root" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvqtV88WM0yCIym9y--l6IZ3RQw0qbklJI0u3X4FynwViNl7hXUummxd_NIuwbR-tJqXo8IbGwQ0xB30_vxEkWIKcmfjx--vGYjRocEwYpnE0L3EGH5VwBE5XsTj7gsaI-g6Vpum1GGxdsb3pkHf6WQrhp-8125WRC7TlN-daXq5Jg6bXXPjTXQs6ahtd66utNt8mkcHgZ0Wxsj-TACp2sssEz3xAvnjwSWeNJc2ZiapbSsfOw4-4E')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
          opacity: 0.55,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(19,19,19,.55)" }} />
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
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 24 }}>
        <ForgeCommandWindow />
      </div>
    </div>
  );
}
