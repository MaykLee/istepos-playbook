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
  { id: 'jogadas',    label: 'Jogadas'    },
  { id: 'montar',     label: 'Montar'     },
  { id: 'dicionario', label: 'Dicionário' },
]

export default function PlaybookTab() {
  const [subTab, setSubTab]          = useState('jogadas')
  const [filteredPlays, setFiltered] = useState(PLAYS)
  const [selectedPlay, setPlay]      = useState(PLAYS[0])
  const [selectedPlayer, setPlayer]  = useState(null)

  function handleSelectPlay(play) { setPlay(play); setPlayer(null) }
  function handlePlayerClick(player) { setPlayer(prev => prev?.id === player.id ? null : player) }

  return (
    <div>
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: `1px solid ${G.aul}` }}>
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            background: 'none', border: 'none',
            borderBottom: `2px solid ${subTab === t.id ? G.au : 'transparent'}`,
            color: subTab === t.id ? G.au : G.mu,
            padding: '8px 14px', cursor: 'pointer',
            fontSize: 11, fontFamily: G.mo, letterSpacing: 1,
            transition: 'color .15s',
          }}>{t.label}</button>
        ))}
      </div>

      {subTab === 'jogadas' && (
        <div className="playbook-grid">
          <div style={{
            background: G.s, border: `1px solid rgba(201,162,39,0.12)`,
            borderRadius: 10, padding: 12, maxHeight: 640, overflowY: 'auto',
          }}>
            <div style={{ fontSize: 9, color: G.mu, fontFamily: G.mo, letterSpacing: 2, marginBottom: 10 }}>JOGADAS</div>
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
  )
}
