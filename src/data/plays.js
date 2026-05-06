import { buildPlayers } from './formations.js'

const COVERAGE_DESC = {
  Blue:   'Cover 2: dois safeties dividem o fundo em duas zonas. CBs cobrem o curto.',
  Green:  'Cover 3: três zonas no fundo (CB + FS + CB). LBs cobrem o curto.',
  Orange: 'Cover 4: quatro zonas no fundo. Excelente contra passes profundos.',
  Silver: 'Cover 2 Man: dois safeties no fundo + marcação individual nos receptores.',
}

const STUNT_DESC = {
  Pinch:   'Pinch: os DEs fecham para dentro comprimindo os gaps A e B.',
  Contain: 'Contain: os DEs mantêm contenção da borda. QB não escapa lateralmente.',
  Slash:   'Slash: um DE corta diagonal pelo gap, o outro faz o movimento inverso.',
  Wiz:     'Wiz: redistribuição de responsabilidade de gap — os DLs trocam de lado.',
  Axe:     'Axe: movimento de controle — DEs seguram o gap com técnica de eixo.',
}

const MODIFIER_DESC = {
  Buck:  'Buck blitza pelo gap forte.',
  Will:  'Will blitza pelo gap fraco.',
  Mike:  'Mike blitza pelo gap A. Pressão central direta no QB.',
  Fire:  'Fire: Will + Buck blitzam juntos. Pressão dupla pelos gaps laterais.',
  WiM:   'WiM: Will + Mike blitzam juntos.',
  BuD:   'BuD: Buck + Dog blitzam. Pressão dupla pelo lado forte.',
  RoD:   'RoD: Rover + Dog blitzam pelo exterior.',
  Dog:   'Dog blitza pelo exterior. Vem de ângulo surpresa.',
  Blood: 'Blood: combinação especial — confirmar com o coordenador.',
}

const BLITZER_MAP = {
  Buck: ['B'], Will: ['W'], Mike: ['M'],
  Fire: ['W', 'B'], WiM: ['W', 'M'], BuD: ['B', 'D'],
  RoD: ['R', 'D'], Dog: ['D'], Blood: ['B', 'W', 'M'],
}

function getRoles(stunt, modifier) {
  const blitzers = new Set(modifier.flatMap(m => BLITZER_MAP[m] || []))

  const stuntRoles = {
    Pinch:   { E_left: 'Fecha para dentro — comprime o gap B.', E_right: 'Fecha para dentro — comprime o gap B.', N: 'Penetra pelo gap A enquanto os DEs fecham.' },
    Contain: { E_left: 'Mantém contenção da borda esquerda. QB não passa por aqui.', E_right: 'Mantém contenção da borda direita.', N: 'Penetra pelo gap A.' },
    Slash:   { E_left: 'Corta diagonal pelo gap — movimento de surpresa.', E_right: 'Wraps pelo exterior enquanto o outro DE corta.', N: 'Mantém gap A, ajusta pelo fluxo.' },
    Wiz:     { E_left: 'Redistribuição de gap — segue a leitura do Wiz.', E_right: 'Redistribuição de gap — segue a leitura do Wiz.', N: 'Ajusta para o lado oposto.' },
    Axe:     { E_left: 'Controle de gap com técnica de eixo.', E_right: 'Controle de gap com técnica de eixo.', N: 'Ancora o centro da linha.' },
  }

  return {
    M: blitzers.has('M') ? 'BLITZA — penetra pelo gap A direto no QB.' : 'Lê o backfield, declara Lucky/Ringo, ajusta pelo fluxo.',
    B: blitzers.has('B') ? 'BLITZA — penetra pelo gap forte.' : 'Cobre gap B do lado forte, ajusta pelo fluxo.',
    W: blitzers.has('W') ? 'BLITZA — penetra pelo gap fraco.' : 'Cobre o backside, gap B lado fraco.',
    D: blitzers.has('D') ? 'BLITZA — vem de ângulo pelo exterior.' : 'Set edge ou cobertura conforme o fluxo.',
    R: blitzers.has('R') ? 'BLITZA — vem pelo exterior.' : 'Set edge ou cobertura conforme o fluxo.',
    CB_left:  'Cobre o WR do seu lado. Não abre cedo para o flat — pode ser Wheel.',
    CB_right: 'Cobre o WR do seu lado. Não abre cedo para o flat — pode ser Wheel.',
    FS: 'Último recurso. Lê o QB, quebra para o lado da jogada. Não saia cedo.',
    ...(stuntRoles[stunt] || {}),
  }
}

