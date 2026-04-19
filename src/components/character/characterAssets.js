/**
 * Character asset registry — Trumi Characters system
 * Thumbnail paths point to /public/assets/character/Trumi Characters/
 */

const BASE = '/assets/character/Trumi Characters'

// ── Skin tones ────────────────────────────────────────────────────────────────
export const SKIN_TONES = [
  '#FEE6CF',
  '#F5CBA7',
  '#D4956A',
  '#B07040',
  '#7A4A28',
  '#4A2810',
]

// ── Feature color palettes (per category) ────────────────────────────────────
export const FEATURE_COLORS = {
  hairFront: [
    { label: 'Tan',        value: '#CB8565' },
    { label: 'Black',      value: '#1a1a1a' },
    { label: 'Dark Brown', value: '#3b1f0a' },
    { label: 'Auburn',     value: '#8b3a0f' },
    { label: 'Blonde',     value: '#d4a847' },
    { label: 'Red',        value: '#b22222' },
  ],
  hairBehind: [
    { label: 'Tan',        value: '#CB8565' },
    { label: 'Black',      value: '#1a1a1a' },
    { label: 'Dark Brown', value: '#3b1f0a' },
    { label: 'Auburn',     value: '#8b3a0f' },
    { label: 'Blonde',     value: '#d4a847' },
    { label: 'Red',        value: '#b22222' },
  ],
  eyes: [
    { label: 'Blue',   value: '#266BFF' },
    { label: 'Brown',  value: '#7a4419' },
    { label: 'Green',  value: '#4a8c3f' },
    { label: 'Grey',   value: '#7a8c9e' },
    { label: 'Hazel',  value: '#8b6914' },
  ],
  eyebrows: [
    { label: 'Warm',  value: '#C07D61' },
    { label: 'Brown', value: '#7a4419' },
    { label: 'Black', value: '#1c1c1c' },
    { label: 'Blonde',value: '#c8a044' },
  ],
  mouth: [
    { label: 'Natural', value: '#6A4D40' },
    { label: 'Rose',    value: '#d44d79' },
    { label: 'Berry',   value: '#9e2a5c' },
    { label: 'Red',     value: '#cc2936' },
    { label: 'Nude',    value: '#c87a6a' },
  ],
}

function f(folder, name) {
  return `${BASE}/${folder}/${name}.svg`
}

// ── Category definitions (order = tab order in UI) ────────────────────────────
export const CATEGORIES = [
  { id: 'hairBehind',    label: 'Back Hair'  },
  { id: 'body',          label: 'Body'       },
  { id: 'head',          label: 'Head'       },
  { id: 'eyes',          label: 'Eyes'       },
  { id: 'eyebrows',      label: 'Eyebrows'   },
  { id: 'nose',          label: 'Nose'       },
  { id: 'mouth',         label: 'Mouth'      },
  { id: 'hairFront',     label: 'Hair'       },
  { id: 'facialAddition',label: 'Extras'     },
]

