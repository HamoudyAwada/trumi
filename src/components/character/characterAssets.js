/**
 * Character asset registry
 * Maps every customizable category to its available SVG options.
 * All paths are relative to /public — served as static assets.
 */

const BASE = '/assets/character/Customizable Characters'

// ── Skin tones ────────────────────────────────────────────────────────────────
export const DEFAULT_SKIN_MAIN   = '#ffd1b5'
export const DEFAULT_SKIN_SHADOW = '#ffd8c1'

export const SKIN_TONES = [
  '#ffe1cf',
  '#d3b7a6',
  '#a78d7c',
  '#7a6253',
  '#4e3829',
  '#220e00',
]

// ── Feature base colors (original fills in SVGs — replaced by useRecolor) ─────
export const DEFAULT_BROW_COLOR = '#9e1f63'  // original eyebrow SVG fill
export const DEFAULT_EYE_COLOR  = '#2192c8'  // original eye iris fill
export const DEFAULT_LIP_COLOR  = '#f15a6d'  // original lip SVG fill
export const DEFAULT_HAIR_COLOR = '#59320c'  // original hair SVG fill (masculine base)

// ── Lips that support colour recolouring ──────────────────────────────────────
export const COLOURED_LIPS = new Set(['lip-5', 'lip-6', 'lip-7'])

// ── Feature color palettes (per category) ────────────────────────────────────
export const FEATURE_COLORS = {
  hair: [
    { label: 'Black',      value: '#1a1a1a' },
    { label: 'Dark Brown', value: '#3b1f0a' },
    { label: 'Brown',      value: '#59320c' },
    { label: 'Auburn',     value: '#8b3a0f' },
    { label: 'Blonde',     value: '#c4922a' },
    { label: 'Red',        value: '#b22222' },
  ],
  eyes: [
    { label: 'Blue',  value: '#2192c8' },
    { label: 'Brown', value: '#7a4419' },
    { label: 'Green', value: '#4a8c3f' },
    { label: 'Grey',  value: '#7a8c9e' },
  ],
  eyebrows: [
    { label: 'Brown',  value: '#59320c' },
    { label: 'Black',  value: '#1c1c1c' },
    { label: 'Blonde', value: '#c8a044' },
  ],
  lips: [
    { label: 'Pink',  value: '#f15a6d' },
    { label: 'Rose',  value: '#d44d79' },
    { label: 'Berry', value: '#9e2a5c' },
    { label: 'Nude',  value: '#c87a6a' },
    { label: 'Red',   value: '#cc2936' },
  ],
}

// Legacy alias kept for any existing imports
export const BROW_COLORS = FEATURE_COLORS.eyebrows

function f(folder, name) {
  return `${BASE}/${folder}/${name}.svg`
}

// ── Category definitions (order = tab order in UI) ────────────────────────────
export const CATEGORIES = [
  { id: 'hair',      label: 'Hair'      },
  { id: 'face',      label: 'Face'      },
  { id: 'eyes',      label: 'Eyes'      },
  { id: 'eyebrows',  label: 'Eyebrows'  },
  { id: 'nose',      label: 'Nose'      },
  { id: 'lips',      label: 'Lips'      },
]

