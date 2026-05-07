import { describe, it, expect } from 'vitest'
import { QUIZ_DEFENSE, QUIZ_COVERAGE, QUIZ_SITUATIONS } from './quiz.js'

function checkShape(q) {
  expect(q.q).toBeTruthy()
  expect(q.opts).toHaveLength(4)
  expect(typeof q.ans).toBe('number')
  expect(q.ans).toBeGreaterThanOrEqual(0)
  expect(q.ans).toBeLessThan(4)
  expect(q.exp).toBeTruthy()
}

describe('QUIZ_DEFENSE', () => {
  it('tem 15 perguntas', () => { expect(QUIZ_DEFENSE).toHaveLength(15) })
  it('todas têm campos obrigatórios', () => { QUIZ_DEFENSE.forEach(checkShape) })
})

describe('QUIZ_COVERAGE', () => {
  it('tem 8 perguntas', () => { expect(QUIZ_COVERAGE).toHaveLength(8) })
  it('todas têm campos obrigatórios', () => { QUIZ_COVERAGE.forEach(checkShape) })
  it('todas têm playId', () => { QUIZ_COVERAGE.forEach(q => expect(q.playId).toBeTruthy()) })
})

describe('QUIZ_SITUATIONS', () => {
  it('tem 8 perguntas', () => { expect(QUIZ_SITUATIONS).toHaveLength(8) })
  it('todas têm campos obrigatórios', () => { QUIZ_SITUATIONS.forEach(checkShape) })
})
