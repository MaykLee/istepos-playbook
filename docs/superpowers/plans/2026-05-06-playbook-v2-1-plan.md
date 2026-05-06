# PlaybookTab v2.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar sub-navegação interna ao PlaybookTab com 3 abas: Jogadas (existente + filtro), Montar (montador de combinações livres) e Dicionário (cards de componentes).

**Architecture:** PlaybookTab/index.jsx ganha estado de sub-aba e sub-nav bar. PlayFilter produz `filteredPlays` que alimenta PlaySelector via prop. PlayBuilder usa `buildPlayers()` de formations.js para montar jogadas dinamicamente. DictionaryTab exibe cards de dictionary.js. Sem novas rotas nem dependências externas.

**Tech Stack:** React 18 hooks (useState, useMemo), Vitest 2 + @testing-library/react, inline styles + classes CSS em index.html.

---

## Contexto do codebase (leia antes de implementar)

- **Paleta:** `import { G } from '../../tokens.js'` — use sempre G.bg, G.au, G.mu, G.bl, G.gr, G.am, G.rd, G.tx, G.mu2, G.s, G.s2, G.aul, G.aub, G.mo (monospace font), G.sr (serif font)
- **buildPlayers:** `import { buildPlayers } from '../../data/formations.js'` — assinatura: `buildPlayers(front, stunt, modifier[], roles{})` → array de 11 player objects `{id, label, name, x, y, moveTo, role}`
- **PLAYS:** `import { PLAYS, PLAYS_BY_FRONT, FRONT_ORDER } from '../../data/plays.js'` — PLAYS é array de 39 jogadas, cada uma com `{id, name, front, stunt, modifier, coverage, description, players}`
- **Testes existentes:** `npm test` roda vitest 2, globals ativados, jsdom. Ver `src/data/plays.test.js` para padrão de testes.
- **CSS @media:** vai em `<style>` no `index.html` — React inline styles não suportam media queries
- **Git:** commits atômicos por task com `git add <files> && git commit -m "feat: ..."`

---

## File Structure

```
src/
  data/
    dictionary.js              ← NOVO: conteúdo dos cards do Dicionário
  components/
    PlaybookTab/
      PlayFilter.jsx           ← NOVO: filtro (texto + tags Front/Coverage)
      PlayBuilder.jsx          ← NOVO: montador de combinações livres
      DictionaryTab.jsx        ← NOVO: grid de cards por categoria
      PlaySelector.jsx         ← MODIFICAR: aceitar `plays` como prop
      ExplainPanel.jsx         ← SEM MUDANÇA (description sempre string)
      FieldDiagram.jsx         ← SEM MUDANÇA
      index.jsx                ← MODIFICAR: sub-nav + wiring
index.html                     ← MODIFICAR: adicionar .dict-grid CSS
```

---

## Task 1: dictionary.js — conteúdo dos cards

**Files:**
- Create: `src/data/dictionary.js`
- Create: `src/data/dictionary.test.js`

- [ ] **Step 1: Escrever o teste**

```js
// src/data/dictionary.test.js
import { describe, it, expect } from 'vitest'
import { DICT_FRONTS, DICT_STUNTS, DICT_BLITZES, DICT_COVERAGES } from './dictionary.js'

describe('dictionary', () => {
  const requiredFields = (arr) => {
    for (const d of arr) {
      expect(d.id, `${d.name} falta id`).toBeTruthy()
      expect(d.name, `${d.id} falta name`).toBeTruthy()
      expect(d.colorKey, `${d.id} falta colorKey`).toBeTruthy()
      expect(d.desc, `${d.id} falta desc`).toBeTruthy()
      expect(d.detail, `${d.id} falta detail`).toBeTruthy()
    }
  }

  it('DICT_FRONTS tem 5 entries com campos obrigatórios', () => {
    expect(DICT_FRONTS).toHaveLength(5)
    requiredFields(DICT_FRONTS)
  })

  it('DICT_STUNTS tem 5 entries com campos obrigatórios', () => {
    expect(DICT_STUNTS).toHaveLength(5)
    requiredFields(DICT_STUNTS)
  })

  it('DICT_BLITZES tem 9 entries com campos obrigatórios', () => {
    expect(DICT_BLITZES).toHaveLength(9)
    requiredFields(DICT_BLITZES)
  })

  it('DICT_COVERAGES tem 4 entries com campos obrigatórios', () => {
    expect(DICT_COVERAGES).toHaveLength(4)
    requiredFields(DICT_COVERAGES)
  })
})
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npm test -- src/data/dictionary.test.js
```
Expected: FAIL com "Cannot find module './dictionary.js'"

- [ ] **Step 3: Criar src/data/dictionary.js**

