import { useState, useCallback } from 'react'
import { calculateCaseScore } from '../utils/score'

/**
 * Score calculation hook for tracking clues, interrogations, and accuracy
 */
export function useScore() {
  const [cluesFound, setCluesFound] = useState(0)
  const [interrogations, setInterrogations] = useState(0)
  const [errors, setErrors] = useState(0)
  const [correctDecisions, setCorrectDecisions] = useState(0)
  const [bonusPoints, setBonusPoints] = useState(0)

  const addClue = useCallback(() => {
    setCluesFound(prev => prev + 1)
  }, [])

  const addInterrogation = useCallback(() => {
    setInterrogations(prev => prev + 1)
  }, [])

  const addError = useCallback(() => {
    setErrors(prev => prev + 1)
  }, [])

  const addCorrectDecision = useCallback(() => {
    setCorrectDecisions(prev => prev + 1)
  }, [])

  const addBonus = useCallback((points) => {
    setBonusPoints(prev => prev + points)
  }, [])

  const getFinalScore = useCallback((totalClues, correctSuspect, correctMotive, correctEvidence) => {
    return calculateCaseScore({
      cluesFound,
      totalClues,
      interrogations,
      correctSuspect,
      correctMotive,
      correctEvidence,
      errors,
      bonusPoints,
    })
  }, [cluesFound, interrogations, errors, bonusPoints])

  const reset = useCallback(() => {
    setCluesFound(0)
    setInterrogations(0)
    setErrors(0)
    setCorrectDecisions(0)
    setBonusPoints(0)
  }, [])

  return {
    cluesFound,
    interrogations,
    errors,
    correctDecisions,
    bonusPoints,
    addClue,
    addInterrogation,
    addError,
    addCorrectDecision,
    addBonus,
    getFinalScore,
    reset,
  }
}

export default useScore
