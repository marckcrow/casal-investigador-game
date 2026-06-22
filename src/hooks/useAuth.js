/**
 * useAuth — Authentication hook for Casal Investigador Game
 * 
 * Manages user session using localStorage.
 * Structured for easy Supabase Auth migration.
 * 
 * Data keys:
 *   mp_users  — array of { id, name, email, password, createdAt, avatar }
 *   mp_user    — currently logged in user (no password)
 */

import { useState, useEffect, useCallback } from 'react'

const USERS_KEY = 'mp_users'
const USER_KEY = 'mp_user'

// ── Avatar emojis for new registrations ─────────────────────────────────
const AVATARS = ['🕵️', '🔍', '🕵🏻', '🕵🏼', '🕵🏽', '🕵🏾', '🕵🏿', '🕵‍♀️', '🕵‍♂️', '🧑‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧙', '🧙‍♀️', '🧙‍♂️', '🦹', '🦹‍♀️', '🦹‍♂️', '🥷', '🥷‍♀️', '🥷‍♂️']

function randomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)]
}

function generateId() {
  return 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7)
}

// ── Email validation ──────────────────────────────────────────────────────
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// ── Password validation ───────────────────────────────────────────────────
export function isValidPassword(password) {
  return password && password.length >= 6
}

// ── Load all users ────────────────────────────────────────────────────────
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ── Save all users ───────────────────────────────────────────────────────
function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {}
}

// ── Load current session ──────────────────────────────────────────────────
function loadSession() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ── Save current session ─────────────────────────────────────────────────
function saveSession(user) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch {}
}

// ── Auth Hook ────────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load session on mount
  useEffect(() => {
    const session = loadSession()
    setUser(session)
    setLoading(false)
  }, [])

  /**
   * Register a new user
   * @returns {{ success: boolean, error?: string, user?: object }}
   */
  const register = useCallback((name, email, password) => {
    if (!name || !name.trim()) {
      return { success: false, error: 'Digite seu nome completo.' }
    }
    if (!isValidEmail(email)) {
      return { success: false, error: 'Digite um e-mail válido.' }
    }
    if (!isValidPassword(password)) {
      return { success: false, error: 'A senha deve ter pelo menos 6 caracteres.' }
    }

    const users = loadUsers()
    const emailLower = email.trim().toLowerCase()

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === emailLower)) {
      return { success: false, error: 'Este e-mail já está cadastrado. Tente fazer login.' }
    }

    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: email.trim(),
      password, // Stored in plain text for localStorage-only (will be hashed in Supabase migration)
      createdAt: new Date().toISOString(),
      avatar: randomAvatar(),
    }

    users.push(newUser)
    saveUsers(users)

    // Save session (without password)
    const sessionUser = { ...newUser }
    delete sessionUser.password
    saveSession(sessionUser)
    setUser(sessionUser)

    return { success: true, user: sessionUser }
  }, [])

  /**
   * Login existing user
   * @returns {{ success: boolean, error?: string, user?: object }}
   */
  const login = useCallback((email, password) => {
    if (!isValidEmail(email)) {
      return { success: false, error: 'Digite um e-mail válido.' }
    }
    if (!password) {
      return { success: false, error: 'Digite sua senha.' }
    }

    const users = loadUsers()
    const emailLower = email.trim().toLowerCase()

    const found = users.find(u => u.email.toLowerCase() === emailLower)
    if (!found) {
      return { success: false, error: 'E-mail não encontrado. Verifique ou crie uma conta.' }
    }
    if (found.password !== password) {
      return { success: false, error: 'Senha incorreta. Tente novamente.' }
    }

    const sessionUser = { ...found }
    delete sessionUser.password
    saveSession(sessionUser)
    setUser(sessionUser)

    return { success: true, user: sessionUser }
  }, [])

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    saveSession(null)
    setUser(null)
  }, [])

  /**
   * Require authentication — returns true if ok, redirects if not
   * Call this in components that need protection
   */
  const requireAuth = useCallback(() => {
    if (!user) {
      window.location.href = '/login'
      return false
    }
    return true
  }, [user])

  /**
   * Get all registered users (admin only)
   */
  const getAllUsers = useCallback(() => {
    const users = loadUsers()
    return users.map(u => {
      const clean = { ...u }
      delete clean.password
      return clean
    })
  }, [])

  /**
   * Check if email is already registered
   */
  const emailExists = useCallback((email) => {
    if (!isValidEmail(email)) return false
    const users = loadUsers()
    return users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())
  }, [])

  return {
    user,           // { id, name, email, createdAt, avatar } | null
    isLoggedIn: !!user,
    loading,
    login,
    register,
    logout,
    requireAuth,
    getAllUsers,
    emailExists,
  }
}

export default useAuth