```js
// src/data/dictionary.js
// colorKey references G object keys from tokens.js
// Components use G[colorKey] to get the actual color

export const DICT_FRONTS = [
  {
    id: 'stack',
    name: 'Stack',
    colorKey: 'bl',
    desc: 'Linha de 4 com NT no gap A. Formação base equilibrada, eficaz contra corrida e passe curto.',
    detail: 'Dois DEs fora dos tackles, NT no centro. LBs alinhados em Stack atrás da linha defensiva.',
    positions: 'N · E · E',
  },
  {
    id: '55',
    name: '55 (Over)',
    colorKey: 'rd',
    desc: 'Linha de 4 deslocada para o lado forte (Over). Cria vantagem de gap no lado do TE.',
    detail: 'NT sai do centro, se posiciona no gap entre guard e tackle do lado forte. Desequilíbrio proposital.',
    positions: 'N · E · E · T',
  },
  {
    id: 'angle',
    name: 'Angle',
    colorKey: 'au',
    desc: 'Linha em ângulo — um DE alinhado fora do tackle, criando ângulo de ataque imprevisível.',
    detail: 'Confunde o assignment dos OLs. Eficaz contra formações com TE e contra QBs que lêem o front rapidamente.',
    positions: 'N · E · E · D/Y',
  },
  {
    id: 'lsu-prevent',
    name: 'LSU Prevent',
    colorKey: 'gr',
    desc: '5 DBs em campo. Prioridade absoluta em não ceder passes profundos.',
    detail: 'Usar com vantagem no placar e pouco tempo restante. Vulnerável contra corridas pelo centro. Exige disciplina dos DBs.',
    positions: 'N · E · E + 5 DBs',
  },
  {
    id: 'dam',
    name: 'Dam',
    colorKey: 'am',
    desc: 'Formação especial com alinhamento distinto — reservada para situações táticas específicas.',
    detail: 'Detalhes de execução a confirmar com o coordenador defensivo. Usada em contexto de jogo específico.',
    positions: 'N · E · E',
  },
]

export const DICT_STUNTS = [
  {
    id: 'pinch',
    name: 'Pinch',
    colorKey: 'au',
    desc: 'DEs fecham para dentro comprimindo os gaps A e B.',
    detail: 'Forte contra runs pelo centro. QB é forçado a escapar lateralmente. Combine com blitzes de borda.',
    positions: 'E_left · N · E_right',
  },
  {
    id: 'contain',
    name: 'Contain',
    colorKey: 'au',
    desc: 'DEs mantêm contenção da borda. QB não escapa lateralmente.',
    detail: 'Boa contra QBs corredores e opções. Sacrifica pressão interior em troca de integridade lateral.',
    positions: 'E_left · N · E_right',
  },
  {
    id: 'slash',
    name: 'Slash',
    colorKey: 'au',
    desc: 'Um DE corta diagonal pelo gap, o outro faz o movimento inverso.',
    detail: 'Cria confusão no bloqueio — difícil de identificar no pré-snap. Timing entre os DEs é crítico.',
    positions: 'E_left · N · E_right',
  },
  {
    id: 'wiz',
    name: 'Wiz',
    colorKey: 'au',
    desc: 'Redistribuição de responsabilidade de gap — DLs trocam de lado após o snap.',
    detail: 'Engana o assignment do centro e dos guards. Ambos os DEs devem fazer o movimento simultaneamente.',
    positions: 'E_left · N · E_right',
  },
  {
    id: 'axe',
    name: 'Axe',
    colorKey: 'au',
    desc: 'DEs seguram o gap com técnica de eixo. Movimento controlado e disciplinado.',
    detail: 'Mais conservador que os outros stunts. Boa base quando o blitz vai ser pesado — DL segura, LBs chegam.',
    positions: 'E_left · N · E_right',
  },
]

export const DICT_BLITZES = [
  {
    id: 'buck',
    name: 'Buck',
    colorKey: 'rd',
    desc: 'Buck (B) blitza pelo gap forte.',
    detail: 'Pressão pelo lado do TE. Bom contra runs e passes para o lado forte. Mike cobre o vazio do Buck.',
    positions: 'B',
  },
  {
    id: 'will',
    name: 'Will',
    colorKey: 'rd',
    desc: 'Will (W) blitza pelo gap fraco.',
    detail: 'Pressão pelo backside. QB precisa processar rapidamente. Mike ajusta para cobrir o lado fraco.',
    positions: 'W',
  },
  {
    id: 'mike',
    name: 'Mike',
    colorKey: 'rd',
    desc: 'Mike (M) blitza pelo gap A. Pressão central direta no QB.',
    detail: 'O blitz mais direto. Mike deve chegar antes do processamento mental do QB. Deixa o meio exposto ao run.',
    positions: 'M',
  },
  {
    id: 'fire',
    name: 'Fire',
    colorKey: 'rd',
    desc: 'Will + Buck blitzam juntos. Pressão dupla pelos gaps laterais.',
    detail: 'Deixa o Mike como único LB de cobertura. A coverage precisa ser sólida. QB tem pouco tempo.',
    positions: 'W · B',
  },
  {
    id: 'wim',
    name: 'WiM',
    colorKey: 'rd',
    desc: 'Will + Mike blitzam juntos. Pressão pelo centro e lado fraco.',
    detail: 'Cria gap no lado forte — Buck deve estar alinhado para cobrir o B gap forte. Coverage fechada.',
    positions: 'W · M',
  },
  {
    id: 'bud',
    name: 'BuD',
    colorKey: 'rd',
    desc: 'Buck + Dog blitzam. Pressão dupla pelo lado forte.',
    detail: 'Overload no lado do TE — tackle e TE não conseguem bloquear os dois. Mike cobre o interior.',
    positions: 'B · D',
  },
  {
    id: 'rod',
    name: 'RoD',
    colorKey: 'rd',
    desc: 'Rover + Dog blitzam pelo exterior. Overload nas bordas.',
    detail: 'Excelente contra spread sem TE. Vulnerável ao run interior — NT e DEs precisam fechar o gap A.',
    positions: 'R · D',
  },
  {
    id: 'dog',
    name: 'Dog',
    colorKey: 'rd',
    desc: 'Dog (D) blitza pelo exterior. Vem de ângulo surpresa.',
    detail: 'Timing é chave — Dog precisa disfarçar o blitz até o snap. Muito eficaz quando bem executado.',
    positions: 'D',
  },
  {
    id: 'blood',
    name: 'Blood',
    colorKey: 'rd',
    desc: 'Combinação especial de blitz. Confirmar com o coordenador antes de usar.',
    detail: 'Detalhe de execução e assignment a definir pela comissão técnica. Usar apenas quando treinado.',
    positions: 'a confirmar',
  },
]

export const DICT_COVERAGES = [
  {
    id: 'blue',
    name: 'Blue (Cover 2)',
    colorKey: 'bl',
    desc: 'Cover 2: dois safeties dividem o fundo em duas zonas. CBs cobrem o flat.',
    detail: 'Vulnerável ao seam route entre os safeties. Forte contra run e passes curtos. CBs não podem se abrir cedo.',
    positions: 'FS · CB · CB',
  },
  {
    id: 'green',
    name: 'Green (Cover 3)',
    colorKey: 'gr',
    desc: 'Cover 3: três zonas no fundo (CB esq + FS + CB dir). LBs cobrem o curto.',
    detail: 'Boa cobertura geral, equilibrada. Vulnerável aos flats quando CB está ocupado com o deep. Cobertura mais comum.',
    positions: 'FS · CB · CB',
  },
  {
    id: 'orange',
    name: 'Orange (Cover 4)',
    colorKey: 'am',
    desc: 'Cover 4: quatro zonas no fundo. Excelente contra passes profundos.',
    detail: 'CBs e safeties cobrem cada quarto do campo. Vulnerável a passes curtos e corrida. Muito conservadora.',
    positions: 'FS · CB · CB + S',
  },
  {
    id: 'silver',
    name: 'Silver (Cover 2 Man)',
    colorKey: 'mu2',
    desc: 'Cover 2 Man: dois safeties no fundo + marcação individual nos receptores.',
    detail: 'Exige atletas nos CBs. Forte contra rotas curtas predizíveis. Vulnerável contra atletismo e cruzamentos.',
    positions: 'FS · CB · CB',
  },
]
```

