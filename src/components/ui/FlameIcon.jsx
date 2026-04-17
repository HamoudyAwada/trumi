/* ─────────────────────────────────────────────
   FlameIcon
   Figma source: node 517-7978 (AAIkcs7Qk445QuSRh90T00)
   Two states: active (navy + violet glow) | inactive (grey)
   Default size: 32×32 px (square, scales proportionally).
───────────────────────────────────────────── */

/* Figma assets — valid 7 days from Apr 17 2026 */
const FLAME_INACTIVE   = 'https://www.figma.com/api/mcp/asset/9b028bf5-22d7-4098-8046-7931dc46c8d1'
const ELLIPSE_INACTIVE = 'https://www.figma.com/api/mcp/asset/fc7481c5-bb1a-4e88-96c5-edb67d953558'
const FLAME_ACTIVE     = 'https://www.figma.com/api/mcp/asset/cd702c6f-3aed-4e3e-9a0b-89281cf1e9c9'
const ELLIPSE_ACTIVE   = 'https://www.figma.com/api/mcp/asset/d13eedea-2e2a-41bc-b034-66dccdaef220'

export default function FlameIcon({ active = true, size = 32 }) {
  const s = size / 32  // scale factor from Figma's 32px base

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width:    size,
        height:   size,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Inner ellipse (glow) — Figma: left 8px, top 12px, 16×20px */}
      <div style={{
        position: 'absolute',
        left:   8  * s,
        top:    12 * s,
        width:  16 * s,
        height: 20 * s,
      }}>
        <img
          src={active ? ELLIPSE_ACTIVE : ELLIPSE_INACTIVE}
          alt=""
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      </div>

      {/* Flame body — Figma: inset 0 12.5% (75% wide, full height) */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left:  '12.5%',
        right: '12.5%',
      }}>
        <img
          src={active ? FLAME_ACTIVE : FLAME_INACTIVE}
          alt=""
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