function play(front, stunt, modifier, coverage) {
  const id = [front, stunt, ...modifier, coverage].join('-').toLowerCase().replace(/\s+/g, '-')
  const name = [front, stunt, ...modifier, coverage].join(' ')
  const modDesc = modifier.map(m => MODIFIER_DESC[m] || m).join(' ')
  const description = [STUNT_DESC[stunt] || stunt, modDesc, COVERAGE_DESC[coverage] || coverage].filter(Boolean).join(' ')
  const roles = getRoles(stunt, modifier)
  return { id, name, front, stunt, modifier, coverage, description, players: buildPlayers(front, stunt, modifier, roles) }
}

export const PLAYS = [
  // STACK (14)
  play('Stack', 'Pinch',   ['Buck'],  'Blue'),
  play('Stack', 'Pinch',   ['Will'],  'Blue'),
  play('Stack', 'Pinch',   ['Fire'],  'Blue'),
  play('Stack', 'Contain', ['Fire'],  'Blue'),
  play('Stack', 'Contain', ['Buck'],  'Blue'),
  play('Stack', 'Contain', ['Will'],  'Blue'),
  play('Stack', 'Slash',   ['Mike'],  'Blue'),
  play('Stack', 'Wiz',     ['Mike'],  'Blue'),
  play('Stack', 'Pinch',   ['Will'],  'Orange'),
  play('Stack', 'Pinch',   ['Buck'],  'Orange'),
  play('Stack', 'Contain', ['Buck'],  'Green'),
  play('Stack', 'Contain', ['Will'],  'Green'),
  play('Stack', 'Wiz',     ['Mike'],  'Green'),
  play('Stack', 'Slash',   ['Mike'],  'Green'),
  // 55 (14)
  play('55',    'Pinch',   ['Buck'],  'Blue'),
  play('55',    'Pinch',   ['Will'],  'Blue'),
  play('55',    'Pinch',   ['Fire'],  'Blue'),
  play('55',    'Contain', ['Fire'],  'Blue'),
  play('55',    'Contain', ['Buck'],  'Blue'),
  play('55',    'Contain', ['Will'],  'Blue'),
  play('55',    'Slash',   ['Mike'],  'Blue'),
  play('55',    'Wiz',     ['Mike'],  'Blue'),
  play('55',    'Pinch',   ['Will'],  'Orange'),
  play('55',    'Pinch',   ['Buck'],  'Orange'),
  play('55',    'Contain', ['Buck'],  'Green'),
  play('55',    'Contain', ['Will'],  'Green'),
  play('55',    'Wiz',     ['Mike'],  'Green'),
  play('55',    'Slash',   ['Mike'],  'Green'),
  // ANGLE (9)
  play('Angle', 'Axe',     [],        'Blue'),
  play('Angle', 'Wiz',     ['WiM'],   'Blue'),
  play('Angle', 'Pinch',   ['BuD'],   'Blue'),
  play('Angle', 'Pinch',   ['RoD'],   'Green'),
  play('Angle', 'Pinch',   ['BuD'],   'Green'),
  play('Angle', 'Pinch',   ['Buck'],  'Green'),
  play('Angle', 'Pinch',   ['Dog'],   'Green'),
  play('Angle', 'Wiz',     ['Buck'],  'Green'),
  play('Angle', 'Wiz',     ['Will'],  'Green'),
  // ESPECIAIS (2)
  play('LSU Prevent', 'Contain', [],       'Green'),
  play('Dam',         'Pinch',   ['Blood'],'Green'),
]

export const PLAYS_BY_FRONT = PLAYS.reduce((acc, p) => {
  if (!acc[p.front]) acc[p.front] = []
  acc[p.front].push(p)
  return acc
}, {})

export const FRONT_ORDER = ['Stack', '55', 'Angle', 'LSU Prevent', 'Dam']
