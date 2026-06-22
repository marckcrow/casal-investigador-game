import { Link } from 'react-router-dom'
import { ThemeBadge, DifficultyBadge } from './Badge'

/**
 * Enhanced case card — professional investigation grid card
 * Ready to replace inline Home.jsx case cards
 */
export default function CaseCard({
  caseData,
  status = 'available',  // available | completed | locked | new
  isCompleted = false,
  score,
  onClick,
  className = '',
}) {
  const THEMES = {
    CRIME: { color: '#c41e3a', icon: '💀' },
    HORROR: { color: '#9b59b6', icon: '👻' },
    OCULTISMO: { color: '#9b59b6', icon: '🔮' },
    MISTÉRIO: { color: '#5dade2', icon: '🗝️' },
    SUSPENSE: { color: '#f39c12', icon: '⏱️' },
  }

  const theme = THEMES[caseData.theme] || THEMES['MISTÉRIO']
  const difficulty = caseData.difficulty || caseData.level === 'FÁCIL' ? 1 : caseData.level === 'MÉDIO' ? 2 : 3
  const completedStars = isCompleted ? (score ? Math.min(5, Math.ceil(score / 30)) : 3) : 0

  return (
    <div
      onClick={onClick}
      className={`
        case-file rounded-lg overflow-hidden transition-all duration-300 cursor-pointer
        hover:-translate-y-1 hover:shadow-lg
        ${isCompleted ? 'border-gold/30' : 'hover:border-gold/40'}
        ${className}
      `}
    >
      {/* Top accent bar */}
      <div className="h-1" style={{ backgroundColor: theme.color }} />

      <div className="p-4">
        {/* Badges row */}
        <div className="flex items-center justify-between mb-2">
          <ThemeBadge theme={caseData.theme} />
          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={difficulty} />
            {isCompleted && (
              <span className="text-xs">{'★'.repeat(completedStars)}{'☆'.repeat(5 - completedStars)}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="font-typewriter text-paper text-sm leading-tight mb-2 line-clamp-2">
          {caseData.title}
        </h4>

        {/* Location */}
        <div className="flex items-center gap-1 text-paperDim text-xs mb-2">
          <span>📍</span>
          <span className="truncate">{caseData.location}</span>
        </div>

        {/* Victim */}
        {caseData.victim && (
          <div className="text-paperDim text-xs mb-2">
            <span className="text-crimson font-typewriter">VÍTIMA: </span>
            <span className="line-clamp-1">{caseData.victim}</span>
          </div>
        )}

        {/* Suspects preview */}
        {caseData.suspects && caseData.suspects.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-3">
            {caseData.suspects.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="bg-noir border border-gray-700 text-paperDim text-xs px-1.5 py-0.5 rounded"
              >
                {s.name?.split(' ')[0] || s}
              </span>
            ))}
            {caseData.suspects.length > 3 && (
              <span className="text-paperDim text-xs px-1.5 py-0.5">
                +{caseData.suspects.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Status + Score */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
          {isCompleted ? (
            <>
              <span className="text-xs font-typewriter text-gold">✅ Resolvido</span>
              {score !== undefined && (
                <span className="text-xs font-typewriter text-gold">🏆 {score} pts</span>
              )}
            </>
          ) : (
            <>
              <span className="text-xs font-typewriter text-paperDim">{caseData.suspects?.length || 3} suspeitos</span>
              <span className="text-xs text-gold">→ Investigar</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
