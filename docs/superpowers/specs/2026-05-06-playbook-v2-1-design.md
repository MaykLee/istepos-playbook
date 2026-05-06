# PlaybookTab v2.1 — Design Spec

> Aprovado via brainstorming em 2026-05-06.

**Goal:** Expandir o PlaybookTab com sub-navegação interna em 3 abas: Jogadas (existente + filtro), Montar (montador de combinações livres) e Dicionário (cards de componentes).

**Architecture:** Sem novas abas no App.jsx. O PlaybookTab ganha estado interno de sub-aba. As 3 features compartilham FieldDiagram e ExplainPanel existentes. Dados de descrição já existem em plays.js (STUNT_DESC, MODIFIER_DESC, COVERAGE_DESC).

**Tech Stack:** React 18 estado local, sem libs externas, inline styles + classes CSS existentes.

---

## 1. Sub-navegação interna

O PlaybookTab ganha uma barra de sub-abas no topo:

```
[ Jogadas ] [ Montar ] [ Dicionário ]
```

- Aba ativa: underline dourado + cor G.au (mesmo padrão do App.jsx)
- Estado: `useState('jogadas')` no PlaybookTab/index.jsx
- As 3 abas ocupam o espaço inteiro — sem coluna esquerda/direita quando Montar ou Dicionário estão ativos

---

## 2. Aba Jogadas (existente + filtro)

### Filtro

Posicionado acima da lista no painel esquerdo existente.

**Campo de texto:**
- Input com ícone de lupa (🔍)
- Placeholder: "Buscar jogada..."
- Filtra em tempo real por `play.name` (case-insensitive, inclui parcial)

**Tags de atalho:**
- Linha de tags logo abaixo do input
- **Front tags:** Stack · 55 · Angle · LSU Prevent · Dam
- **Coverage tags:** Blue · Green · Orange · Silver
- Multi-select: clicar ativa, clicar de novo desativa
- Tags ativas: cor do front/coverage + fundo semitransparente
- Tags inativas: G.mu, borda G.aul
- Botão "× limpar" aparece somente quando há filtro ativo; reseta tudo

**Lógica de filtro:**
```
resultado = plays
  .filter(p => p.name.toLowerCase().includes(textoBusca.toLowerCase()))
  .filter(p => frontsAtivos.length === 0 || frontsAtivos.includes(p.front))
  .filter(p => coveragesAtivas.length === 0 || coveragesAtivas.includes(p.coverage))
```

**Estado vazio:** "Nenhuma jogada encontrada" em G.mu, com botão "limpar filtros".

**Componente:** `src/components/PlaybookTab/PlayFilter.jsx` (novo)
- Props: `onFilterChange(filteredPlays)`
- PlaySelector recebe `plays` como prop em vez de importar PLAYS_BY_FRONT diretamente

---

## 3. Aba Montar

Interface de construção de jogadas por seleção de componentes.

### Layout

Uma única coluna no desktop (sem split esquerda/direita).
Parte superior: seletor de componentes.
Parte inferior: preview da jogada montada (FieldDiagram + ExplainPanel).

### Seletor de componentes

4 seções verticais com label + botões:

**FRONT** (obrigatório, seleção única):
`Stack · 55 · Angle · LSU Prevent · Dam`

**STUNT** (obrigatório, seleção única):
`Pinch · Contain · Slash · Wiz · Axe`

**BLITZ** (opcional, seleção única):
`Nenhum · Buck · Will · Mike · Fire · WiM · BuD · RoD · Dog · Blood`

**COVERAGE** (obrigatório, seleção única):
`Blue · Green · Orange · Silver`

Botão selecionado: fundo G.aub + borda G.au + cor G.au.
Botão não selecionado: fundo transparente + borda G.aul + cor G.mu2.

### Preview da jogada

