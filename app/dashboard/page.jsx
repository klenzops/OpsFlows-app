// app/dashboard/page.jsx
'use client'

export default function Dashboard() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '12px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        background: '#0a0a0a',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg width="28" height="28" viewBox="0 0 60 60" fill="none">
          <path d="M30 8L14 14.5V27C14 36.5 21 45.2 30 48C39 45.2 46 36.5 46 27V14.5L30 8Z"
            stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
          <path d="M22 29.5L27.5 35L38 24"
            stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontSize: '18px', fontWeight: '600', color: '#111110' }}>OpsFlows</div>
      <div style={{ fontSize: '13px', color: '#a8a8a3' }}>Platform is loading correctly ✓</div>
    </div>
  )
}