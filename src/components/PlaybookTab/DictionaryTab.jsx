import { useState } from 'react'
import { G } from '../../tokens.js'
import { DICT_FRONTS, DICT_STUNTS, DICT_BLITZES, DICT_COVERAGES } from '../../data/dictionary.js'

const CATEGORIES = [
  { id: 'fronts',    label: 'FRONTS',    data: DICT_FRONTS    },
  { id: 'stunts',    label: 'STUNTS',    data: DICT_STUNTS    },
  { id: 'blitzes',   label: 'BLITZES',   data: DICT_BLITZES   },
  { id: 'coverages', label: 'COVERAGES', data: DICT_COVERAGES },
]

function DictCard({ entry, isSelected, onClick }) {
  const color = G[entry.colorKey] || G.mu
  return (
    <div onClick={onClick} style={{
      background: isSelected ? G.aub : G.s2,
      border: `1px solid ${isSelected ? G.au : 'rgba(201,162,39,0.12)'}`,
      borderRadius: 8, padding: '12px 16px', cursor: 'pointer',
      transition: 'all .15s',
    }}>
      <div style={{ fontSize: 11, color, fontFamily: G.mo, letterSpacing: 1 }}>{entry.name}</div>
    </div>
  )
}

function DictDetail({ entry, onClose }) {
  const color = G[entry.colorKey] || G.mu
  return (
    <div style={{ background: G.s2, border: `1px solid ${G.au}55`, borderRadius: 8, padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 12, color, fontFamily: G.mo, letterSpacing: 1 }}>{entry.name}</div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: G.mu,
          cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 0 0 10px',
        }}>×</button>
      </div>
      <p style={{ fontSize: 11, color: G.tx, lineHeight: 1.6, margin: '0 0 10px' }}>{entry.desc}</p>
      <div style={{ borderTop: `1px solid ${G.aul}`, paddingTop: 10 }}>
        <p style={{ fontSize: 10, color: G.mu2, lineHeight: 1.6, margin: '0 0 6px' }}>{entry.detail}</p>
        {entry.positions && <span style={{ fontSize: 9, color: G.mu, fontFamily: G.mo }}>{entry.positions}</span>}
      </div>
    </div>
  )
}

export default function DictionaryTab() {
  const [activeCat, setActiveCat] = useState('fronts')
  const [selected, setSelected] = useState(null)
  const current = CATEGORIES.find(c => c.id === activeCat)

  function handleSelect(entry) {
    setSelected(prev => prev?.id === entry.id ? null : entry)
  }

  function handleCatChange(id) {
    setActiveCat(id)
    setSelected(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => {
          const isActive = cat.id === activeCat
          return (
            <button key={cat.id} onClick={() => handleCatChange(cat.id)} style={{
              background: isActive ? G.aub : 'transparent',
              border: `1px solid ${isActive ? G.au : G.aul}`,
              color: isActive ? G.au : G.mu,
              fontSize: 9, fontFamily: G.mo, letterSpacing: 1,
              padding: '5px 12px', borderRadius: 4, cursor: 'pointer', transition: 'all .15s',
            }}>{cat.label}</button>
          )
        })}
      </div>

      <div className="dict-grid">
        {current.data.map(entry => (
          <DictCard
            key={entry.id}
            entry={entry}
            isSelected={selected?.id === entry.id}
            onClick={() => handleSelect(entry)}
          />
        ))}
      </div>

      {/* Desktop: detail panel below grid */}
      {selected && (
        <div className="dict-detail-desktop" style={{ marginTop: 12 }}>
          <DictDetail entry={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {/* Mobile: bottom sheet overlay */}
      {selected && (
        <div
          className="dict-mobile-overlay"
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            zIndex: 1000, alignItems: 'flex-end',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: G.s, borderRadius: '12px 12px 0 0',
            padding: '20px', maxHeight: '75vh', overflowY: 'auto',
          }}>
            <DictDetail entry={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
