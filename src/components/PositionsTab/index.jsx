import { useState } from 'react'
import { G } from '../../tokens.js'
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

function PosCard({ p, isOff, sel, onClick }) {
  const ac = isOff ? G.bl : G.rd
  return (
    <div onClick={onClick} style={{
      background: sel ? G.aub : G.s,
      border: `1px solid ${sel ? G.au : 'rgba(201,162,39,0.15)'}`,
      borderRadius: 8, padding: '12px 14px', cursor: 'pointer', transition: 'border-color .2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 'bold', fontFamily: G.sr, color: G.tx, lineHeight: 1 }}>{p.abbr}</div>
          <div style={{ fontSize: 10, color: G.mu, fontFamily: G.mo, marginTop: 2 }}>{p.name}</div>
        </div>
        <span style={{ background: `${ac}18`, border: `1px solid ${ac}40`, borderRadius: 4, padding: '2px 7px', fontSize: 10, color: ac, fontFamily: G.mo, whiteSpace: 'nowrap' }}>{p.rpg}</span>
      </div>
      <div style={{ fontSize: 11, color: G.mu2, lineHeight: 1.5 }}>{p.role}</div>
      {sel && (
        <div style={{ marginTop: 10, borderTop: `1px solid rgba(201,162,39,0.12)`, paddingTop: 10 }}>
          <div style={{ fontSize: 11, color: '#c8c0b0', lineHeight: 1.6, marginBottom: 10 }}>{p.detail}</div>
          <StatBar label="FORÇA"      val={p.stats.Força}      col={G.rd} />
          <StatBar label="VELOCIDADE" val={p.stats.Velocidade} col={G.bl} />
          <StatBar label="LEITURA"    val={p.stats.Leitura}    col={G.au} />
        </div>
      )}
    </div>
  )
}

export default function PositionsTab() {
  const [side, setSide] = useState('offense')
  const [sel, setSel]   = useState(null)
  const isOff = side === 'offense'
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['offense','defense'].map(s => (
          <button key={s} onClick={() => { setSide(s); setSel(null) }} style={{
            background: side === s ? (s === 'offense' ? `${G.bl}20` : `${G.rd}20`) : 'none',
            border: `1px solid ${side === s ? (s === 'offense' ? G.bl : G.rd) : 'rgba(201,162,39,0.2)'}`,
            borderRadius: 6, padding: '6px 16px',
            color: side === s ? (s === 'offense' ? G.bl : G.rd) : G.mu,
            cursor: 'pointer', fontSize: 12, fontFamily: G.mo,
          }}>{s === 'offense' ? '⚔ ATAQUE' : '🛡 DEFESA'}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
        {POS[side].map((p, i) => (
          <PosCard key={i} p={p} isOff={isOff} sel={sel === i} onClick={() => setSel(sel === i ? null : i)} />
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: G.mu, fontFamily: G.mo, textAlign: 'center' }}>clique em uma carta para expandir</div>
    </div>
  )
}
