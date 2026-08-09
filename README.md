# Vila de Oyó

Customização visual (dashboard `/vila-oyo`) para a instalação local do
[Hermes Agent](https://github.com) rodando neste computador. Este repo guarda
só a personalização — não uma cópia do Hermes Agent em si.

## Conteúdo

- `web/src/pages/VilaOyoPage.tsx` — orquestra Gate → Map → Forge
- `web/src/village/Gate/VillageGate.tsx` — tela de entrada
- `web/src/village/map/VillageMap.tsx` + `BuildingMarker.tsx` — mapa isométrico
- `web/src/village/buildings/forge/ForgeInterior.tsx` + `ForgeCommandWindow.tsx` — Ferraria de Ogum (ações git)
- `web/public/sprites/vista-da-vila.png` — arte do mapa

## Como integrar numa instalação do hermes-agent

1. Copie `web/src/pages/VilaOyoPage.tsx`, `web/src/village/**` e
   `web/public/sprites/vista-da-vila.png` para os caminhos equivalentes em
   `<hermes-agent>/web/`.
2. Em `web/src/App.tsx`:
   - Importe a página:
     ```ts
     import VilaOyoPage from "@/pages/VilaOyoPage";
     ```
   - Registre a rota em `BUILTIN_ROUTES_CORE`:
     ```ts
     "/vila-oyo": VilaOyoPage,
     ```
   - Adicione um item em `BUILTIN_NAV_REST` (sem remover os existentes):
     ```ts
     { path: "/vila-oyo", labelKey: "vila-oyo", label: "Vila de Oyó", icon: Globe },
     ```
3. Rode `npm run build` dentro de `web/` — o Vite já publica em
   `../hermes_cli/web_dist`, então o `hermes dashboard` serve a versão nova
   sem passo manual de cópia.

## Status

Funcional (Gate → Map → Ferraria), mas ainda **não implementa** a estética
"Retro-Tactile 16-bit / Sacred Sovereignty" descrita nos docs de design
originais (chanfros 45°, sombras pixel, dithering, tablets de madeira). Esse
trabalho visual segue pendente.
