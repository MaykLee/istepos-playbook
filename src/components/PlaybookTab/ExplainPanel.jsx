import { G } from '../../tokens.js'
import GlossaryText from '../GlossaryText.jsx'

const COV_COLORS = { Blue: G.bl, Green: G.gr, Orange: G.am, Silver: G.mu2 }

export default function ExplainPanel({ play, selectedPlayer }) {
  if (!play) return null
  const covColor = COV_COLORS[play.coverage] || G.mu

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        background: G.s, border: `1px solid rgba(201,162,39,0.18)`,
        borderRadius: 8, padding: '12px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: G.sr, fontSize: 16, color: G.tx }}>{play.name}</span>
          <span style={{
            fontSize: 9, fontFamily: G.mo, color: covColor,
            background: `${covColor}18`, border: `1px solid ${covColor}30`,
            borderRadius: 3, padding: '2px 7px',
          }}>{play.coverage}</span>
        </div>
        <GlossaryText as="p" style={{ fontSize: 12, color: G.mu2, lineHeight: 1.6, margin: 0 }}>
          {play.description}
        </GlossaryText>
      </div>

      {selectedPlayer ? (
        <div style={{
          background: G.s2, border: `1px solid rgba(201,162,39,0.15)`,
          borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${G.au}`,
        }}>
          <div style={{ fontSize: 10, color: G.mu, fontFamily: G.mo, marginBottom: 4 }}>JOGADOR SELECIONADO</div>
          <div style={{ fontSize: 14, color: G.au, fontFamily: G.sr, marginBottom: 6 }}>
            {selectedPlayer.label} — {selectedPlayer.name}
          </div>
          <GlossaryText as="p" style={{ fontSize: 12, color: G.tx, lineHeight: 1.7, margin: 0 }}>
            {selectedPlayer.role}
          </GlossaryText>
        </div>
      ) : (
        <div style={{
          background: G.s2, border: `1px solid rgba(201,162,39,0.08)`,
          borderRadius: 8, padding: '12px 14px', textAlign: 'center',
        }}>
          <span style={{ fontSize: 11, color: G.mu, fontFamily: G.mo }}>
            clique em um jogador no campo para ver o que ele faz nessa jogada
          </span>
        </div>
      )}
    </div>
  )
}
