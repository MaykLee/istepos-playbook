import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlaySelector from './PlaySelector.jsx'
import { PLAYS } from '../../data/plays.js'

describe('PlaySelector', () => {
  it('renderiza jogadas agrupadas por front', () => {
    render(<PlaySelector plays={PLAYS} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText('Stack')).toBeTruthy()
    expect(screen.getByText('55')).toBeTruthy()
    expect(screen.getByText('Angle')).toBeTruthy()
  })

  it('mostra empty state quando plays está vazio', () => {
    render(<PlaySelector plays={[]} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText(/nenhuma jogada/i)).toBeTruthy()
  })

  it('mostra apenas fronts presentes nas plays passadas', () => {
    const stackOnly = PLAYS.filter(p => p.front === 'Stack')
    render(<PlaySelector plays={stackOnly} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText('Stack')).toBeTruthy()
    expect(screen.queryByText('55')).toBeNull()
  })

  it('chama onSelect ao clicar numa jogada', () => {
    const onSelect = vi.fn()
    render(<PlaySelector plays={PLAYS.slice(0, 3)} selectedId={null} onSelect={onSelect} />)
    screen.getAllByRole('button')[0].click()
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
