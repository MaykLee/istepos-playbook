import { describe, it, expect } from 'vitest'
import { buildDynamicPlay, findCataloguedPlay } from './PlayBuilder.jsx'

describe('findCataloguedPlay', () => {
  it('encontra jogada existente', () => {
    const play = findCataloguedPlay('Stack', 'Pinch', ['Buck'], 'Blue')
    expect(play).toBeTruthy()
    expect(play.name).toBe('Stack Pinch Buck Blue')
  })

  it('retorna null para combinação não catalogada', () => {
    expect(findCataloguedPlay('Stack', 'Pinch', ['Mike'], 'Orange')).toBeNull()
  })

  it('encontra jogada sem modifier (Angle Axe Blue)', () => {
    const play = findCataloguedPlay('Angle', 'Axe', [], 'Blue')
    expect(play).toBeTruthy()
    expect(play.name).toBe('Angle Axe Blue')
  })
})

describe('buildDynamicPlay', () => {
  it('retorna objeto com campos obrigatórios', () => {
    const play = buildDynamicPlay('Stack', 'Pinch', [], 'Blue')
    expect(play.id).toBeTruthy()
    expect(play.name).toBe('Stack Pinch Blue')
    expect(play.players).toHaveLength(11)
    expect(play.description).toBeTruthy()
    expect(play.catalogued).toBe(false)
  })

  it('inclui modifier no nome', () => {
    const play = buildDynamicPlay('Stack', 'Pinch', ['Mike'], 'Orange')
    expect(play.name).toBe('Stack Pinch Mike Orange')
  })

  it('todos os players têm x, y, moveTo, role', () => {
    const play = buildDynamicPlay('55', 'Contain', ['Buck'], 'Green')
    for (const p of play.players) {
      expect(typeof p.x).toBe('number')
      expect(typeof p.y).toBe('number')
      expect(p.moveTo).toBeTruthy()
      expect(p.role).toBeTruthy()
    }
  })
})
