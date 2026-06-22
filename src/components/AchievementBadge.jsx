import { rarityConfig } from '../data/achievements'

/**
 * Achievement/conquest badge with icon, title, description
 */
export default function AchievementBadge({
  achievement,
  unlocked = false,
  compact = false,
  className = '',
}) {
  const rarity = rarityConfig[achievement.rarity] || rarityConfig.common
  const isLocked = !unlocked

  return (
    <div
      className={`
        case-file rounded-lg overflow-hidden transition-all duration-300
        ${!isLocked ? 'hover:-translate-y-1 hover:shadow-lg' : 'opacity-50'}
        ${className}
      `}
      style={{
        border: `1px solid ${isLocked ? '#333' : rarity.color}44`,
        backgroundColor: isLocked ? '#0a0a0a' : `${rarity.color}08`,
      }}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div
          className="text-3xl flex-shrink-0"
          style={{ opacity: isLocked ? 0.2 : 1, filter: isLocked ? 'grayscale(1)' : 'none' }}
        >
          {achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4
              className="font-typewriter text-sm truncate"
              style={{ color: isLocked ? '#555' : '#f0ece3' }}
            >
              {achievement.name}
            </h4>
            {!compact && (
              <span
                className="text-[10px] font-typewriter px-1.5 py-0.5 rounded flex-shrink-0"
                style={{
                  backgroundColor: rarity.bg,
                  color: rarity.color,
                  border: `1px solid ${rarity.color}44`,
                }}
              >
                {rarity.label}
              </span>
            )}
          </div>

          {!compact && (
            <p className="text-paperDim text-xs leading-relaxed line-clamp-2">
              {achievement.description}
            </p>
          )}

          {/* Condition */}
          {!compact && (
            <div className="mt-1.5 flex items-center gap-1">
              <span
                className="text-[10px] font-typewriter"
                style={{ color: rarity.color, opacity: isLocked ? 0.5 : 1 }}
              >
                {isLocked ? `🔒 ${achievement.condition}` : `✅ ${achievement.condition}`}
              </span>
            </div>
          )}

          {/* XP Reward */}
          {!compact && achievement.xpReward && (
            <div className="mt-1 text-[10px] font-typewriter" style={{ color: '#c9a84c' }}>
              +{achievement.xpReward} XP
            </div>
          )}
        </div>

        {/* Unlocked indicator */}
        {!isLocked && (
          <div className="text-gold text-lg flex-shrink-0">✦</div>
        )}
      </div>
    </div>
  )
}
