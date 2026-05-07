# Quiz v2 — Design Spec

## Goal

Aprimorar o QuizTab com três melhorias independentes: novas categorias de perguntas com campo visual integrado, feedback animado de acerto/erro, e progresso persistente entre sessões via localStorage.

## Architecture

Sem backend. Toda persistência em `localStorage`. Três mudanças ortogonais:
1. **Dados** — expandir `quiz.js` com novas categorias e suporte a `playId`
2. **Progresso** — custom hook `useQuizProgress` lê/grava localStorage
3. **UX** — animações CSS + `FieldDiagram` inline nas perguntas com `playId`

## Tech Stack

React 18, Vite 5, CSS-in-JS (inline styles, padrão do projeto), localStorage, componente `FieldDiagram` existente.

---

## Part 1 — Data (quiz.js)

### Estrutura de cada pergunta

```js
{
  q:     string,         // enunciado da situação
  opts:  string[],       // 4 opções
  ans:   number,         // índice da correta (0–3)
  exp:   string,         // explicação mostrada após resposta
  playId?: string,       // opcional — ID de uma jogada em PLAYS para mostrar no campo
}
```

### Categorias

- `QUIZ_DEFENSE` — expande as 10 atuais com 5 novas perguntas (total ~15)
- `QUIZ_COVERAGE` — novo: 8 perguntas de identificação de cobertura pelo alinhamento; maioria com `playId` para mostrar o campo
- `QUIZ_SITUATIONS` — novo: 8 perguntas de down & distance, relógio, gestão de placar

### Tela inicial

Antes de começar, o usuário escolhe categoria:
- Defesa / Coberturas / Situações / Todas (mistura randômica)

---

## Part 2 — Progresso Persistente

### Hook: `useQuizProgress`

Arquivo: `src/components/QuizTab/useQuizProgress.js`

```js
// Retorna: { progress, addResult, resetProgress }
// progress = { xp, history, byCategory }
```

### Estrutura localStorage (chave: `istepos_quiz_progress`)

```js
{
  xp: number,
  history: [{ date: ISO string, category: string, score: number, total: number }],
  byCategory: {
    Defense:    { correct: number, total: number },
    Coverage:   { correct: number, total: number },
    Situations: { correct: number, total: number },
  }
}
```

### Painel de stats (tela inicial do QuizTab)

Mostrado acima do seletor de categoria:
- XP total acumulado em destaque
- Barra de % de acerto por categoria (Defesa / Coberturas / Situações)
- Últimas 3 partidas (data, categoria, score/total)
- Botão "resetar progresso" (confirma antes de apagar)

---

## Part 3 — Visual / UX

### Feedback animado

Ao escolher uma opção:
- **Acerto:** flash verde semitransparente sobre a tela por 400ms + texto "+X XP" que flutua para cima e some (CSS keyframe `floatUp`)
- **Erro:** shake no botão escolhido (CSS keyframe `shake`, 300ms)

Implementado com `useState` em `QuizTab` + classes CSS injetadas via `<style>` tag no componente (ou via `index.html`).

### Campo integrado

Quando `curr.playId` existe:
1. Busca o play em `PLAYS` por id
2. Renderiza `<FieldDiagram play={foundPlay} />` em modo compacto (height reduzida, sem `onPlayerClick`) acima do enunciado
3. Perguntas de cobertura pedem ao jogador que identifique a coverage pelo campo

### Animações CSS (adicionar em index.html)

```css
@keyframes floatUp {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-40px); }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-6px); }
  40%,80% { transform: translateX(6px); }
}
```

---

## File Map

| Arquivo | Ação |
|---|---|
| `src/data/quiz.js` | Adicionar QUIZ_COVERAGE, QUIZ_SITUATIONS, expandir QUIZ_DEFENSE |
| `src/components/QuizTab/useQuizProgress.js` | Criar — hook de localStorage |
| `src/components/QuizTab/index.jsx` | Refatorar — categoria selector, stats panel, animações, campo inline |
| `index.html` | Adicionar keyframes floatUp e shake |

---

## Out of Scope

- Backend / autenticação
- Ranking online / multiplayer
- Editor de perguntas
- Sons / áudio
