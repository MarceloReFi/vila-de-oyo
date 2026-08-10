# Vila de Oyó

Customização visual (dashboard `/vila-oyo`) para a instalação local do
[Hermes Agent](https://github.com) rodando neste computador. Este repo guarda
só a personalização — não uma cópia do Hermes Agent em si.

## Conteúdo

- `web/src/pages/VilaOyoPage.tsx` — orquestra Gate → Map → Forge, e abre o Painel Kingdom
- `web/src/village/theme.css` — `@font-face` (Space Mono / Fira Sans / JetBrains Mono, auto-hospedadas) + tokens de cor escopados em `.vo-root`
- `web/src/village/ui/theme.ts` — tokens de cor em JS + helper `chamfer()` (clip-path chanfrado 45°)
- `web/src/village/ui/ChamferPanel.tsx`, `ChamferButton.tsx`, `ChamferBadge.tsx` — primitivos reutilizáveis do sistema "Sacred Sovereignty"
- `web/src/village/ui/ToolTabs.tsx` — barra de abas genérica pra qualquer construção com múltiplas fontes/ferramentas (usada pelo Mangue; a Forja ainda usa sua própria `ForgeToolTabs.tsx`, criada antes)
- `web/src/village/ui/SourcePanel.tsx` — painel de leitura genérico (lista + loading + erro), usado pelas fontes do Mangue
- `web/src/village/Gate/VillageGate.tsx` — tela de entrada
- `web/src/village/map/VillageMap.tsx` + `BuildingMarker.tsx` — mapa isométrico
- `web/src/village/buildings/forge/ForgeInterior.tsx` — Ferraria de Ogum, multi-ferramenta: `ForgeCommandWindow.tsx` (GitHub), `VercelDeploymentsPanel.tsx`, `SupabaseQueryPanel.tsx`
- `web/src/village/buildings/mangue/MangueInterior.tsx` — Mangue de Nanã, leitura em `ObsidianPanel.tsx`, `LocalFilesPanel.tsx`, `GoogleDrivePanel.tsx`
- `web/src/village/buildings/mercado/MercadoInterior.tsx` — Mercado de Exu, leitura em `GmailPanel.tsx`, `TelegramPanel.tsx`
- `web/src/village/kingdom/KingdomPanel.tsx` — Painel Kingdom (status do reino), portado de `Painel Kingdon.zip/code.html`
- `web/public/sprites/vista-da-vila.png` — arte do mapa (ver nota abaixo sobre `Ila ve Oyo.zip`)
- `web/public/fonts/vila-oyo/*.woff2` — subconjuntos latin das 3 fontes do sistema
- `Ila ve Oyo.zip`, `Painel Kingdon.zip` — exports originais do Claude Design (`DESIGN.md` + mockups). Fonte de verdade do sistema visual; o código acima é a implementação.

## Como integrar numa instalação do hermes-agent

1. Copie `web/src/pages/VilaOyoPage.tsx`, `web/src/village/**`,
   `web/public/sprites/vista-da-vila.png` e `web/public/fonts/vila-oyo/**`
   para os caminhos equivalentes em `<hermes-agent>/web/`.
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
3. Em `web/src/App.tsx`, adicione a rota à mesma condicional que trata
   `/docs` e `/chat` como full-height (procure por `isDocsRoute` /
   `isChatRoute`): declare `isVilaOyoRoute` e inclua-o nos dois `cn(...)`
   que aplicam `min-h-0 flex-1` / `flex flex-1 flex-col`. Sem isso o
   container do conteúdo não estica e qualquer componente com
   `height: "100%"` dentro da rota colapsa — foi assim que o mapa e o
   Painel Kingdom ficaram sem fundo visível na primeira tentativa.
4. Rode `npm run build` dentro de `web/` — o Vite já publica em
   `../hermes_cli/web_dist`, então o `hermes dashboard` serve a versão nova
   sem passo manual de cópia.

Ver `HERMES_GUIDE.md` neste repo para o passo a passo completo e as
armadilhas já identificadas.

## Status

Funcional (Gate → Map → Ferraria → Mangue de Nanã → Painel Kingdom), já com o
sistema visual "Retro-Tactile 16-bit / Sacred Sovereignty": chanfro 45° real
via clip-path (não `border-radius`), sombra pixel em duas camadas, fontes
auto-hospedadas, textura de dithering no Gate, ícones via `lucide-react`.

- **Ferraria de Ogum**: multi-ferramenta (GitHub + status de deployments da
  Vercel + query SELECT no Supabase), todos com dados mock.
- **Mangue de Nanã**: construído, só leitura (Obsidian / Arquivos locais /
  Google Drive, todos mock; GitBook é fonte futura), com arte de fundo real
  em `mangue-de-nana.jpg`.
- **Mercado de Exu**: construído, só leitura (Gmail / Telegram, mock, sem
  validação de API real ainda).

Decisões tomadas na integração:
- **Nomenclatura**: "Mangue de Nanã" é o nome definitivo (substituiu "Bosque
  de Nanã"). O mapa mockup rotula esse prédio como "Nana's Library" — não
  usado como fonte de verdade para o nome.
- **Arte do mapa**: `vista-da-vila.png` foi mantido. O novo `screen.png` em
  `Ila ve Oyo.zip` tem os rótulos dos prédios (em inglês) desenhados dentro da
  própria imagem, enquanto o app atual já renderiza os rótulos dinamicamente
  via `BuildingMarker` (em português, sem depender da arte). Trocar a imagem
  perderia essa flexibilidade sem ganhar nada — o novo mockup ficou só como
  referência de mood/estilo. Se quiser mesmo trocar a arte, precisa de uma
  versão sem texto embutido.
- **Painel Kingdom**: dados (Riqueza, Saúde, Ritual, níveis dos prédios) são
  placeholder estático — sem fonte de dados real definida ainda.
- **Marcador do Palácio**: no mapa, clicar no Palácio agora abre o Painel
  Kingdom (antes só mostrava um toast de "em construção"). Há também um botão
  dedicado "Status do Reino" no HUD do mapa.
- Componentes ainda não portados 1:1 do mockup: indicador de seleção "Golden
  Spear/Burning Flame" do DESIGN.md não foi implementado — os marcadores do
  mapa mantêm o pulso de diamante já existente.

**Não testado visualmente em navegador** nesta rodada (sem acesso a
ferramenta de browser) — build e typecheck passaram limpos e os assets
respondem 200, mas vale abrir `/vila-oyo` e conferir antes de considerar
fechado.
