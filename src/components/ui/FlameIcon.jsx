/* ─────────────────────────────────────────────
   FlameIcon
   Figma source: node 517-7978 (AAIkcs7Qk445QuSRh90T00)
   Two states: active (navy + violet glow) | inactive (grey)
   Default size: 32×32 px (square, scales proportionally).
───────────────────────────────────────────── */

const FLAME_ACTIVE   = '/assets/figma/flame/active.svg'
const FLAME_INACTIVE = '/assets/figma/flame/inactive.svg'

export default function FlameIcon({ active = true, size = 32 }) {
  return (
    <img
      src={active ? FLAME_ACTIVE : FLAME_INACTIVE}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0 }}
    />
  )
}
