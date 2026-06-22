/**
 * Empty state component with illustration, message, CTA
 */
export default function EmptyState({
  icon = '🔍',
  title = 'Nenhum item encontrado',
  message = 'Não há nada para exibir aqui.',
  action,
  actionLabel,
  actionVariant = 'primary',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {/* Illustration */}
      <div className="text-5xl mb-4 opacity-40 animate-float">
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-typewriter text-gold text-lg mb-2 tracking-widest">
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className="text-paperDim text-sm max-w-sm leading-relaxed mb-6">
          {message}
        </p>
      )}

      {/* Action */}
      {action && (
        <button
          onClick={action}
          className={`
            font-typewriter tracking-widest px-6 py-3 rounded transition-all duration-200
            ${actionVariant === 'primary'
              ? 'bg-gold text-noir hover:bg-yellow-400 hover:-translate-y-0.5 hover:shadow-lg'
              : actionVariant === 'secondary'
              ? 'bg-transparent border border-gold/60 text-gold hover:bg-gold/10'
              : 'bg-transparent border-0 text-paperDim hover:text-gold'
            }
          `}
        >
          {actionLabel || 'Ação'}
        </button>
      )}
    </div>
  )
}
