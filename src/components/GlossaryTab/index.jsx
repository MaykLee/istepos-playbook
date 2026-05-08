import { useState, useMemo } from 'react'
import { G } from '../../tokens.js'
import { GLOSSARY, GLOSSARY_CATS } from '../../data/glossary.js'

const CAT_META = {
  Todos:  { color: G.au,  icon: '📖', sub: 'todos os conceitos do playbook' },
  Geral:  { color: G.mu2, icon: '🏈', sub: 'fundamentos do jogo' },
  Ataque: { color: G.bl,  icon: '⚔️', sub: 'formações e conceitos ofensivos' },
  Defesa: { color: G.cr,  icon: '🛡️', sub: 'sistemas, fronts e coberturas' },
  Rotas:  { color: G.am,  icon: '↗️', sub: 'padrões de rota dos receptores' },
}

function catColor(cat) {
  return CAT_META[cat]?.color || G.mu
}

function GlossCard({ g }) {
  const cc = catColor(g.cat)
  return (
    <div style={{
      background: G.s,
      border: `1px solid ${cc}22`,
      borderLeft: `4px solid ${cc}`,
      borderRadius: 10,
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 19, fontFamily: G.sr, fontWeight: 'bold', color: G.wh, lineHeight: 1.2 }}>{g.term}</div>
        <span style={{
          background: `${cc}18`, border: `1px solid ${cc}40`,
          borderRadius: 4, padding: '3px 9px', fontSize: 9,
          color: cc, fontFamily: G.mo, whiteSpace: 'nowrap', marginLeft: 12, marginTop: 3,
        }}>{g.cat.toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 13, color: G.mu2, lineHeight: 1.7 }}>{g.def}</div>
    </div>
  )
}

export default function GlossaryTab() {
  const [q, setQ]     = useState('')
  const [cat, setCat] = useState('Todos')

  const filtered = useMemo(() => GLOSSARY.filter(g => {
    const mq = !q || g.term.toLowerCase().includes(q.toLowerCase()) || g.def.toLowerCase().includes(q.toLowerCase())
    return mq && (cat === 'Todos' || g.cat === cat)
  }), [q, cat])

  // Agrupa por categoria quando "Todos" sem busca ativa
  const grouped = useMemo(() => {
    if (cat !== 'Todos' || q) return null
    const groups = {}
    GLOSSARY_CATS.filter(c => c !== 'Todos').forEach(c => {
      const items = GLOSSARY.filter(g => g.cat === c)
      if (items.length) groups[c] = items
    })
    return groups
  }, [cat, q])

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: 24 }}>

      {/* Header ISTEPOS */}
      <div style={{
        background: `linear-gradient(135deg, #1a0508 0%, #0e0e12 60%)`,
        borderBottom: `2px solid ${G.cr}`,
        padding: '18px 24px',
        marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <img src="/istepos-logo.png" alt="ISTEPOS" style={{ width: 44, height: 44, objectFit: 'contain' }} />
        <div>
          <div style={{ fontFamily: G.mo, fontSize: 15, color: G.cr, letterSpacing: 2 }}>GLOSSÁRIO</div>
          <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, marginTop: 3 }}>{GLOSSARY.length} termos — toque para aprender</div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* Busca */}
        <input
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="buscar termo ou definição..."
          style={{
            width: '100%', boxSizing: 'border-box',
            background: G.s, border: `1px solid rgba(196,18,48,0.25)`,
            borderRadius: 8, padding: '10px 16px',
            color: G.tx, fontSize: 13, fontFamily: G.mo,
            outline: 'none', marginBottom: 16,
          }}
        />

        {/* Filtros de categoria — estilo quiz home */}
        <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, letterSpacing: 2, marginBottom: 12 }}>FILTRAR POR CATEGORIA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {GLOSSARY_CATS.map(c => {
            const meta = CAT_META[c]
            const isActive = cat === c
            const cc = meta.color
            const count = c === 'Todos' ? GLOSSARY.length : GLOSSARY.filter(g => g.cat === c).length
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                background: isActive ? `${cc}18` : 'transparent',
                border: `1px solid ${isActive ? cc + '60' : cc + '20'}`,
                borderLeft: `4px solid ${isActive ? cc : cc + '25'}`,
                borderRadius: 10, padding: '12px 18px',
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all .15s',
              }}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>{meta.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: isActive ? cc : G.mu2, fontFamily: G.mo, fontSize: 13, fontWeight: 'bold', letterSpacing: 1 }}>{c.toUpperCase()}</div>
                  <div style={{ color: G.mu, fontSize: 11, marginTop: 2 }}>{meta.sub}</div>
                </div>
                <span style={{
                  fontFamily: G.mo, fontSize: 12,
                  color: isActive ? cc : G.mu,
                  background: isActive ? `${cc}20` : 'none',
                  border: isActive ? `1px solid ${cc}40` : 'none',
                  borderRadius: 4, padding: isActive ? '2px 8px' : '2px 0',
                }}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Label de resultado de busca */}
        {q && (
          <div style={{ fontFamily: G.mo, fontSize: 10, color: G.mu, letterSpacing: 2, marginBottom: 14 }}>
            {filtered.length} RESULTADO{filtered.length !== 1 ? 'S' : ''} PARA "{q.toUpperCase()}"
          </div>
        )}

        {/* Cards agrupados (modo Todos sem busca) */}
        {grouped ? (
          Object.entries(grouped).map(([section, items]) => (
            <div key={section} style={{ marginBottom: 32 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 12, paddingBottom: 8,
                borderBottom: `1px solid ${catColor(section)}30`,
              }}>
                <span style={{ fontSize: 16 }}>{CAT_META[section]?.icon}</span>
                <div style={{ fontFamily: G.mo, fontSize: 10, color: catColor(section), letterSpacing: 2 }}>{section.toUpperCase()}</div>
                <div style={{ fontFamily: G.mo, fontSize: 9, color: G.mu }}>— {items.length} termos</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((g, i) => <GlossCard key={i} g={g} />)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((g, i) => <GlossCard key={i} g={g} />)}
            {!filtered.length && (
              <div style={{ color: G.mu, fontSize: 12, textAlign: 'center', padding: 32, fontFamily: G.mo }}>
                nenhum resultado encontrado
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
