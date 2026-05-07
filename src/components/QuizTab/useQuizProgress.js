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
    return raw ? JSON.parse(raw) : defaultProgress()
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
        byCategory: { ...prev.byCategory }
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
