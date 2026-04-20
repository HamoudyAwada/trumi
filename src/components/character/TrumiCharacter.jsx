// TrumiCharacter — fetches real SVG files at runtime, substitutes colors, composites layers
// Canvas: 211×320. Layer order back-to-front: hairBehind → body → head → eyes → eyebrows → nose → mouth → hairFront → facialAddition

import { useState, useEffect, useMemo } from 'react';

// ─── Color utilities ──────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function scaleColor(hex, factor) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: Math.min(255, Math.round(r * factor)),
    g: Math.min(255, Math.round(g * factor)),
    b: Math.min(255, Math.round(b * factor)),
  });
}

// ─── useColors — derives all dynamic colors from raw props ────────────────────

function useColors({ skinColor, hairColor, eyeColor, browColor, lipColor }) {
  return useMemo(() => {
    const skin = skinColor || '#FEE6CF';
    const hair = hairColor || '#CB8565';
    const eye  = eyeColor  || '#266BFF';
    const brow = browColor || '#C07D61';
    const lip  = lipColor  || '#6A4D40';
    return {
      skin,
      skinOutline:  scaleColor(skin, 0.62),
      skinShadow:   scaleColor(skin, 0.90),
      hair,
      hairDark:     scaleColor(hair, 0.60),
      hairDarker:   scaleColor(hair, 0.50),
      eye,
      eyeOutline:   '#6B4F42',
      brow,
      browStroke:   scaleColor(brow, 0.68),
      lip,
      lipStroke:    scaleColor(lip, 0.72),
      blush:        '#FEB2B4',
      wrinkle:      '#6B4C3D',
      white:        '#FEFEFE',
    };
  }, [skinColor, hairColor, eyeColor, browColor, lipColor]);
}

// ─── Layer asset definitions — positions verified against Example Character 1 ─
// hair entries have { behind, front } — one click applies both layers at the right z-index

const BASE = '/assets/character/Trumi Characters';

