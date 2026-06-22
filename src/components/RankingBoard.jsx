/**
 * Ranking table with positions, names, scores, titles
 */
export default function RankingBoard({
  entries,
  currentPlayerId,
  showAll = true,
  maxEntries = 10,
  className = '',
}) {
  const displayEntries = showAll ? entries : entries.slice(0, maxEntries)

  const getRankStyle = (rank) => {
    if (rank === 1) return { color: '#FFD700', bg: '#FFD70011', border: '#FFD70044', icon: '🥇' }
    if (rank === 2) return { color: '#C0C0C0', bg: '#C0C0C011', border: '#C0C0C044', icon: '🥈' }
    if (rank === 3) return { color: '#CD7F32', bg: '#CD7F3211', border: '#CD7F3244', icon: '🥉' }
    return { color: '#8a8070', bg: '', border: '#333', icon: '' }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 text-paperDim text-xs font-typewriter tracking-wider border-b border-gray-800">
        <span className="w-8 text-center">#</span>
        <span className="flex-1">JOGADOR</span>
        <span className="w-16 text-center">CASOS</span>
        <span className="w-20 text-center">PONTOS</span>
        <span className="flex-1 text-center">TÍTULO</span>
      </div>

      {/* Entries */}
      {displayEntries.map((entry) => {
        const rankStyle = getRankStyle(entry.rank)
        const isCurrent = entry.isCurrentPlayer || entry.playerName === 'Marcondes Jr'

        return (
          <div
            key={entry.rank}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isCurrent ? 'border' : ''}
            `}
            style={{
              backgroundColor: isCurrent ? '#c9a84c11' : rankStyle.bg,
              borderColor: isCurrent ? '#c9a84c44' : rankStyle.border,
              boxShadow: isCurrent ? '0 0 12px rgba(201,168,76,0.15)' : 'none',
            }}
          >
            {/* Rank */}
            <div className="w-8 text-center">
              {rankStyle.icon ? (
                <span className="text-lg">{rankStyle.icon}</span>
              ) : (
                <span className="font-typewriter text-sm" style={{ color: rankStyle.color }}>
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Player */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="text-lg flex-shrink-0">{entry.avatar || '👤'}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-typewriter text-sm truncate"
                    style={{ color: isCurrent ? '#c9a84c' : '#e8e0d0' }}
                  >
                    {entry.playerName}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-typewriter text-gold flex-shrink-0">← você</span>
                  )}
                </div>
                {entry.country && (
                  <span className="text-xs">{entry.country}</span>
                )}
              </div>
            </div>

            {/* Cases resolved */}
            <div className="w-16 text-center">
              <span className="font-typewriter text-sm" style={{ color: '#e8e0d0' }}>
                {entry.casesResolved}
              </span>
            </div>

            {/* Score */}
            <div className="w-20 text-center">
              <span
                className="font-typewriter text-sm"
                style={{ color: rankStyle.color }}
              >
                {entry.score.toLocaleString('pt-BR')}
              </span>
            </div>

            {/* Title */}
            <div className="flex-1 text-center">
              <span
                className="text-xs font-typewriter"
                style={{ color: rankStyle.color }}
              >
                {entry.title}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
