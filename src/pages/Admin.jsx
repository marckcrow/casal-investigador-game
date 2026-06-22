import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import cases from '../data/cases.json'
import { useGameProgress } from '../hooks/useGameProgress'

// ── Constants ──────────────────────────────────────────────────────────────
const MAINTENANCE_KEY = 'mp_maintenance_mode'
const ADMIN_STATS_KEY = 'mp_admin_stats'

const TABS = [
  { id: 'visao', label: '📊 Visão Geral', icon: '📊' },
  { id: 'erros', label: '🐛 Erros', icon: '🐛' },
  { id: 'jogadores', label: '👥 Jogadores', icon: '👥' },
  { id: 'casos', label: '📁 Casos', icon: '📁' },
  { id: 'ranking', label: '🏆 Ranking', icon: '🏆' },
  { id: 'config', label: '⚙️ Configurações', icon: '⚙️' },
]

const THEME_ICONS = {
  CRIME: '💀', HORROR: '👻', OCULTISMO: '🔮',
  'MISTÉRIO': '🗝️', SUSPENSE: '⏱️'
}
const THEME_COLORS = {
  CRIME: 'bg-crimson/20 text-crimson border-crimson/30',
  HORROR: 'bg-purple-900/30 text-purple-400 border-purple-700/30',
  OCULTISMO: 'bg-purple-800/30 text-purple-300 border-purple-600/30',
  'MISTÉRIO': 'bg-blue-900/30 text-blue-400 border-blue-700/30',
  SUSPENSE: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/30',
}

// ── Stats helpers ─────────────────────────────────────────────────────────
function loadAdminStats() {
  try {
    const raw = localStorage.getItem(ADMIN_STATS_KEY)
    return raw ? JSON.parse(raw) : { totalGamesPlayed: 0, activeRooms: 0 }
  } catch { return { totalGamesPlayed: 0, activeRooms: 0 } }
}

function saveAdminStats(stats) {
  try { localStorage.setItem(ADMIN_STATS_KEY, JSON.stringify(stats)) } catch {}
}

function trackGamePlay() {
  const stats = loadAdminStats()
  stats.totalGamesPlayed = (stats.totalGamesPlayed || 0) + 1
  saveAdminStats(stats)
  return stats
}

