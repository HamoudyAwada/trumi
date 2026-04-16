import { useState, useEffect } from 'react'

const cache = new Map()

/**
 * For each hair color option (keyed by its swatch hex value), maps every
 * base shade found across all hair SVGs to the proportionally equivalent
 * shade in that colour family.
 *
 * Shade roles across the SVGs:
 *   darkest  — #42210b (fem-2 shadow), #59320c (masc shadow)
 *   dark     — #603913 / #603813 (masc+fem mid-shadow)
 *   mid      — #764617 (shared mid-tone)
 *   light    — #a97c50 / #a67c52 (sleek + fem-6 highlight)
 *   buzz     — #9b8579 (buzz-cut's greyish brown)
 *   nearblk  — #1a1a1a (fem-5 base), #333 (fem-7 CSS class)
 */
const SHADE_MAP = {
  '#1a1a1a': {              // ── Black ──────────────────────────────────────
    '#42210b': '#101010',
    '#59320c': '#1a1a1a',
    '#603913': '#222222',
    '#603813': '#222222',
    '#764617': '#2e2e2e',
    '#a97c50': '#464646',
    '#a67c52': '#464646',
    '#9b8579': '#5a5a5a',
    '#1a1a1a': '#101010',
    '#333':    '#1c1c1c',
  },
  '#3b1f0a': {              // ── Dark Brown ──────────────────────────────────
    '#42210b': '#1e0e04',
    '#59320c': '#3b1f0a',
    '#603913': '#4c2a0e',
    '#603813': '#4c2a0e',
    '#764617': '#603512',
    '#a97c50': '#8c5630',
    '#a67c52': '#8c5630',
    '#9b8579': '#8a6855',
    '#1a1a1a': '#200f04',
    '#333':    '#2a1505',
  },
  '#59320c': {              // ── Brown (original — identity mapping) ─────────
    '#42210b': '#42210b',
    '#59320c': '#59320c',
    '#603913': '#603913',
    '#603813': '#603813',
    '#764617': '#764617',
    '#a97c50': '#a97c50',
    '#a67c52': '#a67c52',
    '#9b8579': '#9b8579',
    '#1a1a1a': '#3d1e08',
    '#333':    '#59320c',
  },
  '#8b3a0f': {              // ── Auburn ──────────────────────────────────────
    '#42210b': '#4a1a05',
    '#59320c': '#6e2608',
    '#603913': '#7d2e0c',
    '#603813': '#7d2e0c',
    '#764617': '#8b3a0f',
    '#a97c50': '#c26230',
    '#a67c52': '#c26230',
    '#9b8579': '#b07055',
    '#1a1a1a': '#3d1005',
    '#333':    '#5a2008',
  },
  '#c4922a': {              // ── Blonde ──────────────────────────────────────
    '#42210b': '#6b4d15',
    '#59320c': '#8a651e',
    '#603913': '#9a7224',
    '#603813': '#9a7224',
    '#764617': '#b8882a',
    '#a97c50': '#d4a845',
    '#a67c52': '#d4a845',
    '#9b8579': '#c8b072',
    '#1a1a1a': '#5a4010',
    '#333':    '#7a5a18',
  },
  '#b22222': {              // ── Red ─────────────────────────────────────────
    '#42210b': '#4a0808',
    '#59320c': '#6e0f0f',
    '#603913': '#7c1212',
    '#603813': '#7c1212',
    '#764617': '#921818',
    '#a97c50': '#c44040',
    '#a67c52': '#c44040',
    '#9b8579': '#b05050',
    '#1a1a1a': '#3d0808',
    '#333':    '#5c1010',
  },
}

export function useHairRecolor(path, hairColor) {
  const cacheKey = `${path}::hair::${hairColor}`
  const [src, setSrc] = useState(() => cache.get(cacheKey) ?? null)

  useEffect(() => {
    if (!path) { setSrc(''); return }
    if (cache.has(cacheKey)) { setSrc(cache.get(cacheKey)); return }

    let cancelled = false

    fetch(path)
      .then(r => { if (!r.ok) throw new Error(`Failed: ${path}`); return r.text() })
      .then(svgText => {
        if (cancelled) return

        let result = svgText
        const shades = SHADE_MAP[hairColor]

        // Step 1 — always inject fill on the root <svg> using the darkest target
        // shade. This only affects paths with NO explicit fill of their own — they
        // inherit from the root. Paths with an inline fill or a CSS class rule
        // override this, so it is safe for every SVG type.
        // (Handles: Hair 1/4/8 fem which have zero fill attributes, AND Hair 7
        //  fem whose large base path has no class/fill alongside cls-1 paths.)
        const darkestShade = shades?.['#42210b'] ?? hairColor
        result = result.replace(/(<svg\b)/i, `$1 fill="${darkestShade}"`)

        // Step 2 — replace every known explicit base shade with its proportional
        // target shade. Covers inline fill attrs, CSS class rules, etc.
        if (shades) {
          for (const [from, to] of Object.entries(shades)) {
            if (from === '#333') {
              // 3-digit shorthand — avoid matching inside longer hex values
              result = result.replace(/#333(?![0-9a-fA-F])/gi, to)
            } else {
              result = result.replace(new RegExp(from, 'gi'), to)
            }
          }
        }

        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result)}`
        cache.set(cacheKey, dataUrl)
        setSrc(dataUrl)
      })
      .catch(err => { if (!cancelled) console.warn('[useHairRecolor]', err) })

    return () => { cancelled = true }
  }, [path, hairColor])

  return src
}
