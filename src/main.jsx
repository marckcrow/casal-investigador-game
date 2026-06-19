import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

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
