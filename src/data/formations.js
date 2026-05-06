// SVG field: viewBox "0 0 400 280", LOS at y=190
// y increases downward. DL at ~y=172, LBs ~y=148, DBs ~y=130, FS at y=65

export const FIELD = { w: 400, h: 280, los: 190 }

export const BASES = {
  Stack: {
    N:        { x: 200, y: 172 },
    E_left:   { x: 148, y: 172 },
    E_right:  { x: 252, y: 172 },
    M:        { x: 200, y: 150 },
    B:        { x: 232, y: 150 },
    W:        { x: 168, y: 150 },
    D:        { x: 268, y: 146 },
    R:        { x: 132, y: 146 },
    CB_left:  { x: 55,  y: 138 },
    CB_right: { x: 345, y: 138 },
    FS:       { x: 200, y: 65  },
  },
  '55': {
    N:        { x: 186, y: 172 },
    E_left:   { x: 140, y: 172 },
    E_right:  { x: 252, y: 172 },
    M:        { x: 204, y: 148 },
    B:        { x: 246, y: 148 },
    W:        { x: 162, y: 148 },
    D:        { x: 126, y: 146 },
    R:        { x: 274, y: 146 },
    CB_left:  { x: 55,  y: 138 },
    CB_right: { x: 345, y: 138 },
    FS:       { x: 200, y: 65  },
  },
  Angle: {
    N:        { x: 214, y: 172 },
    E_left:   { x: 152, y: 172 },
    E_right:  { x: 260, y: 172 },
    M:        { x: 228, y: 150 },
    B:        { x: 264, y: 148 },
    W:        { x: 160, y: 148 },
    D:        { x: 128, y: 146 },
    R:        { x: 290, y: 146 },
    CB_left:  { x: 55,  y: 138 },
    CB_right: { x: 345, y: 138 },
    FS:       { x: 200, y: 65  },
  },
  'LSU Prevent': {
    N:        { x: 200, y: 172 },
    E_left:   { x: 148, y: 172 },
    E_right:  { x: 252, y: 172 },
    M:        { x: 200, y: 148 },
    B:        { x: 252, y: 138 },
    W:        { x: 148, y: 138 },
    D:        { x: 295, y: 128 },
    R:        { x: 105, y: 128 },
    CB_left:  { x: 55,  y: 118 },
    CB_right: { x: 345, y: 118 },
    FS:       { x: 200, y: 55  },
  },
  Dam: {
    N:        { x: 200, y: 172 },
    E_left:   { x: 148, y: 172 },
    E_right:  { x: 252, y: 172 },
    M:        { x: 200, y: 150 },
    B:        { x: 240, y: 148 },
    W:        { x: 160, y: 148 },
    D:        { x: 274, y: 146 },
    R:        { x: 126, y: 146 },
    CB_left:  { x: 55,  y: 138 },
    CB_right: { x: 345, y: 138 },
    FS:       { x: 200, y: 65  },
  },
}

export const STUNT_MOVES = {
  Pinch:   { E_left: { x: 174, y: 182 }, E_right: { x: 226, y: 182 }, N: { x: 200, y: 182 } },
  Contain: { E_left: { x: 130, y: 182 }, E_right: { x: 270, y: 182 }, N: { x: 200, y: 182 } },
  Slash:   { E_left: { x: 182, y: 182 }, E_right: { x: 272, y: 180 }, N: { x: 192, y: 182 } },
  Wiz:     { E_left: { x: 158, y: 182 }, E_right: { x: 236, y: 182 }, N: { x: 212, y: 182 } },
  Axe:     { E_left: { x: 148, y: 182 }, E_right: { x: 252, y: 182 }, N: { x: 200, y: 182 } },
}

export const BLITZ_MOVES = {
  Buck:  { B: { x: 234, y: 166 } },
  Will:  { W: { x: 166, y: 166 } },
  Mike:  { M: { x: 200, y: 162 } },
  Fire:  { W: { x: 166, y: 166 }, B: { x: 234, y: 166 } },
  WiM:   { W: { x: 172, y: 164 }, M: { x: 205, y: 162 } },
  BuD:   { B: { x: 234, y: 166 }, D: { x: 262, y: 162 } },
  RoD:   { R: { x: 138, y: 162 }, D: { x: 262, y: 162 } },
  Dog:   { D: { x: 262, y: 162 } },
  Rover: { R: { x: 138, y: 162 } },
  Blood: { B: { x: 234, y: 166 }, W: { x: 166, y: 166 }, M: { x: 200, y: 162 } },
}

export const POSITION_NAMES = {
  N: 'Nose Tackle', E_left: 'Defensive End (Esq)', E_right: 'Defensive End (Dir)',
  M: 'Mike LB', B: 'Buck LB', W: 'Will LB', D: 'Dog', R: 'Rover',
  CB_left: 'Cornerback (Esq)', CB_right: 'Cornerback (Dir)', FS: 'Free Safety',
}

export function buildPlayers(front, stunt, modifier, roles) {
  const base = BASES[front]
  const stuntMoves = STUNT_MOVES[stunt] || {}
  const blitzMoves = modifier.reduce((acc, m) => {
    const moves = BLITZ_MOVES[m] || {}
    return { ...acc, ...moves }
  }, {})

  return Object.entries(base).map(([id, pos]) => ({
    id,
    label: id.startsWith('CB') ? 'CB' : id.startsWith('E_') ? 'E' : id,
    name: POSITION_NAMES[id] || id,
    x: pos.x,
    y: pos.y,
    moveTo: blitzMoves[id] || stuntMoves[id] || { x: pos.x, y: pos.y },
    role: roles[id] || 'Mantém gap de responsabilidade.',
  }))
}
