import { useNavigate, useParams } from 'react-router-dom'

/* ─────────────────────────────────────────────
   LogEntry — placeholder screen
   The full design will be provided by Moe.
   For now this is a holding page so navigation
   from GoalCard "Create Entry" works correctly.
───────────────────────────────────────────── */

export default function LogEntry() {
  const navigate    = useNavigate()
  const { id }      = useParams()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      maxWidth: '430px',
      margin: '0 auto',
      background: 'var(--color-cloud, #fffcfa)',
      boxSizing: 'border-box',
    }}>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '18px',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-tranquil-night, #0f1c3f)',
          margin: 0,
        }}>
          Entry screen coming soon
        </p>
        <p style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '14px',
          color: 'var(--color-fogstone, #66747f)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          This screen will let you log a full entry for your goal. The design is on its way.
        </p>
        <button
          onClick={() => navigate('/goals')}
          style={{
            marginTop: '8px',
            background: 'var(--color-horizon-violet, #6666cc)',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '10px 28px',
            fontFamily: 'var(--font-primary)',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-bold)',
            cursor: 'pointer',
          }}
        >
          Back to Goals
        </button>
      </div>
    </div>
  )
}
