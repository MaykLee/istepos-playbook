import { G } from '../../tokens.js'

export default function StatBar({ label, val, col }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: G.mu, marginBottom: 2, fontFamily: G.mo }}>
        <span>{label}</span>
        <span style={{ color: col }}>{val}/10</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${val * 10}%`, background: col, borderRadius: 2 }} />
      </div>
    </div>
  )
}
