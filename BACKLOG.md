# ISTEPOS Playbook — Backlog

> Atualizado: 2026-05-07. V2.1 entregue e no ar.

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
