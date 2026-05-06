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
  const [text, setText]          = useState('')
  const [activeFronts, setAF]    = useState([])
  const [activeCoverages, setAC] = useState([])

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
