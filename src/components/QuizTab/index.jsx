import { useState, useRef, useEffect } from 'react'
import { G } from '../../tokens.js'
import { QUIZ_DEFENSE, QUIZ_COVERAGE, QUIZ_SITUATIONS, generatePlayQuiz } from '../../data/quiz.js'
import { PLAYS, PLAYS_BY_FRONT, FRONT_ORDER } from '../../data/plays.js'
import FieldDiagram from '../PlaybookTab/FieldDiagram.jsx'
import useQuizProgress from './useQuizProgress.js'

const QUIZ_POOLS = {
  Defense:    QUIZ_DEFENSE,
  Coverage:   QUIZ_COVERAGE,
  Situations: QUIZ_SITUATIONS,
  All:        [...QUIZ_DEFENSE, ...QUIZ_COVERAGE, ...QUIZ_SITUATIONS],
}

const CAT_LABELS = {
  Defense: 'Defesa', Coverage: 'Coberturas', Situations: 'Situações', All: 'Todas', PlayQuiz: 'Por Jogada',
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizTab() {
  const { progress, addResult, resetProgress } = useQuizProgress()
  const [screen, setScreen]           = useState('home')
  const [category, setCategory]       = useState('Defense')
  const [quiz, setQuiz]               = useState([])
  const [qi, setQi]                   = useState(0)
  const [chosen, setChosen]           = useState(null)
  const [answers, setAnswers]         = useState([])
  const [screenFlash, setScreenFlash] = useState(null)
  const [xpFloat, setXpFloat]         = useState(null)
  const [selectedPlay, setSelectedPlay] = useState(null)

  const timersRef = useRef([])
  useEffect(() => () => { timersRef.current.forEach(clearTimeout) }, [])

  function startQuiz(cat) {
    if (cat === 'PlayQuiz') { setScreen('play-select'); return }
    setCategory(cat)
    setQuiz(shuffle(QUIZ_POOLS[cat]))
    setQi(0); setChosen(null); setAnswers([])
    setXpFloat(null); setScreenFlash(null)
    setScreen('quiz')
  }

  function startPlayQuiz(play) {
    setSelectedPlay(play)
    setCategory('PlayQuiz')
    setQuiz(generatePlayQuiz(play))
    setQi(0); setChosen(null); setAnswers([])
    setXpFloat(null); setScreenFlash(null)
    setScreen('quiz')
  }

  function pick(i) {
    if (chosen !== null) return
    setChosen(i)
    const correct = i === quiz[qi].ans
    if (correct) {
      setScreenFlash('correct')
      setXpFloat({ key: Date.now() })
      timersRef.current.push(setTimeout(() => { setScreenFlash(null); setXpFloat(null) }, 800))
    } else {
      setScreenFlash('wrong')
      timersRef.current.push(setTimeout(() => setScreenFlash(null), 300))
    }
    setAnswers(a => [...a, { q: quiz[qi].q, chosen: i, ans: quiz[qi].ans, exp: quiz[qi].exp, correct }])
  }

  function next() {
    if (qi + 1 >= quiz.length) {
      const finalScore = answers.filter(a => a.correct).length
      addResult(category, finalScore, quiz.length)
      setScreen('result')
    } else {
      setQi(q => q + 1)
      setChosen(null)
    }
  }

  // ── HOME SCREEN ─────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '20px 0' }}>
        {/* Stats panel — visível apenas se há histórico */}
        {progress.history.length > 0 && (
          <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.2)`, borderRadius: 10, padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: G.mo, fontSize: 11, color: G.mu }}>XP TOTAL</span>
              <span style={{ fontFamily: G.mo, fontSize: 22, color: G.au }}>{progress.xp} XP</span>
            </div>
            {['Defense', 'Coverage', 'Situations'].map(cat => {
              const { correct, total } = progress.byCategory[cat]
              const pct = total > 0 ? Math.round((correct / total) * 100) : 0
              return (
                <div key={cat} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontFamily: G.mo, fontSize: 10, color: G.mu2 }}>{CAT_LABELS[cat]}</span>
                    <span style={{ fontFamily: G.mo, fontSize: 10, color: G.mu }}>{total > 0 ? `${pct}%` : '—'}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                    {total > 0 && (
                      <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? G.gr : pct >= 50 ? G.au : G.rd, borderRadius: 2 }} />
                    )}
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, marginBottom: 6 }}>ÚLTIMAS PARTIDAS</div>
              {[...progress.history].reverse().slice(0, 3).map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: G.mu2, marginBottom: 4, fontFamily: G.mo }}>
                  <span>{CAT_LABELS[h.category] || h.category}</span>
                  <span>{h.score}/{h.total} — {new Date(h.date).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { if (window.confirm('Resetar todo o progresso?')) resetProgress() }}
              style={{ marginTop: 10, background: 'none', border: `1px solid rgba(212,91,91,0.3)`, borderRadius: 5, padding: '4px 12px', color: G.rd, cursor: 'pointer', fontSize: 10, fontFamily: G.mo }}
            >
              resetar progresso
            </button>
          </div>
        )}
        {/* Categoria selector */}
        <div style={{ fontFamily: G.mo, fontSize: 11, color: G.mu, marginBottom: 12 }}>ESCOLHA A CATEGORIA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Defense', 'Coverage', 'Situations', 'All'].map(cat => (
            <button key={cat} onClick={() => startQuiz(cat)} style={{
              background: G.aul, border: `1px solid rgba(201,162,39,0.3)`, borderRadius: 7,
              padding: '12px 16px', textAlign: 'left', cursor: 'pointer', color: G.tx,
              fontSize: 13, fontFamily: 'system-ui,sans-serif',
            }}>
              <span style={{ fontFamily: G.mo, color: G.au, marginRight: 8 }}>{CAT_LABELS[cat]}</span>
              <span style={{ fontSize: 11, color: G.mu }}>{QUIZ_POOLS[cat].length} perguntas</span>
            </button>
          ))}
          <button onClick={() => startQuiz('PlayQuiz')} style={{
            background: 'rgba(93,175,108,0.08)', border: `1px solid rgba(93,175,108,0.3)`, borderRadius: 7,
            padding: '12px 16px', textAlign: 'left', cursor: 'pointer', color: G.tx,
            fontSize: 13, fontFamily: 'system-ui,sans-serif',
          }}>
            <span style={{ fontFamily: G.mo, color: G.gr, marginRight: 8 }}>Por Jogada</span>
            <span style={{ fontSize: 11, color: G.mu }}>4 perguntas geradas da jogada</span>
          </button>
        </div>
      </div>
    )
  }

  // ── PLAY SELECT SCREEN ──────────────────────────────────────
  if (screen === 'play-select') {
    return (
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '20px 0' }}>
        <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: G.mu, cursor: 'pointer', fontSize: 12, fontFamily: G.mo, marginBottom: 16, padding: 0 }}>← voltar</button>
        <div style={{ fontFamily: G.mo, fontSize: 11, color: G.mu, marginBottom: 16 }}>ESCOLHA A JOGADA</div>
        {FRONT_ORDER.filter(f => PLAYS_BY_FRONT[f]).map(front => (
          <div key={front} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: G.mo, fontSize: 10, color: G.au, marginBottom: 8, letterSpacing: 1 }}>{front.toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PLAYS_BY_FRONT[front].map(play => (
                <button key={play.id} onClick={() => startPlayQuiz(play)} style={{
                  background: G.s, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 7,
                  padding: '10px 14px', textAlign: 'left', cursor: 'pointer', color: G.tx,
                  fontSize: 12, fontFamily: 'system-ui,sans-serif',
                }}>
                  {play.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── RESULT SCREEN ────────────────────────────────────────────
  if (screen === 'result') {
    const finalScore = answers.filter(a => a.correct).length
    const pct  = Math.round((finalScore / quiz.length) * 100)
    const rank = pct >= 90 ? 'Mestre!' : pct >= 70 ? 'Veterano' : pct >= 50 ? 'Recruta Promissor' : 'Calouro'
    return (
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontFamily: G.sr, fontSize: 32, color: G.au, marginBottom: 4 }}>{rank}</div>
        <div style={{ fontSize: 13, color: G.mu, fontFamily: G.mo, marginBottom: 20 }}>{finalScore}/{quiz.length} corretas — {pct}% de acerto</div>
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
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {category === 'PlayQuiz' ? (
            <>
              <button onClick={() => startPlayQuiz(selectedPlay)} style={{ background: 'rgba(93,175,108,0.1)', border: `1px solid ${G.gr}`, borderRadius: 6, padding: '8px 24px', color: G.gr, cursor: 'pointer', fontSize: 12, fontFamily: G.mo }}>repetir jogada</button>
              <button onClick={() => setScreen('play-select')} style={{ background: G.aul, border: `1px solid ${G.au}`, borderRadius: 6, padding: '8px 24px', color: G.au, cursor: 'pointer', fontSize: 12, fontFamily: G.mo }}>outra jogada</button>
            </>
          ) : (
            <button onClick={() => startQuiz(category)} style={{ background: G.aul, border: `1px solid ${G.au}`, borderRadius: 6, padding: '8px 24px', color: G.au, cursor: 'pointer', fontSize: 12, fontFamily: G.mo }}>jogar novamente</button>
          )}
          <button onClick={() => setScreen('home')} style={{ background: G.s, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 6, padding: '8px 24px', color: G.mu2, cursor: 'pointer', fontSize: 12, fontFamily: G.mo }}>mudar categoria</button>
        </div>
      </div>
    )
  }

  // ── QUIZ SCREEN ──────────────────────────────────────────────
  const curr      = quiz[qi]
  const foundPlay = curr.playId ? (PLAYS.find(p => p.id === curr.playId) ?? null) : null
  const score     = answers.filter(a => a.correct).length

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Flash overlay */}
      {screenFlash && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          background: screenFlash === 'correct' ? 'rgba(93,175,108,0.15)' : 'rgba(212,91,91,0.15)',
          zIndex: 100,
        }} />
      )}
      {/* XP flutuante */}
      {xpFloat && (
        <div key={xpFloat.key} style={{
          position: 'fixed', top: '40%', left: '50%', transform: 'translateX(-50%)',
          fontSize: 24, color: G.gr, fontFamily: G.mo, fontWeight: 'bold',
          animation: 'floatUp 0.8s ease forwards', pointerEvents: 'none', zIndex: 101,
        }}>+1 XP</div>
      )}
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: G.mu, fontFamily: G.mo }}>{qi + 1}/{quiz.length}</span>
        <span style={{ fontSize: 11, color: G.au, fontFamily: G.mo }}>{score} XP</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${(qi / quiz.length) * 100}%`, background: G.au, borderRadius: 2 }} />
      </div>
      {/* FieldDiagram (quando playId existe) */}
      {foundPlay && (
        <div style={{ marginBottom: 14, borderRadius: 8, overflow: 'hidden' }}>
          <FieldDiagram play={foundPlay} onPlayerClick={() => {}} selectedPlayer={null} />
        </div>
      )}
      {/* Pergunta */}
      <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.2)`, borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: G.mu, fontFamily: G.mo, marginBottom: 8 }}>SITUAÇÃO</div>
        <div style={{ fontSize: 15, color: G.tx, lineHeight: 1.6, fontFamily: G.sr }}>{curr.q}</div>
      </div>
      {/* Opções */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {curr.opts.map((o, i) => {
          let bc = 'rgba(201,162,39,0.15)', tc = G.mu2, bg = G.s
          let animStyle = {}
          if (chosen !== null) {
            if (i === curr.ans)                            { bc = `${G.gr}50`; tc = G.gr; bg = `${G.gr}0a` }
            else if (i === chosen && chosen !== curr.ans)  { bc = `${G.rd}50`; tc = G.rd; bg = `${G.rd}0a`; animStyle = { animation: 'shake 0.3s ease' } }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{
              background: bg, border: `1px solid ${bc}`, borderRadius: 7,
              padding: '10px 14px', textAlign: 'left',
              cursor: chosen !== null ? 'default' : 'pointer',
              color: tc, fontSize: 12, lineHeight: 1.4, transition: 'all .15s',
              fontFamily: 'system-ui,sans-serif', ...animStyle,
            }}>
              <span style={{ fontFamily: G.mo, color: G.mu, marginRight: 8, fontSize: 10 }}>{String.fromCharCode(65 + i)}.</span>{o}
            </button>
          )
        })}
      </div>
      {/* Explicação + próxima */}
      {chosen !== null && (
        <div>
          <div style={{ background: chosen === curr.ans ? `${G.gr}12` : `${G.am}12`, border: `1px solid ${chosen === curr.ans ? `${G.gr}30` : `${G.am}30`}`, borderRadius: 7, padding: '10px 14px', marginBottom: 12, fontSize: 11, color: G.mu2, lineHeight: 1.5 }}>
            <span style={{ color: chosen === curr.ans ? G.gr : G.am, fontFamily: G.mo, marginRight: 6 }}>{chosen === curr.ans ? '✓ CORRETO' : '→ REVISÃO'}</span>{curr.exp}
          </div>
          <button onClick={next} style={{ width: '100%', background: G.aul, border: `1px solid ${G.au}`, borderRadius: 6, padding: 9, color: G.au, cursor: 'pointer', fontSize: 12, fontFamily: G.mo }}>
            {qi + 1 >= quiz.length ? 'ver resultado →' : 'próxima →'}
          </button>
        </div>
      )}
    </div>
  )
}
