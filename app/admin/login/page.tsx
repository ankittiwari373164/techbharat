'use client'
import { useState, useRef } from 'react'

export default function AdminLogin() {
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Use a real HTML form POST — browser handles cookie + redirect natively
  // No fetch, no JS redirect — server sets cookie and redirects in one go

  const s = {
    page: {
      minHeight: '100vh', background: '#0d0d0d', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    } as React.CSSProperties,
    wrap: { width: '100%', maxWidth: '380px' } as React.CSSProperties,
    card: {
      background: '#1a1a1a', border: '1px solid #2d2d2d',
      borderRadius: '16px', padding: '32px',
    } as React.CSSProperties,
    label: { display: 'block', color: '#9ca3af', fontSize: '12px', fontWeight: '500', marginBottom: '6px' } as React.CSSProperties,
    input: {
      width: '100%', background: '#111', border: '1px solid #374151',
      borderRadius: '8px', padding: '12px 14px', color: '#fff',
      fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
      marginBottom: '16px',
    } as React.CSSProperties,
    btn: {
      width: '100%', background: '#d4220a', color: '#fff', border: 'none',
      borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: '700',
      cursor: 'pointer',
    } as React.CSSProperties,
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', marginBottom: '8px' }}>
            <span style={{ color: '#d4220a' }}>Tech</span>
            <span style={{ color: '#fff' }}>Bharat</span>
          </div>
          <div style={{ color: '#6b7280', fontSize: '13px' }}>Admin Panel</div>
        </div>

        <div style={s.card}>
          <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0' }}>Sign in</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 24px 0' }}>Enter your admin password to continue</p>

          {/* Plain HTML form — browser handles POST, cookie, and redirect natively */}
          <form method="POST" action="/api/admin/login">
            <label style={s.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              autoFocus
              autoComplete="current-password"
              required
              style={s.input}
            />
            <button type="submit" style={s.btn}>Sign In →</button>
          </form>

          {/* Show error from URL param if redirected back with ?error=1 */}
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') && (
            <div style={{
              marginTop: '16px', background: '#2d0a0a', border: '1px solid #7f1d1d',
              borderRadius: '8px', padding: '10px 14px', color: '#f87171', fontSize: '13px',
            }}>
              ⚠ Invalid password. Please try again.
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#374151', fontSize: '11px', marginTop: '24px' }}>
          TechBharat Admin · Authorised access only
        </p>
      </div>
    </div>
  )
}