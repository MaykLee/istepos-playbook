import { useState } from 'react'
import { G } from '../../tokens.js'
import { BASES } from '../../data/formations.js'
import StatBar from '../shared/StatBar.jsx'

const POS = {
  offense: [
    { abbr: 'QB', name: 'Quarterback',    rpg: 'Mago',      role: 'Comanda tudo. Lê a defesa e decide onde a bola vai.',      detail: 'Recebe o snap e escolhe: passa, corre ou entrega. Zanon é o QB do time — fã de jogar pro backside.',       stats: { Força: 3, Velocidade: 6,  Leitura: 10 } },
    { abbr: 'RB', name: 'Running Back',   rpg: 'Guerreiro', role: 'Corre com a bola — ou bloqueia como Lead.',               detail: 'No modo Lead, vai direto no DE do playside. JP e Laurentino são mais efetivos em espaço aberto.',            stats: { Força: 7, Velocidade: 8,  Leitura: 5  } },
    { abbr: 'WR', name: 'Wide Receiver',  rpg: 'Ladrão',    role: 'Receptor aberto. Velocidade, rotas, pega passes.',        detail: 'Henry é o WR mais rápido. Corre Jet Sweep, Slant, Wheel, Hitch, Corner... O CB tem que ficar grudado.',     stats: { Força: 4, Velocidade: 10, Leitura: 6  } },
    { abbr: 'TE', name: 'Tight End',      rpg: 'Paladino',  role: 'Bloqueia E recebe passes. Define o lado Lucky/Ringo.',    detail: 'Híbrido poderoso. Onde o TE alinha, o Mike LB declara a força. TE à esquerda = Lucky. TE à direita = Ringo.', stats: { Força: 8, Velocidade: 5,  Leitura: 6  } },
    { abbr: 'C',  name: 'Center',         rpg: 'Ferreiro',  role: 'Faz o snap. Âncora e comunicador da linha.',              detail: 'Inicia cada jogada entregando a bola pro QB. Coordena os bloqueios internos com os guards.',                stats: { Força: 8, Velocidade: 3,  Leitura: 7  } },
    { abbr: 'T',  name: 'Tackle (LT/RT)', rpg: 'Tanque',    role: 'Extremos da linha. Protegem as laterais do QB.',          detail: 'Os maiores da linha. Protegem o QB de rushers pelas bordas, especialmente contra os Defensive Ends.',       stats: { Força: 10,Velocidade: 3,  Leitura: 5  } },
    { abbr: 'G',  name: 'Guard (LG/RG)',  rpg: 'Guardião',  role: 'Bloqueadores internos. Protegem o centro.',               detail: 'Ao lado do center. Junto com os tackles, formam a muralha que dá tempo pro QB jogar.',                     stats: { Força: 9, Velocidade: 3,  Leitura: 5  } },
  ],
  defense: [
    { abbr: 'E',  name: 'Defensive End',  rpg: 'Berserker', role: 'Extremos da linha. Persegue o QB pelas bordas.',          detail: 'Controla o C-gap. No Jet Sweep, é quem o RB (Lead) vai bloquear. Se ele passar, a jogada funciona.',         stats: { Força: 9, Velocidade: 7,  Leitura: 5  } },
    { abbr: 'N',  name: 'Nose Tackle',    rpg: 'Colosso',   role: 'Centro da linha. Ocupa dois bloqueadores ao mesmo tempo.', detail: 'Posição 0 — em cima do center. Objetivo: destruir o meio do campo.',                                         stats: { Força: 10,Velocidade: 3,  Leitura: 5  } },
    { abbr: 'M',  name: 'Mike LB',        rpg: 'Capitão',   role: 'LB do meio. Declara Lucky/Ringo. Comanda a defesa.',      detail: 'É quem grita Lucky ou Ringo antes do snap. Lê o backfield e se ajusta pelo fluxo.',                         stats: { Força: 7, Velocidade: 7,  Leitura: 9  } },
    { abbr: 'B',  name: 'Buck LB',        rpg: 'Caçador',   role: 'LB do lado forte. Pressiona e cobre.',                   detail: 'Pode fazer blitz em qualquer front. Responde por dois gaps dependendo do fluxo da jogada.',                  stats: { Força: 7, Velocidade: 7,  Leitura: 7  } },
    { abbr: 'W',  name: 'Will LB',        rpg: 'Ranger',    role: 'LB do lado fraco. Cobre o backside.',                    detail: 'Cobre o lado oposto à força. No 2-minute drill, fique de olho no RB fazendo wheel.',                        stats: { Força: 6, Velocidade: 8,  Leitura: 8  } },
    { abbr: 'R',  name: 'Rover',          rpg: 'Espião',    role: 'Híbrido LB/Safety. Versátil, aparece no Rover Blitz.',   detail: 'Pode Set Edge em corridas ou cobrir passe. No Angle front, aparece como Roger. Imprevisível.',              stats: { Força: 6, Velocidade: 8,  Leitura: 8  } },
    { abbr: 'D',  name: 'Dog',            rpg: 'Lobo',      role: 'Similar ao Rover. Blitza ou cobre conforme a formação.', detail: 'No Dog Blitz, vem de ângulo surpresa. No Stack e 55, faz Set Edge como o Rover.',                           stats: { Força: 6, Velocidade: 8,  Leitura: 7  } },
    { abbr: 'CB', name: 'Cornerback',     rpg: 'Duelista',  role: 'Marca o WR em 1x1. Guardião das laterais.',              detail: 'Na Smash, o CB decide qual passe acontece. Fechou no hitch = QB joga corner. Ficou fundo = QB joga hitch.',  stats: { Força: 5, Velocidade: 9,  Leitura: 8  } },
    { abbr: 'FS', name: 'Free Safety',    rpg: 'Vigia',     role: 'Último da defesa. Lê o jogo e quebra passes.',           detail: 'No Cover 2 e 3, cobre zonas atrás dos LBs. É quem salva jogadas que escapam dos outros.',                   stats: { Força: 5, Velocidade: 8,  Leitura: 10 } },
  ],
}

