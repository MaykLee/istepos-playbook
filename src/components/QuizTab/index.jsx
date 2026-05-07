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
  const CATS = [
    { key: 'Defense',    icon: '🛡️', label: 'Defesa',      sub: `${QUIZ_POOLS.Defense.length} perguntas — conceitos, leituras e formações`,    accent: G.au,  accentA: 'rgba(201,162,39,0.14)' },
    { key: 'Coverage',   icon: '📐', label: 'Coberturas',  sub: `${QUIZ_POOLS.Coverage.length} perguntas — com diagrama de campo`,              accent: G.bl,  accentA: 'rgba(91,155,213,0.14)'  },
    { key: 'Situations', icon: '⏱️', label: 'Situações',   sub: `${QUIZ_POOLS.Situations.length} perguntas — down & distance, relógio, placar`, accent: G.am,  accentA: 'rgba(224,160,48,0.14)'  },
    { key: 'PlayQuiz',   icon: '🏟️', label: 'Por Jogada',  sub: '39 jogadas — quiz gerado direto dos dados da jogada',                          accent: G.gr,  accentA: 'rgba(93,175,108,0.14)'  },
    { key: 'All',        icon: '⚡', label: 'Modo Geral',  sub: `${QUIZ_POOLS.All.length} perguntas — tudo misturado`,                          accent: G.mu2, accentA: 'rgba(160,144,128,0.10)' },
  ]

  if (screen === 'home') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 24px' }}>

        {/* ── HEADER CLUBE ── */}
        <div style={{
          background: `linear-gradient(135deg, #1c1508 0%, #0e0e12 60%)`,
          borderBottom: `2px solid ${G.au}`,
          padding: '20px 24px 18px',
          marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <img src="/istepos-logo.png" alt="ISTEPOS" style={{ width: 52, height: 52, objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: G.mo, fontSize: 18, color: G.au, letterSpacing: 3, lineHeight: 1 }}>ISTEPOS</div>
            <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, letterSpacing: 2, marginTop: 4 }}>PLAYBOOK QUIZ</div>
          </div>
          {progress.xp > 0 && (
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontFamily: G.mo, fontSize: 22, color: G.au, lineHeight: 1 }}>{progress.xp}</div>
              <div style={{ fontFamily: G.mo, fontSize: 9, color: G.mu, letterSpacing: 1 }}>XP</div>
            </div>
          )}
        </div>

        <div style={{ padding: '0 16px' }}>

          {/* ── STATS (se há histórico) ── */}
          {progress.history.length > 0 && (
            <div style={{ background: G.s, border: `1px solid rgba(201,162,39,0.15)`, borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                {['Defense', 'Coverage', 'Situations'].map(cat => {
                  const { correct, total } = progress.byCategory[cat]
                  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
                  const c = CATS.find(c => c.key === cat)
                  return (
                    <div key={cat} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontFamily: G.mo, color: c.accent, fontWeight: 'bold' }}>{total > 0 ? `${pct}%` : '—'}</div>
                      <div style={{ fontSize: 9, color: G.mu, fontFamily: G.mo, marginTop: 2 }}>{c.label.toUpperCase()}</div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 6 }}>
                        {total > 0 && <div style={{ height: '100%', width: `${pct}%`, background: c.accent, borderRadius: 2 }} />}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu2 }}>
                  {[...progress.history].reverse().slice(0, 1).map((h, i) => (
                    <span key={i}>{CAT_LABELS[h.category] || h.category} — {h.score}/{h.total} acertos</span>
                  ))}
                </div>
                <button
                  onClick={() => { if (window.confirm('Resetar todo o progresso?')) resetProgress() }}
                  style={{ background: 'none', border: `1px solid rgba(212,91,91,0.3)`, borderRadius: 5, padding: '3px 10px', color: G.rd, cursor: 'pointer', fontSize: 9, fontFamily: G.mo }}
                >resetar</button>
              </div>
            </div>
          )}

          {/* ── CATEGORIAS ── */}
          <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, letterSpacing: 2, marginBottom: 14 }}>ESCOLHA O MODO</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CATS.map(({ key, icon, label, sub, accent, accentA }) => (
              <button key={key} onClick={() => startQuiz(key)} style={{
                background: accentA,
                border: `1px solid ${accent}40`,
                borderLeft: `4px solid ${accent}`,
                borderRadius: 10,
                padding: '16px 20px',
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'border-color .15s, background .15s',
              }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: accent, fontFamily: G.mo, fontSize: 15, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 }}>{label.toUpperCase()}</div>
                  <div style={{ color: G.mu2, fontSize: 12, lineHeight: 1.4 }}>{sub}</div>
                </div>
                <span style={{ color: accent, fontSize: 18, opacity: 0.7 }}>›</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    )
  }

  // ── PLAY SELECT SCREEN ──────────────────────────────────────
  if (screen === 'play-select') {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 24px' }}>
        <div style={{
          background: `linear-gradient(135deg, #0e1a0e 0%, #0e0e12 60%)`,
          borderBottom: `2px solid ${G.gr}`,
          padding: '18px 24px',
          marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: G.mu, cursor: 'pointer', fontSize: 20, padding: 0, lineHeight: 1 }}>‹</button>
          <div>
            <div style={{ fontFamily: G.mo, fontSize: 15, color: G.gr, letterSpacing: 2 }}>POR JOGADA</div>
            <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, marginTop: 3 }}>escolha uma jogada para treinar</div>
          </div>
        </div>
        <div style={{ padding: '0 16px' }}>
          {FRONT_ORDER.filter(f => PLAYS_BY_FRONT[f]).map(front => (
            <div key={front} style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: G.mo, fontSize: 10, color: G.au, letterSpacing: 2, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid rgba(201,162,39,0.15)` }}>{front.toUpperCase()} — {PLAYS_BY_FRONT[front].length} jogadas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PLAYS_BY_FRONT[front].map(play => (
                  <button key={play.id} onClick={() => startPlayQuiz(play)} style={{
                    background: G.s, border: `1px solid rgba(255,255,255,0.08)`,
                    borderLeft: `3px solid ${G.gr}50`,
                    borderRadius: 8,
                    padding: '14px 18px', textAlign: 'left', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ color: G.tx, fontSize: 14, marginBottom: 3 }}>{play.name}</div>
                      <div style={{ color: G.mu, fontSize: 11 }}>{play.stunt} · {play.modifier.length > 0 ? play.modifier.join('+') : 'sem blitz'} · {play.coverage}</div>
                    </div>
                    <span style={{ color: G.gr, fontSize: 18, opacity: 0.6 }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── RESULT SCREEN ────────────────────────────────────────────
  if (screen === 'result') {
    const finalScore = answers.filter(a => a.correct).length
    const pct  = Math.round((finalScore / quiz.length) * 100)
    const rank = pct >= 90 ? 'Mestre!' : pct >= 70 ? 'Veterano' : pct >= 50 ? 'Recruta Promissor' : 'Calouro'
    const rankColor = pct >= 70 ? G.gr : pct >= 50 ? G.au : G.rd
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 24px' }}>
        <div style={{ background: `linear-gradient(135deg,#0e0e12,#161208)`, borderBottom: `2px solid ${rankColor}`, padding: '28px 24px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: G.sr, fontSize: 36, color: rankColor, marginBottom: 6 }}>{rank}</div>
          <div style={{ fontFamily: G.mo, fontSize: 13, color: G.mu }}>{finalScore}/{quiz.length} corretas — {pct}% de acerto</div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginTop: 16, maxWidth: 320, margin: '16px auto 0' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: rankColor, borderRadius: 3 }} />
          </div>
        </div>
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {answers.map((a, i) => (
              <div key={i} style={{ background: G.s, border: `1px solid ${a.correct ? 'rgba(93,175,108,0.25)' : 'rgba(212,91,91,0.25)'}`, borderLeft: `3px solid ${a.correct ? G.gr : G.rd}`, borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, color: a.correct ? G.gr : G.rd, marginTop: 1 }}>{a.correct ? '✓' : '✗'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: G.mu2, marginBottom: a.correct ? 0 : 6, lineHeight: 1.5 }}>{a.q}</div>
                    {!a.correct && <div style={{ fontSize: 12, color: G.am, lineHeight: 1.5 }}>{a.exp}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {category === 'PlayQuiz' ? (
              <>
                <button onClick={() => startPlayQuiz(selectedPlay)} style={{ flex: 1, background: 'rgba(93,175,108,0.12)', border: `1px solid ${G.gr}`, borderRadius: 8, padding: '12px', color: G.gr, cursor: 'pointer', fontSize: 13, fontFamily: G.mo }}>↺ repetir jogada</button>
                <button onClick={() => setScreen('play-select')} style={{ flex: 1, background: G.aul, border: `1px solid ${G.au}`, borderRadius: 8, padding: '12px', color: G.au, cursor: 'pointer', fontSize: 13, fontFamily: G.mo }}>outra jogada →</button>
              </>
            ) : (
              <button onClick={() => startQuiz(category)} style={{ flex: 1, background: G.aul, border: `1px solid ${G.au}`, borderRadius: 8, padding: '12px', color: G.au, cursor: 'pointer', fontSize: 13, fontFamily: G.mo }}>↺ jogar novamente</button>
            )}
            <button onClick={() => setScreen('home')} style={{ flex: 1, background: G.s, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 8, padding: '12px', color: G.mu2, cursor: 'pointer', fontSize: 13, fontFamily: G.mo }}>início</button>
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ SCREEN ──────────────────────────────────────────────
  const curr      = quiz[qi]
  const foundPlay = curr.playId ? (PLAYS.find(p => p.id === curr.playId) ?? null) : null
  const score     = answers.filter(a => a.correct).length
  const catInfo   = CATS.find(c => c.key === category) || CATS[0]

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 24px' }}>
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
          fontSize: 28, color: G.gr, fontFamily: G.mo, fontWeight: 'bold',
          animation: 'floatUp 0.8s ease forwards', pointerEvents: 'none', zIndex: 101,
        }}>+1 XP</div>
      )}
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${catInfo.accent}30`, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: G.mu, cursor: 'pointer', fontSize: 20, padding: 0, lineHeight: 1 }}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${((qi + 1) / quiz.length) * 100}%`, background: catInfo.accent, borderRadius: 2, transition: 'width .3s ease' }} />
          </div>
        </div>
        <span style={{ fontFamily: G.mo, fontSize: 11, color: G.mu, whiteSpace: 'nowrap' }}>{qi + 1} / {quiz.length}</span>
        <span style={{ fontFamily: G.mo, fontSize: 13, color: G.au, minWidth: 48, textAlign: 'right' }}>{score} XP</span>
      </div>
      <div style={{ padding: '0 16px' }}>
      {/* FieldDiagram (quando playId existe) */}
      {foundPlay && (
        <div style={{ marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.06)` }}>
          <FieldDiagram play={foundPlay} onPlayerClick={() => {}} selectedPlayer={null} />
        </div>
      )}
      {/* Pergunta */}
      <div style={{ background: G.s, borderLeft: `4px solid ${catInfo.accent}`, borderRadius: 10, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: catInfo.accent, fontFamily: G.mo, marginBottom: 10, letterSpacing: 1 }}>PERGUNTA {qi + 1}</div>
        <div style={{ fontSize: 17, color: G.tx, lineHeight: 1.6, fontFamily: G.sr }}>{curr.q}</div>
      </div>
      {/* Opções */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {curr.opts.map((o, i) => {
          let bc = `${catInfo.accent}30`, tc = G.mu2, bg = G.s
          let animStyle = {}
          if (chosen !== null) {
            if (i === curr.ans)                            { bc = `${G.gr}60`; tc = G.gr; bg = `${G.gr}0d` }
            else if (i === chosen && chosen !== curr.ans)  { bc = `${G.rd}60`; tc = G.rd; bg = `${G.rd}0d`; animStyle = { animation: 'shake 0.3s ease' } }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{
              background: bg, border: `1px solid ${bc}`, borderRadius: 9,
              padding: '14px 18px', textAlign: 'left',
              cursor: chosen !== null ? 'default' : 'pointer',
              color: tc, fontSize: 14, lineHeight: 1.4, transition: 'all .15s',
              fontFamily: 'system-ui,sans-serif', ...animStyle,
            }}>
              <span style={{ fontFamily: G.mo, color: catInfo.accent, marginRight: 10, fontSize: 11, opacity: 0.7 }}>{String.fromCharCode(65 + i)}.</span>{o}
            </button>
          )
        })}
      </div>
      {/* Explicação + próxima */}
      {chosen !== null && (
        <div>
          <div style={{ background: chosen === curr.ans ? `${G.gr}12` : `${G.am}12`, border: `1px solid ${chosen === curr.ans ? `${G.gr}30` : `${G.am}30`}`, borderRadius: 9, padding: '14px 18px', marginBottom: 12, fontSize: 13, color: G.mu2, lineHeight: 1.6 }}>
            <span style={{ color: chosen === curr.ans ? G.gr : G.am, fontFamily: G.mo, marginRight: 8, fontSize: 11 }}>{chosen === curr.ans ? '✓ CORRETO' : '→ REVISÃO'}</span>{curr.exp}
          </div>
          <button onClick={next} style={{ width: '100%', background: G.aul, border: `1px solid ${G.au}`, borderRadius: 9, padding: 14, color: G.au, cursor: 'pointer', fontSize: 14, fontFamily: G.mo }}>
            {qi + 1 >= quiz.length ? 'ver resultado →' : 'próxima →'}
          </button>
        </div>
      )}
      </div>
    </div>
  )
}
