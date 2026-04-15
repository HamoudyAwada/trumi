import { SKIN_TONES } from './characterAssets'
import './SkinToneSelector.css'

export default function SkinToneSelector({ selected, onChange }) {
  return (
    <div className="skin-row">
      {SKIN_TONES.map(tone => (
        <button
          key={tone}
          className={`skin-swatch${selected === tone ? ' skin-swatch--active' : ''}`}
          style={{ backgroundColor: tone }}
          onClick={() => onChange(tone)}
          aria-label={`Skin tone ${tone}`}
          aria-pressed={selected === tone}
        />
      ))}
    </div>
  )
}
