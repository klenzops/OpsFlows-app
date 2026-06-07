'use client'

import { useState, useRef } from 'react'

const VERDICT = {
  COMPLETE:       { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0', label: 'Complete' },
  MISSING_FIELDS: { bg: '#fefce8', color: '#ca8a04', border: '#fde047', label: 'Missing Fields' },
  FLAGGED:        { bg: '#fef2f2', color: '#dc2626', border: '#fca5a5', label: 'Action Required' },
}

const Logo = ({ size = 30 }) => (
  <div style={{ width: size, height: size, background: '#0a0a0a', borderRadius: size * 0.28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 60 60" fill="none">
      <path d="M30 8L14 14.5V27C14 36.5 21 45.2 30 48C39 45.2 46 36.5 46 27V14.5L30 8Z"
        stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      <path d="M22 29.5L27.5 35L38 24"
        stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
)

export default function Dashboard() {
  const [phase, setPhase]         = useState('idle')   // idle | loading | result | error
  const [result, setResult]       = useState(null)
  const [errMsg, setErrMsg]       = useState('')
  const [drag, setDrag]           = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [fileName, setFileName]   = useState('')
  const inputRef = useRef(null)

  async function processFile(file) {
    if (!file) return
    if (file.type !== 'application/pdf') {
      setErrMsg('Only PDF files are supported. Please upload an OACIQ document in PDF format.')
      setPhase('error')
      return
    }
    setFileName(file.name)
    setPhase('loading')
    setResult(null)
    setErrMsg('')
    setShowEmail(false)
    try {
      const resp = await fetch('/api/reducto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf' },
        body: file
      })
      const data = await resp.json()
      if (data.error) {
        setErrMsg(data.error)
        setPhase('error')
        return
      }
      setResult(data)
      setPhase('result')
    } catch (err) {
      setErrMsg(err.message || 'Connection error. Please try again.')
      setPhase('error')
    }
  }

  function onDrop(e) {
    e.preventDefault()
    setDrag(false)
    processFile(e.dataTransfer.files[0])
  }

  function reset() {
    setPhase('idle')
    setResult(null)
    setErrMsg('')
    setShowEmail(false)
    setFileName('')
  }

  // ── IDLE / ERROR ──────────────────────────────────────────────────────────
  if (phase === 'idle' || phase === 'error') return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <Logo size={36} />
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#111110', letterSpacing: '-0.01em' }}>OpsFlows</span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '650', color: '#111110', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Compliance Verification
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.55' }}>
          Upload an OACIQ brokerage document — the platform auto-detects the form type and runs the right verification checks.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${drag ? '#374151' : '#d1d5db'}`,
            borderRadius: '12px',
            padding: '52px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: drag ? '#f3f4f6' : '#ffffff',
            transition: 'border-color 0.12s ease, background 0.12s ease',
            userSelect: 'none',
          }}
        >
          <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <i className="ti ti-file-upload" style={{ fontSize: '24px', color: '#6b7280' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#111110', marginBottom: '6px' }}>
            Drop a document here or click to select
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>EBCS · DS — PDF only</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={e => { processFile(e.target.files[0]); e.target.value = '' }}
            style={{ display: 'none' }}
          />
        </div>

        {phase === 'error' && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <i className="ti ti-alert-circle" style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }} />
            <span>{errMsg}</span>
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#d1d5db', textAlign: 'center', marginTop: '32px' }}>
          Supported: EBCS · DS · More coming Sprint 2
        </p>
      </div>
    </div>
  )

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (phase === 'loading') return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#111110', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '14px', fontWeight: '500', color: '#111110', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
          Extracting and verifying
        </p>
        <p style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>{fileName}</p>
      </div>
    </div>
  )

  // ── RESULT ────────────────────────────────────────────────────────────────
  const { report, doc_type } = result
  const v = VERDICT[report.verdict] || VERDICT.FLAGGED
  const emailText = report.email_body || report.broker_email_body || ''
  const failedChecks = report.failed_checks || []
  const flaggedItems = report.flagged_items || []

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f9fafb', padding: '28px 20px 72px' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .opsflows-result { animation: fadeIn 0.2s ease forwards }
      `}</style>
      <div style={{ maxWidth: '660px', margin: '0 auto' }} className="opsflows-result">

        {/* Nav bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Logo size={30} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#111110' }}>OpsFlows</span>
          </div>
          <button
            onClick={reset}
            style={{ fontSize: '13px', fontWeight: '500', color: '#374151', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '7px', padding: '7px 14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            ↑ Verify another
          </button>
        </div>

        {/* ── Verdict card ── */}
        <div style={{ background: '#fff', border: `1px solid ${v.border}`, borderRadius: '12px', padding: '24px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '4px', background: v.bg, color: v.color }}>
                  {v.label}
                </span>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '4px', background: '#f3f4f6', color: '#6b7280' }}>
                  {doc_type}
                </span>
              </div>
              <p style={{ fontSize: '16px', fontWeight: '650', color: '#111110', letterSpacing: '-0.01em', marginBottom: '4px' }}>
                {report.contract_number}
              </p>
              <p style={{ fontSize: '13px', color: '#374151', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {report.property_address}
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af' }}>{report.seller_name}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '48px', fontWeight: '700', color: v.color, lineHeight: 1, letterSpacing: '-0.03em' }}>
                {report.score}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px' }}>/ 100</div>
              <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '2px' }}>{report.checks_run} checks</div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f3f4f6', lineHeight: '1.55' }}>
            {report.summary}
          </p>
        </div>

        {/* ── Failed checks ── */}
        {failedChecks.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
              <span style={{ width: '20px', height: '20px', background: '#fee2e2', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ti ti-x" style={{ fontSize: '11px', color: '#dc2626' }} />
              </span>
              <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#374151' }}>
                Failed — {failedChecks.length} critical issue{failedChecks.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {failedChecks.map((check, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: i < failedChecks.length - 1 ? '1px solid #f9fafb' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#111110', marginBottom: '2px' }}>{check.rule}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>Clause {check.clause}</p>
                  </div>
                  {check.next_action && (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#b45309', background: '#fefce8', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {check.next_action}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Flagged for review ── */}
        {flaggedItems.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
              <span style={{ width: '20px', height: '20px', background: '#fef9c3', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ti ti-flag-2" style={{ fontSize: '11px', color: '#d97706' }} />
              </span>
              <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#374151' }}>
                Flagged for review — {flaggedItems.length} item{flaggedItems.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {flaggedItems.map((item, i) => (
                <div key={i}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{item.rule}</p>
                  {item.value && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px', lineHeight: '1.55' }}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Draft email (collapsible) ── */}
        {emailText && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
            <button
              onClick={() => setShowEmail(s => !s)}
              style={{ width: '100%', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <i className="ti ti-mail" style={{ fontSize: '15px', color: '#6b7280' }} />
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#374151' }}>
                  Draft broker email
                </span>
              </div>
              <i className={`ti ti-chevron-${showEmail ? 'up' : 'down'}`} style={{ fontSize: '14px', color: '#9ca3af' }} />
            </button>
            {showEmail && (
              <div style={{ padding: '0 20px 20px' }}>
                <pre style={{
                  fontSize: '12.5px',
                  color: '#374151',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.75',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  margin: 0,
                }}>
                  {emailText}
                </pre>
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#d1d5db', textAlign: 'center', marginTop: '8px' }}>
          Verified {new Date(report.verified_at).toLocaleString('en-CA')}
        </p>
      </div>
    </div>
  )
}