Barra de preview entre seletor e diagrama:
- Nome montado: `{front} {stunt} {modifier} {coverage}` em G.au
- Badge de status:
  - **Verde** "✓ Jogada catalogada" — se existir em PLAYS
  - **Âmbar** "◈ Combinação livre" — se construída dinamicamente

Botão "VER NO CAMPO →" ativo somente quando Front + Stunt + Coverage estão selecionados.

Ao clicar: carrega a jogada (catalogada ou dinâmica) no FieldDiagram abaixo.

### Jogada dinâmica (não catalogada)

Quando a combinação não existe nas 39 jogadas pré-montadas:
```js
const players = buildPlayers(front, stunt, modifier ? [modifier] : [], {})
// description: null → ExplainPanel mostra "Combinação não catalogada — use como referência de gap."
```

`ExplainPanel` recebe `play.description` como null e mostra texto de fallback.

**Componente:** `src/components/PlaybookTab/PlayBuilder.jsx` (novo)

---

## 4. Aba Dicionário

Cards de texto por categoria explicando cada componente do sistema de chamadas.

### Estrutura

Sub-filtro de categoria no topo:
```
[ FRONTS ] [ STUNTS ] [ BLITZES ] [ COVERAGES ]
```
Seleção única (não multi-select). Default: FRONTS.

Grid de cards abaixo: 2 colunas no desktop, 1 no mobile (< 700px).

### Conteúdo dos cards

Dados extraídos de `plays.js` já existentes (STUNT_DESC, MODIFIER_DESC, COVERAGE_DESC) + informações novas para Fronts.

**Estrutura de cada card:**
```
┌─────────────────────────┐
│ NOME (colorido por tipo) │
│ O que faz (1-2 linhas)  │
│ ─────────────────────── │
│ Detalhes / quando usar  │
│ Posições envolvidas      │
└─────────────────────────┘
```

**FRONTS (5 cards):** Stack, 55 (Over), Angle, LSU Prevent, Dam
**STUNTS (5 cards):** Pinch, Contain, Slash, Wiz, Axe
**BLITZES (9 cards):** Buck, Will, Mike, Fire, WiM, BuD, RoD, Dog, Blood
**COVERAGES (4 cards):** Blue (C2), Green (C3), Orange (C4), Silver (C2 Man)

**Dados a criar:** `src/data/dictionary.js` — novo arquivo com DICT_FRONTS, DICT_STUNTS, DICT_BLITZES, DICT_COVERAGES. Aproveita STUNT_DESC e MODIFIER_DESC de plays.js onde já existem.

**Componente:** `src/components/PlaybookTab/DictionaryTab.jsx` (novo)

---

## 5. Arquivos afetados

**Novos:**
- `src/data/dictionary.js` — conteúdo dos cards do Dicionário
- `src/components/PlaybookTab/PlayFilter.jsx` — filtro (texto + tags)
- `src/components/PlaybookTab/PlayBuilder.jsx` — montador de jogadas
- `src/components/PlaybookTab/DictionaryTab.jsx` — grid de cards

**Modificados:**
- `src/components/PlaybookTab/index.jsx` — sub-navegação + estado de sub-aba
- `src/components/PlaybookTab/PlaySelector.jsx` — recebe `plays` como prop
- `src/components/PlaybookTab/ExplainPanel.jsx` — fallback quando `play.description` é null
- `index.html` — adicionar regra CSS para grid do dicionário

---

## 6. O que não muda

- `FieldDiagram.jsx` — reutilizado sem alteração nas abas Jogadas e Montar
- `src/data/plays.js` — sem alteração (PLAYS, buildPlayers exportados normalmente)
- `src/data/formations.js` — sem alteração
- App.jsx e as outras 3 abas — sem alteração

---

## 7. Fora de escopo (próximas versões)

- Mini-SVG nos cards do Dicionário
- Exportar jogada como imagem
- Seleção múltipla de blitz no Montador
- Quiz de Ataque / Quiz Situacional
