import { useSkinTone } from './useSkinTone'
import { useRecolor } from './useRecolor'
import { useHairRecolor } from './useHairRecolor'
import { useNoseRecolor } from './useNoseRecolor'
import { NECK_SHIRT_PATH, findAsset, DEFAULT_BROW_COLOR, DEFAULT_EYE_COLOR, DEFAULT_LIP_COLOR, COLOURED_LIPS } from './characterAssets'
import './CharacterCanvas.css'

// All blue iris fills used across eye SVGs — all must change together
const EYE_IRIS_COLORS = ['#27aae1', '#62d6ff']

// Actual lip fill color used in the lip-5/6/7 SVGs
const LIP_SVG_BASE_COLOR = '#ff9fac'

/**
 * CharacterCanvas
 *
 * Pixel dimensions match Figma node 302:2941 exactly:
 *   Canvas       291 × 302 px
 *   Face zone    left 76px, top 0, width 139px, height 224px
 *   Neck/shirt   top 162px, full width
 *   Hair         top −11px (above face), centered, width 145px
 *
 * Layer order (bottom → top): neck → face → nose → lips → eyes → eyebrows → hair
 */
export default function CharacterCanvas({ selections, skinTone, browColor, eyeColor, lipColor, hairColor }) {
  const faceAsset     = findAsset('face',     selections.face)
  const hairAsset     = findAsset('hair',     selections.hair)
  const eyesAsset     = findAsset('eyes',     selections.eyes)
  const eyebrowsAsset = findAsset('eyebrows', selections.eyebrows)
  const noseAsset     = findAsset('nose',     selections.nose)
  const lipsAsset     = findAsset('lips',     selections.lips)

  const neckSrc = useSkinTone(NECK_SHIRT_PATH,       skinTone, true)
  const faceSrc = useSkinTone(faceAsset?.path ?? '', skinTone, true)

  // Eyes: replace the iris ring (#2192c8) + main iris fill (#27aae1) + chibi iris (#62d6ff)
  const eyesSrc     = useRecolor(eyesAsset?.path ?? '', DEFAULT_EYE_COLOR, eyeColor ?? DEFAULT_EYE_COLOR, EYE_IRIS_COLORS)
  const eyebrowsSrc = useRecolor(eyebrowsAsset?.path ?? '', DEFAULT_BROW_COLOR, browColor ?? '#59320c')
  const noseSrc     = useNoseRecolor(noseAsset?.path ?? '', skinTone)

  // Lips: lip-5/6/7 use #ff9fac as their fill — replace that with the chosen color.
  // Lips 1–4 are line-art (black outline) with no fill to recolor — skip replacement.
  const isColouredLip = COLOURED_LIPS.has(selections.lips)
  const lipsSrc = useRecolor(
    lipsAsset?.path ?? '',
    isColouredLip ? LIP_SVG_BASE_COLOR : '',
    isColouredLip ? (lipColor ?? DEFAULT_LIP_COLOR) : '',
  )

  const hairSrc     = useHairRecolor(hairAsset?.path ?? '', hairColor ?? DEFAULT_HAIR_COLOR)

  return (
    <div className="cc-canvas">

      {/* Neck / Shirt — behind everything */}
      <div className="cc-neck">
        {neckSrc && <img src={neckSrc} alt="" draggable="false" />}
      </div>

      {/* Face zone — all face-relative layers */}
      <div className="cc-face-zone">

        {/* Base face shape */}
        {faceSrc && (
          <img className="cc-face-base" src={faceSrc} alt="" draggable="false" />
        )}

        {/* Full-zone overlays — same coordinate space as face SVG */}
        {noseSrc && (
          <img className="cc-overlay cc-nose" src={noseSrc} alt="" draggable="false" />
        )}
        {eyesSrc && (
          <img className="cc-overlay" src={eyesSrc} alt="" draggable="false" />
        )}
        {eyebrowsSrc && (
          <img className="cc-overlay" src={eyebrowsSrc} alt="" draggable="false" />
        )}

        {/* Lips — inset position from Figma */}
        {lipsSrc && (
          <div className={`cc-lips cc-lips--${selections.lips}`}>
            <img src={lipsSrc} alt="" draggable="false" />
          </div>
        )}

        {/* Hair — top layer, overflows above face zone */}
        {hairSrc && (
          <div className={`cc-hair${selections.hair?.startsWith('fem-') ? ` cc-hair--fem cc-hair--${selections.hair}` : ''}`}>
            <img src={hairSrc} alt="" draggable="false" />
          </div>
        )}

      </div>
    </div>
  )
}
