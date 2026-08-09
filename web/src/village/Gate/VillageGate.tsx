import { useState } from "react";
import { ChamferButton } from "../ui/ChamferButton";
import { chamfer, vo, voFontDisplay, voFontLabel, voFontBody } from "../ui/theme";

export interface VillageGateProps {
  onEnter: () => void;
}

export function VillageGate({ onEnter }: VillageGateProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const inputStyle = {
    width: "100%",
    padding: 14,
    fontFamily: voFontBody,
    fontSize: 16,
    background: vo.secondary,
    color: vo.onPrimary,
    border: "2px solid #0e0e0e",
    clipPath: chamfer(4),
    boxShadow: "inset 4px 4px 0 rgba(0,0,0,.25)",
  } as const;

  const labelStyle = {
    fontFamily: voFontLabel,
    fontSize: 12,
    fontWeight: 500,
    color: vo.onSurfaceVariant,
    textTransform: "uppercase" as const,
    letterSpacing: 2,
  };

  return (
    <div className="vo-root" style={{ position: "absolute", inset: 0 }}>
      <style>{`@keyframes vila-gate-flicker {0%{opacity:1;transform:scale(1);}25%{opacity:.8;transform:scale(1.05);}50%{opacity:.9;transform:scale(.95);}75%{opacity:.7;transform:scale(1.02);}100%{opacity:1;transform:scale(1);}}`}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBM7jGZufsioI2glugx4rOEwQ0JtEtW5NuBDWWpkkitg-ZKL9e-uHeaCwH-jNWxS1vh_cILC79p_mj80uQ8O9ObpmwTwgLug0mltxP7CeAIbOSM4mXRLF6FCilTRGWUvsTlbJC-UnJfGNUzVKPKBUBJjsf2i-78oVHzUuk67rtKfs9l8WwHJ7GcX0jHe7zsqfl68FNiDYlsNbSPgGmayRuU5bxDlUwu8AlGyv-0fF6JZ2mDZZqmlPd6')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
        }}
      />
      <div className="vo-dither" style={{ position: "absolute", inset: 0, opacity: 0.5, mixBlendMode: "overlay" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} />
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          top: "28%",
          left: "18%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,183,150,.4) 0%, rgba(251,183,150,0) 70%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          animation: "vila-gate-flicker .5s infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          top: "28%",
          right: "18%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,183,150,.4) 0%, rgba(251,183,150,0) 70%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          animation: "vila-gate-flicker .5s infinite alternate",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 24,
        }}
      >
        <div style={{ position: "relative", marginBottom: 48, textAlign: "center" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: chamfer(10),
              background: "#855237",
              transform: "skewX(-6deg) scale(1.1)",
              boxShadow: "8px 8px 0 #000",
              zIndex: -1,
              border: "2px solid #0e0e0e",
            }}
          />
          <h1
            style={{
              fontFamily: voFontDisplay,
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: -1,
              color: vo.secondaryFixed,
              textTransform: "uppercase",
              textShadow: "4px 4px 0 #000",
              position: "relative",
              zIndex: 10,
              padding: "16px 40px",
              margin: 0,
            }}
          >
            Vila de Oyó
          </h1>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 32,
            clipPath: chamfer(12),
            background: vo.surfaceContainerHigh,
            borderTop: `2px solid ${vo.outline}`,
            borderLeft: `2px solid ${vo.outline}`,
            borderBottom: "2px solid #0e0e0e",
            borderRight: "2px solid #0e0e0e",
            boxShadow: "inset 0 0 16px rgba(0,0,0,.8), 8px 8px 0 #000",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>Nome de Usuário</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>Senha Secreta</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <ChamferButton onClick={onEnter} corner={10} style={{ width: "100%", fontSize: 18, padding: 16, marginTop: 4 }}>
            Entrar
          </ChamferButton>

          <div style={{ textAlign: "center", marginTop: 2 }}>
            <a
              href="#"
              style={{
                fontFamily: voFontLabel,
                fontSize: 12,
                textDecoration: "underline dotted",
                color: vo.primary,
              }}
            >
              Esqueceu os búzios? (Recuperar Senha)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
