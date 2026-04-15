import { useState, useEffect } from 'react'
import { DEFAULT_SKIN_MAIN, DEFAULT_SKIN_SHADOW, getSkinShadow } from './characterAssets'

/**
 * In-memory cache: "path::skinTone" → data URL
 * Persists for the session — avoids re-fetching the same combination twice.
 */
const cache = new Map()

/**
 * Returns a src string for an SVG, optionally with skin colors swapped.
 *
 * @param {string} path     - Public path to the SVG file
 * @param {string} skinTone - Hex skin tone to apply (e.g. "#ffe1cf")
 * @param {boolean} hasSkin - Set true for face/neck SVGs that have baked-in skin colors
 * @returns {string|null}   - Data URL (or raw path if hasSkin=false), null while loading
 */
export function useSkinTone(path, skinTone, hasSkin = false) {
  const [src, setSrc] = useState(() => {
    if (!hasSkin) return path
    const key = `${path}::${skinTone}`
    return cache.get(key) ?? null
  })

  useEffect(() => {
    if (!hasSkin) {
      setSrc(path)
      return
    }

    const key = `${path}::${skinTone}`

    if (cache.has(key)) {
      setSrc(cache.get(key))
      return
    }

    let cancelled = false

    fetch(path)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load ${path}`)
        return r.text()
      })
      .then(svgText => {
        if (cancelled) return

        const shadow = getSkinShadow(skinTone)

        // Case-insensitive replacement of both skin fill values
        const recolored = svgText
          .replace(new RegExp(DEFAULT_SKIN_MAIN,   'gi'), skinTone)
          .replace(new RegExp(DEFAULT_SKIN_SHADOW, 'gi'), shadow)

        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(recolored)}`
        cache.set(key, dataUrl)
        setSrc(dataUrl)
      })
      .catch(err => {
        if (!cancelled) console.warn('[useSkinTone] Could not load SVG:', err)
      })

    return () => { cancelled = true }
  }, [path, skinTone, hasSkin])

  return src
}
