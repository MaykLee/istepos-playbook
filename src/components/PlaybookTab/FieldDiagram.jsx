import { useState, useEffect } from 'react'
import { G } from '../../tokens.js'

const FW = 400
const FH = 280
const LOS = 190

const COVERAGE_ZONES = {
  Blue: [
    { x: 0,      y: 0, w: FW/2, h: LOS * 0.55, color: G.bl, label: 'ZONA 1' },
    { x: FW/2,   y: 0, w: FW/2, h: LOS * 0.55, color: G.bl, label: 'ZONA 2' },
  ],
  Green: [
    { x: 0,      y: 0, w: FW/3,   h: LOS * 0.5, color: G.gr, label: 'CB' },
    { x: FW/3,   y: 0, w: FW/3,   h: LOS * 0.5, color: G.gr, label: 'FS' },
    { x: FW*2/3, y: 0, w: FW/3,   h: LOS * 0.5, color: G.gr, label: 'CB' },
  ],
  Orange: [
    { x: 0,      y: 0, w: FW/4, h: LOS * 0.48, color: G.am, label: 'F1' },
    { x: FW/4,   y: 0, w: FW/4, h: LOS * 0.48, color: G.am, label: 'F2' },
    { x: FW/2,   y: 0, w: FW/4, h: LOS * 0.48, color: G.am, label: 'F3' },
    { x: FW*3/4, y: 0, w: FW/4, h: LOS * 0.48, color: G.am, label: 'F4' },
  ],
  Silver: [],
}

function tokenColor(id) {
  if (id === 'N' || id.startsWith('E_')) return G.rd
  if (['M','B','W','D','R'].includes(id))  return G.am
  if (id.startsWith('CB'))                 return G.bl
  if (id === 'FS')                         return G.gr
  return G.mu
}

export default function FieldDiagram({ play, onPlayerClick, selectedPlayer }) {
  const [snapped, setSnapped] = useState(false)

  useEffect(() => { setSnapped(false) }, [play?.id])

  if (!play) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 300, color: G.mu, fontFamily: G.mo, fontSize: 12,
      }}>
        ← selecione uma jogada
      </div>
    )
  }

  const zones = COVERAGE_ZONES[play.coverage] || []

  return (
    <div>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={{ width: '100%', display: 'block', borderRadius: 8 }}>
        <defs>
          <marker id="arr-move" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(201,162,39,0.7)" />
          </marker>
          <marker id="arr-blitz" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={G.rd} />
          </marker>
        </defs>

        {/* Campo */}
        <rect x={0} y={0} width={FW} height={FH} fill="rgba(15,32,15,0.95)" />
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <line key={n} x1={n*FW/10} y1={0} x2={n*FW/10} y2={FH}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}

        {/* Zonas de cobertura */}
        {zones.map((z, i) => (
          <g key={i}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h}
              fill={`${z.color}14`} stroke={z.color} strokeWidth="0.8"
              strokeOpacity="0.35" strokeDasharray="4,3" />
            <text x={z.x + z.w/2} y={z.h/2 + 5} textAnchor="middle"
              fill={`${z.color}80`} fontSize="9" fontFamily="'Courier New',monospace">
              {z.label}
            </text>
          </g>
        ))}

        {/* Silver label */}
        {play.coverage === 'Silver' && (
          <text x={FW - 8} y={18} textAnchor="end"
            fill={G.mu2} fontSize="9" fontFamily="'Courier New',monospace">MAN</text>
        )}

        {/* LOS */}
        <line x1={0} y1={LOS} x2={FW} y2={LOS} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x={FW/2} y={LOS + 12} textAnchor="middle"
          fill="rgba(255,255,255,0.18)" fontSize="8" fontFamily="'Courier New',monospace">
          LINHA DE SCRIMMAGE
        </text>

        {/* Setas (sempre visíveis, saem fora do círculo do token) */}
        {play.players.map(p => {
          const dx = p.moveTo.x - p.x
          const dy = p.moveTo.y - p.y
          const len = Math.sqrt(dx*dx + dy*dy)
          if (len < 20) return null
          const sx = p.x + (dx/len) * 16
          const sy = p.y + (dy/len) * 16
          const tx = p.moveTo.x - (dx/len) * 9
          const ty = p.moveTo.y - (dy/len) * 9
          const isBlitz = p.moveTo.y > p.y + 6
          return (
            <path key={`a-${p.id}`}
              d={`M${sx},${sy} L${tx},${ty}`}
              stroke={isBlitz ? `${G.rd}90` : `${G.au}55`}
              strokeWidth="1.5" fill="none" strokeDasharray="5,3"
              markerEnd={isBlitz ? 'url(#arr-blitz)' : 'url(#arr-move)'}
            />
          )
        })}

        {/* Tokens */}
        {play.players.map(p => {
          const cx = snapped ? p.moveTo.x : p.x
          const cy = snapped ? p.moveTo.y : p.y
          const col = tokenColor(p.id)
          const isSel = selectedPlayer?.id === p.id

          return (
            <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onPlayerClick(p)}>
              {/* Fundo sólido para não deixar a seta transparece no label */}
              <circle cx={cx} cy={cy} r={13}
                fill="rgba(10,10,14,0.92)"
                style={{ transition: 'cx 0.6s ease, cy 0.6s ease' }}
              />
              <circle cx={cx} cy={cy} r={13}
                fill={isSel ? `${col}50` : `${col}22`}
                stroke={isSel ? col : `${col}88`}
                strokeWidth={isSel ? 2 : 1.5}
                style={{ transition: 'cx 0.6s ease, cy 0.6s ease' }}
              />
              <text x={cx} y={cy + 4} textAnchor="middle"
                fill={isSel ? col : `${col}cc`}
                fontSize="9" fontFamily="'Courier New',monospace"
                style={{ pointerEvents: 'none', transition: 'x 0.6s ease, y 0.6s ease' }}>
                {p.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* SNAP button */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button
          onClick={() => setSnapped(s => !s)}
          style={{
            background: snapped ? `${G.rd}20` : G.aul,
            border: `1px solid ${snapped ? G.rd : G.au}`,
            borderRadius: 6, padding: '7px 28px',
            color: snapped ? G.rd : G.au,
            cursor: 'pointer', fontSize: 11, fontFamily: G.mo, letterSpacing: 1,
          }}
        >
          {snapped ? '↺ RESET' : '▶ SNAP'}
        </button>
      </div>
    </div>
  )
}
