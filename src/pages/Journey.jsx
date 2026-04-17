import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import './Journey.css'

/* ── Assets (Figma MCP — valid 7 days from Apr 17 2026) ─────────────────── */

const MAP_BLOCK_0 = 'https://www.figma.com/api/mcp/asset/47d340db-1421-4be4-97d0-81a6644b6de0' // star coin (active)
const MAP_BLOCK_1 = 'https://www.figma.com/api/mcp/asset/70f752c2-458d-4a2a-b131-7b446fb1992b' // hex coin 1
const MAP_BLOCK_2 = 'https://www.figma.com/api/mcp/asset/e4cb2eb8-f7aa-4cb1-8e1b-ce0765dbb909' // hex coin 2
const MAP_BLOCK_3 = 'https://www.figma.com/api/mcp/asset/d8ef7d66-e862-42db-b67f-07c08a4fad44' // dotted coin (locked)
const PATH_1      = 'https://www.figma.com/api/mcp/asset/1ae46a57-8fe9-4797-9fa3-028946ee7b37' // connector 0→1
const PATH_2      = 'https://www.figma.com/api/mcp/asset/896891d3-365f-4de0-aa9b-0dfb51adefa3' // connector 1→2
const PATH_3      = 'https://www.figma.com/api/mcp/asset/b3ad6a9d-b85e-4622-baca-ef22c2e8b2a4' // connector 2→3
const PATH_4      = 'https://www.figma.com/api/mcp/asset/5dd819d5-781c-47e3-a10a-d71d382ca7ca' // connector 3→…
const CHAR_FULL   = 'https://www.figma.com/api/mcp/asset/72105aa7-68e2-4290-975b-a4038cdb3591' // full character (top-right)
const CHAR_SMALL  = 'https://www.figma.com/api/mcp/asset/eecdd85e-7a72-42b6-9a09-170f8d5f2957' // outline char (mid-left)
const CHAR_ALT    = 'https://www.figma.com/api/mcp/asset/1b65689e-3a58-445b-8f8b-e3609db288e4' // alt char (bottom-right)

/* ── Map — positions derived from Figma Component1 (326.902 × 555.29 px) ── */

function JourneyMap() {
  return (
    <div className="jn-map">

      {/* ── Path connectors (rendered behind coins) ─────────────── */}

      {/* Connector 0→1: inset 12.94% 61.3% 70.05% 9.36%, rotate -12.77deg */}
      <div className="jn-map__path" style={{ top:'12.94%', right:'61.3%', bottom:'70.05%', left:'9.36%' }}>
        <div className="jn-map__path-inner" style={{ transform:'rotate(-12.77deg)', top:'-10.29%', right:'-10.04%', bottom:'-10.29%', left:'-10.04%' }}>
          <img src={PATH_1} alt="" aria-hidden="true" className="jn-map__img" />
        </div>
      </div>

      {/* Connector 1→2: inset 57.36% 69.43% 23.39% 5.38%, rotate 87.83deg */}
      <div className="jn-map__path" style={{ top:'57.36%', right:'69.43%', bottom:'23.39%', left:'5.38%' }}>
        <div className="jn-map__path-inner" style={{ transform:'rotate(87.83deg)', top:'-10.31%', right:'-7.77%', bottom:'-10.3%', left:'-7.77%' }}>
          <img src={PATH_2} alt="" aria-hidden="true" className="jn-map__img" />
        </div>
      </div>

      {/* Connector 2→3: inset 87.81% 21.54% -4.03% 39.46%, rotate 173.43deg */}
      <div className="jn-map__path" style={{ top:'87.81%', right:'21.54%', bottom:'-4.03%', left:'39.46%' }}>
        <div className="jn-map__path-inner" style={{ transform:'rotate(173.43deg)', top:'-10.52%', right:'-6.77%', bottom:'-10.52%', left:'-6.77%' }}>
          <img src={PATH_3} alt="" aria-hidden="true" className="jn-map__img" />
        </div>
      </div>

      {/* Connector extra: inset 30.22% 0 45.9% 59.54%, rotate -115.94deg */}
      <div className="jn-map__path" style={{ top:'30.22%', right:'0', bottom:'45.9%', left:'59.54%' }}>
        <div className="jn-map__path-inner" style={{ transform:'rotate(-115.94deg)', top:'-8.19%', right:'-8.13%', bottom:'-8.19%', left:'-8.13%' }}>
          <img src={PATH_4} alt="" aria-hidden="true" className="jn-map__img" />
        </div>
      </div>

      {/* ── Character illustrations ──────────────────────────────── */}

      {/* Full character — top-right: inset -13.87% 1.19% 78.56% 70.05% */}
      <div className="jn-map__char" style={{ top:'-13.87%', right:'1.19%', bottom:'78.56%', left:'70.05%' }}>
        <img src={CHAR_FULL} alt="Your Trumi" className="jn-map__img jn-map__img--contain" />
      </div>

      {/* Outline character — mid-left: inset 34.76% 85.09% 44.48% 0.61% */}
      <div className="jn-map__char" style={{ top:'34.76%', right:'85.09%', bottom:'44.48%', left:'0.61%' }}>
        <img src={CHAR_SMALL} alt="" aria-hidden="true" className="jn-map__img jn-map__img--contain" />
      </div>

      {/* Alt character — bottom-right: inset 66.27% 1.19% 7.12% 75.86% */}
      <div className="jn-map__char" style={{ top:'66.27%', right:'1.19%', bottom:'7.12%', left:'75.86%' }}>
        <img src={CHAR_ALT} alt="" aria-hidden="true" className="jn-map__img jn-map__img--contain" />
      </div>

      {/* ── Milestone nodes (rendered on top) ───────────────────── */}

      {/* Node 0 — star coin (active, top-left): inset 0 74% 87.57% 0 */}
      <div className="jn-map__node" style={{ top:'0', right:'74%', bottom:'87.57%', left:'0' }}>
        <img src={MAP_BLOCK_0} alt="Milestone 1 — Begin" className="jn-map__img" />
      </div>

      {/* Node 1 — hex coin (mid-right): inset 24.81% 27.81% 62.77% 46.19% */}
      <div className="jn-map__node" style={{ top:'24.81%', right:'27.81%', bottom:'62.77%', left:'46.19%' }}>
        <img src={MAP_BLOCK_1} alt="Milestone 2" className="jn-map__img" />
      </div>

      {/* Node 2 — hex coin (lower-mid): inset 47.72% 36.07% 39.85% 37.93% */}
      <div className="jn-map__node" style={{ top:'47.72%', right:'36.07%', bottom:'39.85%', left:'37.93%' }}>
        <img src={MAP_BLOCK_2} alt="Milestone 3" className="jn-map__img" />
      </div>

      {/* Node 3 — dotted coin (locked, bottom-left): inset 77.8% 65.13% 9.78% 8.87% */}
      <div className="jn-map__node" style={{ top:'77.8%', right:'65.13%', bottom:'9.78%', left:'8.87%' }}>
        <img src={MAP_BLOCK_3} alt="Milestone 4" className="jn-map__img" />
      </div>

    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function Journey() {
  const navigate = useNavigate()

  return (
    <div className="jn-page">
      <PageHeader title="My Journey" />

      <div className="jn-content">

        <button className="jn-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <JourneyMap />

      </div>
    </div>
  )
}