- [ ] **Step 4: Rodar o teste para confirmar que passa**

```bash
npm test -- src/data/dictionary.test.js
```
Expected: PASS — 4 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/data/dictionary.js src/data/dictionary.test.js
git commit -m "feat: dictionary.js com 23 cards de componentes defensivos"
```

---

## Task 2: PlayFilter.jsx — filtro de jogadas

**Files:**
- Create: `src/components/PlaybookTab/PlayFilter.jsx`
- Create: `src/components/PlaybookTab/PlayFilter.test.js`

- [ ] **Step 1: Escrever o teste (pure logic)**

```js
// src/components/PlaybookTab/PlayFilter.test.js
import { describe, it, expect } from 'vitest'
import { filterPlays } from './PlayFilter.jsx'
import { PLAYS } from '../../data/plays.js'

describe('filterPlays', () => {
  it('sem filtros retorna todas as jogadas', () => {
    expect(filterPlays(PLAYS, '', [], [])).toHaveLength(39)
  })

  it('filtra por texto parcial (case-insensitive)', () => {
    const result = filterPlays(PLAYS, 'stack', [], [])
    expect(result.length).toBeGreaterThan(0)
    result.forEach(p => expect(p.name.toLowerCase()).toContain('stack'))
  })

  it('filtra por front', () => {
    const result = filterPlays(PLAYS, '', ['Stack'], [])
    expect(result).toHaveLength(14)
    result.forEach(p => expect(p.front).toBe('Stack'))
  })

  it('filtra por coverage', () => {
    const result = filterPlays(PLAYS, '', [], ['Blue'])
    result.forEach(p => expect(p.coverage).toBe('Blue'))
  })

  it('combina text + front + coverage', () => {
    const result = filterPlays(PLAYS, 'Pinch', ['Stack'], ['Blue'])
    result.forEach(p => {
      expect(p.name.toLowerCase()).toContain('pinch')
      expect(p.front).toBe('Stack')
      expect(p.coverage).toBe('Blue')
    })
  })

  it('retorna array vazio quando nada bate', () => {
    expect(filterPlays(PLAYS, 'xyzxyz', [], [])).toHaveLength(0)
  })

  it('múltiplos fronts (multi-select)', () => {
    const result = filterPlays(PLAYS, '', ['Stack', '55'], [])
    expect(result.length).toBe(28) // 14 Stack + 14 de 55
    result.forEach(p => expect(['Stack', '55']).toContain(p.front))
  })
})
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npm test -- src/components/PlaybookTab/PlayFilter.test.js
```
Expected: FAIL com "Cannot find module './PlayFilter.jsx'"

- [ ] **Step 3: Criar PlayFilter.jsx**

```jsx
// src/components/PlaybookTab/PlayFilter.jsx
import { useState } from 'react'
import { G } from '../../tokens.js'
import { PLAYS } from '../../data/plays.js'

const FRONTS = ['Stack', '55', 'Angle', 'LSU Prevent', 'Dam']
const COVERAGES = ['Blue', 'Green', 'Orange', 'Silver']
const FRONT_COLORS = { Stack: G.bl, '55': G.rd, Angle: G.au, 'LSU Prevent': G.gr, Dam: G.am }
const COV_COLORS   = { Blue: G.bl, Green: G.gr, Orange: G.am, Silver: G.mu2 }

export function filterPlays(plays, text, fronts, coverages) {
  return plays
    .filter(p => !text || p.name.toLowerCase().includes(text.toLowerCase()))
    .filter(p => fronts.length === 0 || fronts.includes(p.front))
    .filter(p => coverages.length === 0 || coverages.includes(p.coverage))
}

function Tag({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `${color}22` : 'transparent',
        border: `1px solid ${active ? color : G.aul}`,
        color: active ? color : G.mu,
        fontSize: 9, fontFamily: G.mo, padding: '3px 8px',
        borderRadius: 3, cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all .15s',
      }}
    >
      {label}
    </button>
  )
}

