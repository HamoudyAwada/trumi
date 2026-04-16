import './FeatureColorPalette.css'

/**
 * FeatureColorPalette
 * Vertical strip of color swatches for the active feature category.
 * Renders nothing if no colors are defined for the current category.
 */
export default function FeatureColorPalette({ colors, selected, onChange }) {
  if (!colors || colors.length === 0) return <div className="feature-palette feature-palette--empty" />

  return (
    <div className="feature-palette">
      {colors.map(({ label, value }) => (
        <button
          key={value}
          className={`feature-swatch${selected === value ? ' feature-swatch--active' : ''}`}
          style={{ backgroundColor: value }}
          onClick={() => onChange(value)}
          aria-label={label}
          aria-pressed={selected === value}
        />
      ))}
    </div>
  )
}
