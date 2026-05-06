import { useState } from 'react'
import { G } from '../../tokens.js'
import { QUIZ_DEFENSE } from '../../data/quiz.js'

export default function QuizTab() {
  const QUIZ = QUIZ_DEFENSE
  const [qi, setQi]           = useState(0)
  const [chosen, setChosen]   = useState(null)
  const [score, setScore]     = useState(0)
  const [done, setDone]       = useState(false)
  const [answers, setAnswers] = useState([])

  function pick(i) {
    if (chosen !== null) return
    setChosen(i)
    const correct = i === QUIZ[qi].ans
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, { q: QUIZ[qi].q, chosen: i, ans: QUIZ[qi].ans, exp: QUIZ[qi].exp, correct }])
  }
  function next() { qi + 1 >= QUIZ.length ? setDone(true) : (setQi(q => q + 1), setChosen(null)) }
  function restart() { setQi(0); setChosen(null); setScore(0); setDone(false); setAnswers([]) }

  if (done) {
    const pct = Math.round((score / QUIZ.length) * 100)
    const rank = pct >= 90 ? 'Mestre da Defesa' : pct >= 70 ? 'Veterano' : pct >= 50 ? 'Recruta Promissor' : 'Calouro'
    return (
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontFamily: G.sr, fontSize: 32, color: G.au, marginBottom: 4 }}>{rank}</div>
        <div style={{ fontSize: 13, color: G.mu, fontFamily: G.mo, marginBottom: 20 }}>{score}/{QUIZ.length} corretas — {pct}% de acerto</div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginBottom: 24 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? G.gr : pct >= 50 ? G.au : G.rd, borderRadius: 3 }} />
        </div>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {answers.map((a, i) => (
            <div key={i} style={{ background: G.s, border: `1px solid ${a.correct ? 'rgba(93,175,108,0.3)' : 'rgba(212,91,91,0.3)'}`, borderRadius: 7, padding: '10px 14px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: a.correct ? G.gr : G.rd }}>{a.correct ? '✓' : '✗'}</span>
                <span style={{ fontSize: 11, color: G.mu2, flex: 1 }}>{a.q}</span>
              </div>
              {!a.correct && <div style={{ fontSize: 10, color: G.am, fontFamily: G.mo, lineHeight: 1.4, paddingLeft: 20 }}>{a.exp}</div>}
            </div>
          ))}
        </div>
        <button onClick={restart} style={{ background: G.aul, border: `1px solid ${G.au}`, borderRadius: 6, padding: '8px 24px', color: G.au, cursor: 'pointer', fontSize: 12, fontFamily: G.mo }}>jogar novamente</button>
      </div>
    )
  }

  const curr = QUIZ[qi]
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: G.mu, fontFamily: G.mo }}>{qi + 1}/{QUIZ.length}</span>
        <span style={{ fontSize: 11, color: G.au, fontFamily: G.mo }}>{score} XP</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${(qi / QUIZ.length) * 100}%`, background: G.au, borderRadius: 2 }} />
      </div>
      <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.2)`, borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: G.mu, fontFamily: G.mo, marginBottom: 8 }}>SITUAÇÃO</div>
        <div style={{ fontSize: 15, color: G.tx, lineHeight: 1.6, fontFamily: G.sr }}>{curr.q}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {curr.opts.map((o, i) => {
          let bc = 'rgba(201,162,39,0.15)', tc = G.mu2, bg = G.s
          if (chosen !== null) {
            if (i === curr.ans)                           { bc = `${G.gr}50`; tc = G.gr; bg = `${G.gr}0a` }
            else if (i === chosen && chosen !== curr.ans) { bc = `${G.rd}50`; tc = G.rd; bg = `${G.rd}0a` }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${bc}`, borderRadius: 7, padding: '10px 14px', textAlign: 'left', cursor: chosen !== null ? 'default' : 'pointer', color: tc, fontSize: 12, lineHeight: 1.4, transition: 'all .15s', fontFamily: 'system-ui,sans-serif' }}>
              <span style={{ fontFamily: G.mo, color: G.mu, marginRight: 8, fontSize: 10 }}>{String.fromCharCode(65 + i)}.</span>{o}
            </button>
          )
        })}
      </div>
      {chosen !== null && (
        <div>
          <div style={{ background: chosen === curr.ans ? `${G.gr}12` : `${G.am}12`, border: `1px solid ${chosen === curr.ans ? `${G.gr}30` : `${G.am}30`}`, borderRadius: 7, padding: '10px 14px', marginBottom: 12, fontSize: 11, color: G.mu2, lineHeight: 1.5 }}>
            <span style={{ color: chosen === curr.ans ? G.gr : G.am, fontFamily: G.mo, marginRight: 6 }}>{chosen === curr.ans ? '✓ CORRETO' : '→ REVISÃO'}</span>{curr.exp}
          </div>
          <button onClick={next} style={{ width: '100%', background: G.aul, border: `1px solid ${G.au}`, borderRadius: 6, padding: 9, color: G.au, cursor: 'pointer', fontSize: 12, fontFamily: G.mo }}>
            {qi + 1 >= QUIZ.length ? 'ver resultado →' : 'próxima →'}
          </button>
        </div>
      )}
    </div>
  )
}
