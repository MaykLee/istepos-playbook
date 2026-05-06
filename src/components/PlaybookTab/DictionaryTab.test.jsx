import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import DictionaryTab from './DictionaryTab.jsx'

describe('DictionaryTab', () => {
  it('renderiza FRONTS por padrão', () => {
    render(<DictionaryTab />)
    expect(screen.getByText('Stack')).toBeTruthy()
    expect(screen.getByText('Angle')).toBeTruthy()
  })

  it('tem os 4 botões de categoria', () => {
    render(<DictionaryTab />)
    expect(screen.getByText('FRONTS')).toBeTruthy()
    expect(screen.getByText('STUNTS')).toBeTruthy()
    expect(screen.getByText('BLITZES')).toBeTruthy()
    expect(screen.getByText('COVERAGES')).toBeTruthy()
  })

  it('muda para STUNTS ao clicar', async () => {
    render(<DictionaryTab />)
    await userEvent.click(screen.getByText('STUNTS'))
    expect(screen.getByText('Pinch')).toBeTruthy()
    expect(screen.getByText('Contain')).toBeTruthy()
  })

  it('muda para BLITZES ao clicar', async () => {
    render(<DictionaryTab />)
    await userEvent.click(screen.getByText('BLITZES'))
    expect(screen.getByText('Buck')).toBeTruthy()
  })

  it('muda para COVERAGES ao clicar', async () => {
    render(<DictionaryTab />)
    await userEvent.click(screen.getByText('COVERAGES'))
    expect(screen.getByText('Blue (Cover 2)')).toBeTruthy()
  })
})
