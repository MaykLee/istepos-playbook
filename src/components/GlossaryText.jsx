import { useState, useEffect, useRef } from 'react'
import { G } from '../tokens.js'
import { GLOSSARY_MAP } from '../data/glossary.js'

// Build regex from map keys, longest first so MLB matches before LB, etc.
const TERMS   = Object.keys(GLOSSARY_MAP).sort((a, b) => b.length - a.length)
const ESCAPED = TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
const PATTERN = `\\b(${ESCAPED.join('|')})s?\\b`

function parseText(text) {
  const re = new RegExp(PATTERN, 'gi')
  const parts = []
  let last = 0, m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ g: false, text: text.slice(last, m.index) })
    const key = m[1].toUpperCase()
    const def  = GLOSSARY_MAP[key] || GLOSSARY_MAP[key.replace(/S$/, '')] || null
    parts.push(def ? { g: true, text: m[0], key, def } : { g: false, text: m[0] })
    last = re.lastIndex
  }
  if (last < text.length) parts.push({ g: false, text: text.slice(last) })
  return parts
}

export default function GlossaryText({ children, as: Tag = 'span', style }) {
  const [popup, setPopup] = useState(null)
  const popupRef = useRef(null)

  useEffect(() => {
    if (!popup) return
    function onDown(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) setPopup(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [popup])

  if (typeof children !== 'string') return <Tag style={style}>{children}</Tag>

  const parts = parseText(children)

  function open(e, part) {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    setPopup({
      key: part.key,
      def: part.def,
      x: Math.min(r.left, window.innerWidth - 260),
      y: r.bottom + 6,
    })
  }

  return (
    <>
      <Tag style={style}>
        {parts.map((p, i) =>
          p.g
            ? (
              <span key={i} onClick={e => open(e, p)} style={{
                borderBottom: `1px dashed ${G.au}66`,
                cursor: 'pointer',
              }}>
                {p.text}
              </span>
            )
            : p.text
        )}
      </Tag>

      {popup && (
        <div ref={popupRef} style={{
          position: 'fixed', left: popup.x, top: popup.y, zIndex: 1000,
          background: G.s, border: `1px solid ${G.au}`, borderRadius: 6,
          padding: '8px 12px', maxWidth: 240,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize: 9, color: G.au, fontFamily: G.mo, letterSpacing: 1, marginBottom: 4 }}>
            {popup.key}
          </div>
          <div style={{ fontSize: 11, color: G.tx, lineHeight: 1.5 }}>{popup.def}</div>
        </div>
      )}
    </>
  )
}
