import { useState } from 'react'

const KEY = 'istepos_quiz_progress'

function defaultProgress() {
  return {
    xp: 0,
    history: [],
    byCategory: {
      Defense:    { correct: 0, total: 0 },
      Coverage:   { correct: 0, total: 0 },
      Situations: { correct: 0, total: 0 },
    }
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    const parsed = JSON.parse(raw)
    const def = defaultProgress()
    return {
      xp:         typeof parsed.xp === 'number' ? parsed.xp : def.xp,
      history:    Array.isArray(parsed.history) ? parsed.history : def.history,
      byCategory: {
        Defense:    { ...def.byCategory.Defense,    ...(parsed.byCategory?.Defense    ?? {}) },
        Coverage:   { ...def.byCategory.Coverage,   ...(parsed.byCategory?.Coverage   ?? {}) },
        Situations: { ...def.byCategory.Situations, ...(parsed.byCategory?.Situations ?? {}) },
      }
    }
  } catch {
    return defaultProgress()
  }
}

export default function useQuizProgress() {
  const [progress, setProgress] = useState(load)

  function addResult(category, score, total) {
    setProgress(prev => {
      const next = {
        xp: prev.xp + score,
        history: [
          ...prev.history,
          { date: new Date().toISOString(), category, score, total }
        ],
        byCategory: Object.fromEntries(
          Object.entries(prev.byCategory).map(([k, v]) => [k, { ...v }])
        )
      }
      if (['Defense', 'Coverage', 'Situations'].includes(category)) {
        next.byCategory[category] = {
          correct: prev.byCategory[category].correct + score,
          total:   prev.byCategory[category].total + total,
        }
      }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  function resetProgress() {
    localStorage.removeItem(KEY)
    setProgress(defaultProgress())
  }

  return { progress, addResult, resetProgress }
}
