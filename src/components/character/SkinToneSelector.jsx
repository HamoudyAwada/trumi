import { SKIN_TONES } from './characterAssets'
import './SkinToneSelector.css'

/**
 * SkinToneSelector
 *
 * Row of 6 circular skin tone swatches.
 * Selected swatch has a violet border ring.
 *
 * @param {string}   selected  - Currently selected skin tone hex
 * @param {Function} onChange  - (hexColor) => void
 */
export default function SkinToneSelector({ selected, onChange }) {
  return (
    <div className="skin-row" role="radiogroup" aria-label="Skin tone">
      {SKIN_TONES.map(tone => (
        <button
          key={tone}
          className={`skin-swatch${tone === selected ? ' skin-swatch--active' : ''}`}
          style={{ backgroundColor: tone }}
          onClick={() => onChange(tone)}
          aria-label={`Skin tone ${tone}`}
          aria-checked={tone === selected}
          role="radio"
        />
      ))}
    </div>
  )
}
