/**
 * Score calculation functions for Casal Investigador Game
 */

/**
 * Calculate score for a completed case
 * @param {Object} params
 * @param {number} params.cluesFound - Number of clues revealed
 * @param {number} params.totalClues - Total available clues
 * @param {number} params.interrogations - Number of interrogations done
 * @param {boolean} params.correctSuspect - Whether the right suspect was chosen
 * @param {boolean} params.correctMotive - Whether the right motive was identified
 * @param {boolean} params.correctEvidence - Whether the right evidence was identified
 * @param {number} params.errors - Number of wrong accusations
 * @param {number} params.bonusPoints - Bonus points for special achievements
 * @returns {{ total: number, breakdown: Object, title: string, stars: number }}
 */
export function calculateCaseScore({
  cluesFound = 0,
  totalClues = 3,
  interrogations = 0,
  correctSuspect = false,
  correctMotive = false,
  correctEvidence = false,
  errors = 0,
  bonusPoints = 0,
} = {}) {
  // Base score
  let total = 0

  // Clue discovery (max 60 points, 20 per clue)
  const clueScore = Math.min(cluesFound * 20, 60)
  total += clueScore

  // Correct accusation bonus
  const suspectBonus = correctSuspect ? 50 : 0
  total += suspectBonus

  // Motive identification bonus
  const motiveBonus = correctMotive ? 20 : 0
  total += motiveBonus

  // Evidence identification bonus
  const evidenceBonus = correctEvidence ? 20 : 0
  total += evidenceBonus

  // Interrogation bonus (10 per interrogation, max 30)
  const interrogationScore = Math.min(interrogations * 10, 30)
  total += interrogationScore

  // Perfect investigation bonus (all clues, no errors, correct suspect)
  const perfectBonus = (cluesFound === totalClues && errors === 0 && correctSuspect) ? 30 : 0
  total += perfectBonus

  // Speed bonus (conceptual - would need timer data)
  // First case bonus
  // Bonus points parameter
  total += bonusPoints

  // Error penalty
  const errorPenalty = errors * 10
  total = Math.max(0, total - errorPenalty)

  // Title based on score
  const title = getScoreTitle(total)
  const stars = getScoreStars(total)

  return {
    total: Math.max(0, total),
    breakdown: {
      clues: { points: clueScore, max: 60, label: '🔍 Pistas Encontradas' },
      suspect: { points: suspectBonus, max: 50, label: '⚖️ Acusação Correta' },
      motive: { points: motiveBonus, max: 20, label: '💡 Motivo Identificado' },
      evidence: { points: evidenceBonus, max: 20, label: '📋 Evidência Correta' },
      interrogation: { points: interrogationScore, max: 30, label: '🗣️ Interrogatórios' },
      perfect: { points: perfectBonus, max: 30, label: '⭐ Investigação Perfeita' },
      bonus: { points: bonusPoints, max: null, label: '🎁 Bônus' },
      penalty: { points: -errorPenalty, max: null, label: '⚠️ Penalidades' },
    },
    title,
    stars,
  }
}

/**
 * Get detective title based on score
 * @param {number} score
 * @returns {string}
 */
export function getScoreTitle(score) {
  if (score >= 150) return '🏆 Gênio Investigativo'
  if (score >= 100) return '🌟 Mestre da Dedução'
  if (score >= 50) return '🔎 Investigador Atento'
  return '📋 Detetive Iniciante'
}

/**
 * Get star rating (1-5) based on score
 * @param {number} score
 * @returns {number}
 */
export function getScoreStars(score) {
  if (score >= 150) return 5
  if (score >= 100) return 4
  if (score >= 70) return 3
  if (score >= 40) return 2
  if (score >= 1) return 1
  return 0
}

/**
 * Get XP earned from a case
 * @param {number} score
 * @returns {number}
 */
export function getXpFromScore(score) {
  return score * 10
}

export default {
  calculateCaseScore,
  getScoreTitle,
  getScoreStars,
  getXpFromScore,
}
