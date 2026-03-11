'use client'
// components/admin/SeoAnalyticsTab.tsx
// Drop-in replacement for the SEO tab in app/admin/page.tsx
// Usage: import SeoAnalyticsTab from '@/components/admin/SeoAnalyticsTab'
// Then use <SeoAnalyticsTab /> inside the SEO tab section

import { useEffect, useState, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
interface TrafficDay   { date: string; views: number }
interface LiveEntry    { time: string; path: string; device: string; source: string }
interface SourceEntry  { source: string; count: number }
interface PageEntry    { path: string; views: number }
interface TrendItem    { title: string; traffic: string }
interface SeoPageData  { page: string; title?: string; description?: string; keywords?: string[]; trendKeywords?: string[]; lastUpdated?: number }

interface AnalyticsData {
  summary: {
    totalViews: number
    todayViews: number
    viewsTrend: 'up' | 'down'
    uniqueVisitorsToday: number
    bounceRate: number
    avgTime: string
    period: string
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

// ── Mini sparkline chart ────────────────────────────────────────────────────
function SparkLine({ data }: { data: TrafficDay[] }) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.views), 1)
  const W = 280, H = 80
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - (d.views / max) * (H - 10) - 5
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="#f43f5e"
        strokeWidth="2.5"
        points={pts}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * W
        const y = H - (d.views / max) * (H - 10) - 5
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="#f43f5e" />
        )
      })}
    </svg>
  )
}

