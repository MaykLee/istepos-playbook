import { useState } from 'react'
import { G } from './tokens.js'
import PositionsTab from './components/PositionsTab/index.jsx'
import GlossaryTab  from './components/GlossaryTab/index.jsx'
import QuizTab      from './components/QuizTab/index.jsx'
import PlaybookTab  from './components/PlaybookTab/index.jsx'

const TABS = [
  { id: 'pos',      label: '⚔ Posições'  },
  { id: 'glos',     label: '📖 Glossário' },
  { id: 'quiz',     label: '🎯 Quiz'      },
  { id: 'playbook', label: '📋 Playbook'  },
]

export default function App() {
  const [tab, setTab] = useState('playbook')

  return (
    <div style={{ background: G.bg, minHeight: '100vh', color: G.tx, fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ borderBottom: `1px solid ${G.aul}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontFamily: G.sr, fontSize: 18, color: G.au, letterSpacing: 2 }}>ISTEPOS</div>
        <div style={{ width: 1, height: 14, background: G.aul }} />
        <div style={{ fontSize: 10, color: G.mu, fontFamily: G.mo, letterSpacing: 1 }}>DEFENSIVE PLAYBOOK — 2026</div>
      </div>

      <div style={{ display: 'flex', borderBottom: `1px solid ${G.aul}`, padding: '0 20px', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === t.id ? G.au : 'transparent'}`,
              color: tab === t.id ? G.au : G.mu,
              padding: '11px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: G.mo,
              whiteSpace: 'nowrap',
              transition: 'color .2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
        {tab === 'pos'      && <PositionsTab />}
        {tab === 'glos'     && <GlossaryTab />}
        {tab === 'quiz'     && <QuizTab />}
        {tab === 'playbook' && <PlaybookTab />}
      </div>
    </div>
  )
}
