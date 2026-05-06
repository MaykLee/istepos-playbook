import { useState } from 'react'
import { G } from '../../tokens.js'
import { PLAYS } from '../../data/plays.js'
import { buildPlayers } from '../../data/formations.js'
import FieldDiagram from './FieldDiagram.jsx'
import ExplainPanel from './ExplainPanel.jsx'

const FRONTS    = ['Stack', '55', 'Angle', 'LSU Prevent', 'Dam']
const STUNTS    = ['Pinch', 'Contain', 'Slash', 'Wiz', 'Axe']
const BLITZES   = ['Nenhum', 'Buck', 'Will', 'Mike', 'Fire', 'WiM', 'BuD', 'RoD', 'Dog', 'Blood']
const COVERAGES = ['Blue', 'Green', 'Orange', 'Silver']

const FRONT_DESC_MAP = {
  'Stack':       'Linha de 4 com NT no gap A. Formação base equilibrada, eficaz contra corrida e passe curto.',
  '55':          'Linha de 4 deslocada para o lado forte (Over). Cria vantagem de gap no lado do TE.',
  'Angle':       'Linha em ângulo — um DE alinhado fora do tackle, criando ângulo de ataque imprevisível.',
  'LSU Prevent': '5 DBs em campo. Prioridade absoluta em não ceder passes profundos.',
  'Dam':         'Formação especial com alinhamento distinto — reservada para situações táticas específicas.',
}
const STUNT_DESC_MAP = {
  Pinch:   'DEs fecham para dentro comprimindo os gaps A e B. Forte contra runs pelo centro.',
  Contain: 'DEs mantêm contenção da borda. QB não escapa lateralmente.',
  Slash:   'Um DE corta diagonal pelo gap, o outro faz o movimento inverso. Timing entre os DEs é crítico.',
  Wiz:     'Redistribuição de responsabilidade de gap — DLs trocam de lado após o snap.',
  Axe:     'DEs seguram o gap com técnica de eixo. Movimento controlado e disciplinado.',
}
const MOD_DESC_MAP = {
  Buck:  'Buck blitza pelo gap forte. Bom contra runs e passes para o lado forte.',
  Will:  'Will blitza pelo gap fraco. QB precisa processar rapidamente.',
  Mike:  'Mike blitza pelo gap A. Pressão central direta no QB.',
  Fire:  'Will + Buck blitzam juntos. QB tem pouco tempo para processar.',
  WiM:   'Will + Mike blitzam juntos. Pressão pelo centro e lado fraco.',
  BuD:   'Buck + Dog blitzam. Overload no lado do TE.',
  RoD:   'Rover + Dog blitzam pelo exterior. Overload nas bordas.',
  Dog:   'Dog blitza pelo exterior com ângulo surpresa.',
  Blood: 'Combinação especial de blitz — confirmar com o coordenador antes de usar.',
}
const COV_DESC_MAP = {
  Blue:   'Cover 2: dois safeties dividem o fundo em duas zonas. CBs cobrem o flat.',
  Green:  'Cover 3: três zonas no fundo (CB esq + FS + CB dir). LBs cobrem o curto.',
  Orange: 'Cover 4: quatro zonas no fundo. Excelente contra passes profundos.',
  Silver: 'Cover 2 Man: dois safeties no fundo + marcação individual nos receptores.',
}

export function findCataloguedPlay(front, stunt, modifier, coverage) {
  return PLAYS.find(p =>
    p.front === front && p.stunt === stunt &&
    JSON.stringify(p.modifier) === JSON.stringify(modifier) &&
    p.coverage === coverage
  ) || null
}

export function buildDynamicPlay(front, stunt, modifier, coverage) {
  const parts = [front, stunt, ...modifier, coverage]
  const id = parts.join('-').toLowerCase().replace(/\s+/g, '-')
  const name = parts.join(' ')
  const modDesc = modifier.map(m => MOD_DESC_MAP[m] || m).join(' ')
  const description = [STUNT_DESC_MAP[stunt], modDesc, COV_DESC_MAP[coverage]].filter(Boolean).join(' ')
  const players = buildPlayers(front, stunt, modifier, {})
  return { id, name, front, stunt, modifier, coverage, description, players, catalogued: false }
}

