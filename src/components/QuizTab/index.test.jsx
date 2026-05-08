import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import QuizTab from './index.jsx'

describe('QuizTab', () => {
  beforeEach(() => { localStorage.clear() })

  it('mostra seletor de categoria na tela inicial', () => {
    render(<QuizTab />)
    expect(screen.getByText('DEFESA')).toBeTruthy()
    expect(screen.getByText('COBERTURAS')).toBeTruthy()
    expect(screen.getByText('SITUAÇÕES')).toBeTruthy()
    expect(screen.getByText('MODO GERAL')).toBeTruthy()
    expect(screen.getByText('POR JOGADA')).toBeTruthy()
  })

  it('clicar em Defesa leva para a tela de quiz', () => {
    render(<QuizTab />)
    fireEvent.click(screen.getByText('DEFESA'))
    expect(screen.getByText(/1\s*\/\s*\d+/)).toBeTruthy()
  })

  it('mostra painel de stats quando há histórico no localStorage', () => {
    localStorage.setItem('istepos_quiz_progress', JSON.stringify({
      xp: 15,
      history: [{ date: '2026-05-07T00:00:00Z', category: 'Defense', score: 8, total: 10 }],
      byCategory: {
        Defense:    { correct: 8, total: 10 },
        Coverage:   { correct: 0, total: 0 },
        Situations: { correct: 0, total: 0 },
      }
    }))
    render(<QuizTab />)
    expect(screen.getByText('15')).toBeTruthy()
    expect(screen.getAllByText('XP').length).toBeGreaterThan(0)
  })
})
