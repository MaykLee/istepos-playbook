import { useState } from 'react'
import { G } from '../tokens.js'

const KEY = 'istepos_access'
const CORRECT = import.meta.env.VITE_APP_PASSWORD

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(KEY) === '1')
  const [input, setInput]       = useState('')
  const [error, setError]       = useState(false)
  const [shake, setShake]       = useState(false)

  if (unlocked) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (input === CORRECT) {
      sessionStorage.setItem(KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 400)
    }
  }

  return (
    <div style={{
      background: G.bg,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <img src="/istepos-logo.png" alt="ISTEPOS" style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 20 }} />
      <div style={{ fontFamily: G.mo, fontSize: 22, color: G.wh, letterSpacing: 4, marginBottom: 4 }}>ISTEPOS</div>
      <div style={{ fontFamily: G.mo, fontSize: 10, color: G.cr, letterSpacing: 3, marginBottom: 40 }}>DEFENSIVE PLAYBOOK · 2026</div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          maxWidth: 320,
          animation: shake ? 'shake .4s ease' : 'none',
        }}
      >
        <input
          type="password"
          placeholder="Senha de acesso"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          autoFocus
          style={{
            background: G.s,
            border: `1px solid ${error ? G.cr : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 6,
            color: G.wh,
            fontFamily: G.mo,
            fontSize: 16,
            padding: '12px 16px',
            outline: 'none',
            transition: 'border-color .2s',
          }}
        />
        {error && (
          <div style={{ color: G.cr, fontFamily: G.mo, fontSize: 12, letterSpacing: 1, textAlign: 'center' }}>
            SENHA INCORRETA
          </div>
        )}
        <button
          type="submit"
          style={{
            background: G.cr,
            color: G.wh,
            border: 'none',
            borderRadius: 6,
            fontFamily: G.mo,
            fontSize: 14,
            letterSpacing: 2,
            padding: '12px 0',
            cursor: 'pointer',
          }}
        >
          ENTRAR
        </button>
      </form>
    </div>
  )
}
