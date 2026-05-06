import { useState, useMemo } from 'react'
import { G } from '../../tokens.js'
import { GLOSSARY, GLOSSARY_CATS } from '../../data/glossary.js'

export default function GlossaryTab() {
  const [q, setQ]     = useState('')
  const [cat, setCat] = useState('Todos')

  const filtered = useMemo(() => GLOSSARY.filter(g => {
    const mq = !q || g.term.toLowerCase().includes(q.toLowerCase()) || g.def.toLowerCase().includes(q.toLowerCase())
    return mq && (cat === 'Todos' || g.cat === cat)
  }), [q, cat])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="buscar termo..."
          style={{ flex: '1 1 180px', background: G.s, border: `1px solid rgba(201,162,39,0.2)`, borderRadius: 6, padding: '7px 12px', color: G.tx, fontSize: 12, fontFamily: G.mo, outline: 'none', minWidth: 0 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {GLOSSARY_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              background: cat === c ? G.aul : 'none',
              border: `1px solid ${cat === c ? G.au : 'rgba(201,162,39,0.2)'}`,
              borderRadius: 5, padding: '5px 10px', color: cat === c ? G.au : G.mu, cursor: 'pointer', fontSize: 11, fontFamily: G.mo,
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((g, i) => {
          const cc = g.cat === 'Ataque' ? G.bl : g.cat === 'Defesa' ? G.rd : g.cat === 'Rotas' ? G.am : G.mu
          return (
            <div key={i} style={{ background: G.s, border: `1px solid rgba(201,162,39,0.1)`, borderRadius: 7, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ background: `${cc}18`, border: `1px solid ${cc}30`, borderRadius: 4, padding: '2px 7px', fontSize: 9, color: cc, fontFamily: G.mo, whiteSpace: 'nowrap', marginTop: 1 }}>{g.cat}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 'bold', fontFamily: G.sr, color: G.tx, marginBottom: 3 }}>{g.term}</div>
                <div style={{ fontSize: 11, color: G.mu2, lineHeight: 1.5 }}>{g.def}</div>
              </div>
            </div>
          )
        })}
        {!filtered.length && <div style={{ color: G.mu, fontSize: 12, textAlign: 'center', padding: 20, fontFamily: G.mo }}>nenhum resultado encontrado</div>}
      </div>
    </div>
  )
}
