# Guia para editar a Vila de Oyó com o Hermes

Este documento é para o **Hermes** (o agente que roda neste computador),
não para quem lê o código. Serve pra evitar repetir os problemas da sessão
que criou este projeto. Leia antes de mexer em qualquer coisa da Vila de Oyó.

## Onde as coisas vivem

Existem **dois lugares**, com papéis diferentes — não confundir:

| Lugar | Papel |
|---|---|
| `C:\Users\marce\AppData\Local\hermes\hermes-agent\web\` | A instalação real que roda o dashboard nesta máquina (`hermes dashboard --port 9119`). É aqui que você edita e builda pra testar. |
| `C:\Users\marce\vila-de-oyo\` | Repositório permanente, git-tracked, que espelha só a personalização da Vila de Oyó. É o que vai pro GitHub (`github.com/MarceloReFi/vila-de-oyo`, **sem hífen**). |

**Nunca use pastas `Temp`/`tmp` como working directory para este projeto.**
Uma sessão anterior clonou o repo errado dentro de
`AppData\Local\Temp\vila-de-oyo`, apontando pra um repositório GitHub
diferente (`MarceloReFi/-vila-de-oyo`, **com hífen**) — isso causou o app
rodando localmente ficar desconectado do que estava no Git por várias
sessões. Esse repo com hífen está **obsoleto**, não usar mais.

## Fluxo de trabalho

1. Edite os arquivos em `AppData\Local\hermes\hermes-agent\web\src\village\**`
   (e `App.tsx` se for mexer em rotas/nav).
2. Rode `npm run build` dentro de `web/`. O `vite.config.ts` já tem
   `outDir: "../hermes_cli/web_dist"` — o build escreve direto onde o
   dashboard serve. **Nunca copie arquivos de build à mão** (`cp -r ...`)
   pra `hermes_cli/web_dist` — se você fez isso, é sinal de que está
   buildando no lugar errado.
3. Reinicie o dashboard: `hermes dashboard --port 9119 --skip-build --no-open`.
4. Teste em `http://localhost:9119/vila-oyo` com hard refresh
   (Ctrl+Shift+R) — cache de bundle antigo engana.
5. Só depois de confirmar visualmente, copie os arquivos alterados para
   `C:\Users\marce\vila-de-oyo\web\...` (mesma estrutura de pastas) e
   `git commit` + `git push origin main` nesse repo.

## Armadilhas já pisadas (não repetir)

- **Rota cheia de tela precisa entrar na condicional de layout.** Em
  `web/src/App.tsx` existe `isDocsRoute` / `isChatRoute` / `isVilaOyoRoute`
  controlando se o container do conteúdo estica pra altura cheia
  (`min-h-0 flex-1`). Sem isso, qualquer componente com `height: "100%"`
  dentro da rota colapsa pra ~0px — foi exatamente o bug que fez o mapa e o
  Painel Kingdom aparecerem sem fundo, com os marcadores grudados no topo.
  Se criar uma rota irmã nova (tipo `/vila-oyo/algumacoisa`) que também
  precise ocupar a tela inteira, adicione o mesmo tratamento.
- **`web/public/fonts` e `hermes_cli/web_dist` estão no `.gitignore`** da
  instalação real — isso é esperado, não é bug. É por isso que as fontes
  moram versionadas no repo `vila-de-oyo` (não na instalação real) e por
  que o build nunca precisa ser commitado.
- **Imagens do Claude Design com URL `lh3.googleusercontent.com/aida-public/...`
  são temporárias.** Baixe e salve em `web/public/sprites/` antes de usar
  num componente — não referencie a URL do Google direto.
- **Tokens de cor do "Sacred Sovereignty" nunca vão pro `@theme` global**
  (`web/src/index.css`) — isso repintaria o dashboard inteiro. Ficam
  isolados em `village/theme.css` (`@font-face` + CSS vars sob `.vo-root`)
  e `village/ui/theme.ts` (mesmos tokens em JS).

## Sistema de design

Fonte de verdade: `DESIGN.md` dentro de `Ila ve Oyo.zip` e
`Painel Kingdon.zip` (raiz deste repo) — nome do sistema: **Sacred
Sovereignty**. Resumo do que importa no dia a dia:

- **Cantos**: sempre chanfro 45° via `chamfer(px)` de
  `web/src/village/ui/theme.ts` (retorna um `clip-path: polygon(...)`).
  Nunca `border-radius` em painéis/botões/badges da vila.
- **Sombra**: painéis usam duas camadas — uma cópia do mesmo `clip-path`,
  preenchida de preto, deslocada (`translate(Npx, Npx)`), atrás do
  conteúdo real. Um `box-shadow` comum não funciona junto com `clip-path`
  (fica cortado). Use `ChamferPanel` (`web/src/village/ui/ChamferPanel.tsx`)
  pra isso em vez de reinventar.
- **Botões**: use `ChamferButton` (`ui/ChamferButton.tsx`) — já implementa
  o "Carved Block": brilho dourado no hover, desloca 2px no clique.