const LAYER_DEFS = {
  // Each hair style bundles a back layer (rendered behind body) + front layer (rendered on top)
  hair: {
    'hair-1': {
      behind: { src: `${BASE}/Hair/Behind/Back Hair 1.svg`, x: 0,    y: 0, w: 211, h: 229 },
      front:  { src: `${BASE}/Hair/Front/Hair 01.svg`,       x: 41.5, y: 1.31, w: 128, h: 147 },
    },
    'hair-2': {
      behind: { src: `${BASE}/Hair/Behind/Back Hair 2.svg`, x: 30.5, y: 0, w: 150, h: 278 },
      front:  { src: `${BASE}/Hair/Front/Hair 02.svg`,       x: 34,   y: 1.31, w: 143, h: 96 },
    },
    'hair-3': {
      behind: null,
      front:  { src: `${BASE}/Hair/Front/Hair 03.svg`, x: 41.5, y: 1.31, w: 128, h: 87 },
    },
    'hair-4': {
      behind: null,
      front:  { src: `${BASE}/Hair/Front/Hair 04.svg`, x: 16.5, y: -18, w: 178, h: 128 },
    },
    'hair-5': {
      behind: null,
      front:  { src: `${BASE}/Hair/Front/Hair 05.svg`, x: 41, y: 1.31, w: 129, h: 99 },
    },
  },
  body: {
    'body-1': { src: `${BASE}/Bodies/body 1.svg`, x: 14.82, y: 131.59, w: 181, h: 189 },
    'body-2': { src: `${BASE}/Bodies/body 2.svg`, x: 14,    y: 131.59, w: 183, h: 187 },
    'body-3': { src: `${BASE}/Bodies/body 3.svg`, x: 18,    y: 131.59, w: 175, h: 190 },
    'body-4': { src: `${BASE}/Bodies/body 4.svg`, x: 21,    y: 131.59, w: 169, h: 191 },
    'body-5': { src: `${BASE}/Bodies/body 5.svg`, x: 4,     y: 131.59, w: 203, h: 190 },
  },
  head: {
    'head-01': { src: `${BASE}/Heads/Head 01.svg`, x: 31.26, y: 4.74, w: 149, h: 134 },
    'head-02': { src: `${BASE}/Heads/Head 02.svg`, x: 31.26, y: 4.74, w: 149, h: 134 },
    'head-03': { src: `${BASE}/Heads/Head 03.svg`, x: 31.26, y: 4.74, w: 149, h: 134 },
    'head-04': { src: `${BASE}/Heads/Head 04.svg`, x: 30.76, y: 4.74, w: 150, h: 134 },
    'head-05': { src: `${BASE}/Heads/Head 05.svg`, x: 31.26, y: 4.74, w: 149, h: 134 },
  },
  eyes: {
    'eyes-01': { src: `${BASE}/Eyes/Eyes 01.svg`, x: 57.13, y: 76.11, w: 97,  h: 30 },
    'eyes-02': { src: `${BASE}/Eyes/Eyes 02.svg`, x: 61.5,  y: 82.11, w: 88,  h: 9  },
    'eyes-03': { src: `${BASE}/Eyes/Eyes 03.svg`, x: 63,    y: 76.11, w: 85,  h: 21 },
    'eyes-04': { src: `${BASE}/Eyes/Eyes 04.svg`, x: 54.5,  y: 76.11, w: 102, h: 32 },
    'eyes-05': { src: `${BASE}/Eyes/Eyes 05.svg`, x: 61.5,  y: 76.11, w: 88,  h: 27 },
  },
  eyebrows: {
    'eyebrows-01': { src: `${BASE}/Eyebrows/Eyebrows 01.svg`, x: 69.94, y: 57.53, w: 70, h: 17 },
    'eyebrows-02': { src: `${BASE}/Eyebrows/Eyebrows 02.svg`, x: 65.5,  y: 57.53, w: 80, h: 21 },
    'eyebrows-03': { src: `${BASE}/Eyebrows/Eyebrows 03.svg`, x: 62,    y: 57.53, w: 87, h: 14 },
    'eyebrows-04': { src: `${BASE}/Eyebrows/Eyebrows 04.svg`, x: 68,    y: 57.53, w: 75, h: 15 },
    'eyebrows-05': { src: `${BASE}/Eyebrows/Eyebrows 05.svg`, x: 69,    y: 57.53, w: 73, h: 9  },
  },
  nose: {
    'nose-01': { src: `${BASE}/Noses/Nose 01.svg`, x: 98.5,  y: 102.79, w: 14, h: 8  },
    'nose-02': { src: `${BASE}/Noses/Nose 02.svg`, x: 97,    y: 102.79, w: 17, h: 7  },
    'nose-03': { src: `${BASE}/Noses/Nose 03.svg`, x: 100.5, y: 102.79, w: 10, h: 12 },
    'nose-04': { src: `${BASE}/Noses/Nose 04.svg`, x: 101,   y: 102.79, w: 9,  h: 18 },
    'nose-05': { src: `${BASE}/Noses/Nose 05.svg`, x: 97,    y: 102.79, w: 17, h: 6  },
  },
  mouth: {
    'mouth-01': { src: `${BASE}/Mouths/Mouth 01.svg`, x: 92.13, y: 115.94, w: 28, h: 8  },
    'mouth-02': { src: `${BASE}/Mouths/Mouth 02.svg`, x: 100,   y: 115.94, w: 11, h: 19 },
    'mouth-03': { src: `${BASE}/Mouths/Mouth 03.svg`, x: 94.5,  y: 115.94, w: 22, h: 6  },
    'mouth-04': { src: `${BASE}/Mouths/Mouth 04.svg`, x: 90,    y: 115.94, w: 31, h: 13 },
    'mouth-05': { src: `${BASE}/Mouths/Mouth 05.svg`, x: 94.5,  y: 115.94, w: 22, h: 15 },
  },
  facialAddition: {
    'blush-01': { src: `${BASE}/Facial Additions/Blush 01.svg`, x: 57.5, y: 105.85, w: 96, h: 14 },
    'blush-02': { src: `${BASE}/Facial Additions/Blush 02.svg`, x: 58,   y: 105.85, w: 95, h: 14 },
    'wrinkles':  { src: `${BASE}/Facial Additions/Wrinkles.svg`,  x: 78,   y: 65,     w: 55, h: 59 },
  },
};

// ─── Per-context color substitution maps ─────────────────────────────────────

function getColorMap(ctx, c) {
  switch (ctx) {
    case 'hair':
      return {
        '#CB8565': c.hair,
        '#694E45': c.hairDark,
        '#694E44': c.hairDark,
        '#71564B': c.hairDarker,
      };
    case 'body':
      // #71564B is clothing — intentionally omitted so it stays fixed
      return {
        '#FEE6D0': c.skin,
        '#FEE6CF': c.skin,
        '#FDBF9D': c.skinShadow,
      };
    case 'head':
      return {
        '#FEE6CF': c.skin,
        '#FEE6D0': c.skin,
        '#6F5348': c.skinOutline,
        '#6B4F42': c.skinOutline,
        '#FDBF9D': c.skinShadow,
      };
    case 'eyes':
      return {
        '#266BFF': c.eye,
        '#6B4F42': c.eyeOutline,
        '#6A4D40': c.eyeOutline,
        '#FDFCFC': c.white,
        '#FEFEFE': c.white,
      };
    case 'eyebrows':
      return {
        '#C07D61': c.brow,
        '#6C4F43': c.browStroke,
        '#71564B': c.browStroke,
      };
    case 'nose':
      return {
        '#71564B': c.skinOutline,
        '#6F5348': c.skinOutline,
      };
    case 'mouth':
      return {
        '#6A4D40': c.lip,
        '#71564B': c.lipStroke,
        '#EA9193': c.blush,
      };
    case 'facialAddition':
      return {
        '#FEB2B4': c.blush,
        '#6B4C3D': c.wrinkle,
      };
    default:
      return {};
  }
}

