import { describe, it, expect } from 'vitest'
import { PLAYS, PLAYS_BY_FRONT } from './plays.js'

describe('PLAYS', () => {
  it('tem 39 jogadas no total', () => {
    expect(PLAYS).toHaveLength(39)
  })

  it('todas têm id, name, description e 11 players', () => {
    for (const p of PLAYS) {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.players).toHaveLength(11)
    }
  })

  it('todos os players têm x, y, moveTo e role', () => {
    for (const p of PLAYS) {
      for (const player of p.players) {
        expect(typeof player.x).toBe('number')
        expect(typeof player.y).toBe('number')
        expect(player.moveTo).toBeTruthy()
        expect(player.role).toBeTruthy()
      }
    }
  })

  it('Stack tem 14 jogadas', () => {
    expect(PLAYS_BY_FRONT['Stack']).toHaveLength(14)
  })

  it('55 tem 14 jogadas', () => {
    expect(PLAYS_BY_FRONT['55']).toHaveLength(14)
  })

  it('Angle tem 9 jogadas', () => {
    expect(PLAYS_BY_FRONT['Angle']).toHaveLength(9)
  })

  it('ids são únicos', () => {
    const ids = PLAYS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
