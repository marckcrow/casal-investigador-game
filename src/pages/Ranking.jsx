import { Link } from 'react-router-dom'
import RankingBoard from '../components/RankingBoard'
import ProgressBar from '../components/ProgressBar'
import { mockRanking, rankingStats, getRankTitle } from '../data/ranking'
import { useGameProgress } from '../hooks/useGameProgress'
import { useAuth } from '../hooks/useAuth'

export default function Ranking() {
  const { user, isLoggedIn } = useAuth()
  const { progress, getLevelInfo } = useGameProgress()
  const levelInfo = getLevelInfo()

  const myEntry = {
    rank: rankingStats.yourPosition,
    playerName: 'Você',
    casesResolved: progress.totalCasesCompleted || rankingStats.yourCasesResolved,
    score: progress.totalScore || rankingStats.yourTotalScore,
    title: levelInfo.title,
    avatar: '🕵️',
    country: '🇧🇷',
    isCurrentPlayer: true,
  }

  // Merge current player into ranking
  const rankingWithMe = [...mockRanking]
  // Insert current player at correct position
  const insertIndex = rankingWithMe.findIndex(e => e.rank > rankingStats.yourPosition)
  if (insertIndex >= 0) {
    rankingWithMe.splice(insertIndex, 0, myEntry)
  } else {
    rankingWithMe.push(myEntry)
  }
  // Re-rank
  const reRanked = rankingWithMe.map((e, i) => ({ ...e, rank: i + 1 }))

  return (
    <div className="min-h-screen bg-noir text-paper">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-noir2/90">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors text-sm">← Início</Link>
          <div className="flex-1 text-center">
            <span className="font-typewriter text-gold text-sm tracking-widest">
              🏆 RANKING
            </span>
          </div>
          {isLoggedIn ? (
            <Link to="/admin" className="text-paperDim hover:text-gold text-sm transition-colors">
              ⚙️ Admin
            </Link>
          ) : (
            <Link to="/login" className="text-paperDim hover:text-gold text-sm transition-colors">
              🔑 Login
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="font-typewriter text-gold text-2xl mb-2 tracking-widest">
            QUADRO DE DETETIVES
          </h1>
          <p className="text-paperDim text-sm">
            Os investigadores mais eficientes do Brasil
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Summary */}
        {/* Your rank (logged in) */}
        {isLoggedIn && (
          <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-6 text-center animate-fade-in">
            <p className="text-paperDim text-xs font-typewriter tracking-widest mb-1">SEU RANK</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{user.avatar}</span>
              <div className="text-left">
                <div className="font-typewriter text-gold text-lg">{user.name}</div>
                <div className="text-paperDim text-xs">#{rankingStats.yourPosition} · {myEntry.score.toLocaleString('pt-BR')} pts · {levelInfo.title}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total de Jogadores', value: rankingStats.totalPlayers.toLocaleString('pt-BR'), icon: '👥' },
            { label: 'Sua Posição', value: `#${rankingStats.yourPosition}`, icon: '🎯' },
            { label: 'Sua Pontuação', value: myEntry.score.toLocaleString('pt-BR'), icon: '⭐' },
            { label: 'Casos Resolvidos', value: myEntry.casesResolved, icon: '📋' },
          ].map(stat => (
            <div key={stat.label} className="bg-noir2 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-typewriter text-gold text-xl mb-0.5">{stat.value}</div>
              <div className="text-paperDim text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Your Stats */}
        <div className="bg-noir2 border border-gold/20 rounded-lg p-5 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl">🕵️</div>
            <div>
              <div className="font-typewriter text-gold text-lg">{levelInfo.title}</div>
              <div className="text-paperDim text-xs">Nível {levelInfo.level} · {myEntry.casesResolved} casos resolvidos</div>
            </div>
          </div>
          <ProgressBar
            value={levelInfo.xpInCurrentLevel}
            max={levelInfo.xpForNextLevel}
            label={`XP: ${levelInfo.xpInCurrentLevel} / ${levelInfo.xpForNextLevel}`}
            variant="gold"
          />
          <div className="mt-2 text-right text-paperDim text-xs">
            Total: {levelInfo.xp.toLocaleString('pt-BR')} XP
          </div>
        </div>

        {/* Ranking Table */}
        <div className="mb-6">
          <h2 className="font-typewriter text-gold text-sm tracking-widest mb-4">
            🏅 TOP 10 INVESTIGADORES
          </h2>
          <RankingBoard entries={reRanked} />
        </div>

        {/* CTA */}
        <div className="text-center mt-8 p-6 bg-noir2 border border-gray-800 rounded-lg">
          <p className="text-paperDim text-sm mb-4">
            Quer subir no ranking? Resolva mais casos e erre menos para ganhar mais pontos!
          </p>
          <Link
            to="/jogar"
            className="inline-block bg-gold text-noir font-typewriter tracking-widest px-6 py-3 rounded hover:bg-yellow-400 transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-gold/30"
          >
            🎮 JOGAR AGORA
          </Link>
        </div>
      </div>
    </div>
  )
}
