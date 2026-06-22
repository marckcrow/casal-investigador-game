/**
 * Card component — noir/gold detective theme
 * Slots: header, body, footer
 * Border variants: default, gold, crimson, subtle
 */
export default function Card({
  children,
  className = '',
  hover = true,
  variant = 'default', // default | gold | crimson | subtle
  padding = 'md',      // none | sm | md | lg
  onClick,
  ...props
}) {
  const borderClasses = {
    default: 'border border-gray-800 hover:border-gold/50',
    gold: 'border border-gold/40 hover:border-gold',
    crimson: 'border border-crimson/30 hover:border-crimson/60',
    subtle: 'border border-gray-800/50 hover:border-gray-700',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  const hoverClasses = hover && onClick
    ? 'hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 cursor-pointer'
    : ''

  const paddingAll = paddingClasses[padding] || paddingClasses.md

  if (onClick) {
    return (
      <div
        onClick={onClick}
        className={`
          bg-noir2 rounded-lg overflow-hidden
          ${borderClasses[variant]}
          ${paddingAll}
          ${hoverClasses}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={`
        bg-noir2 rounded-lg overflow-hidden
        ${borderClasses[variant]}
        ${paddingAll}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b border-gray-800 px-4 py-3 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`px-4 py-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-gray-800 px-4 py-3 ${className}`}>
      {children}
    </div>
  )
}
