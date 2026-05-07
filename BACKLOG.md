# ISTEPOS Playbook — Backlog

> Atualizado: 2026-05-07. Quiz v2 entregue e no ar.

---

## ✅ Entregue — Quiz v2 (sessão 2026-05-07)

- QUIZ_DEFENSE expandido para 15 perguntas
- QUIZ_COVERAGE (8 perguntas com FieldDiagram integrado)
- QUIZ_SITUATIONS (8 perguntas de down & distance / relógio)
- Tela inicial com seletor de categoria (Defesa / Coberturas / Situações / Todas)
- Progresso persistente via localStorage (XP, histórico, % de acerto por categoria)
- Feedback animado: flash verde/vermelho, shake no erro, "+1 XP" flutuante
- 57 testes passando

---

## PRÓXIMA — Quiz por Jogada (geração dinâmica de perguntas)

> Ideia: o jogador seleciona qualquer jogada do playbook e responde perguntas geradas automaticamente sobre ela.

### Conceito

Nova categoria no seletor de quiz: **"Por Jogada"**.
- Passo 1: seletor de jogada (similar ao PlaySelector existente, agrupado por frente)
- Passo 2: 4–5 perguntas geradas dinamicamente a partir dos dados da jogada
- Passo 3: resultado com acerto + explicações

### Perguntas geradas automaticamente (sem escrever manualmente)

A partir de `PLAYS[i]` já temos tudo:

| Campo | Pergunta gerada |
|---|---|
| `play.coverage` | "Qual é a cobertura desta jogada?" (4 opções: Cover 2 / Cover 3 / Cover 4 / Man) |
| `play.stunt` | "Que stunt os DLs executam?" (4 opções aleatórias do STUNT_DESC) |
| `play.modifier` | "Há blitz nessa jogada?" / "Quem blitza?" (baseado no modifier) |
| `play.front` | "Qual é a frente defensiva?" (Stack / 55 / Angle / etc.) |
| `play.players[N].role` | "O que o Nose Tackle faz nessa jogada?" (role do jogador N) |

### Arquivos a tocar
- `src/data/quiz.js` — função `generatePlayQuiz(play)` que retorna array de perguntas
- `src/components/QuizTab/index.jsx` — nova tela de seleção de jogada + integração com generatePlayQuiz

### Decisão de design pendente
- Mostrar FieldDiagram enquanto o jogador responde as perguntas da jogada? (provavelmente sim)
- Quantas perguntas por jogada? (sugestão: 4, cobrindo coverage + stunt + modifier + front)

---

## ✅ Entregue — V2.1 (sessão 2026-05-06/07)

### PlaybookTab refatorado com 3 sub-abas
- **Jogadas**: PlayFilter (busca texto + tags front/coverage) + PlaySelector (agrupado por front)
- **Montar**: PlayBuilder com seletor de Front/Stunt/Blitz/Coverage, descrição inline ao selecionar, preview com FieldDiagram + ExplainPanel
- **Dicionário**: DictionaryTab com 4 categorias (Fronts/Stunts/Blitzes/Coverages), cards completos

### Correções e melhorias
- STUNT_MOVES corrigido: DLs agora atacam em direção à LOS (y=182)
- GlossaryText component: termos técnicos sublinhados e clicáveis com popup em todo o app
- glossary.js: array original do GlossaryTab + GLOSSARY_MAP para tooltips (chaves em UPPERCASE)
- 39 testes passando, build limpo ~196 kB

---

## PRÓXIMA SESSÃO — Quiz v2 (SPEC PRONTA)

> Spec: docs/superpowers/specs/2026-05-06-quiz-v2-design.md
> Próximo passo: invocar writing-plans para criar plano de implementação.

### A) Novas categorias de perguntas
- QUIZ_DEFENSE: expandir de 10 para ~15 perguntas
- QUIZ_COVERAGE (novo): 8 perguntas de identificação de cobertura; suporte a playId para mostrar FieldDiagram
- QUIZ_SITUATIONS (novo): 8 perguntas de down & distance, relógio, placar
- Tela inicial com seletor de categoria

### B) Visual / UX
- Flash verde/vermelho ao responder + "+X XP" flutuando no acerto
- Shake no botão errado
- FieldDiagram integrado em perguntas com playId
- Keyframes CSS: floatUp e shake (em index.html)

### C) Progresso persistente (localStorage)
- Hook useQuizProgress.js: XP + histórico + % de acerto por categoria
- Painel de stats na tela inicial do Quiz
- Botão de reset com confirmação

### Arquivos a tocar:
- src/data/quiz.js — expandir + novas categorias
- src/components/QuizTab/useQuizProgress.js — criar
- src/components/QuizTab/index.jsx — refatorar
- index.html — keyframes floatUp e shake

---

## Médio prazo

- Design: espaçamentos, mobile, animações de entrada nos cards
- Clarificar Blood e Axe com comissão técnica

---

## Someday / talvez

- Jogadas ofensivas (nova aba ou nova app)
- Cover 1 como coverage adicional
- Modo estudo: flashcards (nome → diagrama, diagrama → nome)
- Exportar jogada como imagem PNG

---

## Decisões técnicas

- Node 18 (WSL) → vitest 2 + jsdom 24 (vitest 4 incompatível)
- CSS @media e keyframes via index.html (React inline styles não suportam)
- buildPlayers() computa jogadas dinamicamente
- Push WSL: rodar "git push origin master" no PowerShell sem &&
- GlossaryText: chaves do GLOSSARY_MAP em UPPERCASE (lookup usa toUpperCase())
- Blood e Axe: "a confirmar" com comissão técnica
