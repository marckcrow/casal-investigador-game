import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'casal_investigador_progress'

const DEFAULT_PROGRESS = {
  completedCases: {},    // { caseId: { score, date, title, mistakes } }
  totalScore: 0,
  totalCasesCompleted: 0,
  achievements: {},     // { achievementId: true }
  currentStreak: 0,
  maxStreak: 0,
  lastPlayed: null,
  level: 1,
  xp: 0,
}

/**
 * Track completed cases, scores, and achievements in localStorage
 */
export function useGameProgress() {
  const [progress, setProgress] = useLocalStorage(STORAGE_KEY, DEFAULT_PROGRESS)

  const completeCase = (caseId, score, caseTitle = '', mistakes = 0) => {
    setProgress(prev => {
      const alreadyCompleted = !!prev.completedCases[caseId]
      const newCompletedCases = {
        ...prev.completedCases,
        [caseId]: {
          score,
          date: new Date().toISOString(),
          title: caseTitle,
          mistakes,
          completedAt: Date.now(),
        }
      }

      const deltaScore = alreadyCompleted
        ? score - (prev.completedCases[caseId]?.score || 0)
        : score

      const newTotalScore = alreadyCompleted
        ? prev.totalScore
        : prev.totalScore + score

      const newTotalCompleted = alreadyCompleted
        ? prev.totalCasesCompleted
        : prev.totalCasesCompleted + 1

      // XP system: 10 XP per point scored
      const newXp = prev.xp + (alreadyCompleted ? 0 : score * 10)
      const newLevel = Math.floor(newXp / 1000) + 1

      return {
        ...prev,
        completedCases: newCompletedCases,
        totalScore: newTotalScore,
        totalCasesCompleted: newTotalCompleted,
        lastPlayed: new Date().toISOString(),
        xp: newXp,
        level: newLevel,
      }
    })
  }

  const unlockAchievement = (achievementId) => {
    setProgress(prev => ({
      ...prev,
      achievements: {
        ...prev.achievements,
        [achievementId]: true,
      }
    }))
  }

  const isCaseCompleted = (caseId) => {
    return !!progress.completedCases[caseId]
  }

  const getCaseScore = (caseId) => {
    return progress.completedCases[caseId]?.score || 0
  }

  const isAchievementUnlocked = (achievementId) => {
    return !!progress.achievements[achievementId]
  }

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS)
  }

  const getLevelInfo = () => {
    const level = progress.level || 1
    const xp = progress.xp || 0
    const xpForNextLevel = level * 1000
    const xpInCurrentLevel = xp % 1000
    const progressPercent = Math.min(100, (xpInCurrentLevel / xpForNextLevel) * 100)

    const titles = [
      'Detetive Iniciante',
      'Investigador Aprendiz',
      'Investigador Júnior',
      'Investigador Sênior',
      'Detetive Chefe',
      'Mestre Investigador',
      'Gênio da Dedução',
      'Lenda Investigativa',
      'Detetive Supremo',
      'Lenda Absoluta',
    ]

    return {
      level,
      xp,
      xpForNextLevel,
      xpInCurrentLevel,
      progressPercent,
      title: titles[Math.min(level - 1, titles.length - 1)] || 'Detetive Iniciante',
    }
  }

  return {
    progress,
    completeCase,
    unlockAchievement,
    isCaseCompleted,
    getCaseScore,
    isAchievementUnlocked,
    resetProgress,
    getLevelInfo,
  }
}

export default useGameProgress
