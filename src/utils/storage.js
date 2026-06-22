/**
 * localStorage helpers for Casal Investigador Game
 */

const PREFIX = 'cig_'

/**
 * Save game progress to localStorage
 * @param {Object} data
 */
export function saveGameProgress(data) {
  try {
    const existing = loadGameProgress()
    const merged = { ...existing, ...data, updatedAt: new Date().toISOString() }
    window.localStorage.setItem(PREFIX + 'progress', JSON.stringify(merged))
  } catch (error) {
    console.warn('[storage] Error saving game progress:', error)
  }
}

/**
 * Load game progress from localStorage
 * @returns {Object}
 */
export function loadGameProgress() {
  try {
    const raw = window.localStorage.getItem(PREFIX + 'progress')
    return raw ? JSON.parse(raw) : {}
  } catch (error) {
    console.warn('[storage] Error loading game progress:', error)
    return {}
  }
}

/**
 * Save notes for a specific case
 * @param {number|string} caseId
 * @param {string} notes
 */
export function saveNotes(caseId, notes) {
  try {
    const key = PREFIX + `notes_${caseId}`
    window.localStorage.setItem(key, notes)
  } catch (error) {
    console.warn('[storage] Error saving notes:', error)
  }
}

/**
 * Load notes for a specific case
 * @param {number|string} caseId
 * @returns {string}
 */
export function loadNotes(caseId) {
  try {
    const key = PREFIX + `notes_${caseId}`
    return window.localStorage.getItem(key) || ''
  } catch (error) {
    console.warn('[storage] Error loading notes:', error)
    return ''
  }
}

/**
 * Save hypothesis for a specific case
 * @param {number|string} caseId
 * @param {string} hypothesis
 */
export function saveHypothesis(caseId, hypothesis) {
  try {
    const key = PREFIX + `hypothesis_${caseId}`
    window.localStorage.setItem(key, hypothesis)
  } catch (error) {
    console.warn('[storage] Error saving hypothesis:', error)
  }
}

/**
 * Load hypothesis for a specific case
 * @param {number|string} caseId
 * @returns {string}
 */
export function loadHypothesis(caseId) {
  try {
    const key = PREFIX + `hypothesis_${caseId}`
    return window.localStorage.getItem(key) || ''
  } catch (error) {
    console.warn('[storage] Error loading hypothesis:', error)
    return ''
  }
}

/**
 * Save found clues for a specific case
 * @param {number|string} caseId
 * @param {Array} clues
 */
export function saveFoundClues(caseId, clues) {
  try {
    const key = PREFIX + `clues_${caseId}`
    window.localStorage.setItem(key, JSON.stringify(clues))
  } catch (error) {
    console.warn('[storage] Error saving clues:', error)
  }
}

/**
 * Load found clues for a specific case
 * @param {number|string} caseId
 * @returns {Array}
 */
export function loadFoundClues(caseId) {
  try {
    const key = PREFIX + `clues_${caseId}`
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.warn('[storage] Error loading clues:', error)
    return []
  }
}

/**
 * Save suspect suspicion levels
 * @param {number|string} caseId
 * @param {Object} levels - { suspectName: level }
 */
export function saveSuspectLevels(caseId, levels) {
  try {
    const key = PREFIX + `suspects_${caseId}`
    window.localStorage.setItem(key, JSON.stringify(levels))
  } catch (error) {
    console.warn('[storage] Error saving suspect levels:', error)
  }
}

/**
 * Load suspect suspicion levels
 * @param {number|string} caseId
 * @returns {Object}
 */
export function loadSuspectLevels(caseId) {
  try {
    const key = PREFIX + `suspects_${caseId}`
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch (error) {
    console.warn('[storage] Error loading suspect levels:', error)
    return {}
  }
}

/**
 * Clear all game data
 */
export function clearAllGameData() {
  try {
    const keysToRemove = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => window.localStorage.removeItem(key))
  } catch (error) {
    console.warn('[storage] Error clearing game data:', error)
  }
}

export default {
  saveGameProgress,
  loadGameProgress,
  saveNotes,
  loadNotes,
  saveHypothesis,
  loadHypothesis,
  saveFoundClues,
  loadFoundClues,
  saveSuspectLevels,
  loadSuspectLevels,
  clearAllGameData,
}
