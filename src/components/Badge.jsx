/**
 * Badge component — status badges for difficulty, themes, locked/unlocked/completed
 */
const THEME_CONFIG = {
  CRIME: { label: 'CRIME', bg: '#c41e3a22', color: '#ff6b6b', border: '#c41e3a44', icon: '💀' },
  HORROR: { label: 'HORROR', bg: '#4a008022', color: '#9b59b6', border: '#4a008044', icon: '👻' },
  OCULTISMO: { label: 'OCULTISMO', bg: '#2d004d22', color: '#9b59b6', border: '#8e44ad44', icon: '🔮' },
  'MISTÉRIO': { label: 'MISTÉRIO', bg: '#003d5b22', color: '#5dade2', border: '#003d5b44', icon: '🗝️' },
  SUSPENSE: { label: 'SUSPENSE', bg: '#5b3a0022', color: '#f39c12', border: '#5b3a0044', icon: '⏱️' },
}

const DIFFICULTY_CONFIG = {
  fácil: { label: 'Fácil', bg: '#16a08522', color: '#2ecc71', border: '#16a08544', stars: 1 },
  médio: { label: 'Médio', bg: '#d4a01722', color: '#f39c12', border: '#d4a01744', stars: 2 },
  difícil: { label: 'Difícil', bg: '#c41e3a22', color: '#ff6b6b', border: '#c41e3a44', stars: 3 },
}

const STATUS_CONFIG = {
  locked: { label: '🔒 Bloqueado', color: '#555', bg: '#1a1a1a', border: '#333' },
  unlocked: { label: '🔓 Desbloqueado', color: '#2ecc71', bg: '#2ecc7111', border: '#2ecc7133' },
  completed: { label: '✅ Resolvido', color: '#c9a84c', bg: '#c9a84c11', border: '#c9a84c33' },
  new: { label: '🆕 Novo', color: '#3498db', bg: '#3498db11', border: '#3498db33' },
}

/**
 * Theme badge (matches Home.jsx inline theme-badge classes)
 */
export function ThemeBadge({ theme }) {
  const config = THEME_CONFIG[theme] || THEME_CONFIG['MISTÉRIO']
  return (
    <span
      className="text-xs font-typewriter tracking-widest px-2 py-0.5 rounded uppercase"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.icon} {config.label}
    </span>
  )
}

/**
 * Difficulty badge with star rating
 */
export function DifficultyBadge({ difficulty }) {
  // difficulty: 1-3 or string 'fácil'/'médio'/'difícil'
  let config
  if (typeof difficulty === 'number') {
    const map = { 1: 'fácil', 2: 'médio', 3: 'difícil' }
    config = DIFFICULTY_CONFIG[map[difficulty]] || DIFFICULTY_CONFIG.médio
  } else {
    config = DIFFICULTY_CONFIG[difficulty?.toLowerCase()] || DIFFICULTY_CONFIG.médio
  }

  return (
    <span
      className="text-xs font-typewriter px-2 py-0.5 rounded"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      {'★'.repeat(config.stars)}{'☆'.repeat(3 - config.stars)}
    </span>
  )
}

/**
 * Generic status badge
 */
export function StatusBadge({ status, customLabel, customColor }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.locked
  return (
    <span
      className="text-xs font-typewriter px-2 py-0.5 rounded"
      style={{
        backgroundColor: customColor ? `${customColor}22` : config.bg,
        color: customColor || config.color,
        border: `1px solid ${customColor ? `${customColor}44` : config.border}`,
      }}
    >
      {customLabel || config.label}
    </span>
  )
}

/**
 * Generic badge with custom color
 */
export function Badge({
  children,
  color = '#c9a84c',
  bg,
  size = 'md', // sm | md
  className = '',
}) {
  const bgColor = bg || `${color}22`
  return (
    <span
      className={`font-typewriter tracking-widest px-2 py-0.5 rounded uppercase inline-block ${size === 'sm' ? 'text-[10px]' : 'text-xs'} ${className}`}
      style={{
        backgroundColor: bgColor,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  )
}

export default Badge