// ── Asset lists per category ───────────────────────────────────────────────────
export const ASSETS = {
  face: [
    { id: 'fem-oval',           label: 'F · Oval',            path: f('Faces', 'Feminine - Oval'),              hasSkin: true },
    { id: 'fem-round',          label: 'F · Round',           path: f('Faces', 'Feminine - Round'),             hasSkin: true },
    { id: 'fem-heart',          label: 'F · Heart',           path: f('Faces', 'Feminine - Heart'),             hasSkin: true },
    { id: 'fem-square',         label: 'F · Square',          path: f('Faces', 'Feminine - Square'),            hasSkin: true },
    { id: 'fem-diamond',        label: 'F · Diamond',         path: f('Faces', 'Feminine - Diamond'),           hasSkin: true },
    { id: 'fem-rectangle',      label: 'F · Rectangle',       path: f('Faces', 'Feminine - Rectangle'),         hasSkin: true },
    { id: 'fem-triangle',       label: 'F · Triangle',        path: f('Faces', 'Feminine - Triangle'),          hasSkin: true },
    { id: 'fem-oval-beard',     label: 'F · Oval + Beard',    path: f('Faces', 'Feminine - Oval - Beard'),      hasSkin: true },
    { id: 'fem-round-beard',    label: 'F · Round + Beard',   path: f('Faces', 'Feminine - Round - Beard'),     hasSkin: true },
    { id: 'fem-heart-beard',    label: 'F · Heart + Beard',   path: f('Faces', 'Feminine - Heart - Beard'),     hasSkin: true },
    { id: 'fem-square-beard',   label: 'F · Square + Beard',  path: f('Faces', 'Feminine - Square - Beard'),    hasSkin: true },
    { id: 'fem-diamond-beard',  label: 'F · Diamond + Beard', path: f('Faces', 'Feminine - Diamond - Beard'),   hasSkin: true },
    { id: 'fem-rect-beard',     label: 'F · Rect + Beard',    path: f('Faces', 'Feminine - Rectangle - Beard'), hasSkin: true },
    { id: 'fem-tri-beard',      label: 'F · Tri + Beard',     path: f('Faces', 'Feminine - Triangle - Beard'),  hasSkin: true },
    { id: 'masc-oval',          label: 'M · Oval',            path: f('Faces', 'Masculine - Oval'),             hasSkin: true },
    { id: 'masc-round',         label: 'M · Round',           path: f('Faces', 'Masculine - Round'),            hasSkin: true },
    { id: 'masc-heart',         label: 'M · Heart',           path: f('Faces', 'Masculine - Heart'),            hasSkin: true },
    { id: 'masc-square',        label: 'M · Square',          path: f('Faces', 'Masculine - Square'),           hasSkin: true },
    { id: 'masc-diamond',       label: 'M · Diamond',         path: f('Faces', 'Masculine - Diamond'),          hasSkin: true },
    { id: 'masc-rectangle',     label: 'M · Rectangle',       path: f('Faces', 'Masculine - Rectangle'),        hasSkin: true },
    { id: 'masc-oval-beard',    label: 'M · Oval + Beard',    path: f('Faces', 'Masculine - Oval - Beard'),     hasSkin: true },
    { id: 'masc-round-beard',   label: 'M · Round + Beard',   path: f('Faces', 'Masculine - Round - Beard'),    hasSkin: true },
    { id: 'masc-heart-beard',   label: 'M · Heart + Beard',   path: f('Faces', 'Masculine - Heart - Beard'),    hasSkin: true },
    { id: 'masc-square-beard',  label: 'M · Square + Beard',  path: f('Faces', 'Masculine - Square - Beard'),   hasSkin: true },
    { id: 'masc-diamond-beard', label: 'M · Diamond + Beard', path: f('Faces', 'Masculine - Diamond - Beard'),  hasSkin: true },
  ],

  hair: [
    { id: 'buzz',        label: 'Buzz Cut', path: f('Hair', 'Hair - Buzz Cut')                    },
    { id: 'masc-afro',   label: 'Afro',     path: f('Hair', 'Hair - Masculine - Afro')            },
    { id: 'masc-curly',  label: 'Curly',    path: f('Hair', 'Hair - Masculine - Curly')           },
    { id: 'masc-idk',    label: 'Textured', path: f('Hair', 'Hair - Masculine - IDK')             },
    { id: 'masc-mohawk', label: 'Mohawk',   path: f('Hair', 'Hair - Masculine - Mohawk or Onion') },
    { id: 'masc-sleek',  label: 'Sleek',    path: f('Hair', 'Hair - Masculine - Sleek')           },
    { id: 'masc-wavy',   label: 'Wavy',     path: f('Hair', 'Hair - Masculine - Wavey')           },
    { id: 'fem-1',       label: 'Style 1',  path: f('Hair', 'Hair 1 - feminine')                  },
    { id: 'fem-2',       label: 'Style 2',  path: f('Hair', 'Hair 2 - feminine')                  },
    { id: 'fem-4',       label: 'Style 4',  path: f('Hair', 'Hair 4 - feminine')                  },
    { id: 'fem-5',       label: 'Style 5',  path: f('Hair', 'Hair 5 - feminine')                  },
    { id: 'fem-6',       label: 'Style 6',  path: f('Hair', 'Hair 6 - feminine')                  },
    { id: 'fem-7',       label: 'Style 7',  path: f('Hair', 'Hair 7 - feminine')                  },
    { id: 'fem-8',       label: 'Style 8',  path: f('Hair', 'Hair 8 - feminine')                  },
  ],

  eyes: [
    { id: 'almond',            label: 'Almond',           path: f('Eyes', 'Eyes - Almond')              },
    { id: 'almond-lashes',     label: 'Almond + Lashes',  path: f('Eyes', 'Eyes - Almond - Lashes')     },
    { id: 'cartoon-long',      label: 'Cartoon Long',     path: f('Eyes', 'Eyes - Cartoon - Long')      },
    { id: 'cartoon-short',     label: 'Cartoon Short',    path: f('Eyes', 'Eyes - Cartoon - Short')     },
    { id: 'chibi',             label: 'Chibi',            path: f('Eyes', 'Eyes - Chibi')               },
    { id: 'chibi-lashes',      label: 'Chibi + Lashes',   path: f('Eyes', 'Eyes - Chibi - Lashes')      },
    { id: 'chibi-neutral',     label: 'Chibi Neutral',    path: f('Eyes', 'Eyes - Chibi - Neutral')     },
    { id: 'downturned',        label: 'Downturned',       path: f('Eyes', 'Eyes - Downturned')          },
    { id: 'downturned-lashes', label: 'Downturned + Lashes', path: f('Eyes', 'Eyes - Downturned - Lashes') },
    { id: 'hooded',            label: 'Hooded',           path: f('Eyes', 'Eyes - Hooded')              },
    { id: 'hooded-lashes',     label: 'Hooded + Lashes',  path: f('Eyes', 'Eyes - Hooded - Lashes')     },
    { id: 'monolid',           label: 'Monolid',          path: f('Eyes', 'Eyes - Monolid')             },
    { id: 'monolid-lashes',    label: 'Monolid + Lashes', path: f('Eyes', 'Eyes - Monolid - Lashes')    },
    { id: 'simple',            label: 'Simple',           path: f('Eyes', 'Eyes - Simple')              },
    { id: 'wide',              label: 'Wide',             path: f('Eyes', 'Eyes - Wide')                },
    { id: 'wide-lashes',       label: 'Wide + Lashes',    path: f('Eyes', 'Eyes - Wide - Lashes')       },
  ],

  eyebrows: [
    { id: 'brow-1', label: 'Style 1', path: f('Eyebrows', 'Eyebrows - 1') },
    { id: 'brow-2', label: 'Style 2', path: f('Eyebrows', 'Eyebrows - 2') },
    { id: 'brow-3', label: 'Style 3', path: f('Eyebrows', 'Eyebrows - 3') },
    { id: 'brow-4', label: 'Style 4', path: f('Eyebrows', 'Eyebrows - 4') },
    { id: 'brow-5', label: 'Style 5', path: f('Eyebrows', 'Eyebrows - 5') },
    { id: 'brow-6', label: 'Style 6', path: f('Eyebrows', 'Eyebrows - 6') },
    { id: 'brow-7', label: 'Style 7', path: f('Eyebrows', 'Eyebrows - 7') },
    { id: 'brow-8', label: 'Style 8', path: f('Eyebrows', 'Eyebrows - 8') },
  ],

  nose: [
    { id: 'nose-1',  label: 'Style 1',  path: f('Noses', 'Nose - 1')   },
    { id: 'nose-2',  label: 'Style 2',  path: f('Noses', 'Nose - 2')   },
    { id: 'nose-3',  label: 'Style 3',  path: f('Noses', 'Nose - 3')   },
    { id: 'nose-4',  label: 'Style 4',  path: f('Noses', 'Nose - 4')   },
    { id: 'nose-4b', label: 'Style 4b', path: f('Noses', 'Nose - 4_1') },
    { id: 'nose-5',  label: 'Style 5',  path: f('Noses', 'Nose - 5')   },
    { id: 'nose-6',  label: 'Style 6',  path: f('Noses', 'Nose - 6')   },
  ],

  lips: [
    { id: 'lip-1', label: 'Style 1', path: f('Lips', 'Lip1') },
    { id: 'lip-2', label: 'Style 2', path: f('Lips', 'Lip2') },
    { id: 'lip-3', label: 'Style 3', path: f('Lips', 'Lip3') },
    { id: 'lip-4', label: 'Style 4', path: f('Lips', 'Lip4') },
    { id: 'lip-5', label: 'Style 5', path: f('Lips', 'Lip5') },
    { id: 'lip-6', label: 'Style 6', path: f('Lips', 'Lip6') },
    { id: 'lip-7', label: 'Style 7', path: f('Lips', 'Lip7') },
  ],
}

// ── Defaults ──────────────────────────────────────────────────────────────────
export const DEFAULT_CHARACTER = {
  face:      'masc-oval-beard',
  hair:      'masc-idk',
  eyes:      'wide',
  eyebrows:  'brow-2',
  nose:      'nose-1',
  lips:      'lip-1',
  skinTone:  '#ffe1cf',
  browColor: '#59320c',
  eyeColor:  '#2192c8',
  lipColor:  '#f15a6d',
  hairColor: '#59320c',
  name:      '',
  bio:       '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function findAsset(category, id) {
  return ASSETS[category]?.find(a => a.id === id) ?? null
}

export const NECK_SHIRT_PATH = `${BASE}/Neck and Shirt/Neck Shirt.svg`
