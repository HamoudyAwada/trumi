import { useState, useEffect } from 'react'

const cache = new Map()

/**
 * For each skin tone, maps every base nose shade to a proportionally
 * equivalent shade in that skin-tone family.
 *
 * Shade roles across the nose SVGs:
 *   main      — #ffd1b5  base skin fill (cls-1)
 *   highlight — #ffddc9  lighter warm highlight (cls-3)
 *   mid       — #f5b893  mid shadow / outline stroke (cls-4 / stroke)
 *   deep      — #dc886f  deep shadow (cls-2)
 *
 * Proportional ratios derived from the original base (#ffd1b5):
 *   highlight  → R×1.000, G×1.057, B×1.110  (capped at 255)
 *   mid shadow → R×0.961, G×0.880, B×0.812
 *   deep shadow→ R×0.863, G×0.651, B×0.613
 */
const NOSE_SHADE_MAP = {
  '#ffe1cf': {
    '#ffd1b5': '#ffe1cf',
    '#ffddc9': '#ffeee5',
    '#f5b893': '#f5c6a8',
    '#dc886f': '#dc927f',
  },
  '#d3b7a6': {
    '#ffd1b5': '#d3b7a6',
    '#ffddc9': '#d3c1b8',
    '#f5b893': '#cba187',
    '#dc886f': '#b67766',
  },
  '#a78d7c': {
    '#ffd1b5': '#a78d7c',
    '#ffddc9': '#a7958a',
    '#f5b893': '#a07c65',
    '#dc886f': '#905c4c',
  },
  '#7a6253': {
    '#ffd1b5': '#7a6253',
    '#ffddc9': '#7a685c',
    '#f5b893': '#755643',
    '#dc886f': '#694033',
  },
  '#4e3829': {
    '#ffd1b5': '#4e3829',
    '#ffddc9': '#4e3b2e',
    '#f5b893': '#4b3121',
    '#dc886f': '#432419',
  },
  '#220e00': {
    '#ffd1b5': '#220e00',
    '#ffddc9': '#220f00',
    '#f5b893': '#210c00',
    '#dc886f': '#1d0900',
  },
}

export function useNoseRecolor(path, skinTone) {
  const cacheKey = `${path}::nose::${skinTone}`
  const [src, setSrc] = useState(() => cache.get(cacheKey) ?? null)

  useEffect(() => {
    if (!path) { setSrc(''); return }
    if (cache.has(cacheKey)) { setSrc(cache.get(cacheKey)); return }

    let cancelled = false

    fetch(path)
      .then(r => { if (!r.ok) throw new Error(`Failed: ${path}`); return r.text() })
      .then(svgText => {
        if (cancelled) return

        const shades = NOSE_SHADE_MAP[skinTone]
        let result = svgText

        if (shades) {
          for (const [from, to] of Object.entries(shades)) {
            result = result.replace(new RegExp(from, 'gi'), to)
          }
        }

        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result)}`
        cache.set(cacheKey, dataUrl)
        setSrc(dataUrl)
      })
      .catch(err => { if (!cancelled) console.warn('[useNoseRecolor]', err) })

    return () => { cancelled = true }
  }, [path, skinTone])

  return src
}
