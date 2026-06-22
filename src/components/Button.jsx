/**
 * Button component — noir/gold detective theme
 * Variants: primary, secondary, ghost, gold
 * Sizes: sm, md, lg
 */
export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | gold
  size = 'md',          // sm | md | lg
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variantClasses = {
    primary: 'bg-crimson text-white border-0 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg shadow-crimson/30',
    secondary: 'bg-transparent border border-gold/60 text-gold hover:bg-gold/10 hover:border-gold',
    ghost: 'bg-transparent border-0 text-paperDim hover:text-gold hover:bg-gold/5',
    gold: 'bg-gold text-noir border-0 hover:bg-yellow-400 hover:-translate-y-0.5 hover:shadow-lg shadow-gold/30',
  }

  const disabledClasses = disabled || loading
    ? 'opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-none pointer-events-none'
    : 'cursor-pointer'

  const loadingContent = loading ? (
    <span className="flex items-center gap-2">
      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      {children}
    </span>
  ) : children

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        font-typewriter tracking-widest rounded transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {loadingContent}
    </button>
  )
}