export default function PlayFilter({ onChange }) {
  const [text, setText]             = useState('')
  const [activeFronts, setAF]       = useState([])
  const [activeCoverages, setAC]    = useState([])

  const hasFilter = text || activeFronts.length > 0 || activeCoverages.length > 0

  function apply(t, af, ac) {
    onChange(filterPlays(PLAYS, t, af, ac))
  }

  function handleText(e) {
    setText(e.target.value)
    apply(e.target.value, activeFronts, activeCoverages)
  }

  function toggleFront(f) {
    const next = activeFronts.includes(f) ? activeFronts.filter(x => x !== f) : [...activeFronts, f]
    setAF(next)
    apply(text, next, activeCoverages)
  }

  function toggleCoverage(c) {
    const next = activeCoverages.includes(c) ? activeCoverages.filter(x => x !== c) : [...activeCoverages, c]
    setAC(next)
    apply(text, activeFronts, next)
  }

  function clear() {
    setText('')
    setAF([])
    setAC([])
    onChange(PLAYS)
  }

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Text search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: G.bg, border: `1px solid ${G.aul}`,
        borderRadius: 6, padding: '7px 10px', marginBottom: 8,
      }}>
        <span style={{ color: G.mu, fontSize: 13 }}>🔍</span>
        <input
          value={text}
          onChange={handleText}
          placeholder="Buscar jogada..."
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: G.tx, fontSize: 11, fontFamily: G.mo, flex: 1,
          }}
        />
      </div>

      {/* Tag rows */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
        {FRONTS.map(f => (
          <Tag key={f} label={f} active={activeFronts.includes(f)}
            color={FRONT_COLORS[f]} onClick={() => toggleFront(f)} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {COVERAGES.map(c => (
          <Tag key={c} label={c} active={activeCoverages.includes(c)}
            color={COV_COLORS[c]} onClick={() => toggleCoverage(c)} />
        ))}
        {hasFilter && (
          <button
            onClick={clear}
            style={{
              background: 'transparent', border: `1px solid ${G.rd}40`,
              color: G.rd, fontSize: 9, fontFamily: G.mo, padding: '3px 8px',
              borderRadius: 3, cursor: 'pointer',
            }}
          >
            × limpar
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rodar o teste para confirmar que passa**

```bash
npm test -- src/components/PlaybookTab/PlayFilter.test.js
```
Expected: PASS — 7 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/components/PlaybookTab/PlayFilter.jsx src/components/PlaybookTab/PlayFilter.test.js
git commit -m "feat: PlayFilter com busca por texto e tags Front/Coverage"
```

---

## Task 3: PlaySelector.jsx — aceitar plays como prop

**Files:**
- Modify: `src/components/PlaybookTab/PlaySelector.jsx`
- Create: `src/components/PlaybookTab/PlaySelector.test.js`

- [ ] **Step 1: Escrever o teste**

```js
// src/components/PlaybookTab/PlaySelector.test.js
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlaySelector from './PlaySelector.jsx'
import { PLAYS } from '../../data/plays.js'

describe('PlaySelector', () => {
  it('renderiza jogadas agrupadas por front', () => {
    render(<PlaySelector plays={PLAYS} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText('STACK')).toBeTruthy()
    expect(screen.getByText('55')).toBeTruthy()
    expect(screen.getByText('ANGLE')).toBeTruthy()
  })

  it('mostra empty state quando plays está vazio', () => {
    render(<PlaySelector plays={[]} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText(/nenhuma jogada/i)).toBeTruthy()
  })

  it('mostra apenas fronts presentes nas plays passadas', () => {
    const stackOnly = PLAYS.filter(p => p.front === 'Stack')
    render(<PlaySelector plays={stackOnly} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText('STACK')).toBeTruthy()
    expect(screen.queryByText('55')).toBeNull()
  })

  it('chama onSelect ao clicar numa jogada', () => {
    const onSelect = vi.fn()
    render(<PlaySelector plays={PLAYS.slice(0, 3)} selectedId={null} onSelect={onSelect} />)
    screen.getAllByRole('button')[0].click()
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npm test -- src/components/PlaybookTab/PlaySelector.test.js
```
Expected: FAIL (PlaySelector importa PLAYS_BY_FRONT em vez de aceitar prop)

- [ ] **Step 3: Atualizar PlaySelector.jsx**

Substituir o conteúdo completo do arquivo:

```jsx
// src/components/PlaybookTab/PlaySelector.jsx
import { G } from '../../tokens.js'
import { FRONT_ORDER } from '../../data/plays.js'

const FRONT_COLORS = {
  Stack:         G.bl,
  '55':          G.rd,
  Angle:         G.au,
  'LSU Prevent': G.gr,
  Dam:           G.am,
}

const COV_COLORS = { Blue: G.bl, Green: G.gr, Orange: G.am, Silver: G.mu2 }

export default function PlaySelector({ plays, selectedId, onSelect }) {
  if (plays.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0', color: G.mu, fontFamily: G.mo, fontSize: 11 }}>
        Nenhuma jogada encontrada
      </div>
    )
  }

  const byFront = FRONT_ORDER.reduce((acc, f) => {
    const group = plays.filter(p => p.front === f)
    if (group.length) acc[f] = group
    return acc
  }, {})

  return (
    <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
      {FRONT_ORDER.filter(f => byFront[f]).map(front => {
        const color = FRONT_COLORS[front] || G.mu
        return (
          <div key={front} style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 9, fontFamily: G.mo, color, letterSpacing: 2,
              textTransform: 'uppercase', padding: '4px 10px',
              borderLeft: `2px solid ${color}`, marginBottom: 6,
            }}>
              {front}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {byFront[front].map(play => {
                const isSelected = play.id === selectedId
                const parts = play.name.split(' ')
                const coverage = parts[parts.length - 1]
                const covColor = COV_COLORS[coverage] || G.mu

                return (
                  <button
                    key={play.id}
                    onClick={() => onSelect(play)}
                    style={{
                      background: isSelected ? G.aub : 'none',
                      border: `1px solid ${isSelected ? G.au : 'rgba(201,162,39,0.1)'}`,
                      borderRadius: 5, padding: '7px 10px',
                      textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 11, color: isSelected ? G.tx : G.mu2, fontFamily: G.mo, flex: 1 }}>
                      {parts.slice(0, -1).join(' ')}
                    </span>
                    <span style={{
                      fontSize: 9, fontFamily: G.mo, color: covColor,
                      background: `${covColor}18`, border: `1px solid ${covColor}30`,
                      borderRadius: 3, padding: '1px 5px',
                    }}>
                      {coverage}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Rodar o teste para confirmar que passa**

```bash
npm test -- src/components/PlaybookTab/PlaySelector.test.js
```
Expected: PASS — 4 testes passando

- [ ] **Step 5: Rodar todos os testes para confirmar sem regressões**

```bash
npm test
```
Expected: todos passando

- [ ] **Step 6: Commit**

```bash
git add src/components/PlaybookTab/PlaySelector.jsx src/components/PlaybookTab/PlaySelector.test.js
git commit -m "feat: PlaySelector aceita plays como prop, mostra empty state"
```

---

## Task 4: PlayBuilder.jsx — montador de combinações livres

**Files:**
- Create: `src/components/PlaybookTab/PlayBuilder.jsx`
- Create: `src/components/PlaybookTab/PlayBuilder.test.js`

- [ ] **Step 1: Escrever o teste (pure logic — buildDynamicPlay)**

```js
// src/components/PlaybookTab/PlayBuilder.test.js
import { describe, it, expect } from 'vitest'
import { buildDynamicPlay, findCataloguedPlay } from './PlayBuilder.jsx'
import { PLAYS } from '../../data/plays.js'

describe('findCataloguedPlay', () => {
  it('encontra jogada existente pelo front/stunt/modifier/coverage', () => {
    const play = findCataloguedPlay('Stack', 'Pinch', ['Buck'], 'Blue')
    expect(play).toBeTruthy()
    expect(play.name).toBe('Stack Pinch Buck Blue')
  })

  it('retorna null para combinação não catalogada', () => {
    expect(findCataloguedPlay('Stack', 'Pinch', ['Mike'], 'Orange')).toBeNull()
  })

  it('retorna null quando modifier é vazio e não existe', () => {
    expect(findCataloguedPlay('Stack', 'Pinch', [], 'Blue')).toBeNull()
  })

  it('encontra jogada sem modifier (Angle Axe Blue)', () => {
    const play = findCataloguedPlay('Angle', 'Axe', [], 'Blue')
    expect(play).toBeTruthy()
    expect(play.name).toBe('Angle Axe Blue')
  })
})

describe('buildDynamicPlay', () => {
  it('retorna objeto com id, name, front, stunt, modifier, coverage, description, players', () => {
    const play = buildDynamicPlay('Stack', 'Pinch', [], 'Blue')
    expect(play.id).toBeTruthy()
    expect(play.name).toBe('Stack Pinch Blue')
    expect(play.front).toBe('Stack')
    expect(play.players).toHaveLength(11)
    expect(play.description).toBeTruthy()
    expect(play.catalogued).toBe(false)
  })

  it('inclui modifier no nome quando fornecido', () => {
    const play = buildDynamicPlay('Stack', 'Pinch', ['Mike'], 'Orange')
    expect(play.name).toBe('Stack Pinch Mike Orange')
  })

  it('todos os players têm x, y, moveTo, role', () => {
    const play = buildDynamicPlay('55', 'Contain', ['Buck'], 'Green')
    for (const p of play.players) {
      expect(typeof p.x).toBe('number')
      expect(typeof p.y).toBe('number')
      expect(p.moveTo).toBeTruthy()
      expect(p.role).toBeTruthy()
    }
  })
})
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npm test -- src/components/PlaybookTab/PlayBuilder.test.js
```
Expected: FAIL com "Cannot find module './PlayBuilder.jsx'"

- [ ] **Step 3: Criar PlayBuilder.jsx**

```jsx
// src/components/PlaybookTab/PlayBuilder.jsx
import { useState } from 'react'
import { G } from '../../tokens.js'
import { PLAYS } from '../../data/plays.js'
import { buildPlayers } from '../../data/formations.js'
import FieldDiagram from './FieldDiagram.jsx'
import ExplainPanel from './ExplainPanel.jsx'

const FRONTS    = ['Stack', '55', 'Angle', 'LSU Prevent', 'Dam']
const STUNTS    = ['Pinch', 'Contain', 'Slash', 'Wiz', 'Axe']
const BLITZES   = ['Nenhum', 'Buck', 'Will', 'Mike', 'Fire', 'WiM', 'BuD', 'RoD', 'Dog', 'Blood']
const COVERAGES = ['Blue', 'Green', 'Orange', 'Silver']

const STUNT_DESC_MAP = {
  Pinch: 'DEs fecham para dentro comprimindo os gaps A e B.',
  Contain: 'DEs mantêm contenção da borda. QB não escapa lateralmente.',
  Slash: 'Um DE corta diagonal pelo gap, o outro faz o movimento inverso.',
  Wiz: 'Redistribuição de responsabilidade de gap — DLs trocam de lado.',
  Axe: 'DEs seguram o gap com técnica de eixo.',
}
const MOD_DESC_MAP = {
  Buck: 'Buck blitza pelo gap forte.',
  Will: 'Will blitza pelo gap fraco.',
  Mike: 'Mike blitza pelo gap A.',
  Fire: 'Fire: Will + Buck blitzam juntos.',
  WiM: 'WiM: Will + Mike blitzam juntos.',
  BuD: 'BuD: Buck + Dog blitzam pelo lado forte.',
  RoD: 'RoD: Rover + Dog blitzam pelo exterior.',
  Dog: 'Dog blitza pelo exterior.',
  Blood: 'Blood: combinação especial — confirmar com o coordenador.',
}
const COV_DESC_MAP = {
  Blue: 'Cover 2: dois safeties dividem o fundo em duas zonas.',
  Green: 'Cover 3: três zonas no fundo.',
  Orange: 'Cover 4: quatro zonas no fundo.',
  Silver: 'Cover 2 Man: safeties no fundo + marcação individual.',
}

export function findCataloguedPlay(front, stunt, modifier, coverage) {
  return PLAYS.find(p =>
    p.front === front &&
    p.stunt === stunt &&
    JSON.stringify(p.modifier) === JSON.stringify(modifier) &&
    p.coverage === coverage
  ) || null
}

export function buildDynamicPlay(front, stunt, modifier, coverage) {
  const parts = [front, stunt, ...modifier, coverage]
  const id = parts.join('-').toLowerCase().replace(/\s+/g, '-')
  const name = parts.join(' ')
  const modDesc = modifier.map(m => MOD_DESC_MAP[m] || m).join(' ')
  const description = [STUNT_DESC_MAP[stunt], modDesc, COV_DESC_MAP[coverage]].filter(Boolean).join(' ')
  const players = buildPlayers(front, stunt, modifier, {})
  return { id, name, front, stunt, modifier, coverage, description, players, catalogued: false }
}

function SelectorSection({ label, options, selected, onSelect, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 8, color: G.mu, fontFamily: G.mo, letterSpacing: 2, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {options.map(opt => {
          const isActive = selected === opt
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                background: isActive ? G.aub : 'transparent',
                border: `1px solid ${isActive ? G.au : G.aul}`,
                color: isActive ? G.au : G.mu2,
                fontSize: 10, fontFamily: G.mo, padding: '5px 12px',
                borderRadius: 4, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function PlayBuilder() {
  const [front,    setFront]    = useState(null)
  const [stunt,    setStunt]    = useState(null)
  const [blitz,    setBlitz]    = useState('Nenhum')
  const [coverage, setCoverage] = useState(null)
  const [activePlay, setActivePlay] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const canBuild = front && stunt && coverage

  const previewName = [front, stunt, blitz !== 'Nenhum' ? blitz : null, coverage]
    .filter(Boolean).join(' ') || '—'

  function handleBuild() {
    const modifier = blitz === 'Nenhum' ? [] : [blitz]
    const existing = findCataloguedPlay(front, stunt, modifier, coverage)
    setActivePlay(existing ? { ...existing, catalogued: true } : buildDynamicPlay(front, stunt, modifier, coverage))
    setSelectedPlayer(null)
  }

  function handlePlayerClick(player) {
    setSelectedPlayer(prev => prev?.id === player.id ? null : player)
  }

  return (
    <div>
      {/* Selector sections */}
      <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.12)`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <SelectorSection label="FRONT"    options={FRONTS}    selected={front}    onSelect={f => { setFront(f); setActivePlay(null) }} />
        <SelectorSection label="STUNT"    options={STUNTS}    selected={stunt}    onSelect={s => { setStunt(s); setActivePlay(null) }} />
        <SelectorSection label="BLITZ (OPCIONAL)" options={BLITZES} selected={blitz} onSelect={b => { setBlitz(b); setActivePlay(null) }} />
        <SelectorSection label="COVERAGE" options={COVERAGES} selected={coverage} onSelect={c => { setCoverage(c); setActivePlay(null) }} />

        {/* Preview bar */}
        <div style={{
          background: G.s2, border: `1px solid ${canBuild ? G.aul : 'rgba(201,162,39,0.06)'}`,
          borderRadius: 6, padding: '10px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 8, color: G.mu, fontFamily: G.mo, letterSpacing: 1, marginBottom: 3 }}>JOGADA</div>
            <div style={{ fontSize: 13, color: canBuild ? G.au : G.mu, fontFamily: G.mo }}>{previewName}</div>
            {activePlay && (
              <div style={{ fontSize: 9, color: activePlay.catalogued ? G.gr : G.am, marginTop: 3, fontFamily: G.mo }}>
                {activePlay.catalogued ? '✓ Jogada catalogada' : '◈ Combinação livre'}
              </div>
            )}
          </div>
          <button
            onClick={handleBuild}
            disabled={!canBuild}
            style={{
              background: canBuild ? G.aub : 'transparent',
              border: `1px solid ${canBuild ? G.au : G.aul}`,
              color: canBuild ? G.au : G.mu,
              fontSize: 10, fontFamily: G.mo, padding: '8px 16px',
              borderRadius: 5, cursor: canBuild ? 'pointer' : 'default',
              transition: 'all .15s',
            }}
          >
            VER NO CAMPO →
          </button>
        </div>
      </div>

      {/* Field + explain */}
      {activePlay ? (
        <>
          <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.12)`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <FieldDiagram play={activePlay} onPlayerClick={handlePlayerClick} selectedPlayer={selectedPlayer} />
          </div>
          <ExplainPanel play={activePlay} selectedPlayer={selectedPlayer} />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px 0', color: G.mu, fontFamily: G.mo, fontSize: 11 }}>
          Selecione front, stunt e coverage para montar uma jogada
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Rodar o teste para confirmar que passa**

```bash
npm test -- src/components/PlaybookTab/PlayBuilder.test.js
```
Expected: PASS — 7 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/components/PlaybookTab/PlayBuilder.jsx src/components/PlaybookTab/PlayBuilder.test.js
git commit -m "feat: PlayBuilder com montador de combinações livres e detecção de jogadas catalogadas"
```

---

## Task 5: DictionaryTab.jsx — grid de cards

**Files:**
- Create: `src/components/PlaybookTab/DictionaryTab.jsx`
- Create: `src/components/PlaybookTab/DictionaryTab.test.js`

- [ ] **Step 1: Escrever o teste**

```js
// src/components/PlaybookTab/DictionaryTab.test.js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import DictionaryTab from './DictionaryTab.jsx'

describe('DictionaryTab', () => {
  it('renderiza a categoria FRONTS por padrão', () => {
    render(<DictionaryTab />)
    expect(screen.getByText('Stack')).toBeTruthy()
    expect(screen.getByText('Angle')).toBeTruthy()
  })

  it('tem os 4 botões de categoria', () => {
    render(<DictionaryTab />)
    expect(screen.getByText('FRONTS')).toBeTruthy()
    expect(screen.getByText('STUNTS')).toBeTruthy()
    expect(screen.getByText('BLITZES')).toBeTruthy()
    expect(screen.getByText('COVERAGES')).toBeTruthy()
  })

  it('muda para STUNTS ao clicar', async () => {
    render(<DictionaryTab />)
    await userEvent.click(screen.getByText('STUNTS'))
    expect(screen.getByText('Pinch')).toBeTruthy()
    expect(screen.getByText('Contain')).toBeTruthy()
  })

  it('muda para BLITZES ao clicar', async () => {
    render(<DictionaryTab />)
    await userEvent.click(screen.getByText('BLITZES'))
    expect(screen.getByText('Buck')).toBeTruthy()
    expect(screen.getByText('Fire')).toBeTruthy()
  })

  it('muda para COVERAGES ao clicar', async () => {
    render(<DictionaryTab />)
    await userEvent.click(screen.getByText('COVERAGES'))
    expect(screen.getByText('Blue (Cover 2)')).toBeTruthy()
    expect(screen.getByText('Green (Cover 3)')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
npm test -- src/components/PlaybookTab/DictionaryTab.test.js
```
Expected: FAIL com "Cannot find module './DictionaryTab.jsx'"

- [ ] **Step 3: Criar DictionaryTab.jsx**

```jsx
// src/components/PlaybookTab/DictionaryTab.jsx
import { useState } from 'react'
import { G } from '../../tokens.js'
import { DICT_FRONTS, DICT_STUNTS, DICT_BLITZES, DICT_COVERAGES } from '../../data/dictionary.js'

const CATEGORIES = [
  { id: 'fronts',    label: 'FRONTS',    data: DICT_FRONTS    },
  { id: 'stunts',    label: 'STUNTS',    data: DICT_STUNTS    },
  { id: 'blitzes',   label: 'BLITZES',   data: DICT_BLITZES   },
  { id: 'coverages', label: 'COVERAGES', data: DICT_COVERAGES },
]

function DictCard({ entry }) {
  const color = G[entry.colorKey] || G.mu
  return (
    <div style={{
      background: G.s2, border: `1px solid rgba(201,162,39,0.12)`,
      borderRadius: 8, padding: '14px 16px',
    }}>
      <div style={{ fontSize: 11, color, fontFamily: G.mo, letterSpacing: 1, marginBottom: 6 }}>
        {entry.name}
      </div>
      <p style={{ fontSize: 11, color: G.tx, lineHeight: 1.6, margin: '0 0 8px' }}>
        {entry.desc}
      </p>
      <div style={{ borderTop: `1px solid ${G.aul}`, paddingTop: 8 }}>
        <p style={{ fontSize: 10, color: G.mu2, lineHeight: 1.6, margin: '0 0 4px' }}>
          {entry.detail}
        </p>
        {entry.positions && (
          <span style={{ fontSize: 9, color: G.mu, fontFamily: G.mo }}>{entry.positions}</span>
        )}
      </div>
    </div>
  )
}

export default function DictionaryTab() {
  const [activeCat, setActiveCat] = useState('fronts')
  const current = CATEGORIES.find(c => c.id === activeCat)

  return (
    <div>
      {/* Category sub-tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => {
          const isActive = cat.id === activeCat
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              style={{
                background: isActive ? G.aub : 'transparent',
                border: `1px solid ${isActive ? G.au : G.aul}`,
                color: isActive ? G.au : G.mu,
                fontSize: 9, fontFamily: G.mo, letterSpacing: 1,
                padding: '5px 12px', borderRadius: 4, cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Cards grid */}
      <div className="dict-grid">
        {current.data.map(entry => (
          <DictCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rodar o teste para confirmar que passa**

```bash
npm test -- src/components/PlaybookTab/DictionaryTab.test.js
```
Expected: PASS — 5 testes passando

- [ ] **Step 5: Commit**

```bash
git add src/components/PlaybookTab/DictionaryTab.jsx src/components/PlaybookTab/DictionaryTab.test.js
git commit -m "feat: DictionaryTab com cards de componentes por categoria"
```

---

## Task 6: PlaybookTab index.jsx — wiring + CSS

**Files:**
- Modify: `src/components/PlaybookTab/index.jsx`
- Modify: `index.html`

- [ ] **Step 1: Adicionar CSS do grid do dicionário em index.html**

Abrir `index.html` e substituir o bloco `<style>` existente por:

```html
<style>
  .playbook-grid {
    display: grid;
    grid-template-columns: minmax(180px, 240px) 1fr;
    gap: 16px;
  }
  .dict-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 700px) {
    .playbook-grid {
      grid-template-columns: 1fr;
    }
    .dict-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Atualizar PlaybookTab/index.jsx**

Substituir o conteúdo completo do arquivo:

```jsx
// src/components/PlaybookTab/index.jsx
import { useState } from 'react'
import { G } from '../../tokens.js'
import PlaySelector from './PlaySelector.jsx'
import PlayFilter from './PlayFilter.jsx'
import FieldDiagram from './FieldDiagram.jsx'
import ExplainPanel from './ExplainPanel.jsx'
import PlayBuilder from './PlayBuilder.jsx'
import DictionaryTab from './DictionaryTab.jsx'
import { PLAYS } from '../../data/plays.js'

const SUB_TABS = [
  { id: 'jogadas',   label: 'Jogadas'    },
  { id: 'montar',    label: 'Montar'     },
  { id: 'dicionario',label: 'Dicionário' },
]

export default function PlaybookTab() {
  const [subTab, setSubTab]           = useState('jogadas')
  const [filteredPlays, setFiltered]  = useState(PLAYS)
  const [selectedPlay, setPlay]       = useState(PLAYS[0])
  const [selectedPlayer, setPlayer]   = useState(null)

  function handleSelectPlay(play) {
    setPlay(play)
    setPlayer(null)
  }

  function handlePlayerClick(player) {
    setPlayer(prev => prev?.id === player.id ? null : player)
  }

  return (
    <div>
      {/* Sub-navigation */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 16,
        borderBottom: `1px solid ${G.aul}`, paddingBottom: 0,
      }}>
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              background: 'none', border: 'none',
              borderBottom: `2px solid ${subTab === t.id ? G.au : 'transparent'}`,
              color: subTab === t.id ? G.au : G.mu,
              padding: '8px 14px', cursor: 'pointer',
              fontSize: 11, fontFamily: G.mo, letterSpacing: 1,
              transition: 'color .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* JOGADAS */}
      {subTab === 'jogadas' && (
        <div className="playbook-grid">
          <div style={{
            background: G.s, border: `1px solid rgba(201,162,39,0.12)`,
            borderRadius: 10, padding: 12, maxHeight: 640, overflowY: 'auto',
          }}>
            <div style={{ fontSize: 9, color: G.mu, fontFamily: G.mo, letterSpacing: 2, marginBottom: 10 }}>
              JOGADAS
            </div>
            <PlayFilter onChange={setFiltered} />
            <PlaySelector
              plays={filteredPlays}
              selectedId={selectedPlay?.id}
              onSelect={handleSelectPlay}
            />
          </div>

          <div>
            <div style={{
              background: G.s, border: `1px solid rgba(201,162,39,0.12)`,
              borderRadius: 10, padding: 16, marginBottom: 12,
            }}>
              <FieldDiagram
                play={selectedPlay}
                onPlayerClick={handlePlayerClick}
                selectedPlayer={selectedPlayer}
              />
            </div>
            <ExplainPanel play={selectedPlay} selectedPlayer={selectedPlayer} />
          </div>
        </div>
      )}

      {/* MONTAR */}
      {subTab === 'montar' && <PlayBuilder />}

      {/* DICIONÁRIO */}
      {subTab === 'dicionario' && <DictionaryTab />}
    </div>
  )
}
```

- [ ] **Step 3: Rodar todos os testes**

```bash
npm test
```
Expected: todos passando (nenhuma regressão)

- [ ] **Step 4: Build de produção**

```bash
npm run build
```
Expected: ✓ built in ~3s, zero erros

- [ ] **Step 5: Testar manualmente no dev server**

```bash
npm run dev
```

Abrir http://localhost:5173 e verificar:
- Sub-tabs aparecem: Jogadas | Montar | Dicionário
- **Jogadas:** busca por texto filtra jogadas em tempo real; tags Front (Stack/55/Angle/LSU/Dam) filtram; tags Coverage filtram; filtros combinam; botão "× limpar" aparece e limpa tudo
- **Montar:** botões de Front/Stunt/Blitz/Coverage funcionam; preview do nome atualiza; "VER NO CAMPO" habilita quando Front+Stunt+Coverage estão selecionados; jogada catalogada mostra "✓ Jogada catalogada"; combinação não catalogada mostra "◈ Combinação livre"; FieldDiagram e ExplainPanel funcionam igual à aba Jogadas
- **Dicionário:** 4 sub-categorias navegam corretamente; cards mostram nome, desc, detail, positions; grid 2 colunas no desktop

- [ ] **Step 6: Commit**

```bash
git add src/components/PlaybookTab/index.jsx index.html
git commit -m "feat: PlaybookTab v2.1 — sub-nav Jogadas/Montar/Dicionário completo"
```

---

## Self-Review do Plano

**Spec coverage:**
- ✅ Sub-navegação (Jogadas | Montar | Dicionário) — Task 6
- ✅ Filtro por texto + Front + Coverage tags + limpar — Task 2 + Task 6
- ✅ PlaySelector aceita plays filtradas — Task 3
- ✅ Montador de combinações livres — Task 4
- ✅ buildPlayers() para combinações não catalogadas — Task 4 (buildDynamicPlay)
- ✅ Badge catalogada vs livre — Task 4
- ✅ Cards por categoria (Fronts/Stunts/Blitzes/Coverages) — Tasks 1 + 5
- ✅ Grid 2 colunas desktop / 1 coluna mobile — Task 5 + Task 6 (CSS)

**Placeholder scan:** nenhum TBD/TODO — todo código está completo.

**Type consistency:**
- `filterPlays(plays, text, fronts, coverages)` — usada em PlayFilter.jsx e testada em PlayFilter.test.js ✓
- `findCataloguedPlay(front, stunt, modifier, coverage)` — exportada e testada ✓
- `buildDynamicPlay(front, stunt, modifier, coverage)` — exportada e testada ✓
- `onChange(filteredPlays)` — PlayFilter passa array de plays para index.jsx via setFiltered ✓
- `plays` prop — PlaySelector recebe array, agrupa internamente ✓
