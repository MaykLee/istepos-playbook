# Roadmap: ISTEPOS Playbook

## Milestones

- ✅ **v2.0 MVP Refactor** - Fases 1-2 (shipped 2026-05-06)
- ✅ **v2.2 Quiz v2** - Fases 3-4 (shipped 2026-05-07)
- 🚧 **v2.3 Quiz por Jogada** - Em progresso

## Phases

<details>
<summary>✅ v2.0/v2.1 - Refactor + PlaybookTab (SHIPPED 2026-05-06)</summary>

### Phase 1: PlaybookTab Refactor
**Goal**: Refatorar PlaybookTab com 3 sub-abas (Jogadas, Montar, Dicionário)
**Plans**: Delivered

Plans:
- [x] 01-01: PlayFilter, PlaySelector, PlayBuilder, DictionaryTab
- [x] 01-02: GlossaryText component, STUNT_MOVES fix

### Phase 2: Data & Glossary Foundation
**Goal**: formations.js, plays.js, glossary.js, dictionary.js estruturados
**Plans**: Delivered

Plans:
- [x] 02-01: buildPlayers(), GLOSSARY_MAP, DICT_* data

</details>

<details>
<summary>✅ v2.2 - Quiz v2 (SHIPPED 2026-05-07)</summary>

### Phase 3: Quiz v2 - Categorias e Progresso
**Goal**: QUIZ_DEFENSE (15q), QUIZ_COVERAGE (8q+FieldDiagram), QUIZ_SITUATIONS (8q), progresso localStorage
**Plans**: Delivered

Plans:
- [x] 03-01: Quiz categories + home seletor
- [x] 03-02: useQuizProgress hook + feedback animado (XP, flash, shake)

### Phase 4: Quiz v2 - Testes
**Goal**: 57 testes passando, build limpo
**Plans**: Delivered

Plans:
- [x] 04-01: vitest suite completa

</details>

### 🚧 v2.3 Quiz por Jogada (Em Progresso)

**Milestone Goal:** Nova categoria de quiz onde o jogador seleciona uma jogada do playbook e responde perguntas geradas dinamicamente a partir dos dados da jogada.

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. PlaybookTab Refactor | v2.1 | 2/2 | Complete | 2026-05-06 |
| 2. Data Foundation | v2.1 | 1/1 | Complete | 2026-05-06 |
| 3. Quiz v2 Categorias | v2.2 | 2/2 | Complete | 2026-05-07 |
| 4. Quiz v2 Testes | v2.2 | 1/1 | Complete | 2026-05-07 |
| 5. Quiz por Jogada | v2.3 | 0/? | Not started | - |

### Phase 5: Quiz por Jogada
**Goal:** [To be planned]
**Requirements**: TBD
**Depends on**: Phase 4
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 5 to break down)
