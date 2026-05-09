# ISTEPOS Playbook — Backlog

> Atualizado: 2026-05-08. Design v2 + Posições completo (Defesa + Ataque) entregue.

---

## ✅ Entregue — Posições bidirecional + Playbook header + Glossário busca (sessão 2026-05-08 cont.)

### Posições
- Diagrama ofensivo (Shotgun): QB recuado, RB, WR_L/WR_R, TE, OL completo
- Interação bidirecional: clicar card ↔ token no campo (ambos funcionam)
- Tokens clicáveis com cursor pointer; anel/destaque ao selecionar

### Glossário
- Busca ao vivo por siglas (GLOSSARY_MAP): digitar "TE", "QB", "LOS" retorna resultado imediato
- Cards de sigla aparecem antes dos termos completos na busca

### Playbook
- Header ISTEPOS com gradiente dourado (G.au), logo, sub-tabs com ícones

---

## ✅ Entregue — Design v2 + Quiz melhorado (sessão 2026-05-08)

### Quiz
- GlossaryText integrado nas explicações do quiz (termos clicáveis inline)
- Contexto do erro: quando erra, mostra o que a opção escolhida significa (✗ VOCÊ ESCOLHEU + explicação)
- generatePlayQuiz: `optExps` gerados automaticamente para todas as 4 perguntas (frente, stunt, blitz, cobertura)

### FieldDiagram — setas
- Setas saem de fora do círculo do token (offset 16px no centro de origem)
- Fundo sólido `rgba(10,10,14,0.92)` atrás de cada token — label nunca fica tapada pela seta

### Glossário redesenhado
- Header ISTEPOS com gradiente vermelho do clube
- Filtros de categoria no estilo quiz home (cards verticais coloridos com ícones)
- Cards com termo em destaque (19px serif), badge de categoria, definição clara
- Agrupamento por seção quando "Todos" (sem busca ativa)

### Posições
- Diagrama de campo defensivo (Stack base) no topo da aba Defesa
- Ao clicar uma posição, o token correspondente fica destacado no campo com anel animado
- Cabeçalho dinâmico: vermelho para Defesa, azul para Ataque

### Testes
- 3 testes corrigidos (textos toUpperCase, XP separado em dois elementos)
- 57 testes passando

---

## ✅ Entregue — Quiz v2 (sessão 2026-05-07)

- QUIZ_DEFENSE: 15 perguntas
- QUIZ_COVERAGE: 8 perguntas com FieldDiagram integrado
- QUIZ_SITUATIONS: 8 perguntas de down & distance
- Tela home com seletor de categoria + Quiz por Jogada
- Progresso persistente localStorage: XP, histórico, % por categoria
- Feedback animado: flash verde/vermelho, shake no erro, "+1 XP" flutuante

---

## PRÓXIMAS

### Design — médio prazo
- Mobile: revisar espaçamentos, tamanhos de fonte no mobile
- Animações de entrada nos cards (fade-in por lista)
- Glossário: GlossaryText nas definições dos cards (termos dentro da def clicáveis)

### Posições
- ~~Diagrama ofensivo~~ ✅ entregue
- ~~Animação de destaque~~ ✅ entregue

### Quiz
- Estatísticas de acerto por jogada no "Quiz por Jogada"
- Modo Revisar: listar todas as perguntas que errou

---

## Someday / talvez

- Jogadas ofensivas (nova aba ou nova app)
- Cover 1 como coverage adicional
- Modo estudo: flashcards (nome → diagrama, diagrama → nome)
- Exportar jogada como imagem PNG
- Blood e Axe: confirmar com comissão técnica

---

## Decisões técnicas

- Node 18 (WSL) → vitest 2 + jsdom 24
- CSS @media e keyframes via index.html
- Push WSL: `git push origin master` no PowerShell sem &&
- localStorage key quiz: `istepos_quiz_progress`
- Cores do clube: `G.cr = '#c41230'` (vermelho), `G.wh = '#f0ece4'` (branco)
- DEF_TOKENS em PositionsTab usa BASES.Stack diretamente
