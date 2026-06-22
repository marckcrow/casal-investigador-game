import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ── Global Error Tracker ──────────────────────────────────────────────────
// Logs errors to localStorage for Admin panel review
const ERROR_LOG_KEY = 'mp_error_log'
const MAX_ERRORS = 100

window.__ErrorTracker = {
  log(error, context = '') {
    try {
      const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        message: error?.message || String(error),
        stack: error?.stack || '',
        context: context || window.location.pathname,
        url: window.location.href,
        userAgent: navigator.userAgent.slice(0, 120),
        timestamp: new Date().toISOString(),
      }
      const raw = localStorage.getItem(ERROR_LOG_KEY)
      const log = raw ? JSON.parse(raw) : []
      log.unshift(entry)
      if (log.length > MAX_ERRORS) log.length = MAX_ERRORS
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(log))
    } catch { /* storage full or unavailable */ }
  },
  getErrors() {
    try {
      return JSON.parse(localStorage.getItem(ERROR_LOG_KEY)) || []
    } catch { return [] }
  },
  clearErrors() {
    localStorage.removeItem(ERROR_LOG_KEY)
  },
}

// Override window.onerror to capture all runtime errors
const _origOnError = window.onerror
window.onerror = function(msg, src, line, col, err) {
  window.__ErrorTracker.log(err || msg, `${src}:${line}:${col}`)
  // Also show on screen (existing behavior)
  var el = document.getElementById('err-msg')
  if (el) el.textContent = 'Erro: ' + msg + ' (linha ' + line + ')'
  console.error('[Global error]', msg, src, line, col, err)
  if (_origOnError) return _origOnError.apply(this, arguments)
}

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
  window.__ErrorTracker.log(e.reason, 'Unhandled Promise Rejection')
})

// Error boundary to catch render errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }
  componentDidCatch(error, info) {
    this.setState({ error, info })
    console.error('[Casal Investigador] Render error:', error, info)
    // Show error on screen for debugging
    document.getElementById('root').style.padding = '20px'
    document.getElementById('root').style.color = '#c41e3a'
    document.getElementById('root').style.fontFamily = 'monospace'
    document.getElementById('root').innerHTML = '<h2>⚠️ Erro ao carregar</h2><pre style="color:#c9a84c;white-space:pre-wrap">' + String(error.stack || error.message || error).replace(/</g,'&lt;') + '</pre>'
  }
  render() {
    if (this.state.error) return null
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)

// Register Service Worker for PWA / offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — silently ignore
    })
  })
}
