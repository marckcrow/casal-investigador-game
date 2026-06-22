import { clueTypes, importanceLevels } from '../data/clues'

/**
 * Clue display card — icon by type, status: found/locked/important
 */
export default function ClueCard({
  clue,
  status = 'locked',   // locked | found | important
  onClick,
  compact = false,
  className = '',
}) {
  const typeInfo = clueTypes[clue.type] || clueTypes.objeto
  const importanceInfo = importanceLevels[clue.importance] || importanceLevels.baixa

  const isLocked = status === 'locked'
  const isFound = status === 'found'
  const isImportant = status === 'important'

  const borderColor = isLocked
    ? 'border-gray-800'
    : isImportant
    ? importanceInfo.color
    : typeInfo.color

  return (
    <div
      onClick={onClick}
      className={`
        case-file rounded-lg overflow-hidden transition-all duration-300
        ${!isLocked ? 'hover:-translate-y-1 hover:shadow-lg' : 'opacity-60'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ border: `1px solid ${borderColor}44` }}
    >
      {/* Header bar */}
      <div
        className="h-1"
        style={{ backgroundColor: borderColor }}
      />

      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        {/* Icon + Type */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl" style={{ opacity: isLocked ? 0.3 : 1 }}>
            {typeInfo.icon}
          </span>
          <span
            className="text-xs font-typewriter tracking-wider uppercase"
            style={{ color: typeInfo.color, opacity: isLocked ? 0.4 : 1 }}
          >
            {typeInfo.label}
          </span>
          {clue.importance === 'alta' && (
            <span
              className="text-xs font-typewriter px-1.5 py-0.5 rounded ml-auto"
              style={{
                backgroundColor: `${importanceInfo.color}22`,
                color: importanceInfo.color,
                border: `1px solid ${importanceInfo.color}44`,
              }}
            >
              ⚡ Crucial
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          className="font-typewriter text-sm mb-1 leading-tight"
          style={{ color: isLocked ? '#6a6560' : '#f0ece3' }}
        >
          {isLocked ? '???' : clue.title}
        </h4>

        {/* Description (only if found) */}
        {!isLocked && !compact && clue.description && (
          <p className="text-paperDim text-xs leading-relaxed mt-2">
            {clue.description}
          </p>
        )}

        {/* Analysis (only if found, expanded) */}
        {isFound && clue.analysis && !compact && (
          <div
            className="mt-3 p-2 rounded text-xs italic leading-relaxed"
            style={{
              backgroundColor: '#c9a84c11',
              border: '1px solid #c9a84c33',
              color: '#e8c96a',
            }}
          >
            💡 {clue.analysis}
          </div>
        )}

        {/* Locked overlay */}
        {isLocked && (
          <div className="flex items-center gap-1 mt-2 text-paperDim text-xs opacity-50">
            <span>🔒</span>
            <span>Revele esta pista durante a investigação</span>
          </div>
        )}
      </div>
    </div>
  )
}
