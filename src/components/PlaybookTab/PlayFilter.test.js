import { describe, it, expect } from 'vitest'
import { filterPlays } from './PlayFilter.jsx'
import { PLAYS } from '../../data/plays.js'

describe('filterPlays', () => {
  it('sem filtros retorna todas as jogadas', () => {
    expect(filterPlays(PLAYS, '', [], [])).toHaveLength(39)
  })

  it('filtra por texto parcial (case-insensitive)', () => {
    const result = filterPlays(PLAYS, 'stack', [], [])
    expect(result.length).toBeGreaterThan(0)
    result.forEach(p => expect(p.name.toLowerCase()).toContain('stack'))
  })

  it('filtra por front', () => {
    const result = filterPlays(PLAYS, '', ['Stack'], [])
    expect(result).toHaveLength(14)
    result.forEach(p => expect(p.front).toBe('Stack'))
  })

  it('filtra por coverage', () => {
    const result = filterPlays(PLAYS, '', [], ['Blue'])
    result.forEach(p => expect(p.coverage).toBe('Blue'))
  })

  it('combina text + front + coverage', () => {
    const result = filterPlays(PLAYS, 'Pinch', ['Stack'], ['Blue'])
    result.forEach(p => {
      expect(p.name.toLowerCase()).toContain('pinch')
      expect(p.front).toBe('Stack')
      expect(p.coverage).toBe('Blue')
    })
  })

  it('retorna array vazio quando nada bate', () => {
    expect(filterPlays(PLAYS, 'xyzxyz', [], [])).toHaveLength(0)
  })

  it('múltiplos fronts (multi-select)', () => {
    const result = filterPlays(PLAYS, '', ['Stack', '55'], [])
    expect(result.length).toBe(28)
    result.forEach(p => expect(['Stack', '55']).toContain(p.front))
  })
})
