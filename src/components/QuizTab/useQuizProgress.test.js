import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import useQuizProgress from './useQuizProgress.js'

describe('useQuizProgress', () => {
  beforeEach(() => { localStorage.clear() })

  it('inicia com progresso vazio', () => {
    const { result } = renderHook(() => useQuizProgress())
    expect(result.current.progress.xp).toBe(0)
    expect(result.current.progress.history).toHaveLength(0)
    expect(result.current.progress.byCategory.Defense.total).toBe(0)
  })

  it('addResult atualiza xp, history e byCategory', () => {
    const { result } = renderHook(() => useQuizProgress())
    act(() => { result.current.addResult('Defense', 7, 10) })
    expect(result.current.progress.xp).toBe(7)
    expect(result.current.progress.history).toHaveLength(1)
    expect(result.current.progress.history[0]).toMatchObject({ category: 'Defense', score: 7, total: 10 })
    expect(result.current.progress.byCategory.Defense).toEqual({ correct: 7, total: 10 })
  })

  it('acumula xp ao longo de múltiplas sessões', () => {
    const { result } = renderHook(() => useQuizProgress())
    act(() => { result.current.addResult('Coverage', 5, 8) })
    act(() => { result.current.addResult('Coverage', 6, 8) })
    expect(result.current.progress.xp).toBe(11)
    expect(result.current.progress.byCategory.Coverage).toEqual({ correct: 11, total: 16 })
  })

  it('persiste no localStorage', () => {
    const { result } = renderHook(() => useQuizProgress())
    act(() => { result.current.addResult('Defense', 5, 10) })
    const stored = JSON.parse(localStorage.getItem('istepos_quiz_progress'))
    expect(stored.xp).toBe(5)
    expect(stored.history).toHaveLength(1)
  })

  it('carrega dados existentes do localStorage', () => {
    localStorage.setItem('istepos_quiz_progress', JSON.stringify({
      xp: 20,
      history: [{ date: '2026-05-07T00:00:00Z', category: 'Defense', score: 8, total: 10 }],
      byCategory: {
        Defense:    { correct: 8, total: 10 },
        Coverage:   { correct: 0, total: 0 },
        Situations: { correct: 0, total: 0 },
      }
    }))
    const { result } = renderHook(() => useQuizProgress())
    expect(result.current.progress.xp).toBe(20)
    expect(result.current.progress.history).toHaveLength(1)
  })

  it('resetProgress limpa estado e localStorage', () => {
    const { result } = renderHook(() => useQuizProgress())
    act(() => { result.current.addResult('Defense', 8, 10) })
    act(() => { result.current.resetProgress() })
    expect(result.current.progress.xp).toBe(0)
    expect(result.current.progress.history).toHaveLength(0)
    expect(localStorage.getItem('istepos_quiz_progress')).toBeNull()
  })

  it('categoria All não atualiza byCategory', () => {
    const { result } = renderHook(() => useQuizProgress())
    act(() => { result.current.addResult('All', 10, 26) })
    expect(result.current.progress.xp).toBe(10)
    expect(result.current.progress.byCategory.Defense.total).toBe(0)
  })

  it('tolera schema desatualizado no localStorage (faltando byCategory)', () => {
    localStorage.setItem('istepos_quiz_progress', JSON.stringify({ xp: 5, history: [] }))
    const { result } = renderHook(() => useQuizProgress())
    expect(result.current.progress.xp).toBe(5)
    expect(result.current.progress.byCategory.Defense.total).toBe(0)
    // Must not throw when addResult is called
    act(() => { result.current.addResult('Defense', 3, 5) })
    expect(result.current.progress.xp).toBe(8)
  })
})