// ─── SvgLayer — fetches one SVG file, recolors it, renders inline ─────────────

function SvgLayer({ src, x, y, w, h, colorMap }) {
  const [svgData, setSvgData] = useState(null);
  const colorKey = useMemo(() => JSON.stringify(colorMap), [colorMap]);

  useEffect(() => {
    if (!src) return;
    let alive = true;
    fetch(src)
      .then(r => r.text())
      .then(raw => {
        if (!alive) return;
        let text = raw;
        Object.entries(colorMap).forEach(([from, to]) => {
          if (from && to && from.toLowerCase() !== to.toLowerCase()) {
            const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(esc, 'gi'), to);
          }
        });
        const vbMatch = text.match(/viewBox="([^"]+)"/i);
        const vbParts = vbMatch ? vbMatch[1].trim().split(/[\s,]+/).map(Number) : [];
        const vw = vbParts[2] || w;
        const vh = vbParts[3] || h;
        const innerMatch = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        if (alive) setSvgData({ inner: innerMatch?.[1] ?? '', vw, vh });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [src, colorKey]);

  if (!svgData?.inner) return null;

  return (
    <svg
      x={x} y={y}
      width={svgData.vw} height={svgData.vh}
      viewBox={`0 0 ${svgData.vw} ${svgData.vh}`}
      fill="none"
      dangerouslySetInnerHTML={{ __html: svgData.inner }}
    />
  );
}

// ─── Default selections ───────────────────────────────────────────────────────

const DEFAULT_SELECTIONS = {
  hair:           'hair-1',
  body:           'body-1',
  head:           'head-01',
  eyes:           'eyes-01',
  eyebrows:       'eyebrows-01',
  nose:           'nose-01',
  mouth:          'mouth-01',
  facialAddition: 'none',
};

// ─── TrumiCharacter ───────────────────────────────────────────────────────────

export default function TrumiCharacter({
  selections = {},
  skinColor,
  hairColor,
  eyeColor,
  browColor,
  lipColor,
  size = 320,
}) {
  const sel = { ...DEFAULT_SELECTIONS, ...selections };
  const c   = useColors({ skinColor, hairColor, eyeColor, browColor, lipColor });
  const scale = size / 320;

  const hairCombo = LAYER_DEFS.hair[sel.hair] ?? LAYER_DEFS.hair['hair-1'];

  // Layer order: hair-behind → body → head → eyes → eyebrows → nose → mouth → hair-front → facialAddition
  const layers = [
    { key: 'hairBehind',     ctx: 'hair',           def: hairCombo.behind },
    { key: 'body',           ctx: 'body',           def: LAYER_DEFS.body[sel.body] },
    { key: 'head',           ctx: 'head',           def: LAYER_DEFS.head[sel.head] },
    { key: 'eyes',           ctx: 'eyes',           def: LAYER_DEFS.eyes[sel.eyes] },
    { key: 'eyebrows',       ctx: 'eyebrows',       def: LAYER_DEFS.eyebrows[sel.eyebrows] },
    { key: 'nose',           ctx: 'nose',           def: LAYER_DEFS.nose[sel.nose] },
    { key: 'mouth',          ctx: 'mouth',          def: LAYER_DEFS.mouth[sel.mouth] },
    { key: 'hairFront',      ctx: 'hair',           def: hairCombo.front },
    { key: 'facialAddition', ctx: 'facialAddition', def: sel.facialAddition !== 'none' ? LAYER_DEFS.facialAddition[sel.facialAddition] : null },
  ];

  return (
    <svg
      width={211 * scale}
      height={320 * scale}
      viewBox="0 0 211 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {layers.map(({ key, ctx, def }) =>
        def ? (
          <SvgLayer
            key={key}
            src={def.src}
            x={def.x} y={def.y}
            w={def.w} h={def.h}
            colorMap={getColorMap(ctx, c)}
          />
        ) : null
      )}
    </svg>
  );
}