// ── Donut chart ─────────────────────────────────────────────────────────────
function DonutChart({ desktop, mobile }: { desktop: number; mobile: number }) {
  const r = 40, cx = 55, cy = 55, stroke = 12
  const circ = 2 * Math.PI * r
  const deskArc = (desktop / 100) * circ
  return (
    <svg width="110" height="110">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2a3a" strokeWidth={stroke} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#f43f5e" strokeWidth={stroke}
        strokeDasharray={`${deskArc} ${circ}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#0ea5e9" strokeWidth={stroke}
        strokeDasharray={`${circ - deskArc} ${circ}`}
        strokeDashoffset={circ * 0.25 - deskArc}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  )
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function SeoAnalyticsTab() {
  const [data,    setData]    = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period,  setPeriod]  = useState<'7d' | '30d'>('7d')
  const [cronRunning, setCronRunning] = useState(false)
  const [cronMsg, setCronMsg] = useState('')
  const [seoEdit, setSeoEdit] = useState<{ page: string; title: string; desc: string; kw: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?period=${period}`)
      if (res.ok) setData(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [period])

  useEffect(() => { void load() }, [load])

  // Auto-refresh live log every 30s
  useEffect(() => {
    const t = setInterval(() => { void load() }, 30_000)
    return () => clearInterval(t)
  }, [load])

  const runCron = async (force = false) => {
    setCronRunning(true)
    setCronMsg('Running SEO automation...')
    try {
      // Call via admin API proxy — auth handled by cookie, secret injected server-side
      const res  = await fetch(`/api/admin/run-seo-cron${force ? '?force=1' : ''}`, { method: 'POST' })
      const json = await res.json()
      if (json.log) setCronMsg(json.log.slice(-3).join(' · '))
      else if (json.error) setCronMsg('Error: ' + json.error)
      else setCronMsg('✅ Done')
      await load()
    } catch (e) {
      setCronMsg('Error: ' + String(e))
    }
    setCronRunning(false)
  }

  // ── Styles ─────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background:   '#0f172a',
    border:       '1px solid #1e2d40',
    borderRadius: 12,
    padding:      20,
  }
  const statCard: React.CSSProperties = {
    ...card,
    display:        'flex',
    flexDirection:  'column',
    gap:            4,
  }
  const label: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
    color: '#64748b', textTransform: 'uppercase',
  }
  const bigNum: React.CSSProperties = {
    fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1,
  }
  const sub: React.CSSProperties = { fontSize: 12, color: '#22c55e' }

  if (loading && !data) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        Loading analytics...
      </div>
    )
  }

  const s = data?.summary

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>📊 Site Analytics</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Self-hosted · No third-party tracking</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['7d', '30d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              background:   period === p ? '#f43f5e' : '#1e2d40',
              color:        '#f1f5f9',
              border:       'none',
              borderRadius: 6,
              padding:      '6px 14px',
              cursor:       'pointer',
              fontSize:     13,
              fontWeight:   600,
            }}>
              {p === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </button>
          ))}
          <button onClick={() => void load()} style={{
            background: '#1e2d40', color: '#94a3b8', border: 'none',
            borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13,
          }}>⟳ Refresh</button>
        </div>
      </div>

      {/* ── Stat cards row ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <div style={statCard}>
          <span style={label}>Total Clicks</span>
          <span style={bigNum}>{s?.totalViews?.toLocaleString() ?? '—'}</span>
          <span style={sub}>▲ Visits in {period}</span>
        </div>
        <div style={statCard}>
          <span style={label}>Today</span>
          <span style={bigNum}>{s?.todayViews?.toLocaleString() ?? '—'}</span>
          <span style={{ ...sub, color: s?.viewsTrend === 'up' ? '#22c55e' : '#f43f5e' }}>
            {s?.viewsTrend === 'up' ? '▲' : '▼'} vs yesterday
          </span>
        </div>
        <div style={statCard}>
          <span style={label}>Bounce Rate</span>
          <span style={bigNum}>{s?.bounceRate ?? '—'}%</span>
          <span style={{ ...sub, color: '#94a3b8' }}>Avg. {s?.bounceRate ?? 42}%</span>
        </div>
        <div style={statCard}>
          <span style={label}>Avg. Time</span>
          <span style={bigNum}>{s?.avgTime ?? '—'}</span>
          <span style={{ ...sub, color: '#94a3b8' }}>Per Session</span>
        </div>
      </div>

      {/* ── Traffic trend + device type ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
        <div style={card}>
          <div style={{ ...label, marginBottom: 16 }}>Traffic Trends</div>
          <SparkLine data={data?.trafficTrend ?? []} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {(data?.trafficTrend ?? []).filter((_, i, a) => i === 0 || i === Math.floor(a.length / 2) || i === a.length - 1).map(d => (
              <span key={d.date} style={{ fontSize: 11, color: '#475569' }}>{d.date.slice(5)}</span>
            ))}
          </div>
        </div>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={label}>Device Type</div>
          <DonutChart desktop={data?.deviceSplit?.desktop ?? 50} mobile={data?.deviceSplit?.mobile ?? 50} />
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#f43f5e', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Desktop {data?.deviceSplit?.desktop ?? 50}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0ea5e9', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>Mobile {data?.deviceSplit?.mobile ?? 50}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Live visitor log + traffic sources ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Live Log */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            <span style={label}>Live Visitor Log & Sources</span>
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: '#475569' }}>
            Where users came from (Referrer) and pages visited.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 1fr', gap: '4px 8px', fontSize: 12 }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Time</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Device</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Traffic Source</span>
            {(data?.liveLog ?? []).slice(0, 12).map((entry, i) => (
              <>
                <span key={`t${i}`} style={{ color: '#94a3b8', padding: '4px 0', borderTop: '1px solid #1e2d40' }}>{entry.time}</span>
                <span key={`d${i}`} style={{ padding: '4px 0', borderTop: '1px solid #1e2d40' }}>
                  <span style={{
                    background: '#0f4c75', color: '#7dd3fc',
                    borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600,
                  }}>{entry.device}</span>
                </span>
                <span key={`s${i}`} style={{ color: '#22d3ee', padding: '4px 0', borderTop: '1px solid #1e2d40', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  🔗 {entry.source}
                </span>
              </>
            ))}
          </div>
          {(!data?.liveLog?.length) && (
            <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
              No visitor data yet. Add the analytics script to your app.
            </p>
          )}
        </div>

        {/* Top Sources */}
        <div style={card}>
          <div style={{ ...label, marginBottom: 16 }}>Top Traffic Sources</div>
          {(data?.topSources ?? []).map((src, i) => {
            const maxCount = Math.max(...(data?.topSources ?? []).map(s => s.count), 1)
            const pct = Math.round((src.count / maxCount) * 100)
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{src.source}</span>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{src.count}</span>
                </div>
                <div style={{ height: 4, background: '#1e2d40', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#f43f5e', borderRadius: 2, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            )
          })}
          {!data?.topSources?.length && (
            <p style={{ color: '#475569', fontSize: 12 }}>No source data yet.</p>
          )}

          {/* Top Pages */}
          <div style={{ ...label, margin: '20px 0 12px' }}>Top Pages</div>
          {(data?.topPages ?? []).slice(0, 5).map((pg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e2d40' }}>
              <span style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' }}>{pg.path}</span>
              <span style={{ fontSize: 12, color: '#f43f5e', fontWeight: 600 }}>{pg.views}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Top Google Search Queries (from Trends) ────────────────────── */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={label}>🔍 India Trending Topics (Google Trends)</div>
          <span style={{ fontSize: 11, background: '#1e2d40', color: '#64748b', padding: '3px 8px', borderRadius: 4 }}>
            OFFICIAL GOOGLE DATA
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0 20px' }}>
          <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, paddingBottom: 8 }}>Trending Topic</span>
          <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, paddingBottom: 8 }}>Traffic</span>
          <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, paddingBottom: 8 }}>Relevance</span>
          {(data?.trends ?? []).slice(0, 8).map((t, i) => (
            <>
              <span key={`t${i}`} style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600, padding: '8px 0', borderTop: '1px solid #1e2d40' }}>
                {t.title}
              </span>
              <span key={`v${i}`} style={{ fontSize: 13, color: '#22c55e', padding: '8px 0', borderTop: '1px solid #1e2d40', textAlign: 'right' }}>
                {t.traffic || '—'}
              </span>
              <span key={`r${i}`} style={{ fontSize: 11, color: '#64748b', padding: '8px 0', borderTop: '1px solid #1e2d40' }}>
                {i < 3 ? '🔥 Hot' : i < 6 ? '📈 Rising' : '📊 Trending'}
              </span>
            </>
          ))}
        </div>
        {!data?.trends?.length && (
          <p style={{ color: '#475569', fontSize: 12 }}>
            Trends not loaded yet. Run SEO cron to fetch.
          </p>
        )}
      </div>

      {/* ── Smart SEO Manager ──────────────────────────────────────────── */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={label}>🚀 Smart SEO Manager (Visibility Strategy)</div>
          <button
            onClick={() => void runCron(true)}
            disabled={cronRunning}
            style={{
              background:   cronRunning ? '#374151' : '#f43f5e',
              color:        '#fff',
              border:       'none',
              borderRadius: 6,
              padding:      '8px 16px',
              cursor:       cronRunning ? 'not-allowed' : 'pointer',
              fontSize:     13,
              fontWeight:   700,
            }}
          >
            {cronRunning ? '⏳ Running...' : '⚡ Force Update'}
          </button>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#475569' }}>
          Auto-generated keywords based on India Google Trends. Titles &amp; descriptions are FIXED (never auto-changed).
        </p>

        {cronMsg && (
          <div style={{ background: '#0f2742', border: '1px solid #1e3a5f', borderRadius: 6, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#7dd3fc' }}>
            {cronMsg}
          </div>
        )}

        {/* Page SEO list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(data?.seoPages ?? []).map((pg) => (
            <div key={pg.page} style={{ background: '#0a1628', border: '1px solid #1e2d40', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 13, color: '#f43f5e', fontWeight: 700, textTransform: 'uppercase' }}>/{pg.page === 'home' ? '' : pg.page}</span>
                  <span style={{ fontSize: 11, color: '#475569', marginLeft: 8 }}>
                    {pg.lastUpdated ? `Updated ${new Date(pg.lastUpdated).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}` : 'Not yet generated'}
                  </span>
                </div>
                <button
                  onClick={() => setSeoEdit({ page: pg.page, title: pg.title ?? '', desc: pg.description ?? '', kw: (pg.keywords ?? []).join(', ') })}
                  style={{ background: '#1e2d40', color: '#94a3b8', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11 }}
                >
                  Edit
                </button>
              </div>

              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Browser Title:</span>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#e2e8f0' }}>{pg.title || '—'}</p>
              </div>

              {pg.trendKeywords && pg.trendKeywords.length > 0 && (
                <div>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Trend Keywords (Auto):</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {pg.trendKeywords.map((kw, i) => (
                      <span key={i} style={{ background: '#0f2742', color: '#7dd3fc', borderRadius: 4, padding: '2px 8px', fontSize: 11 }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── SEO Edit Modal ─────────────────────────────────────────────── */}
      {seoEdit && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e2d40', borderRadius: 12, padding: 24, width: 560, maxWidth: '90vw' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f1f5f9' }}>Edit SEO: /{seoEdit.page}</h3>

            <label style={{ ...label, display: 'block', marginBottom: 4 }}>Browser Title (FIXED — manually edited only)</label>
            <input
              value={seoEdit.title}
              onChange={e => setSeoEdit({ ...seoEdit, title: e.target.value })}
              style={{ width: '100%', background: '#1e2d40', border: '1px solid #2d3f55', borderRadius: 6, padding: '8px 12px', color: '#f1f5f9', fontSize: 13, boxSizing: 'border-box', marginBottom: 12 }}
            />

            <label style={{ ...label, display: 'block', marginBottom: 4 }}>Meta Description (FIXED)</label>
            <textarea
              value={seoEdit.desc}
              onChange={e => setSeoEdit({ ...seoEdit, desc: e.target.value })}
              rows={3}
              style={{ width: '100%', background: '#1e2d40', border: '1px solid #2d3f55', borderRadius: 6, padding: '8px 12px', color: '#f1f5f9', fontSize: 13, boxSizing: 'border-box', resize: 'vertical', marginBottom: 12 }}
            />

            <label style={{ ...label, display: 'block', marginBottom: 4 }}>Targeted Keywords (comma-separated)</label>
            <textarea
              value={seoEdit.kw}
              onChange={e => setSeoEdit({ ...seoEdit, kw: e.target.value })}
              rows={2}
              style={{ width: '100%', background: '#1e2d40', border: '1px solid #2d3f55', borderRadius: 6, padding: '8px 12px', color: '#f1f5f9', fontSize: 13, boxSizing: 'border-box', resize: 'vertical', marginBottom: 16 }}
            />

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSeoEdit(null)}
                style={{ background: '#1e2d40', color: '#94a3b8', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
              >Cancel</button>
              <button
                onClick={async () => {
                  await fetch('/api/seo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'save-page-seo',
                      page:   seoEdit.page,
                      title:  seoEdit.title,
                      description: seoEdit.desc,
                      keywords:    seoEdit.kw.split(',').map(k => k.trim()).filter(Boolean),
                    }),
                  })
                  setSeoEdit(null)
                  await load()
                }}
                style={{ background: '#f43f5e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 700 }}
              >Save SEO Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cron log ───────────────────────────────────────────────────── */}
      {data?.cronLog && (
        <div style={card}>
          <div style={label}>Last SEO Cron Run — {new Date(data.cronLog.ts).toLocaleString('en-IN')}</div>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.cronLog.log.map((line, i) => (
              <span key={i} style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
                {line.startsWith('===') ? <strong style={{ color: '#7dd3fc' }}>{line}</strong> : line}
              </span>
            ))}
          </div>
        </div>
      )}


    </div>
  )
}