import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const STORAGE_KEYS = {
  EMAIL: 'mp_login_email',
  TAB: 'mp_login_tab',
}

export default function Login() {
  const navigate = useNavigate()
  const { login, register, isLoggedIn } = useAuth()

  const [tab, setTab] = useState(() => localStorage.getItem(STORAGE_KEYS.TAB) || 'login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState(() => localStorage.getItem(STORAGE_KEYS.EMAIL) || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true })
    }
  }, [isLoggedIn, navigate])

  // Persist email preference
  useEffect(() => {
    if (email) localStorage.setItem(STORAGE_KEYS.EMAIL, email)
  }, [email])

  // Persist tab preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB, tab)
  }, [tab])

  const switchTab = (t) => {
    setTab(t)
    setError('')
    setPassword('')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = login(email, password)
      if (result.success) {
        navigate('/', { replace: true })
      } else {
        setError(result.error)
        setLoading(false)
      }
    }, 400) // simulate async
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const result = register(name, email, password)
      if (result.success) {
        navigate('/', { replace: true })
      } else {
        setError(result.error)
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-4 py-8">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Floating elements */}
      <div className="fixed top-10 left-8 text-4xl opacity-10 animate-float">🔍</div>
      <div className="fixed bottom-12 right-8 text-4xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🕵️</div>

      <div className="relative w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕵️</div>
          <h1 className="font-typewriter text-gold text-2xl tracking-widest mb-1">
            CASAL INVESTIGADOR
          </h1>
          <p className="text-paperDim text-sm">Acesso ao sistema de investigação</p>
        </div>

        {/* Case file card */}
        <div className="case-file p-8 relative">
          {/* Red "TOP SECRET" stamp */}
          <div className="absolute top-4 right-4 font-typewriter text-crimson text-[10px] tracking-[0.2em] rotate-6 opacity-40 select-none">
            CONFIDENCIAL
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2.5 text-sm font-typewriter tracking-wider rounded transition-all ${
                tab === 'login'
                  ? 'bg-gold text-noir shadow shadow-gold/20'
                  : 'bg-noir border border-gray-700 text-paperDim hover:border-gold/50'
              }`}
            >
              🔑 ENTRAR
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-2.5 text-sm font-typewriter tracking-wider rounded transition-all ${
                tab === 'register'
                  ? 'bg-gold text-noir shadow shadow-gold/20'
                  : 'bg-noir border border-gray-700 text-paperDim hover:border-gold/50'
              }`}
            >
              📝 CRIAR CONTA
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">
                  E-MAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-noir border border-gray-700 text-paper px-4 py-3 rounded focus:border-gold outline-none text-sm placeholder:text-gray-600 transition-colors"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">
                  SENHA
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-noir border border-gray-700 text-paper px-4 py-3 rounded focus:border-gold outline-none text-sm placeholder:text-gray-600 transition-colors pr-12"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-paperDim hover:text-gold text-sm transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-crimson/10 border border-crimson/30 rounded-lg p-3 text-crimson text-sm text-center">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3.5 text-base font-typewriter tracking-wider disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                    Entrando...
                  </span>
                ) : '🔑 ENTRAR'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">
                  NOME COMPLETO
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-noir border border-gray-700 text-paper px-4 py-3 rounded focus:border-gold outline-none text-sm placeholder:text-gray-600 transition-colors"
                  placeholder="Seu nome de investigador"
                  autoComplete="name"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">
                  E-MAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-noir border border-gray-700 text-paper px-4 py-3 rounded focus:border-gold outline-none text-sm placeholder:text-gray-600 transition-colors"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">
                  SENHA <span className="text-paperDim/60">(mín. 6 caracteres)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-noir border border-gray-700 text-paper px-4 py-3 rounded focus:border-gold outline-none text-sm placeholder:text-gray-600 transition-colors pr-12"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-paperDim hover:text-gold text-sm transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Password strength hint */}
              {password.length > 0 && (
                <div className="flex gap-1">
                  {[1, 2, 3].map(n => (
                    <div
                      key={n}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= n * 2
                          ? password.length >= 10 ? 'bg-gold' : password.length >= 6 ? 'bg-yellow-600' : 'bg-red-700'
                          : 'bg-gray-800'
                      }`}
                    />
                  ))}
                  <span className="text-paperDim/60 text-[10px] ml-2 self-center">
                    {password.length < 6 ? 'Fraca' : password.length < 10 ? 'Razoável' : 'Forte'}
                  </span>
                </div>
              )}

              {error && (
                <div className="bg-crimson/10 border border-crimson/30 rounded-lg p-3 text-crimson text-sm text-center">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-3.5 text-base font-typewriter tracking-wider disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                    Criando conta...
                  </span>
                ) : '📝 CRIAR MINHA CONTA'}
              </button>

              <p className="text-paperDim/60 text-xs text-center">
                Ao criar uma conta, você concorda com os termos de uso do Casal Investigador.
              </p>
            </form>
          )}
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center">
          {tab === 'login' ? (
            <p className="text-paperDim text-sm">
              Não tem conta?{' '}
              <button onClick={() => switchTab('register')} className="text-gold hover:underline">
                Crie uma agora
              </button>
            </p>
          ) : (
            <p className="text-paperDim text-sm">
              Já tem conta?{' '}
              <button onClick={() => switchTab('login')} className="text-gold hover:underline">
                Faça login
              </button>
            </p>
          )}
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-paperDim/60 hover:text-gold text-xs transition-colors">
            ← Voltar ao início
          </Link>
        </div>

        {/* Error animation hint */}
        {error && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-noir2 border border-gray-700 rounded-full px-4 py-2">
              <span className="text-crimson text-sm animate-pulse">⚠️</span>
              <span className="text-paperDim text-xs">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
