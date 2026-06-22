import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Toast notification system — auto-dismiss, success/error/info/warning
 */
let toastId = 0
let addToastGlobal = null

export function showToast(message, type = 'info', duration = 4000) {
  if (addToastGlobal) {
    addToastGlobal({ id: ++toastId, message, type, duration })
  }
}

export function showSuccess(message, duration) { return showToast(message, 'success', duration) }
export function showError(message, duration) { return showToast(message, 'error', duration) }
export function showInfo(message, duration) { return showToast(message, 'info', duration) }
export function showWarning(message, duration) { return showToast(message, 'warning', duration) }

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Register global add function
  useEffect(() => {
    addToastGlobal = (toast) => {
      setToasts(prev => [...prev, toast])
    }
    return () => { addToastGlobal = null }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  const { message, type, duration = 4000 } = toast

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onRemove, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onRemove])

  const config = {
    success: {
      icon: '✅',
      color: '#2ecc71',
      bg: '#2ecc7111',
      border: '#2ecc7144',
    },
    error: {
      icon: '⚠️',
      color: '#c41e3a',
      bg: '#c41e3a11',
      border: '#c41e3a44',
    },
    info: {
      icon: 'ℹ️',
      color: '#3498db',
      bg: '#3498db11',
      border: '#3498db44',
    },
    warning: {
      icon: '⚡',
      color: '#f39c12',
      bg: '#f39c1211',
      border: '#f39c1244',
    },
  }

  const { icon, color, bg, border } = config[type] || config.info

  return (
    <div
      className="case-file pointer-events-auto animate-fade-in flex items-start gap-3 p-3"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <p className="text-paper text-sm flex-1 leading-relaxed">{message}</p>
      <button
        onClick={onRemove}
        className="text-paperDim hover:text-gold transition-colors flex-shrink-0 text-sm"
      >
        ✕
      </button>
    </div>
  )
}
