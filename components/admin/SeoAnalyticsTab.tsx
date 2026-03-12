'use client'
// components/admin/SeoAnalyticsTab.tsx
// Manofox-style dark analytics dashboard for The Tech Bharat admin

import { useEffect, useState, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
interface TrafficDay  { date: string; views: number }
interface LiveEntry   { time: string; path: string; device: string; source: string }
interface SourceEntry { source: string; count: number }
interface PageEntry   { path: string; views: number }
interface TrendItem   { title: string; traffic: string }
interface SeoPageData { page: string; title?: string; description?: string; keywords?: string[]; trendKeywords?: string[]; lastUpdated?: number }

interface AnalyticsData {
  summary: {
    totalViews: number
    todayViews: number
    viewsTrend: 'up' | 'down'
    uniqueVisitorsToday: number
    bounceRate: number
    avgTime: string
    period: string
    hasLiveData: boolean
  }
  trafficTrend:  TrafficDay[]
  deviceSplit:   { desktop: number; mobile: number }
  topSources:    SourceEntry[]
  liveLog:       LiveEntry[]
  topPages:      PageEntry[]
  trends:        TrendItem[]
  seoPages:      SeoPageData[]
  cronLog:       { log: string[]; ts: number } | null
}

// ── Inline SVG sparkline ───────────────────────────────────────────────────
function SparkLine({ data }: { data: TrafficDay[] }) {
  if (!data.length || data.every(d => d.views === 0)) {
    return (
      <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 12 }}>
        No data yet — push middleware.ts to start tracking
      </div>
    )
  }
  const max = Math.max(...data.map(d => d.views), 1)
  const W = 560, H = 80
  const pts = data.map((d, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * W
    const y = H - (d.views / max) * (H - 12) - 6
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e94560" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#e94560" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="#e94560" strokeWidth="2.5" points={pts} strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * W
        const y = H - (d.views / max) * (H - 12) - 6
        return <circle key={i} cx={x} cy={y} r="3.5" fill="#e94560" stroke="#16213e" strokeWidth="1.5" />
      })}
    </svg>
  )
}

