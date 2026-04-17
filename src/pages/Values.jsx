import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import './Values.css'

/* ── Figma assets (node 667:8575) ─────────────────────────────────────── */
const IMG_DIAMOND    = 'https://www.figma.com/api/mcp/asset/d9fe6dff-9882-4ac7-8bb7-77f4b642abb3'
const IMG_SPARKLE_R  = 'https://www.figma.com/api/mcp/asset/7620e9c7-ed1a-4325-81e6-2f7096dd8acb'
const IMG_SPARKLE_L  = 'https://www.figma.com/api/mcp/asset/63201f76-42e6-40fd-a5f6-5976b4b96a83'
const IMG_SPARKLE_I1 = 'https://www.figma.com/api/mcp/asset/2cf5af8e-a830-44a1-8c28-194a985aab1c'
const IMG_SPARKLE_I2 = 'https://www.figma.com/api/mcp/asset/8e2b176b-e502-41c1-be50-9376841d1745'
const IMG_SPARKLE_I3 = 'https://www.figma.com/api/mcp/asset/b835b573-5a26-4477-8292-5dc5a396c617'
const IMG_TARGET     = 'https://www.figma.com/api/mcp/asset/090d5093-1e66-4362-95bf-91b6be8cf71e'

/* ── Data ─────────────────────────────────────────────────────────────── */
function loadValues() {
  try {
    const { top3 = [], top10 = [] } = JSON.parse(localStorage.getItem('trumi_values') ?? '{}')
    const others = top10.filter(v => !top3.includes(v))
    return { top3, others }
  } catch {
    return { top3: [], others: [] }
  }
}

/* ══════════════════════════════════════════════════════════════════════
   Values page
   ══════════════════════════════════════════════════════════════════════ */
export default function Values() {
  const navigate = useNavigate()
  const [alignOpen, setAlignOpen] = useState(false)
  const { top3, others } = loadValues()

  return (
    <div className="mv-page">
      <PageHeader title="My Values" />

      {/* Goals toggle — top-right, lets user switch to the Goals view */}
      <button className="mv-goals-btn" onClick={() => navigate('/goals')} aria-label="Switch to Goals">
        <img src={IMG_TARGET} alt="" className="mv-goals-btn__icon" aria-hidden="true" />
        <span className="mv-goals-btn__label">Goals</span>
      </button>

      <div className="mv-scroll">

        {/* ── Diamond hero ── */}
        <div className="mv-hero">
          <div className="mv-diamond-zone">
            {/* Outer sparkles */}
            <img src={IMG_SPARKLE_L} alt="" aria-hidden="true" className="mv-sparkle mv-sparkle--left" />
            <img src={IMG_SPARKLE_R} alt="" aria-hidden="true" className="mv-sparkle mv-sparkle--right" />

            {/* Diamond gem with inner sparkles */}
            <div className="mv-gem-wrap">
              <img src={IMG_DIAMOND} alt="" aria-hidden="true" className="mv-gem-img" />
              <img src={IMG_SPARKLE_I1} alt="" aria-hidden="true" className="mv-gem-sparkle mv-gem-sparkle--tl" />
              <img src={IMG_SPARKLE_I2} alt="" aria-hidden="true" className="mv-gem-sparkle mv-gem-sparkle--tr" />
              <img src={IMG_SPARKLE_I3} alt="" aria-hidden="true" className="mv-gem-sparkle mv-gem-sparkle--tr-sm" />
            </div>
          </div>

          <h1 className="mv-title">My Values</h1>
        </div>

        {/* ── Value chips ── */}
        <div className="mv-chips">
          {/* Row 1 — top 3 priority values (large, violet-filled) */}
          {top3.length > 0 && (
            <div className="mv-chips__row">
              {top3.map(v => (
                <span key={v} className="mv-chip mv-chip--priority">{v}</span>
              ))}
            </div>
          )}

          {/* Rows 2+ — other selected values (smaller, light bg) */}
          {others.length > 0 && (
            <>
              <div className="mv-chips__row">
                {others.slice(0, 3).map(v => (
                  <span key={v} className="mv-chip">{v}</span>
                ))}
              </div>
              {others.length > 3 && (
                <div className="mv-chips__row">
                  {others.slice(3).map(v => (
                    <span key={v} className="mv-chip">{v}</span>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Empty state */}
          {top3.length === 0 && others.length === 0 && (
            <p className="mv-empty">Complete onboarding to see your values here.</p>
          )}
        </div>

        {/* ── Alignment info toggle ── */}
        <div className="mv-align">
          {alignOpen && (
            <p className="mv-align__body">
              Being "aligned" means that your daily actions and choices reflect what matters most to you.
              For example, if you value <strong>Peace</strong>, but often feel stressed or overwhelmed,
              your current alignment with the value Peace might be low.
            </p>
          )}
          <button
            className="mv-align__toggle"
            onClick={() => setAlignOpen(o => !o)}
            aria-expanded={alignOpen}
          >
            *What do you mean alignment?
          </button>
        </div>

        {/* ── Redefine button ── */}
        <div className="mv-actions">
          <button className="mv-redefine-btn" onClick={() => navigate('/onboarding/step/1')}>
            Redefine My Values
          </button>
        </div>

      </div>
    </div>
  )
}
