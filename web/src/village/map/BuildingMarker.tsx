import { useState, type CSSProperties } from "react";
import { chamfer, voFontDisplay, voFontLabel } from "../ui/theme";

export interface BuildingMarkerProps {
  id: string;
  name: string;
  sub: string;
  left: string;
  top: string;
  color: string;
  built: boolean;
  onClick: () => void;
}

export function BuildingMarker({ name, sub, left, top, color, onClick }: BuildingMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const wrapStyle: CSSProperties = {
    position: "absolute",
    left,
    top,
    transform: "translate(-50%, -50%)",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
  };
  const dotStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(45deg)",
    width: 18,
    height: 18,
    background: color,
    border: "2px solid #0e0e0e",
    boxShadow: `0 0 12px ${color}, 2px 2px 0 rgba(0,0,0,.8)`,
    animation: "vila-marker-pulse 1.6s ease-in-out infinite",
  };

  return (
    <button
      style={wrapStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={dotStyle} />
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            clipPath: chamfer(6),
            background: "#0e0e0e",
            border: `2px solid ${color}`,
            padding: "8px 12px",
            whiteSpace: "nowrap",
            boxShadow: "3px 3px 0 rgba(0,0,0,.8)",
          }}
        >
          <div
            style={{
              fontFamily: voFontDisplay,
              fontSize: 13,
              fontWeight: 700,
              color: "#fff9ef",
              textTransform: "uppercase",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: voFontLabel,
              fontSize: 11,
              color: "#d6c2ba",
              marginTop: 2,
            }}
          >
            {sub}
          </div>
        </div>
      )}
    </button>
  );
}
