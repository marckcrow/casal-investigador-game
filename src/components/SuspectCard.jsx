/**
 * Suspect profile card — police/investigative file style
 */
export default function SuspectCard({
  suspect,
  index,
  suspicionLevel = 50,  // 0-100
  isSelected = false,
  isCriminal = false,
  onClick,
  onLevelChange,
  showLevel = false,
  className = '',
}) {
  const getLevelColor = (level) => {
    if (level >= 75) return '#c41e3a'
    if (level >= 50) return '#f39c12'
    if (level >= 25) return '#c9a84c'
    return '#2ecc71'
  }

  const levelColor = getLevelColor(suspicionLevel)

  return (
    <div
      onClick={onClick}
      className={`
        case-file rounded-lg overflow-hidden transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${isSelected ? 'border-gold shadow-lg shadow-gold/20' : 'hover:border-gray-600'}
        ${isCriminal ? 'border-crimson/40' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-800"
        style={{ backgroundColor: isSelected ? '#c9a84c11' : '' }}
      >
        {/* Number badge */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-typewriter flex-shrink-0"
          style={{
            backgroundColor: isSelected ? '#c9a84c' : '#1a1a1a',
            color: isSelected ? '#0a0a0a' : '#b8b0a0',
            border: isSelected ? 'none' : '1px solid #333',
          }}
        >
          {index + 1}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <h4 className="font-typewriter text-paper text-sm truncate">
            {suspect.name}
          </h4>
          {suspect.motive && (
            <p className="text-paperDim text-xs truncate mt-0.5">
              💢 {suspect.motive}
            </p>
          )}
        </div>

        {/* Selected checkmark */}
        {isSelected && (
          <span className="text-gold text-xl flex-shrink-0">✓</span>
        )}

        {/* Criminal indicator */}
        {isCriminal && (
          <span className="text-crimson text-xs font-typewriter flex-shrink-0">🎭</span>
        )}
      </div>

      {/* Suspicion Level Slider */}
      {showLevel && onLevelChange !== undefined && (
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-paperDim text-xs font-typewriter">NÍVEL DE SUSPEITA</span>
            <span
              className="text-xs font-typewriter"
              style={{ color: levelColor }}
            >
              {suspicionLevel}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={suspicionLevel}
            onChange={e => onLevelChange(parseInt(e.target.value))}
            onClick={e => e.stopPropagation()}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${levelColor} ${suspicionLevel}%, #1a1a1a ${suspicionLevel}%)`,
              accentColor: levelColor,
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-green-500/60">Inocente</span>
            <span className="text-[10px] text-crimson/60">Criminoso</span>
          </div>
        </div>
      )}

      {/* Status */}
      {isSelected && (
        <div className="px-4 py-2 text-center">
          <span
            className="text-xs font-typewriter tracking-wider"
            style={{ color: levelColor }}
          >
            {suspicionLevel >= 75
              ? '⚠️ ALTA PROBABILIDADE'
              : suspicionLevel >= 50
              ? '🔎 SUSPEITO'
              : suspicionLevel >= 25
              ? '◑ PARCIALMENTE SUSPEITO'
              : '◯ SEM INDÍCIOS'}
          </span>
        </div>
      )}
    </div>
  )
}