// ── Donut chart ────────────────────────────────────────────────────────────
function DonutChart({ desktop, mobile }: { desktop: number; mobile: number }) {
  const r = 50, cx = 65, cy = 65, stroke = 14
  const circ = 2 * Math.PI * r
  const deskArc = (desktop / 100) * circ
  return (
    <svg width="130" height="130">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0f2444" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e94560" strokeWidth={stroke}
        strokeDasharray={`${deskArc} ${circ}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3498db" strokeWidth={stroke}
        strokeDasharray={`${circ - deskArc} ${circ}`} strokeDashoffset={circ * 0.25 - deskArc}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SeoAnalyticsTab() {
  const [data,        setData]        = useState<AnalyticsData | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [apiError,    setApiError]    = useState<string | null>(null)
  const [period,      setPeriod]      = useState<'7d' | '30d'>('7d')
  const [cronRunning, setCronRunning] = useState(false)
  const [cronMsg,     setCronMsg]     = useState('')
  const [seoEdit,     setSeoEdit]     = useState<{ page: string; title: string; desc: string; kw: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setApiError(null)
    try {
      const res  = await fetch(`/api/analytics?period=${period}`, { credentials: 'include' })
      const json = await res.json()
      if (!res.ok) {
        setApiError(`Error ${res.status}: ${json.error || 'Check Vercel logs'}`)
      } else {
        setData(json)
      }
    } catch (e) {
      setApiError('Network error: ' + String(e))
    }
    setLoading(false)
  }, [period])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    const t = setInterval(() => { void load() }, 30_000)
    return () => clearInterval(t)
  }, [load])

  const runCron = async () => {
    setCronRunning(true)
    setCronMsg('⏳ Running SEO automation...')
    try {
      const res  = await fetch('/api/admin/run-seo-cron', { method: 'POST', credentials: 'include' })
      const json = await res.json()
      if (json.log)   setCronMsg('✅ ' + json.log.slice(-2).join(' · '))
      else if (json.error) setCronMsg('❌ ' + json.error)
      await load()
    } catch (e) { setCronMsg('❌ ' + String(e)) }
    setCronRunning(false)
  }

  // ── shared styles ─────────────────────────────────────────────────────────
  const card: React.CSSProperties = { background: '#16213e', border: '1px solid #1e2d50', borderRadius: 12, padding: 24 }
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: 8 }
  const bigNum: React.CSSProperties = { fontSize: 36, fontWeight: 800, color: '#ffffff', lineHeight: 1, display: 'block', margin: '6px 0' }

  // ── Error state ───────────────────────────────────────────────────────────
  if (!loading && apiError) {
    return (
      <div style={{ ...card, border: '1px solid #e94560' }}>
        <h3 style={{ color: '#e94560', margin: '0 0 10px' }}>⚠️ Analytics Error</h3>
        <pre style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 16px', whiteSpace: 'pre-wrap' }}>{apiError}</pre>
        <button onClick={() => void load()} style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontWeight: 700 }}>Retry</button>
      </div>
    )
  }

  if (loading && !data) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280', background: '#16213e', borderRadius: 12 }}>📊 Loading analytics...</div>
  }

  const s = data?.summary

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 700 }}>📊 Site Analytics</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 13 }}>Self-hosted · No third-party tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['7d', '30d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              background: period === p ? '#e94560' : '#0f2444', color: '#fff',
              border: 'none', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>
              {p === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
          <button onClick={() => void load()} style={{ background: '#0f2444', color: '#94a3b8', border: '1px solid #1e2d50', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', fontSize: 13 }}>
            {loading ? '⏳' : '⟳'} Refresh
          </button>
        </div>
      </div>

      {/* No live data banner */}
      {data && !s?.hasLiveData && (
        <div style={{ background: '#0f2444', border: '1px solid #e94560', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#fbbf24' }}>
          ⚡ Showing estimated data from article views. Push <code style={{ color: '#e94560' }}>middleware.ts</code> to start live visitor tracking.
        </div>
      )}

      {/* 4 Stat cards — like Manofox */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div style={card}>
          <span style={labelStyle}>Total Clicks</span>
          <span style={bigNum}>{(s?.totalViews ?? 0).toLocaleString()}</span>
          <span style={{ fontSize: 13, color: '#2ecc71' }}>▲ Visits in {period}</span>
        </div>
        <div style={card}>
          <span style={labelStyle}>Today</span>
          <span style={bigNum}>{(s?.todayViews ?? 0).toLocaleString()}</span>
          <span style={{ fontSize: 13, color: s?.viewsTrend === 'up' ? '#2ecc71' : '#e94560' }}>
            {s?.viewsTrend === 'up' ? '▲' : '▼'} vs yesterday
          </span>
        </div>
        <div style={card}>
          <span style={labelStyle}>Bounce Rate</span>
          <span style={bigNum}>{s?.bounceRate ?? 42}%</span>
          <span style={{ fontSize: 13, color: '#f1c40f' }}>Avg. {s?.bounceRate ?? 42}%</span>
        </div>
        <div style={card}>
          <span style={labelStyle}>Avg. Time</span>
          <span style={bigNum}>{s?.avgTime ?? '1m 45s'}</span>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Per Session</span>
        </div>
      </div>

      {/* Traffic chart + Device donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        <div style={card}>
          <span style={labelStyle}>Traffic Trends</span>
          <SparkLine data={data?.trafficTrend ?? []} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {(data?.trafficTrend ?? [])
              .filter((_, i, a) => i === 0 || i === Math.floor(a.length / 2) || i === a.length - 1)
              .map(d => <span key={d.date} style={{ fontSize: 11, color: '#475569' }}>{d.date.slice(5).replace('-', '/')}</span>)}
          </div>
        </div>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={labelStyle}>Device Type</span>
          <DonutChart desktop={data?.deviceSplit?.desktop ?? 60} mobile={data?.deviceSplit?.mobile ?? 40} />
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#e94560', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Desktop {data?.deviceSplit?.desktop ?? 60}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#3498db', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Mobile {data?.deviceSplit?.mobile ?? 40}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live visitor log + Top sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Live log */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }} />
            <span style={labelStyle}>Live Visitor Log & Sources</span>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: '#475569' }}>
            Shows where users came from (Referrer) and pages visited.
          </p>
          {(data?.liveLog ?? []).length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '90px 80px 1fr', gap: '0 8px', fontSize: 12 }}>
              {['Time', 'Device', 'Traffic Source'].map(h => (
                <span key={h} style={{ color: '#6b7280', fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid #1e2d50' }}>{h}</span>
              ))}
              {(data?.liveLog ?? []).slice(0, 15).map((entry, i) => (
                <>
                  <span key={`t${i}`} style={{ color: '#888', padding: '5px 0', borderBottom: '1px solid #0f2444', fontSize: 11 }}>{entry.time}</span>
                  <span key={`d${i}`} style={{ padding: '5px 0', borderBottom: '1px solid #0f2444' }}>
                    <span style={{
                      background: entry.device === 'Mobile' ? '#e67e22' : '#3498db',
                      color: '#fff', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontWeight: 700,
                    }}>{entry.device}</span>
                  </span>
                  <span key={`s${i}`} style={{ color: '#2ecc71', padding: '5px 0', borderBottom: '1px solid #0f2444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🔗 {entry.source}
                  </span>
                </>
              ))}
            </div>
          ) : (
            <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', padding: '20px 0', margin: 0 }}>
              No live visits recorded yet.<br />
              Push <code style={{ color: '#e94560' }}>middleware.ts</code> to GitHub → Vercel will redeploy and tracking starts automatically.
            </p>
          )}
        </div>

        {/* Top sources */}
        <div style={card}>
          <span style={labelStyle}>Top Traffic Sources</span>
          {(data?.topSources ?? []).length > 0 ? (
            (data?.topSources ?? []).map((src, i) => {
              const maxC = (data?.topSources ?? [])[0]?.count ?? 1
              const pct  = Math.round((src.count / maxC) * 100)
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{src.source}</span>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>{src.count.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 5, background: '#0f2444', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#e94560', borderRadius: 3, transition: 'width 0.8s' }} />
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: '#475569', fontSize: 12, marginBottom: 16 }}>No source data yet.</p>
          )}

          <span style={{ ...labelStyle, marginTop: 20 }}>Top Pages</span>
          {(data?.topPages ?? []).slice(0, 6).map((pg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #0f2444' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '78%' }}>{pg.path}</span>
              <span style={{ fontSize: 12, color: '#e94560', fontWeight: 700 }}>{pg.views.toLocaleString()}</span>
            </div>
          ))}
          {!(data?.topPages ?? []).length && <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>No page data yet.</p>}
        </div>
      </div>

      {/* India Trending Topics */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={labelStyle}>🔍 India Trending Topics (Google Trends)</span>
          <span style={{ background: '#fff', color: '#333', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>OFFICIAL GOOGLE DATA</span>
        </div>
        {(data?.trends ?? []).length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', gap: '0 16px' }}>
            {['Trending Topic', 'Traffic', 'Relevance'].map(h => (
              <span key={h} style={{ fontSize: 11, color: '#475569', fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid #1e2d50' }}>{h}</span>
            ))}
            {(data?.trends ?? []).slice(0, 10).map((t, i) => (
              <>
                <span key={`tt${i}`} style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, padding: '8px 0', borderBottom: '1px solid #0f2444' }}>{t.title}</span>
                <span key={`tv${i}`} style={{ fontSize: 13, color: '#2ecc71', padding: '8px 0', borderBottom: '1px solid #0f2444', textAlign: 'right' as const }}>{t.traffic || '—'}</span>
                <span key={`tr${i}`} style={{ fontSize: 11, padding: '8px 0', borderBottom: '1px solid #0f2444', color: '#6b7280' }}>
                  {i < 3 ? '🔥 Hot' : i < 6 ? '📈 Rising' : '📊 Trending'}
                </span>
              </>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Trends not loaded yet. Run SEO cron to fetch.</p>
        )}
      </div>

      {/* Smart SEO Manager */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div>
            <span style={labelStyle}>🚀 Smart SEO Manager (Visibility Strategy)</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>Auto-generated keywords based on India Google Trends. Titles & descriptions are FIXED (never auto-changed).</span>
          </div>
          <button
            onClick={() => void runCron()}
            disabled={cronRunning}
            style={{
              background: cronRunning ? '#374151' : '#e94560', color: '#fff',
              border: 'none', borderRadius: 6, padding: '9px 18px',
              cursor: cronRunning ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700,
              whiteSpace: 'nowrap', marginLeft: 16,
            }}
          >
            {cronRunning ? '⏳ Running...' : '⚡ Force Update'}
          </button>
        </div>

        {cronMsg && (
          <div style={{ background: '#0f2444', border: '1px solid #1e3a5f', borderRadius: 6, padding: '10px 14px', margin: '14px 0', fontSize: 12, color: '#7dd3fc' }}>
            {cronMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {(data?.seoPages ?? []).map((pg) => (
            <div key={pg.page} style={{ background: '#0f1c35', border: '1px solid #1e2d50', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 13, color: '#e94560', fontWeight: 700, textTransform: 'uppercase' }}>
                    /{pg.page === 'home' ? '' : pg.page}
                  </span>
                  <span style={{ fontSize: 11, color: '#475569', marginLeft: 10 }}>
                    {pg.lastUpdated
                      ? `Updated ${new Date(pg.lastUpdated).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}`
                      : 'Not generated yet'}
                  </span>
                </div>
                <button
                  onClick={() => setSeoEdit({ page: pg.page, title: pg.title ?? '', desc: pg.description ?? '', kw: (pg.keywords ?? []).join(', ') })}
                  style={{ background: '#1e2d50', color: '#94a3b8', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                >
                  Edit
                </button>
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Browser Title: </span>
                <span style={{ fontSize: 13, color: '#e2e8f0' }}>{pg.title || '—'}</span>
              </div>
              {pg.trendKeywords && pg.trendKeywords.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {pg.trendKeywords.map((kw, i) => (
                    <span key={i} style={{ background: '#0f2444', color: '#60a5fa', borderRadius: 4, padding: '2px 8px', fontSize: 11 }}>{kw}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SEO Edit Modal */}
      {seoEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#16213e', border: '1px solid #1e2d50', borderRadius: 14, padding: 28, width: 560, maxWidth: '92vw' }}>
            <h3 style={{ margin: '0 0 18px', color: '#fff' }}>Edit SEO: /{seoEdit.page}</h3>
            {[
              { label: 'Browser Title (FIXED — manually edited only)', key: 'title' as const, rows: 1 },
              { label: 'Meta Description (FIXED)', key: 'desc' as const, rows: 3 },
              { label: 'Targeted Keywords (comma-separated)', key: 'kw' as const, rows: 2 },
            ].map(({ label, key, rows }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</label>
                <textarea value={seoEdit[key]} onChange={e => setSeoEdit({ ...seoEdit, [key]: e.target.value })} rows={rows}
                  style={{ width: '100%', background: '#0f2444', border: '1px solid #1e3a5f', borderRadius: 6, padding: '9px 12px', color: '#f1f5f9', fontSize: 13, boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setSeoEdit(null)} style={{ background: '#1e2d50', color: '#94a3b8', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={async () => {
                await fetch('/api/seo', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'save-page-seo', page: seoEdit.page, title: seoEdit.title, description: seoEdit.desc, keywords: seoEdit.kw.split(',').map(k => k.trim()).filter(Boolean) }) })
                setSeoEdit(null); await load()
              }} style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontWeight: 700 }}>
                Save SEO Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cron log */}
      {data?.cronLog && (
        <div style={card}>
          <span style={labelStyle}>Last SEO Cron Run — {new Date(data.cronLog.ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {data.cronLog.log.map((line, i) => (
              <span key={i} style={{ fontSize: 12, color: line.startsWith('===') ? '#60a5fa' : '#6b7280', fontFamily: 'monospace', fontWeight: line.startsWith('===') ? 700 : 400 }}>
                {line}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}