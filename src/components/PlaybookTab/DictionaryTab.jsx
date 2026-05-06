import { useState } from 'react'
import { G } from '../../tokens.js'
import { DICT_FRONTS, DICT_STUNTS, DICT_BLITZES, DICT_COVERAGES } from '../../data/dictionary.js'
import GlossaryText from '../GlossaryText.jsx'

const CATEGORIES = [
  { id: 'fronts',    label: 'FRONTS',    data: DICT_FRONTS    },
  { id: 'stunts',    label: 'STUNTS',    data: DICT_STUNTS    },
  { id: 'blitzes',   label: 'BLITZES',   data: DICT_BLITZES   },
  { id: 'coverages', label: 'COVERAGES', data: DICT_COVERAGES },
]

function DictCard({ entry }) {
  const color = G[entry.colorKey] || G.mu
  return (
    <div style={{ background: G.s2, border: `1px solid rgba(201,162,39,0.12)`, borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color, fontFamily: G.mo, letterSpacing: 1, marginBottom: 6 }}>{entry.name}</div>
      <GlossaryText as="p" style={{ fontSize: 11, color: G.tx, lineHeight: 1.6, margin: '0 0 8px' }}>
        {entry.desc}
      </GlossaryText>
      <div style={{ borderTop: `1px solid ${G.aul}`, paddingTop: 8 }}>
        <GlossaryText as="p" style={{ fontSize: 10, color: G.mu2, lineHeight: 1.6, margin: '0 0 4px' }}>
          {entry.detail}
        </GlossaryText>
        {entry.positions && <span style={{ fontSize: 9, color: G.mu, fontFamily: G.mo }}>{entry.positions}</span>}
      </div>
    </div>
  )
}

export default function DictionaryTab() {
  const [activeCat, setActiveCat] = useState('fronts')
  const current = CATEGORIES.find(c => c.id === activeCat)

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => {
          const isActive = cat.id === activeCat
          return (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
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
        {current.data.map(entry => <DictCard key={entry.id} entry={entry} />)}
      </div>
    </div>
  )
}