- **Abas de ferramenta/fonte**: use `ToolTabs` (`ui/ToolTabs.tsx`,
  genérico, criado junto com o Mangue) pra qualquer construção nova. A
  Forja ainda usa sua própria `buildings/forge/ForgeToolTabs.tsx`, criada
  antes do genérico existir — não foi migrada pra evitar mexer em código
  já em produção sem necessidade. Não duplique `ToolTabs` de novo pra
  outra construção; reutilize o genérico.
- **Painel de leitura de uma fonte (lista + loading + erro)**: use
  `SourcePanel` (`ui/SourcePanel.tsx`, genérico) — usado pelas 3 fontes do
  Mangue (Obsidian/Arquivos locais/Drive). Escreva só a função de busca de
  dados (`fetchItems`) e o texto/ícone da fonte; não reimplemente a lista.
- **Fontes**: use as constantes `voFontDisplay` / `voFontBody` /
  `voFontLabel` de `ui/theme.ts` (Space Mono / Fira Sans / JetBrains Mono,
  auto-hospedadas em `public/fonts/vila-oyo/`). Não escreva
  `fontFamily: "'Space Mono', monospace"` direto — esse nome não está
  carregado; sem o `@font-face` de `theme.css` cai no monospace do sistema.
- **Ícones**: `lucide-react` (já é dependência do dashboard). Não usar
  Material Symbols / fonte de ícone externa.

## Decisões já tomadas (não reabrir sem motivo)

- Prédio 3 do mapa se chama **"Mangue de Nanã"** — nome definitivo,
  substitui a denominação anterior "Bosque de Nanã". Não é "Nana's
  Library" (nome que aparece no mockup `Ila ve Oyo.zip`, nunca foi o
  canônico).
- **Palácio do Alaafin**: convertido de modal (Painel Kingdom) pra
  construção de tela cheia (`built: true`), igual Ferraria/Mangue/
  Mercado — `KingdomPanel.tsx` foi removido. 8 abas: Visão Geral (o
  antigo conteúdo do modal, portado sem mudança de dados), Hermes
  (modelo/tokens/sessões), Armazenamento (limites por fonte), Acesso
  (credenciais conectadas — **somente leitura**, não é o sistema de
  distribuir autorizações pra parceiros discutido na Forja, que segue
  undesigned), Fluxos (status operacional das conexões, distinto de
  Acesso), Financeiro e Novas Construções (futuro, abas desabilitadas),
  Relatórios (botão que gera um resumo — texto estático por enquanto,
  sem fonte de dados real). Todas as abas com dados são placeholder. O
  botão "Status do Reino" no HUD do mapa e o clique no marcador do
  Palácio levam pro mesmo lugar agora.
- Dados do Painel Kingdom (Riqueza, Saúde, Ritual, níveis dos prédios) são
  **placeholder estático** — ainda não há fonte de dados real definida.
- **Mangue de Nanã**: construído (`built: true` em `VillageMap.tsx`), só
  leitura por enquanto — Obsidian, Arquivos locais (sem restrição de
  pasta) e Google Drive, todos com dados placeholder. GitBook é fonte
  futura, aba desabilitada. Arte de fundo do interior:
  `web/public/sprites/mangue-de-nana.jpg`, desfocada, mesmo tratamento do
  `ForgeInterior.tsx`. Escrita/criação/deleção nessas fontes ainda não foi
  desenhada; quando "Arquivos locais" ganhar delete, usar soft-delete
  (mover pra uma pasta de lixeira gerenciada pelo Hermes) em vez de apagar
  de verdade, já que o acesso não tem pasta-raiz restrita.
- **Mercado de Exu**: construído (`built: true` em `VillageMap.tsx`), só
  leitura por enquanto — Gmail e Telegram, ambos com dados placeholder
  (nenhum dos dois foi validado contra API real durante o design — Gmail
  não tinha ferramenta MCP carregada na sessão, Telegram não tem
  conector). Arte de fundo do interior:
  `web/public/sprites/mercado-de-exu.jpg`, mesmo tratamento (desfocada) do
  Forge/Mangue. Diferente do Mangue, essa arte tem uma faixa "MERCADO DE
  EXU" desenhada no topo da própria imagem (candidato único disponível
  sem UI concorrente embutida) — fica ilegível sob o blur/opacity padrão,
  mas se um dia trocar a arte por uma sem texto embutido, prefira. Escrita
  (enviar e-mail/mensagem) ainda não desenhada — quando desenhar, tratar
  como ação de alto risco (impersonar o usuário), com confirmação
  explícita tipo rascunho-antes-de-enviar, não o mesmo padrão leve das
  leituras.

## Checklist antes de dar push

- [ ] `npm run build` limpo (sem erros de TypeScript)
- [ ] Testado em `http://localhost:9119/vila-oyo` com hard refresh
- [ ] Se mexeu em fontes/imagens novas: copiadas pra
      `public/fonts/vila-oyo/` ou `public/sprites/` em **ambos** os
      lugares (instalação real + `C:\Users\marce\vila-de-oyo`)
- [ ] Commit no repo `C:\Users\marce\vila-de-oyo`, remote `origin` =
      `https://github.com/MarceloReFi/vila-de-oyo.git` (sem hífen)
