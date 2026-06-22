import { investigators } from '../data/investigators'

/**
 * Character profile card for the couple protagonists
 */
export default function InvestigatorCard({
  investigator,
  showStats = true,
  compact = false,
  className = '',
}) {
  if (!investigator) return null

  const StatBar = ({ label, value }) => (
    <div className="flex items-center gap-2">
      <span className="text-paperDim text-xs w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-noir rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            backgroundColor: investigator.color,
            boxShadow: `0 0 6px ${investigator.color}66`,
          }}
        />
      </div>
      <span className="text-paperDim text-xs w-6 text-right">{value}</span>
    </div>
  )

  return (
    <div
      className={`case-file rounded-lg overflow-hidden ${className}`}
      style={{ border: `1px solid ${investigator.color}33` }}
    >
      {/* Top accent bar */}
      <div
        className="h-1"
        style={{ backgroundColor: investigator.color }}
      />

      <div className={`${compact ? 'p-4' : 'p-6'}`}>
        {/* Avatar + Name */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="text-5xl flex-shrink-0"
            style={{ filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.3))' }}
          >
            {investigator.avatar}
          </div>
          <div className="flex-1">
            <div className="font-typewriter text-gold text-lg leading-tight">
              {investigator.name}
            </div>
            <div
              className="text-xs font-typewriter tracking-wider mt-0.5"
              style={{ color: investigator.color }}
            >
              {investigator.role}
            </div>
            <div className="text-paperDim text-xs mt-1 italic">
              {investigator.tagline}
            </div>
          </div>
        </div>

        {/* Special Ability */}
        <div
          className="mb-4 p-3 rounded-lg"
          style={{ backgroundColor: `${investigator.color}11`, border: `1px solid ${investigator.color}33` }}
        >
          <div className="text-xs font-typewriter tracking-wider mb-1" style={{ color: investigator.color }}>
            ⚡ {investigator.specialAbility}
          </div>
          <p className="text-paperDim text-xs leading-relaxed">
            {investigator.specialAbilityDesc}
          </p>
        </div>

        {/* Personality Traits */}
        {!compact && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {investigator.personalityTraits.map(trait => (
              <span
                key={trait}
                className="text-[10px] font-typewriter px-2 py-0.5 rounded"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: investigator.color,
                  border: `1px solid ${investigator.color}44`,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        {showStats && investigator.stats && (
          <div className="space-y-2">
            {Object.entries(investigator.stats).map(([key, value]) => (
              <StatBar
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
              />
            ))}
          </div>
        )}

        {/* Backstory (full mode only) */}
        {!compact && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="text-xs font-typewriter text-gold tracking-wider mb-2">
              📖 HISTÓRICO
            </div>
            <p className="text-paperDim text-xs leading-relaxed italic">
              {investigator.backstory}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
