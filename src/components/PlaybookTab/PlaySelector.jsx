import { G } from '../../tokens.js'
import { PLAYS_BY_FRONT, FRONT_ORDER } from '../../data/plays.js'

const FRONT_COLORS = {
  Stack:         G.bl,
  '55':          G.rd,
  Angle:         G.au,
  'LSU Prevent': G.gr,
  Dam:           G.am,
}

const COV_COLORS = { Blue: G.bl, Green: G.gr, Orange: G.am, Silver: G.mu2 }

export default function PlaySelector({ selectedId, onSelect }) {
  return (
    <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
      {FRONT_ORDER.filter(f => PLAYS_BY_FRONT[f]).map(front => {
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
              {PLAYS_BY_FRONT[front].map(play => {
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
