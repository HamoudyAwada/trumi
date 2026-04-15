import { useState, useEffect } from 'react'
import { DEFAULT_SKIN_MAIN, DEFAULT_SKIN_SHADOW } from './characterAssets'

const cache = new Map()

/**
 * Returns an SVG src with skin fill colors replaced.
 * factor=1.0 makes cls-3 and cls-1 the exact same color — no two-tone halo.
 * Also replaces cls-4 (#f3c0a1) used in the neck SVG.
 */
function getSkinShadow(hex) {
  // factor 1.0 = identical shadow, eliminates visible two-tone on face oval
  return hex
}

export function useSkinTone(path, skinTone, hasSkin = false) {
  const [src, setSrc] = useState(() => {
    if (!hasSkin) return path
    return cache.get(`${path}::${skinTone}`) ?? null
  })

  useEffect(() => {
    if (!hasSkin) { setSrc(path); return }

    const key = `${path}::${skinTone}`
    if (cache.has(key)) { setSrc(cache.get(key)); return }

    let cancelled = false

    fetch(path)
      .then(r => { if (!r.ok) throw new Error(`Failed: ${path}`); return r.text() })
      .then(svgText => {
        if (cancelled) return
        const shadow = getSkinShadow(skinTone)
        const recolored = svgText
          .replace(new RegExp(DEFAULT_SKIN_MAIN,   'gi'), skinTone)
          .replace(new RegExp(DEFAULT_SKIN_SHADOW, 'gi'), shadow)
          .replace(/#f3c0a1/gi, shadow)
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(recolored)}`
        cache.set(key, dataUrl)
        setSrc(dataUrl)
      })
      .catch(err => { if (!cancelled) console.warn('[useSkinTone]', err) })

    return () => { cancelled = true }
  }, [path, skinTone, hasSkin])

  return src
}
