import { describe, it, expect } from 'vitest'
import { DICT_FRONTS, DICT_STUNTS, DICT_BLITZES, DICT_COVERAGES } from './dictionary.js'

describe('dictionary', () => {
  const requiredFields = (arr) => {
    for (const d of arr) {
      expect(d.id, `${d.name} falta id`).toBeTruthy()
      expect(d.name, `${d.id} falta name`).toBeTruthy()
      expect(d.colorKey, `${d.id} falta colorKey`).toBeTruthy()
      expect(d.desc, `${d.id} falta desc`).toBeTruthy()
      expect(d.detail, `${d.id} falta detail`).toBeTruthy()
    }
  }

  it('DICT_FRONTS tem 5 entries com campos obrigatórios', () => {
    expect(DICT_FRONTS).toHaveLength(5)
    requiredFields(DICT_FRONTS)
  })

  it('DICT_STUNTS tem 5 entries com campos obrigatórios', () => {
    expect(DICT_STUNTS).toHaveLength(5)
    requiredFields(DICT_STUNTS)
  })

  it('DICT_BLITZES tem 9 entries com campos obrigatórios', () => {
    expect(DICT_BLITZES).toHaveLength(9)
    requiredFields(DICT_BLITZES)
  })

  it('DICT_COVERAGES tem 4 entries com campos obrigatórios', () => {
    expect(DICT_COVERAGES).toHaveLength(4)
    requiredFields(DICT_COVERAGES)
  })
})
