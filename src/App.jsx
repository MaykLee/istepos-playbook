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

      {/* ── HEADER ── */}
      <div style={{
        background: `linear-gradient(90deg, #1a0408 0%, #0e0e12 60%)`,
        borderBottom: `3px solid ${G.cr}`,
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <img src="/istepos-logo.png" alt="ISTEPOS" style={{ width: 44, height: 44, objectFit: 'contain' }} />
        <div>
          <div style={{ fontFamily: G.mo, fontSize: 20, color: G.wh, letterSpacing: 3, lineHeight: 1 }}>ISTEPOS</div>
          <div style={{ fontFamily: G.mo, fontSize: 9, color: G.cr, letterSpacing: 2, marginTop: 3 }}>DEFENSIVE PLAYBOOK · 2026</div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', borderBottom: `1px solid rgba(196,18,48,0.2)`, padding: '0 20px', overflowX: 'auto', background: '#100608' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: `3px solid ${tab === t.id ? G.cr : 'transparent'}`,
              color: tab === t.id ? G.wh : G.mu,
              padding: '12px 18px',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: G.mo,
              whiteSpace: 'nowrap',
              transition: 'color .2s, border-color .2s',
              letterSpacing: 1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20, maxWidth: 960, margin: '0 auto' }}>
        {tab === 'pos'      && <PositionsTab />}
        {tab === 'glos'     && <GlossaryTab />}
        {tab === 'quiz'     && <QuizTab />}
        {tab === 'playbook' && <PlaybookTab />}
      </div>
    </div>
  )
}
