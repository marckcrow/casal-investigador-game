import { useEffect, useRef } from 'react'

/**
 * Animated progress bar with label and percentage
 * Color variants: gold, crimson, green, blue, purple
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercent = true,
  variant = 'gold',   // gold | crimson | green | blue | purple
  size = 'md',        // sm | md | lg
  animated = true,
  className = '',
}) {
  const fillRef = useRef(null)
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const colorMap = {
    gold: '#c9a84c',
    crimson: '#c41e3a',
    green: '#2ecc71',
    blue: '#3498db',
    purple: '#9b59b6',
  }

  const sizeMap = {
    sm: 'h-1',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const color = colorMap[variant] || colorMap.gold

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-paperDim text-xs font-typewriter">{label}</span>
          )}
          {showPercent && (
            <span className="text-paperDim text-xs font-typewriter">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-noir rounded-full overflow-hidden ${sizeMap[size]}`}
        style={{ border: `1px solid ${color}33` }}
      >
        <div
          ref={fillRef}
          className={`h-full rounded-full transition-all duration-700 ease-out ${animated ? '' : ''}`}
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  )
}
