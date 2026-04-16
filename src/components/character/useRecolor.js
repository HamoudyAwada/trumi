import { useState, useEffect } from 'react'

const cache = new Map()

/**
 * Returns an SVG src with one or more colors replaced by `toColor`.
 * @param {string}   path          - Public path to the SVG
 * @param {string}   fromColor     - Primary color to replace (hex). Pass '' to skip.
 * @param {string}   toColor       - Replacement color
 * @param {string[]} alsoReplace   - Additional hex colors to also replace with toColor
 */
export function useRecolor(path, fromColor, toColor, alsoReplace = []) {
  const cacheKey = `${path}::${fromColor}::${toColor}::${alsoReplace.join(',')}`

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
        if (fromColor) {
          result = result.replace(new RegExp(fromColor, 'gi'), toColor)
        }
        for (const extra of alsoReplace) {
          if (extra) result = result.replace(new RegExp(extra, 'gi'), toColor)
        }
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(result)}`
        cache.set(cacheKey, dataUrl)
        setSrc(dataUrl)
      })
      .catch(err => { if (!cancelled) console.warn('[useRecolor]', err) })

    return () => { cancelled = true }
  }, [cacheKey])

  return src
}