export default function Admin() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, getAllUsers } = useAuth()
  const { progress } = useGameProgress()

  const [activeTab, setActiveTab] = useState('visao')
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    return localStorage.getItem(MAINTENANCE_KEY) === 'true'
  })
  const [stats, setStats] = useState(loadAdminStats)
  const [users, setUsers] = useState([])
  const [searchUsers, setSearchUsers] = useState('')
  const [searchCases, setSearchCases] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorLog, setErrorLog] = useState([])

  const allCases = cases.cases || cases

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoggedIn, navigate])

  // ── Load users ─────────────────────────────────────────────────────────
  useEffect(() => {
    const all = getAllUsers()
    setUsers(all)
  }, [activeTab, getAllUsers])

  // ── Refresh stats ─────────────────────────────────────────────────────
  useEffect(() => {
    setStats(loadAdminStats())
  }, [])

  // ── Show notification ─────────────────────────────────────────────────
  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 2500)
  }

  // ── Toggle maintenance ─────────────────────────────────────────────────
  const toggleMaintenance = () => {
    const next = !maintenanceMode
    setMaintenanceMode(next)
    localStorage.setItem(MAINTENANCE_KEY, String(next))
    showNotif(next ? '🔒 Modo manutenção ATIVADO' : '✅ Modo manutenção DESATIVADA')
  }

  // ── Error log management ────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'erros' && window.__ErrorTracker) {
      setErrorLog(window.__ErrorTracker.getErrors())
    }
  }, [activeTab])

  const clearErrors = () => {
    if (window.__ErrorTracker) {
      window.__ErrorTracker.clearErrors()
      setErrorLog([])
      showNotif('🗑️ Log de erros limpo!')
    }
  }

  // ── Ranking data from localStorage ─────────────────────────────────────
  const rankingData = (() => {
    try {
      const raw = localStorage.getItem('mp_ranking')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })()

  // ── Filtered users ──────────────────────────────────────────────────────
  const filteredUsers = users.filter(u =>
    !searchUsers ||
    u.name?.toLowerCase().includes(searchUsers.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUsers.toLowerCase())
  )

  // ── Filtered cases ─────────────────────────────────────────────────────
  const filteredCases = allCases.filter(c =>
    !searchCases ||
    c.title?.toLowerCase().includes(searchCases.toLowerCase()) ||
    c.theme?.toLowerCase().includes(searchCases.toLowerCase()) ||
    String(c.id).includes(searchCases)
  )

  // ── Render ─────────────────────────────────────────────────────────────
  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-noir text-paper">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors text-sm">← Início</Link>
          <div className="flex-1 flex items-center gap-2 justify-center">
            <span className="text-amber-400 text-sm">⚙️</span>
            <span className="font-typewriter text-gold text-sm tracking-widest">
              PAINEL ADMINISTRATIVO
            </span>
          </div>
          {/* User info */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{user.avatar}</span>
            <span className="text-paperDim text-xs hidden sm:inline">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Maintenance banner */}
      {maintenanceMode && (
        <div className="bg-crimson/20 border-b border-crimson/30 py-2 px-4 text-center">
          <span className="text-crimson text-xs font-typewriter tracking-wider">
            🔒 MODO MANUTENÇÃO ATIVO — O jogo está temporariamente indisponível
          </span>
        </div>
      )}

      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-16 right-4 z-50 px-5 py-2.5 rounded-lg shadow-xl text-sm font-medium animate-fade-in ${
          notification.type === 'success' ? 'bg-green-900/90 text-green-200 border border-green-700' :
          notification.type === 'error' ? 'bg-red-900/90 text-red-200 border border-red-700' :
          'bg-noir2 text-paper border border-gray-600'
        }`}>
          {notification.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-noir2 rounded-xl p-1.5 mb-6 border border-gray-800 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 py-2.5 px-3 rounded-lg font-typewriter text-xs tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold text-noir shadow'
                  : 'text-paperDim hover:text-gold hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: VISÃO GERAL ─────────────────────────────────────────── */}
        {activeTab === 'visao' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-typewriter text-gold text-lg tracking-widest">📊 VISÃO GERAL</h2>
              <button
                onClick={() => setStats(loadAdminStats())}
                className="text-paperDim hover:text-gold text-xs transition-colors"
              >
                🔄 Atualizar
              </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '👥', label: 'Total de Jogadores', value: users.length, color: 'gold' },
                { icon: '🎮', label: 'Partidas Jogadas', value: stats.totalGamesPlayed || 0, color: 'text-blue-400' },
                { icon: '🏆', label: 'Casos Resolvidos', value: progress.totalCasesCompleted || 0, color: 'text-green-400' },
                { icon: '⭐', label: 'Pontuação Total', value: (progress.totalScore || 0).toLocaleString('pt-BR'), color: 'text-purple-400' },
              ].map(s => (
                <div key={s.label} className="bg-noir2 border border-gray-800 rounded-xl p-5 text-center hover:border-gold/30 transition-all">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className={`font-typewriter text-2xl mb-1 ${s.color === 'gold' ? 'text-gold' : s.color}`}>
                    {s.value}
                  </div>
                  <div className="text-paperDim text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress summary */}
            <div className="bg-noir2 border border-gray-800 rounded-xl p-5">
              <h3 className="font-typewriter text-gold text-sm tracking-widest mb-4">📈 PROGRESSO DO USUÁRIO ATUAL</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-paper text-lg font-typewriter">{progress.level || 1}</div>
                  <div className="text-paperDim text-xs">Nível</div>
                </div>
                <div>
                  <div className="text-gold text-lg font-typewriter">{progress.xp?.toLocaleString('pt-BR') || 0}</div>
                  <div className="text-paperDim text-xs">XP Total</div>
                </div>
                <div>
                  <div className="text-paper text-lg font-typewriter">{Object.keys(progress.completedCases || {}).length}</div>
                  <div className="text-paperDim text-xs">Casos Feitos</div>
                </div>
                <div>
                  <div className="text-paper text-lg font-typewriter">{Object.keys(progress.achievements || {}).length}</div>
                  <div className="text-paperDim text-xs">Conquistas</div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('jogadores')} className="bg-noir2 border border-gray-800 rounded-xl p-4 text-left hover:border-gold/30 transition-all">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-typewriter text-paper text-sm mb-1">Gerenciar Jogadores</div>
                <div className="text-paperDim text-xs">{users.length} usuários registrados</div>
              </button>
              <button onClick={() => setActiveTab('config')} className="bg-noir2 border border-gray-800 rounded-xl p-4 text-left hover:border-gold/30 transition-all">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-typewriter text-paper text-sm mb-1">Configurações</div>
                <div className="text-paperDim text-xs">{maintenanceMode ? '🔒 Manutenção ON' : '✅ Online'}</div>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: ERROS (Error Log) ──────────────────────────────────── */}
        {activeTab === 'erros' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-typewriter text-crimson text-lg tracking-widest">🐛 LOG DE ERROS</h2>
              <div className="flex gap-2">
                <span className="text-paperDim text-xs">{errorLog.length} erro(s) registrado(s)</span>
                {errorLog.length > 0 && (
                  <button
                    onClick={clearErrors}
                    className="text-xs bg-crimson/20 border border-crimson/30 text-crimson px-3 py-1.5 rounded hover:bg-crimson/30 transition-all font-typewriter"
                  >
                    🗑️ Limpar
                  </button>
                )}
              </div>
            </div>

            {errorLog.length === 0 ? (
              <div className="bg-noir2 border border-gray-800 rounded-xl p-12 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-paper text-sm mb-1">Nenhum erro registrado!</p>
                <p className="text-paperDim text-xs">Os erros de runtime aparecerão aqui automaticamente.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {errorLog.map((err, i) => (
                  <div key={err.id || i} className="bg-noir2 border border-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="text-crimson text-sm font-mono break-all">{err.message}</div>
                        <div className="text-paperDim text-xs mt-1 font-mono">📍 {err.context || err.url}</div>
                      </div>
                      <div className="text-paperDim/50 text-[10px] whitespace-nowrap">
                        {new Date(err.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    {err.stack && (
                      <details className="mt-2">
                        <summary className="text-paperDim/60 text-xs cursor-pointer hover:text-gold transition-colors">Stack trace ▾</summary>
                        <pre className="text-paperDim/40 text-[10px] mt-2 overflow-auto max-h-32 font-mono leading-relaxed whitespace-pre-wrap">{err.stack}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
              <p className="text-paperDim text-xs leading-relaxed">
                📝 <strong>Como funciona:</strong> O tracker captura automaticamente erros de JavaScript
                (window.onerror, promessas rejeitadas, erros de render). Cada erro é salvo no localStorage
                do navegador. Para ver erros de outros usuários, integre com Supabase ou um serviço
                de error tracking (Sentry, LogRocket).
              </p>
            </div>
          </div>
        )}

        {/* ── TAB: JOGADORES ────────────────────────────────────────────── */}
        {activeTab === 'jogadores' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-typewriter text-gold text-lg tracking-widest">👥 JOGADORES REGISTRADOS</h2>
              <span className="text-paperDim text-xs">{filteredUsers.length} de {users.length}</span>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchUsers}
              onChange={e => setSearchUsers(e.target.value)}
              className="w-full sm:w-80 bg-noir border border-gray-700 text-paper px-4 py-2 rounded focus:border-gold outline-none text-sm"
            />

            {/* Table */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-paperDim">
                <div className="text-4xl mb-4">👤</div>
                <p>Nenhum jogador encontrado.</p>
              </div>
            ) : (
              <div className="bg-noir2 border border-gray-800 rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 border-b border-gray-800 bg-noir/50">
                  <div className="col-span-1 text-paperDim text-xs font-typewriter">#</div>
                  <div className="col-span-3 text-paperDim text-xs font-typewriter">NOME</div>
                  <div className="col-span-4 text-paperDim text-xs font-typewriter">E-MAIL</div>
                  <div className="col-span-2 text-paperDim text-xs font-typewriter">DATA</div>
                  <div className="col-span-2 text-paperDim text-xs font-typewriter text-center">PERFIL</div>
                </div>

                {/* Rows */}
                {filteredUsers.map((u, i) => (
                  <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-4 border-b border-gray-800/50 last:border-0 hover:bg-gray-900/30 transition-colors">
                    <div className="hidden md:block col-span-1 text-paperDim text-xs self-center">#{i + 1}</div>
                    <div className="col-span-1 md:col-span-3 flex items-center gap-2">
                      <span className="text-xl">{u.avatar || '🕵️'}</span>
                      <span className="text-paper text-sm truncate">{u.name}</span>
                    </div>
                    <div className="col-span-1 md:col-span-4 text-paperDim text-xs self-center truncate">{u.email}</div>
                    <div className="col-span-1 md:col-span-2 text-paperDim text-xs self-center">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-2 self-center">
                      {u.id === user?.id && (
                        <span className="bg-gold/20 text-gold text-[10px] font-typewriter px-2 py-0.5 rounded border border-gold/30">VOCÊ</span>
                      )}
                      <span className="text-paperDim text-xs">🕵️</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: CASOS ────────────────────────────────────────────────── */}
        {activeTab === 'casos' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-typewriter text-gold text-lg tracking-widest">📁 CASOS ({allCases.length})</h2>
              <span className="text-paperDim text-xs">{filteredCases.length} casos</span>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar caso por título, tema ou ID..."
              value={searchCases}
              onChange={e => setSearchCases(e.target.value)}
              className="w-full sm:w-96 bg-noir border border-gray-700 text-paper px-4 py-2 rounded focus:border-gold outline-none text-sm"
            />

            {/* Theme filter summary */}
            <div className="flex gap-2 flex-wrap">
              {Object.entries(THEME_ICONS).map(([theme, icon]) => (
                <span key={theme} className="text-paperDim text-xs bg-noir2 border border-gray-800 px-2 py-1 rounded">
                  {icon} {theme}: {allCases.filter(c => c.theme === theme).length}
                </span>
              ))}
            </div>

            {/* Cases list */}
            {filteredCases.length === 0 ? (
              <div className="text-center py-16 text-paperDim">
                <div className="text-4xl mb-4">🔍</div>
                <p>Nenhum caso encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCases.map(c => (
                  <div key={c.id} className="bg-noir2 border border-gray-800 rounded-lg p-4 hover:border-gold/30 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-paper text-xs font-typewriter">#{String(c.id).padStart(2, '0')}</span>
                      <span className={`text-[10px] font-typewriter px-2 py-0.5 rounded border ${THEME_COLORS[c.theme] || ''}`}>
                        {THEME_ICONS[c.theme]} {c.theme}
                      </span>
                    </div>
                    <h4 className="text-paper text-sm mb-2 leading-tight line-clamp-2">{c.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-paperDim text-xs">📍 {c.location}</span>
                      <span className="text-gold text-xs">
                        {'★'.repeat(c.difficulty || 2)}{'☆'.repeat(3 - (c.difficulty || 2))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: RANKING ─────────────────────────────────────────────── */}
        {activeTab === 'ranking' && (
          <div className="animate-fade-in space-y-4">
            <h2 className="font-typewriter text-gold text-lg tracking-widest">🏆 RANKING DOS INVESTIGADORES</h2>

            {rankingData ? (
              <div className="bg-noir2 border border-gray-800 rounded-xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 border-b border-gray-800 bg-noir/50">
                  <div className="col-span-1 text-paperDim text-xs font-typewriter">#</div>
                  <div className="col-span-5 text-paperDim text-xs font-typewriter">JOGADOR</div>
                  <div className="col-span-2 text-paperDim text-xs font-typewriter text-center">CASOS</div>
                  <div className="col-span-2 text-paperDim text-xs font-typewriter text-right">PONTOS</div>
                  <div className="col-span-2 text-paperDim text-xs font-typewriter text-center">TÍTULO</div>
                </div>
                {rankingData.slice(0, 20).map((entry, i) => (
                  <div key={i} className={`grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-4 border-b border-gray-800/50 last:border-0 ${
                    entry.isCurrentPlayer ? 'bg-gold/5' : ''
                  }`}>
                    <div className="col-span-1 self-center">
                      {i < 3 ? ['🥇', '🥈', '🥉'][i] : <span className="text-paperDim text-xs font-typewriter">#{i + 1}</span>}
                    </div>
                    <div className="col-span-1 md:col-span-5 flex items-center gap-2">
                      <span className="text-lg">{entry.avatar || '🕵️'}</span>
                      <span className="text-paper text-sm">
                        {entry.playerName || entry.name || 'Jogador'}
                        {entry.isCurrentPlayer && <span className="text-gold text-xs ml-1">(você)</span>}
                      </span>
                    </div>
                    <div className="col-span-1 md:col-span-2 text-center text-paper text-sm self-center">
                      {entry.casesResolved || entry.cases || 0}
                    </div>
                    <div className="col-span-1 md:col-span-2 text-right font-typewriter text-gold text-sm self-center">
                      {(entry.score || 0).toLocaleString('pt-BR')}
                    </div>
                    <div className="col-span-1 md:col-span-2 text-center">
                      <span className="text-paperDim text-xs">{entry.title || 'Investigador'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-noir2 border border-gray-800 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-paperDim text-sm mb-4">Nenhum dado de ranking registrado ainda.</p>
                <p className="text-paperDim/60 text-xs">
                  O ranking é atualizado conforme os jogadores completam casos.
                </p>
              </div>
            )}

            {/* User's rank highlight */}
            {user && (
              <div className="bg-gold/5 border border-gold/30 rounded-xl p-5">
                <div className="font-typewriter text-gold text-sm tracking-widest mb-3">🎯 SUA POSIÇÃO</div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{user.avatar}</span>
                  <div>
                    <div className="text-paper text-sm">{user.name}</div>
                    <div className="text-paperDim text-xs">{user.email}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-typewriter text-gold text-lg">
                      {(progress.totalScore || 0).toLocaleString('pt-BR')} pts
                    </div>
                    <div className="text-paperDim text-xs">{progress.totalCasesCompleted || 0} casos resolvidos</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: CONFIGURAÇÕES ────────────────────────────────────────── */}
        {activeTab === 'config' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="font-typewriter text-gold text-lg tracking-widest">⚙️ CONFIGURAÇÕES DO SISTEMA</h2>

            {/* Maintenance toggle */}
            <div className="bg-noir2 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-typewriter text-paper text-sm mb-1">🔒 MODO MANUTENÇÃO</div>
                  <p className="text-paperDim text-xs">
                    Quando ativado, jogadores não poderão acessar o jogo.
                  </p>
                </div>
                <button
                  onClick={toggleMaintenance}
                  className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 ${
                    maintenanceMode ? 'bg-crimson' : 'bg-gray-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow ${
                    maintenanceMode ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
              {maintenanceMode && (
                <div className="mt-3 bg-crimson/10 border border-crimson/20 rounded-lg p-3">
                  <p className="text-crimson text-xs">🔒 Modo manutenção ATIVADO — jogadores verão mensagem de indisponibilidade.</p>
                </div>
              )}
            </div>

            {/* Account info */}
            <div className="bg-noir2 border border-gray-800 rounded-xl p-6">
              <div className="font-typewriter text-paper text-sm mb-4 tracking-widest">👤 SUA CONTA</div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{user?.avatar}</span>
                <div>
                  <div className="text-paper text-base">{user?.name}</div>
                  <div className="text-paperDim text-xs">{user?.email}</div>
                  <div className="text-paperDim/60 text-xs mt-0.5">
                    Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={logout}
                  className="bg-crimson/20 border border-crimson/30 text-crimson px-4 py-2 rounded-lg text-sm hover:bg-crimson/30 transition-all font-typewriter"
                >
                  🚪 Sair da Conta
                </button>
                <Link to="/" className="btn-outline text-sm px-4 py-2">
                  ← Voltar ao Início
                </Link>
              </div>
            </div>

            {/* Data management */}
            <div className="bg-noir2 border border-gray-800 rounded-xl p-6">
              <div className="font-typewriter text-paper text-sm mb-4 tracking-widest">📦 DADOS</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-paper text-xs">Usuários registrados</div>
                    <div className="text-paperDim text-xs">{users.length} contas</div>
                  </div>
                  <span className="bg-noir border border-gray-700 text-paperDim text-xs px-3 py-1 rounded">
                    mp_users (localStorage)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-paper text-xs">Progresso de jogo</div>
                    <div className="text-paperDim text-xs">{progress.totalCasesCompleted || 0} casos, {(progress.totalScore || 0).toLocaleString('pt-BR')} pts</div>
                  </div>
                  <span className="bg-noir border border-gray-700 text-paperDim text-xs px-3 py-1 rounded">
                    casal_investigador_progress
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-paper text-xs">Partidas registradas</div>
                    <div className="text-paperDim text-xs">{stats.totalGamesPlayed || 0} partidas</div>
                  </div>
                  <span className="bg-noir border border-gray-700 text-paperDim text-xs px-3 py-1 rounded">
                    mp_admin_stats
                  </span>
                </div>
              </div>
              <p className="text-paperDim/50 text-[10px] mt-4 leading-relaxed">
                📝 Nota: Todos os dados estão armazenados localmente no navegador (localStorage).
                Para produção, integre com Supabase (PostgreSQL + Auth + Realtime).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
