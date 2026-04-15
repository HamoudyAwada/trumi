import { BROW_COLORS } from './characterAssets'
import './BrowColorSelector.css'

export default function BrowColorSelector({ selected, onChange }) {
  return (
    <div className="brow-row">
      <span className="brow-row__label">Eyebrows</span>
      <div className="brow-row__swatches">
        {BROW_COLORS.map(({ label, value }) => (
          <button
            key={value}
            className={`brow-swatch${selected === value ? ' brow-swatch--active' : ''}`}
            style={{ backgroundColor: value }}
            onClick={() => onChange(value)}
            aria-label={`${label} eyebrows`}
            aria-pressed={selected === value}
          />
        ))}
      </div>
    </div>
  )
}