// ── Tokens defensivos (Stack base) ──────────────────────────────────────────
const base = BASES.Stack
const DEF_TOKENS = [
  { id: 'E_left',   label: 'DE', abbr: 'E',  x: base.E_left.x,   y: base.E_left.y   },
  { id: 'N',        label: 'NT', abbr: 'N',  x: base.N.x,        y: base.N.y        },
  { id: 'E_right',  label: 'DE', abbr: 'E',  x: base.E_right.x,  y: base.E_right.y  },
  { id: 'W',        label: 'W',  abbr: 'W',  x: base.W.x,        y: base.W.y        },
  { id: 'M',        label: 'M',  abbr: 'M',  x: base.M.x,        y: base.M.y        },
  { id: 'B',        label: 'B',  abbr: 'B',  x: base.B.x,        y: base.B.y        },
  { id: 'R',        label: 'R',  abbr: 'R',  x: base.R.x,        y: base.R.y        },
  { id: 'D',        label: 'D',  abbr: 'D',  x: base.D.x,        y: base.D.y        },
  { id: 'CB_left',  label: 'CB', abbr: 'CB', x: base.CB_left.x,  y: base.CB_left.y  },
  { id: 'CB_right', label: 'CB', abbr: 'CB', x: base.CB_right.x, y: base.CB_right.y },
  { id: 'FS',       label: 'FS', abbr: 'FS', x: base.FS.x,       y: base.FS.y       },
]

// ── Tokens ofensivos (Shotgun base) ─────────────────────────────────────────
const OFF_TOKENS = [
  { id: 'WR_L', label: 'WR', abbr: 'WR', x: 45,  y: 193 },
  { id: 'LT',   label: 'LT', abbr: 'T',  x: 152, y: 196 },
  { id: 'LG',   label: 'LG', abbr: 'G',  x: 176, y: 196 },
  { id: 'C',    label: 'C',  abbr: 'C',  x: 200, y: 196 },
  { id: 'RG',   label: 'RG', abbr: 'G',  x: 224, y: 196 },
  { id: 'RT',   label: 'RT', abbr: 'T',  x: 248, y: 196 },
  { id: 'TE',   label: 'TE', abbr: 'TE', x: 274, y: 194 },
  { id: 'WR_R', label: 'WR', abbr: 'WR', x: 355, y: 193 },
  { id: 'QB',   label: 'QB', abbr: 'QB', x: 200, y: 222 },
  { id: 'RB',   label: 'RB', abbr: 'RB', x: 232, y: 236 },
]

function defTokenColor(id) {
  if (id === 'N' || id.startsWith('E_')) return G.cr
  if (['M','B','W','D','R'].includes(id))  return G.am
  if (id.startsWith('CB'))                 return G.bl
  if (id === 'FS')                         return G.gr
  return G.mu
}

