import { useState } from 'react'
import { G } from '../../tokens.js'
import PlaySelector from './PlaySelector.jsx'
import FieldDiagram from './FieldDiagram.jsx'
import ExplainPanel from './ExplainPanel.jsx'
import { PLAYS } from '../../data/plays.js'

export default function PlaybookTab() {
  const [selectedPlay, setSelectedPlay] = useState(PLAYS[0])
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  function handleSelectPlay(play) {
    setSelectedPlay(play)
    setSelectedPlayer(null)
  }

  function handlePlayerClick(player) {
    setSelectedPlayer(prev => prev?.id === player.id ? null : player)
  }

  return (
    <div className="playbook-grid">
      {/* Left: play list */}
      <div style={{
        background: G.s, border: `1px solid rgba(201,162,39,0.12)`,
        borderRadius: 10, padding: 12, maxHeight: 600, overflowY: 'auto',
      }}>
        <div style={{ fontSize: 9, color: G.mu, fontFamily: G.mo, letterSpacing: 2, marginBottom: 12 }}>
          JOGADAS
        </div>
        <PlaySelector selectedId={selectedPlay?.id} onSelect={handleSelectPlay} />
      </div>

      {/* Right: field + explain */}
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
  )
}
