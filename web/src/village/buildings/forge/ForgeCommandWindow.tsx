import { useState } from "react";

interface ForgeAction {
  id: number;
  title: string;
  subtitle: string;
  icon: "hammer" | "bellows" | "tongs" | "whetstone";
  prompt: string;
  result: string;
}

const ACTIONS: ForgeAction[] = [
  { id: 0, title: "Temperar novo commit", subtitle: "git commit", icon: "hammer", prompt: "O ferro está pronto para ser moldado...", result: "Hermes: commit forjado — 3 arquivos temperados no fogo do repositório." },
  { id: 1, title: "Soprar o fole", subtitle: "git sync", icon: "bellows", prompt: "O fole aviva as chamas...", result: "Hermes: sincronizado com a origem — 2 commits recebidos, 1 enviado." },
  { id: 2, title: "Puxar do fogo", subtitle: "git rebuild", icon: "tongs", prompt: "O metal aquece novamente sob as pinças...", result: "Hermes: rebuild completo — a lâmina saiu mais afiada." },
  { id: 3, title: "Consultar a forja", subtitle: "git log", icon: "whetstone", prompt: "As marcas do martelo contam a história...", result: "Hermes: últimos 5 commits exibidos no registro da forja." },
];

/** Pixel-flat SVG renditions of the real forge tools — no icon-font glyphs, per the design brief. */
function ForgeIcon({ kind }: { kind: ForgeAction["icon"] }) {
  const common = { width: 40, height: 40, shapeRendering: "crispEdges" as const };
  if (kind === "hammer") {
    return (
      <svg viewBox="0 0 40 40" {...common}>
        <rect x="16" y="16" width="6" height="20" fill="#8a5a38" stroke="#3a220f" strokeWidth={1} />
        <rect x="14" y="30" width="10" height="4" fill="#3a220f" />
        <rect x="6" y="4" width="24" height="12" fill="#6b6b6b" stroke="#0e0e0e" strokeWidth={1.5} />
        <rect x="6" y="4" width="24" height="4" fill="#9a9a9a" />
        <rect x="2" y="6" width="6" height="8" fill="#4a4a4a" stroke="#0e0e0e" strokeWidth={1} />
      </svg>
    );
  }
  if (kind === "bellows") {
    return (
      <svg viewBox="0 0 40 40" {...common}>
        <polygon points="4,8 4,32 26,22 26,18" fill="#8a5a38" stroke="#3a220f" strokeWidth={1.5} />
        <line x1="10" y1="12" x2="10" y2="28" stroke="#3a220f" strokeWidth={1.5} />
        <line x1="15" y1="14" x2="15" y2="26" stroke="#3a220f" strokeWidth={1.5} />
        <line x1="20" y1="16" x2="20" y2="24" stroke="#3a220f" strokeWidth={1.5} />
        <rect x="26" y="18" width="12" height="4" fill="#4a4a4a" stroke="#0e0e0e" strokeWidth={1} />
      </svg>
    );
  }
  if (kind === "tongs") {
    return (
      <svg viewBox="0 0 40 40" {...common}>
        <rect x="17" y="4" width="6" height="16" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(-18 20 12)" />
        <rect x="17" y="4" width="6" height="16" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(18 20 12)" />
        <rect x="12" y="2" width="6" height="6" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(-30 15 5)" />
        <rect x="22" y="2" width="6" height="6" fill="#9f8d85" stroke="#0e0e0e" strokeWidth={1} transform="rotate(30 25 5)" />
        <circle cx="20" cy="18" r="3" fill="#4a4a4a" stroke="#0e0e0e" strokeWidth={1} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 40" {...common}>
      <rect x="4" y="24" width="32" height="8" fill="#5a3a20" stroke="#3a220f" strokeWidth={1} />
      <rect x="6" y="10" width="28" height="12" fill="#a8a2a0" stroke="#0e0e0e" strokeWidth={1.5} transform="rotate(-4 20 16)" />
      <rect x="6" y="14" width="28" height="3" fill="#7d7876" transform="rotate(-4 20 16)" />
    </svg>
  );
}

export function ForgeCommandWindow() {
  const [selected, setSelected] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [particleKey, setParticleKey] = useState(0);
  const action = ACTIONS[selected];

  const select = (id: number) => {
    setSelected(id);
    setConfirmed(false);
  };
  const confirm = () => {
    setConfirmed(true);
    setParticleKey((k) => k + 1);
  };
  const cancel = () => setConfirmed(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 800,
        background: "#2a2a2a",
        border: "4px solid #2a1f1a",
        boxShadow: "inset 2px 2px 0 #fbb796, inset -2px -2px 0 #0e0e0e, 0 0 30px rgba(251,183,150,.3), 8px 8px 0 #000",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <style>{`
        @keyframes vila-typing { from { width: 0; } to { width: 100%; } }
        @keyframes vila-pulse-opacity { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @keyframes vila-spark1 { to { transform: translate(-70px,-50px) scale(0); opacity: 0; } }
        @keyframes vila-spark2 { to { transform: translate(60px,-55px) scale(0); opacity: 0; } }
        @keyframes vila-spark3 { to { transform: translate(-40px,20px) scale(0); opacity: 0; } }
        @keyframes vila-spark4 { to { transform: translate(50px,25px) scale(0); opacity: 0; } }
        @keyframes vila-spark5 { to { transform: translate(-15px,-75px) scale(0); opacity: 0; } }
        @keyframes vila-spark6 { to { transform: translate(20px,-80px) scale(0); opacity: 0; } }
      `}</style>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #52443d",
          paddingBottom: 16,
        }}
      >
        <div>
          <h1 style={{ fontFamily: "'Space Mono',monospace", fontSize: 32, fontWeight: 700, letterSpacing: -0.5, color: "#fbb796", margin: 0 }}>
            FERRARIA DE OGUM
          </h1>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              fontWeight: 500,
              color: "#ff636f",
              textTransform: "uppercase",
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            Status: O fogo está aceso
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {ACTIONS.map((a) => {
          const active = a.id === selected;
          return (
            <button
              key={a.id}
              onClick={() => select(a.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: 16,
                textAlign: "left",
                border: `2px solid ${active ? "#ff636f" : "#52443d"}`,
                background: active ? "rgba(255,99,111,0.12)" : "#20201f",
                boxShadow: "inset 2px 2px 0 rgba(255,255,255,.1), inset -2px -2px 0 rgba(0,0,0,.5), 4px 4px 0 rgba(0,0,0,.8)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "#353535",
                  border: `2px solid ${active ? "#ff636f" : "#52443d"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "inset 2px 2px 0 rgba(0,0,0,.5)",
                }}
              >
                <ForgeIcon kind={a.icon} />
              </div>
              <div>
                <h3 style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, fontWeight: 700, color: active ? "#ff636f" : "#e5e2e1", margin: 0 }}>
                  {a.title}
                </h3>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 500, color: "#d6c2ba", margin: "4px 0 0" }}>
                  {a.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 4,
          background: "#0e0e0e",
          border: "4px solid #52443d",
          padding: 16,
          position: "relative",
          boxShadow: "inset 0 0 10px rgba(0,0,0,.8)",
        }}
      >
        <div style={{ position: "absolute", top: -4, left: -4, width: 8, height: 8, background: "#fbb796" }} />
        <div style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, background: "#fbb796" }} />
        <div style={{ position: "absolute", bottom: -4, left: -4, width: 8, height: 8, background: "#fbb796" }} />
        <div style={{ position: "absolute", bottom: -4, right: -4, width: 8, height: 8, background: "#fbb796" }} />
        <p
          key={`${action.id}-${confirmed}`}
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            animation: "vila-typing 1.6s steps(40,end)",
            fontFamily: "'Fira Sans',sans-serif",
            fontSize: 18,
            color: "#ffe16d",
            margin: 0,
          }}
        >
          {confirmed ? action.result : action.prompt}
        </p>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            width: 10,
            height: 10,
            background: "#ffe16d",
            borderRadius: "50%",
            animation: "vila-pulse-opacity 1.2s infinite",
          }}
        />
      </div>

      {confirmed && (
        <div key={particleKey} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 70, right: 70, width: 8, height: 8, borderRadius: "50%", background: "#ff8a4c", animation: "vila-spark1 .7s ease-out forwards" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 8, height: 8, borderRadius: "50%", background: "#ffe16d", animation: "vila-spark2 .7s ease-out forwards" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 6, height: 6, borderRadius: "50%", background: "#ff8a4c", animation: "vila-spark3 .6s ease-out forwards .05s" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 6, height: 6, borderRadius: "50%", background: "#ffe16d", animation: "vila-spark4 .6s ease-out forwards .05s" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 7, height: 7, borderRadius: "50%", background: "#ff636f", animation: "vila-spark5 .75s ease-out forwards .1s" }} />
          <div style={{ position: "absolute", top: 70, right: 70, width: 7, height: 7, borderRadius: "50%", background: "#ff636f", animation: "vila-spark6 .75s ease-out forwards .1s" }} />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
        <button
          onClick={cancel}
          style={{
            background: "#353535",
            color: "#e5e2e1",
            border: "2px solid #52443d",
            padding: "10px 24px",
            fontFamily: "'Space Mono',monospace",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "4px 4px 0 rgba(0,0,0,.8)",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={confirm}
          style={{
            background: "#c78a6b",
            color: "#4e250d",
            border: "2px solid #fbb796",
            padding: "10px 24px",
            fontFamily: "'Space Mono',monospace",
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "4px 4px 0 rgba(0,0,0,.8)",
          }}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
