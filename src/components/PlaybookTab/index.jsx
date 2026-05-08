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
  { id: 'jogadas',    label: 'Jogadas',    icon: '📋' },
  { id: 'montar',     label: 'Montar',     icon: '🔧' },
  { id: 'dicionario', label: 'Dicionário', icon: '📖' },
]

export default function PlaybookTab() {
  const [subTab, setSubTab]          = useState('jogadas')
  const [filteredPlays, setFiltered] = useState(PLAYS)
  const [selectedPlay, setPlay]      = useState(PLAYS[0])
  const [selectedPlayer, setPlayer]  = useState(null)

  function handleSelectPlay(play) { setPlay(play); setPlayer(null) }
  function handlePlayerClick(player) { setPlayer(prev => prev?.id === player.id ? null : player) }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 24 }}>

      {/* Header ISTEPOS */}
      <div style={{
        background: `linear-gradient(135deg, #120a02 0%, #0e0e12 60%)`,
        borderBottom: `2px solid ${G.au}`,
        padding: '18px 24px',
        marginBottom: 0,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <img src="/istepos-logo.png" alt="ISTEPOS" style={{ width: 44, height: 44, objectFit: 'contain' }} />
        <div>
          <div style={{ fontFamily: G.mo, fontSize: 15, color: G.au, letterSpacing: 2 }}>PLAYBOOK</div>
          <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, marginTop: 3 }}>{PLAYS.length} jogadas defensivas · 2026</div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: `1px solid rgba(201,162,39,0.2)`,
        background: '#0c0c10',
      }}>
        {SUB_TABS.map(t => {
          const isActive = subTab === t.id
          return (
            <button key={t.id} onClick={() => setSubTab(t.id)} style={{
              background: isActive ? `${G.au}12` : 'transparent',
              border: 'none',
              borderBottom: `3px solid ${isActive ? G.au : 'transparent'}`,
              borderRight: `1px solid rgba(255,255,255,0.04)`,
              color: isActive ? G.au : G.mu,
              padding: '12px 20px',
              cursor: 'pointer', fontSize: 12, fontFamily: G.mo, letterSpacing: 1,
              transition: 'all .15s',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              {t.label.toUpperCase()}
            </button>
          )
        })}
      </div>

      <div style={{ padding: '16px 0 0' }}>
        {subTab === 'jogadas' && (
          <div className="playbook-grid">
            <div style={{
              background: G.s, border: `1px solid rgba(201,162,39,0.12)`,
              borderRadius: 10, padding: 12, maxHeight: 640, overflowY: 'auto',
            }}>
              <div style={{ fontSize: 9, color: G.au, fontFamily: G.mo, letterSpacing: 2, marginBottom: 10 }}>
                {filteredPlays.length} JOGADAS
              </div>
              <PlayFilter onChange={setFiltered} />
              <PlaySelector plays={filteredPlays} selectedId={selectedPlay?.id} onSelect={handleSelectPlay} />
            </div>
            <div>
              <div style={{
                background: G.s, border: `1px solid rgba(201,162,39,0.12)`,
                borderRadius: 10, padding: 16, marginBottom: 12,
              }}>
                <FieldDiagram play={selectedPlay} onPlayerClick={handlePlayerClick} selectedPlayer={selectedPlayer} />
              </div>
              <ExplainPanel play={selectedPlay} selectedPlayer={selectedPlayer} />
            </div>
          </div>
        )}

        {subTab === 'montar'     && <PlayBuilder />}
        {subTab === 'dicionario' && <DictionaryTab />}
      </div>
    </div>
  )
}