// ── Asset lists per category ──────────────────────────────────────────────────
export const ASSETS = {
  hairBehind: [
    { id: 'back-hair-3', label: 'Style 3', path: f('Hair/Behind', 'Back Hair 3') },
    { id: 'back-hair-4', label: 'Style 4', path: f('Hair/Behind', 'Back Hair 4') },
  ],

  body: [
    { id: 'body-1', label: 'Body 1', path: f('Bodies', 'body 1') },
    { id: 'body-2', label: 'Body 2', path: f('Bodies', 'body 2') },
    { id: 'body-3', label: 'Body 3', path: f('Bodies', 'body 3') },
    { id: 'body-4', label: 'Body 4', path: f('Bodies', 'body 4') },
    { id: 'body-5', label: 'Body 5', path: f('Bodies', 'body 5') },
  ],

  head: [
    { id: 'head-01', label: 'Head 1', path: f('Heads', 'Head 01') },
    { id: 'head-02', label: 'Head 2', path: f('Heads', 'Head 02') },
    { id: 'head-03', label: 'Head 3', path: f('Heads', 'Head 03') },
    { id: 'head-04', label: 'Head 4', path: f('Heads', 'Head 04') },
    { id: 'head-05', label: 'Head 5', path: f('Heads', 'Head 05') },
  ],

  eyes: [
    { id: 'eyes-01', label: 'Style 1', path: f('Eyes', 'Eyes 01') },
    { id: 'eyes-02', label: 'Style 2', path: f('Eyes', 'Eyes 02') },
    { id: 'eyes-03', label: 'Style 3', path: f('Eyes', 'Eyes 03') },
    { id: 'eyes-04', label: 'Style 4', path: f('Eyes', 'Eyes 04') },
    { id: 'eyes-05', label: 'Style 5', path: f('Eyes', 'Eyes 05') },
  ],

  eyebrows: [
    { id: 'eyebrows-01', label: 'Style 1', path: f('Eyebrows', 'Eyebrows 01') },
    { id: 'eyebrows-02', label: 'Style 2', path: f('Eyebrows', 'Eyebrows 02') },
    { id: 'eyebrows-03', label: 'Style 3', path: f('Eyebrows', 'Eyebrows 03') },
    { id: 'eyebrows-04', label: 'Style 4', path: f('Eyebrows', 'Eyebrows 04') },
    { id: 'eyebrows-05', label: 'Style 5', path: f('Eyebrows', 'Eyebrows 05') },
  ],

  nose: [
    { id: 'nose-01', label: 'Style 1', path: f('Noses', 'Nose 01') },
    { id: 'nose-02', label: 'Style 2', path: f('Noses', 'Nose 02') },
    { id: 'nose-03', label: 'Style 3', path: f('Noses', 'Nose 03') },
    { id: 'nose-04', label: 'Style 4', path: f('Noses', 'Nose 04') },
    { id: 'nose-05', label: 'Style 5', path: f('Noses', 'Nose 05') },
  ],

  mouth: [
    { id: 'mouth-01', label: 'Style 1', path: f('Mouths', 'Mouth 01') },
    { id: 'mouth-02', label: 'Style 2', path: f('Mouths', 'Mouth 02') },
    { id: 'mouth-03', label: 'Style 3', path: f('Mouths', 'Mouth 03') },
    { id: 'mouth-04', label: 'Style 4', path: f('Mouths', 'Mouth 04') },
    { id: 'mouth-05', label: 'Style 5', path: f('Mouths', 'Mouth 05') },
  ],

  hairFront: [
    { id: 'hair-front-01', label: 'Style 1', path: f('Hair/Front', 'Hair 01') },
    { id: 'hair-front-02', label: 'Style 2', path: f('Hair/Front', 'Hair 02') },
    { id: 'hair-front-03', label: 'Style 3', path: f('Hair/Front', 'Hair 03') },
    { id: 'hair-front-04', label: 'Style 4', path: f('Hair/Front', 'Hair 04') },
    { id: 'hair-front-05', label: 'Style 5', path: f('Hair/Front', 'Hair 05') },
  ],

  facialAddition: [
    { id: 'none',     label: 'None',     path: null },
    { id: 'blush-01', label: 'Blush 1',  path: f('Facial Additions', 'Blush 01') },
    { id: 'blush-02', label: 'Blush 2',  path: f('Facial Additions', 'Blush 02') },
    { id: 'wrinkles', label: 'Wrinkles', path: f('Facial Additions', 'Wrinkles') },
  ],
}

// ── Default character (matches Example Character 1) ───────────────────────────
export const DEFAULT_CHARACTER = {
  hairBehind:    'back-hair-4',
  body:          'body-1',
  head:          'head-01',
  eyes:          'eyes-01',
  eyebrows:      'eyebrows-01',
  nose:          'nose-01',
  mouth:         'mouth-01',
  hairFront:     'hair-front-01',
  facialAddition:'none',
  skinColor:     '#FEE6CF',
  hairColor:     '#CB8565',
  eyeColor:      '#266BFF',
  browColor:     '#C07D61',
  lipColor:      '#6A4D40',
  name:          '',
  bio:           '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function findAsset(category, id) {
  return ASSETS[category]?.find(a => a.id === id) ?? null
}
