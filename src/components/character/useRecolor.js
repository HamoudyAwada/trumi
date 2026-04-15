import { useState, useEffect } from 'react'

const cache = new Map()

/**
 * Returns an SVG src with `fromColor` replaced by `toColor`.
 * Useful for single-color parts like eyebrows.
 */
export function useRecolor(path, fromColor, toColor) {
  const [src, setSrc] = useState(() => {
    return cache.get(`${path}::${toColor}`) ?? null
  })

  useEffect(() => {
    if (!path) { setSrc(''); return }

    const key = `${path}::${toColor}`
    if (cache.has(key)) { setSrc(cache.get(key)); return }

    let cancelled = false

    fetch(path)
      .then(r => { if (!r.ok) throw new Error(`Failed: ${path}`); return r.text() })
      .then(svgText => {
        if (cancelled) return
        const recolored = svgText.replace(new RegExp(fromColor, 'gi'), toColor)
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(recolored)}`
        cache.set(key, dataUrl)
        setSrc(dataUrl)
      })
      .catch(err => { if (!cancelled) console.warn('[useRecolor]', err) })

    return () => { cancelled = true }
  }, [path, fromColor, toColor])

  return src
}
