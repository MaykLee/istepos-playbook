# ISTEPOS Defensive Playbook

App interativo de playbook defensivo para o time ISTEPOS — futebol americano flag.

**Live:** https://istepos-playbook.vercel.app (auto-deploy via GitHub)

---

## Stack

- Vite 5 + React 18
- Vitest 2 + jsdom 24 (testes)
- Deploy: Vercel (free tier, auto-deploy no push para `master`)

## Rodar localmente

```bash
npm install
npm run dev       # dev server em localhost:5173
npm run build     # build de produção em dist/
npm test          # testes
```

## Estrutura

```
src/
  tokens.js                    # paleta de cores (objeto G)
  App.jsx                      # shell com 4 abas
  data/
    formations.js              # BASES, STUNT_MOVES, BLITZ_MOVES, buildPlayers()
    plays.js                   # 39 jogadas pré-montadas (PLAYS, PLAYS_BY_FRONT)
    glossary.js                # 42 termos (GLOSSARY, GLOSSARY_CATS)
    quiz.js                    # QUIZ_DEFENSE — 10 perguntas
  components/
    PlaybookTab/               # diagrama SVG interativo + seletor + painel
      PlaySelector.jsx         # lista de jogadas agrupadas por front
      FieldDiagram.jsx         # campo SVG com tokens, setas e animação SNAP
      ExplainPanel.jsx         # descrição da jogada + role do jogador clicado
      index.jsx                # layout responsivo 2 colunas
    PositionsTab/              # cards de posições ofensivas e defensivas
    GlossaryTab/               # busca + filtro por categoria
    QuizTab/                   # quiz com XP e ranking
    shared/
      StatBar.jsx              # barra de estatística (Força/Velocidade/Leitura)
assets/
  source/
    playbook_raw.txt           # texto extraído do PDF do playbook 2026
```

## Sistema de dados

As 39 jogadas são computadas, não codificadas manualmente:

```
buildPlayers(front, stunt, modifiers[], roles)
  = BASES[front]          — posições iniciais dos 11 jogadores
  + STUNT_MOVES[stunt]    — moveTo dos DLs (para onde vão no snap)
  + BLITZ_MOVES[mod]      — moveTo dos LBs blitzando
```

**Fronts:** Stack, 55, Angle, LSU Prevent, Dam  
**Stunts:** Pinch, Contain, Slash, Wiz, Axe  
**Blitz mods:** Buck, Will, Mike, Fire (=Will+Buck), WiM (=Will+Mike), BuD (=Buck+Dog), RoD (=Rover+Dog), Dog, Blood  
**Coverages:** Blue (C2), Green (C3), Orange (C4), Silver (C2 Man)

## Deploy

Push para `master` → Vercel detecta e deploya automaticamente (~1 min).

`vercel.json` contém rewrite de SPA para todas as rotas apontarem para `index.html`.

---

Temporada 2026 — 66 dias para o Super Liga.
