import { useSkinTone } from './useSkinTone'
import { NECK_SHIRT_PATH, findAsset } from './characterAssets'
import './CharacterCanvas.css'

/**
 * CharacterCanvas
 *
 * Renders the layered SVG character. Layer order (bottom → top):
 *   1. Neck & Shirt  (skin tone applied)
 *   2. Face          (skin tone applied)
 *   3. Nose          (1080×1080 overlay)
 *   4. Lips          (positioned within face zone)
 *   5. Eyes          (1080×1080 overlay)
 *   6. Eyebrows      (1080×1080 overlay)
 *   7. Hair          (on top of all features)
 *
 * @param {Object} selections - { face, hair, eyes, eyebrows, nose, lips }
 * @param {string} skinTone   - Hex color for skin tone
 */
export default function CharacterCanvas({ selections, skinTone }) {
  const faceAsset     = findAsset('face',     selections.face)
  const hairAsset     = findAsset('hair',     selections.hair)
  const eyesAsset     = findAsset('eyes',     selections.eyes)
  const eyebrowsAsset = findAsset('eyebrows', selections.eyebrows)
  const noseAsset     = findAsset('nose',     selections.nose)
  const lipsAsset     = findAsset('lips',     selections.lips)

  // Skin-tone-swapped sources for face/neck layers
  const neckSrc     = useSkinTone(NECK_SHIRT_PATH,       skinTone, true)
  const faceSrc     = useSkinTone(faceAsset?.path ?? '', skinTone, true)

  // Non-skin layers — served directly
  const eyesSrc     = eyesAsset?.path     ?? ''
  const eyebrowsSrc = eyebrowsAsset?.path ?? ''
  const noseSrc     = noseAsset?.path     ?? ''
  const lipsSrc     = lipsAsset?.path     ?? ''
  const hairSrc     = hairAsset?.path     ?? ''

  return (
    <div className="cc-canvas">
      {/* ── Neck / Shirt ─────────────────────────── */}
      <div className="cc-neck">
        {neckSrc && <img src={neckSrc} alt="" draggable="false" />}
      </div>

      {/* ── Face zone — all face-relative layers ─── */}
      <div className="cc-face-zone">

        {/* Base face shape */}
        {faceSrc && (
          <img className="cc-face-base" src={faceSrc} alt="" draggable="false" />
        )}

        {/* 1080×1080 overlays — sit in exact same coordinate space as face */}
        {noseSrc && (
          <img className="cc-overlay" src={noseSrc} alt="" draggable="false" />
        )}
        {eyesSrc && (
          <img className="cc-overlay" src={eyesSrc} alt="" draggable="false" />
        )}
        {eyebrowsSrc && (
          <img className="cc-overlay" src={eyebrowsSrc} alt="" draggable="false" />
        )}

        {/* Lips — positioned within lower face */}
        {lipsSrc && (
          <div className="cc-lips">
            <img src={lipsSrc} alt="" draggable="false" />
          </div>
        )}

        {/* Hair — top layer, overflows above face */}
        {hairSrc && (
          <div className="cc-hair">
            <img src={hairSrc} alt="" draggable="false" />
          </div>
        )}
      </div>
    </div>
  )
}