function offTokenColor(id) {
  if (id === 'QB')                         return G.au
  if (id === 'RB')                         return G.am
  if (id === 'WR_L' || id === 'WR_R')     return G.bl
  if (id === 'TE')                         return G.gr
  return G.mu2
}

function FieldToken({ p, col, isSelected, onClick }) {
  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}>
      <circle cx={p.x} cy={p.y} r={14} fill="rgba(10,10,14,0.92)" />
      <circle cx={p.x} cy={p.y} r={14}
        fill={isSelected ? `${col}55` : `${col}18`}
        stroke={isSelected ? col : `${col}55`}
        strokeWidth={isSelected ? 2.5 : 1.5}
      />
      {isSelected && (
        <circle cx={p.x} cy={p.y} r={19}
          fill="none" stroke={col} strokeWidth="1" strokeOpacity="0.4"
          strokeDasharray="3,3"
        />
      )}
      <text x={p.x} y={p.y + 4} textAnchor="middle"
        fill={isSelected ? col : `${col}bb`}
        fontSize={isSelected ? '9' : '8'} fontFamily="'Courier New',monospace"
        style={{ pointerEvents: 'none' }}>
        {p.label}
      </text>
    </g>
  )
}

function DefenseField({ selAbbr, onTokenClick }) {
  const FW = 400, FH = 220, LOS = 190
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid rgba(196,18,48,0.2)`, marginBottom: 20 }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={{ width: '100%', display: 'block' }}>
        <rect x={0} y={0} width={FW} height={FH} fill="rgba(15,32,15,0.95)" />
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <line key={n} x1={n*FW/10} y1={0} x2={n*FW/10} y2={FH}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}
        <line x1={0} y1={LOS} x2={FW} y2={LOS} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x={FW/2} y={LOS + 13} textAnchor="middle"
          fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="'Courier New',monospace">
          LINHA DE SCRIMMAGE
        </text>
        {[160,180,200,220,240].map((x, i) => (
          <circle key={i} cx={x} cy={196} r={11}
            fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        ))}
        <text x={200} y={215} textAnchor="middle"
          fill="rgba(255,255,255,0.1)" fontSize="7" fontFamily="'Courier New',monospace">ATAQUE</text>
        {DEF_TOKENS.map(p => (
          <FieldToken key={p.id} p={p} col={defTokenColor(p.id)} isSelected={selAbbr && p.abbr === selAbbr} onClick={() => onTokenClick(p.abbr)} />
        ))}
      </svg>
      <div style={{ background: 'rgba(10,10,14,0.7)', borderTop: '1px solid rgba(196,18,48,0.1)', padding: '6px 14px' }}>
        <span style={{ fontFamily: G.mo, fontSize: 9, color: G.mu, letterSpacing: 1 }}>
          FORMAÇÃO BASE — STACK · {selAbbr ? `${selAbbr} DESTACADO` : 'SELECIONE UMA POSIÇÃO'}
        </span>
      </div>
    </div>
  )
}

function OffenseField({ selAbbr, onTokenClick }) {
  const FW = 400, FH = 280, LOS = 190
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid rgba(91,155,213,0.2)`, marginBottom: 20 }}>
      <svg viewBox={`0 0 ${FW} ${FH}`} style={{ width: '100%', display: 'block' }}>
        <rect x={0} y={0} width={FW} height={FH} fill="rgba(15,32,15,0.95)" />
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <line key={n} x1={n*FW/10} y1={0} x2={n*FW/10} y2={FH}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}
        <line x1={0} y1={LOS} x2={FW} y2={LOS} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x={FW/2} y={LOS - 7} textAnchor="middle"
          fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="'Courier New',monospace">
          LINHA DE SCRIMMAGE
        </text>
        {/* Silhueta da defesa */}
        {[148,172,200,228,252].map((x, i) => (
          <circle key={i} cx={x} cy={172} r={11}
            fill="rgba(196,18,48,0.04)" stroke="rgba(196,18,48,0.15)" strokeWidth="1" />
        ))}
        <text x={200} y={150} textAnchor="middle"
          fill="rgba(196,18,48,0.18)" fontSize="7" fontFamily="'Courier New',monospace">DEFESA</text>
        {/* Tokens ofensivos */}
        {OFF_TOKENS.map(p => (
          <FieldToken key={p.id} p={p} col={offTokenColor(p.id)} isSelected={selAbbr && p.abbr === selAbbr} onClick={() => onTokenClick(p.abbr)} />
        ))}
      </svg>
      <div style={{ background: 'rgba(10,10,14,0.7)', borderTop: '1px solid rgba(91,155,213,0.1)', padding: '6px 14px' }}>
        <span style={{ fontFamily: G.mo, fontSize: 9, color: G.mu, letterSpacing: 1 }}>
          FORMAÇÃO BASE — SHOTGUN · {selAbbr ? `${selAbbr} DESTACADO` : 'SELECIONE UMA POSIÇÃO'}
        </span>
      </div>
    </div>
  )
}

