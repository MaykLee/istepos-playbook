import { describe, it, expect } from 'vitest'
import { BASES, buildPlayers } from './formations.js'

describe('BASES', () => {
  it('Stack tem 11 jogadores definidos', () => {
    expect(Object.keys(BASES.Stack)).toHaveLength(11)
  })

  it('todos os fronts têm FS e N', () => {
    for (const front of Object.keys(BASES)) {
      expect(BASES[front]).toHaveProperty('N')
      expect(BASES[front]).toHaveProperty('FS')
    }
  })
})

describe('buildPlayers', () => {
  it('retorna 11 jogadores para Stack Pinch Buck', () => {
    const players = buildPlayers('Stack', 'Pinch', ['Buck'], {})
    expect(players).toHaveLength(11)
  })

  it('Buck blitzando tem moveTo diferente da posição base', () => {
    const players = buildPlayers('Stack', 'Pinch', ['Buck'], {})
    const buck = players.find(p => p.id === 'B')
    expect(buck.moveTo.y).not.toBe(buck.y)
  })

  it('jogador sem movimento tem moveTo igual à posição base', () => {
    const players = buildPlayers('Stack', 'Pinch', ['Buck'], {})
    const fs = players.find(p => p.id === 'FS')
    expect(fs.moveTo).toEqual({ x: fs.x, y: fs.y })
  })

  it('Fire move Will e Buck', () => {
    const players = buildPlayers('Stack', 'Pinch', ['Fire'], {})
    const will = players.find(p => p.id === 'W')
    const buck = players.find(p => p.id === 'B')
    expect(will.moveTo.y).not.toBe(will.y)
    expect(buck.moveTo.y).not.toBe(buck.y)
  })
})