function SelectorSection({ label, options, selected, onSelect, descMap }) {
  const desc = selected && descMap?.[selected]
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 8, color: G.mu, fontFamily: G.mo, letterSpacing: 2, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {options.map(opt => {
          const isActive = selected === opt
          return (
            <button key={opt} onClick={() => onSelect(opt)} style={{
              background: isActive ? G.aub : 'transparent',
              border: `1px solid ${isActive ? G.au : G.aul}`,
              color: isActive ? G.au : G.mu2,
              fontSize: 10, fontFamily: G.mo, padding: '5px 12px',
              borderRadius: 4, cursor: 'pointer', transition: 'all .15s',
            }}>{opt}</button>
          )
        })}
      </div>
      {desc && (
        <div style={{
          marginTop: 6, fontSize: 10, color: G.mu2, lineHeight: 1.5,
          padding: '6px 10px', background: G.s2, borderRadius: 4,
          border: `1px solid ${G.aul}`,
        }}>{desc}</div>
      )}
    </div>
  )
}

export default function PlayBuilder() {
  const [front,    setFront]    = useState(null)
  const [stunt,    setStunt]    = useState(null)
  const [blitz,    setBlitz]    = useState('Nenhum')
  const [coverage, setCoverage] = useState(null)
  const [activePlay, setActivePlay] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const canBuild = front && stunt && coverage
  const previewName = [front, stunt, blitz !== 'Nenhum' ? blitz : null, coverage].filter(Boolean).join(' ') || '—'

  function handleBuild() {
    const modifier = blitz === 'Nenhum' ? [] : [blitz]
    const existing = findCataloguedPlay(front, stunt, modifier, coverage)
    setActivePlay(existing ? { ...existing, catalogued: true } : buildDynamicPlay(front, stunt, modifier, coverage))
    setSelectedPlayer(null)
  }

  function handlePlayerClick(player) {
    setSelectedPlayer(prev => prev?.id === player.id ? null : player)
  }

  return (
    <div>
      <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.12)`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <SelectorSection label="FRONT"            options={FRONTS}    selected={front}    onSelect={f => { setFront(f);    setActivePlay(null) }} descMap={FRONT_DESC_MAP}  />
        <SelectorSection label="STUNT"            options={STUNTS}    selected={stunt}    onSelect={s => { setStunt(s);    setActivePlay(null) }} descMap={STUNT_DESC_MAP}  />
        <SelectorSection label="BLITZ (OPCIONAL)" options={BLITZES}   selected={blitz}    onSelect={b => { setBlitz(b);    setActivePlay(null) }} descMap={MOD_DESC_MAP}    />
        <SelectorSection label="COVERAGE"         options={COVERAGES} selected={coverage} onSelect={c => { setCoverage(c); setActivePlay(null) }} descMap={COV_DESC_MAP}    />
        <div style={{
          background: G.s2, border: `1px solid ${canBuild ? G.aul : 'rgba(201,162,39,0.06)'}`,
          borderRadius: 6, padding: '10px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 8, color: G.mu, fontFamily: G.mo, letterSpacing: 1, marginBottom: 3 }}>JOGADA</div>
            <div style={{ fontSize: 13, color: canBuild ? G.au : G.mu, fontFamily: G.mo }}>{previewName}</div>
            {activePlay && (
              <div style={{ fontSize: 9, color: activePlay.catalogued ? G.gr : G.am, marginTop: 3, fontFamily: G.mo }}>
                {activePlay.catalogued ? '✓ Jogada catalogada' : '◈ Combinação livre'}
              </div>
            )}
          </div>
          <button onClick={handleBuild} disabled={!canBuild} style={{
            background: canBuild ? G.aub : 'transparent',
            border: `1px solid ${canBuild ? G.au : G.aul}`,
            color: canBuild ? G.au : G.mu,
            fontSize: 10, fontFamily: G.mo, padding: '8px 16px',
            borderRadius: 5, cursor: canBuild ? 'pointer' : 'default', transition: 'all .15s',
          }}>VER NO CAMPO →</button>
        </div>
      </div>
      {activePlay ? (
        <>
          <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.12)`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <FieldDiagram play={activePlay} onPlayerClick={handlePlayerClick} selectedPlayer={selectedPlayer} />
          </div>
          <ExplainPanel play={activePlay} selectedPlayer={selectedPlayer} />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px 0', color: G.mu, fontFamily: G.mo, fontSize: 11 }}>
          Selecione front, stunt e coverage para montar uma jogada
        </div>
      )}
    </div>
  )
}