function PosCard({ p, isOff, sel, onClick }) {
  const ac = isOff ? G.bl : G.cr
  return (
    <div onClick={onClick} style={{
      background: G.s,
      border: `1px solid ${sel ? ac : `${ac}25`}`,
      borderLeft: `4px solid ${sel ? ac : `${ac}50`}`,
      borderRadius: 10, padding: '16px 18px', cursor: 'pointer', transition: 'border-color .2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 'bold', fontFamily: G.sr, color: G.wh, lineHeight: 1 }}>{p.abbr}</div>
          <div style={{ fontSize: 11, color: G.mu, fontFamily: G.mo, marginTop: 3 }}>{p.name}</div>
        </div>
        <span style={{ background: `${ac}20`, border: `1px solid ${ac}50`, borderRadius: 5, padding: '3px 9px', fontSize: 10, color: ac, fontFamily: G.mo, whiteSpace: 'nowrap' }}>{p.rpg}</span>
      </div>
      <div style={{ fontSize: 13, color: G.mu2, lineHeight: 1.5 }}>{p.role}</div>
      {sel && (
        <div style={{ marginTop: 12, borderTop: `1px solid rgba(255,255,255,0.07)`, paddingTop: 12 }}>
          <div style={{ fontSize: 13, color: G.wh, lineHeight: 1.6, marginBottom: 12 }}>{p.detail}</div>
          <StatBar label="FORÇA"      val={p.stats.Força}      col={G.cr} />
          <StatBar label="VELOCIDADE" val={p.stats.Velocidade} col={G.bl} />
          <StatBar label="LEITURA"    val={p.stats.Leitura}    col={G.au} />
        </div>
      )}
    </div>
  )
}

export default function PositionsTab() {
  const [side, setSide] = useState('defense')
  const [sel, setSel]   = useState(null)
  const isOff = side === 'offense'
  const ac = isOff ? G.bl : G.cr
  const selAbbr = sel !== null ? POS[side][sel]?.abbr : null

  function handleTokenClick(abbr) {
    const idx = POS[side].findIndex(p => p.abbr === abbr)
    if (idx === -1) return
    setSel(prev => prev === idx ? null : idx)
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 24 }}>
      <div style={{
        background: `linear-gradient(135deg, ${isOff ? '#08101a' : '#1a0508'} 0%, #0e0e12 60%)`,
        borderBottom: `2px solid ${ac}`,
        padding: '18px 24px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <img src="/istepos-logo.png" alt="ISTEPOS" style={{ width: 44, height: 44, objectFit: 'contain' }} />
        <div>
          <div style={{ fontFamily: G.mo, fontSize: 15, color: ac, letterSpacing: 2 }}>POSIÇÕES</div>
          <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, marginTop: 3 }}>conheça cada jogador em campo</div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['offense','defense'].map(s => {
            const sAc = s === 'offense' ? G.bl : G.cr
            const isActive = side === s
            return (
              <button key={s} onClick={() => { setSide(s); setSel(null) }} style={{
                flex: 1,
                background: isActive ? `${sAc}18` : 'transparent',
                border: `1px solid ${isActive ? sAc + '60' : sAc + '20'}`,
                borderLeft: `4px solid ${isActive ? sAc : sAc + '25'}`,
                borderRadius: 10, padding: '12px 18px',
                color: isActive ? sAc : G.mu,
                cursor: 'pointer', fontSize: 13, fontFamily: G.mo, letterSpacing: 1,
                transition: 'all .15s',
              }}>
                {s === 'offense' ? '⚔️  ATAQUE' : '🛡️  DEFESA'}
              </button>
            )
          })}
        </div>

        {isOff ? <OffenseField selAbbr={selAbbr} onTokenClick={handleTokenClick} /> : <DefenseField selAbbr={selAbbr} onTokenClick={handleTokenClick} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {POS[side].map((p, i) => (
            <PosCard key={i} p={p} isOff={isOff} sel={sel === i} onClick={() => setSel(sel === i ? null : i)} />
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: G.mu, fontFamily: G.mo, textAlign: 'center' }}>
          clique em uma carta para expandir
        </div>
      </div>
    </div>
  )
}
