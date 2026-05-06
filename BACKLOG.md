# ISTEPOS Playbook — Backlog

> Atualizado: 2026-05-06. V2.0 entregue e no ar.

---

## Próxima sessão (prioridade alta)

### 1. Busca e filtro no Playbook
- Lupa no topo do PlaySelector para filtrar por texto livre
- Tags clicáveis: por front (Stack / 55 / Angle / LSU / Dam), por stunt (Pinch / Contain / Slash / Wiz), por coverage (Blue / Green / Orange / Silver)
- Filtros combináveis — ex: Stack + Blue mostra só as jogadas Stack com Cover 2
- Estado de filtro resetável com um "×"

### 2. Montador de Jogadas
- Interface no próprio PlaybookTab (aproveitar espaço vazio)
- Cada componente do nome vira botão selecionável:
  - Front: Stack | 55 | Angle | LSU Prevent | Dam
  - Stunt: Pinch | Contain | Slash | Wiz | Axe
  - Blitz: Buck | Will | Mike | Fire | WiM | BuD | RoD | Dog | Blood | (nenhum)
  - Coverage: Blue | Green | Orange | Silver
- Se a combinação existir nas 39 jogadas pré-montadas → abre ela no diagrama
- Se não existir → monta dinamicamente com buildPlayers() + aviso "jogada não catalogada"
- Importante: o playbook do PDF não tem todas as combinações possíveis — o montador cobre o gap

### 3. Cards de Componentes (dicionário visual)
- Um card para cada "palavra" do sistema de chamadas
- Cabe na mesma página do Playbook (seção abaixo do diagrama ou accordion lateral)
- Conteúdo por card:
  - **Fronts:** Stack, 55 (Over), Angle, LSU Prevent, Dam — alinhamento de linha
  - **Stunts:** Pinch, Contain, Slash, Wiz, Axe — movimento dos DLs
  - **Blitzes:** Buck, Will, Mike, Fire, WiM, BuD, RoD, Dog, Blood — quem blitza e por onde
  - **Coverages:** Blue (C2), Green (C3), Orange (C4), Silver (C2 Man) — responsabilidades dos DBs
- Objetivo: jogador entende o "porquê" da jogada ao montar, não só o "o quê"

---

## Médio prazo

### 4. Quiz evoluído
- Quiz de Defesa: expandir de 10 para 20+ perguntas
- Quiz de Ataque: precisa de conteúdo do usuário (formações/rotas ofensivas) — a definir
- Quiz Situacional: 3ª distância longa / red zone / 2 min drill — a definir
- Seletor de tipo de quiz na aba

### 5. Design
- Revisão geral de espaçamentos e tipografia
- Melhorar mobile: PlaySelector muito compacto em telas pequenas
- Animação de entrada nos cards (fade in suave)
- Tema alternativo (mais claro) — a avaliar

---

## Someday / talvez

- Jogas ofensivas (nova aba ou nova app)
- Cover 1 como coverage adicional
- Clarificar Blood e Axe (significado ainda a confirmar com comissão)
- Modo estudo: flashcards das jogadas (nome → diagrama, diagrama → nome)
- Exportar jogada como imagem PNG para compartilhar no grupo

---

## Decisões técnicas registradas

- Node 18 (WSL) → vitest 2 + jsdom 24 (vitest 4 incompatível)
- CSS @media via `<style>` em index.html (inline styles React não suportam @media)
- buildPlayers() computa as 39 jogadas — não copy-paste de coordenadas
- Animação SNAP via CSS transition em cx/cy do SVG (sem lib de animação)
- Blood e Axe: modifiers marcados como "a confirmar" nos dados
