import { useEffect, useRef } from 'react'

/**
 * Modal component — overlay modal with backdrop blur
 * Animation: fade + scale entrance
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',     // sm | md | lg | xl
  showClose = true,
  closeOnBackdrop = true,
  className = '',
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={modalRef}
        className={`
          case-file w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto
          animate-fade-in ${className}
        `}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between p-6 pb-4">
            {title && (
              <h3 id="modal-title" className="font-typewriter text-gold text-lg tracking-widest">
                {title}
              </h3>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="text-paperDim hover:text-gold text-xl transition-colors ml-auto mt-[-4px]"
                aria-label="Fechar"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  )
}
