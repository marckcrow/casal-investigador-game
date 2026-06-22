import { getScoreTitle, getScoreStars } from '../utils/score'
import ProgressBar from './ProgressBar'

/**
 * Score breakdown display at end of case
 */
export default function ScoreSummary({
  scoreData,
  caseTitle,
  caseId,
  onPlayAgain,
  onHome,
}) {
  if (!scoreData) return null

  const { total, breakdown, title, stars } = scoreData
  const breakdownEntries = Object.values(breakdown).filter(
    b => b.points !== 0 || b.max !== null
  )

  const starIcons = '★'.repeat(stars) + '☆'.repeat(5 - stars)

  return (
    <div className="case-file p-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-paperDim text-xs font-typewriter tracking-widest mb-2">
          RELATÓRIO DE INVESTIGAÇÃO
        </div>
        <h3 className="font-typewriter text-gold text-sm mb-1">{caseTitle}</h3>
        <div className="text-xs text-paperDim">Caso #{String(caseId).padStart(2, '0')}</div>
      </div>

      {/* Score display */}
      <div className="text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#c9a84c11', border: '1px solid #c9a84c33' }}>
        <div className="font-typewriter text-4xl text-gold mb-1" style={{ textShadow: '0 0 20px rgba(201,168,76,0.5)' }}>
          {total}
        </div>
        <div className="text-paperDim text-xs font-typewriter tracking-wider mb-2">PONTOS</div>
        <div className="text-gold text-lg">{starIcons}</div>
        <div className="mt-2 font-typewriter text-sm" style={{ color: '#e8c96a' }}>
          {title}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-6">
        <div className="text-xs font-typewriter text-gold tracking-widest mb-3">// DETALHAMENTO</div>
        {breakdownEntries.map((item, i) => {
          const isNegative = item.points < 0
          const color = isNegative ? '#c41e3a' : '#c9a84c'
          const percent = item.max ? (item.points / item.max) * 100 : null

          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm w-6 text-center" style={{ color }}>
                {isNegative ? '−' : item.points > 0 ? '+' : '○'}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs ${isNegative ? 'text-crimson' : 'text-paperDim'}`}>
                    {item.label}
                  </span>
                  <span className="text-xs font-typewriter" style={{ color: isNegative ? '#c41e3a' : '#c9a84c' }}>
                    {isNegative ? item.points : `+${item.points}`}{item.max ? `/${item.max}` : ''}
                  </span>
                </div>
                {percent !== null && (
                  <div className="h-1 bg-noir rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 4px ${color}66`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      {(onPlayAgain || onHome) && (
        <div className="flex gap-3 justify-center flex-wrap">
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="bg-gold text-noir font-typewriter tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-gold/30"
            >
              🔄 JOGAR NOVAMENTE
            </button>
          )}
          {onHome && (
            <button
              onClick={onHome}
              className="bg-transparent border border-gold/60 text-gold font-typewriter tracking-widest px-6 py-3 rounded hover:bg-gold/10 transition-all"
            >
              🏠 INÍCIO
            </button>
          )}
        </div>
      )}
    </div>
  )
}
