import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cases from '../data/cases.json'
import { startAmbient, stopAmbient } from '../lib/audio'

const THEMES = ['Todos', 'CRIME', 'HORROR', 'OCULTISMO', 'MISTÉRIO', 'SUSPENSE']
const THEME_ICONS = { CRIME: '💀', HORROR: '👻', OCULTISMO: '🔮', 'MISTÉRIO': '🗝️', SUSPENSE: '⏱️' }
const DIFFICULTY_STARS = n => '★'.repeat(n) + '☆'.repeat(3 - n)

export default function Home() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [audioOn, setAudioOn] = useState(false)
  const [showModal, setShowModal] = useState(null)
  const [bgmOn, setBgmOn] = useState(true)

  const allCases = cases.cases || cases
  const filtered = Array.isArray(allCases) ? allCases.filter(c =>
    (filter === 'Todos' || c.theme === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) ||
     c.location.toLowerCase().includes(search.toLowerCase()))
  ) : []

  const toggleAudio = () => {
    if (audioOn) { stopAmbient(); setAudioOn(false) }
    else { startAmbient('rain'); setAudioOn(true) }
  }

  return (
    <div className="min-h-screen bg-noir">
      {/* Header */}
      <header className="border-b border-gray-800 bg-noir2/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-typewriter text-gold text-xl tracking-widest">CASAL INVESTIGADOR</h1>
            <p className="text-paperDim text-sm">50 CASOS INTERATIVOS</p>
          </div>
          <div className="flex gap-3">
            <Link to="/caderno" className="btn-outline text-sm px-3 py-2" title="Caderno de Investigação">
              📓 Caderno
            </Link>
            <Link to="/ranking" className="btn-outline text-sm px-3 py-2" title="Ranking">
              🏆 Ranking
            </Link>
            <Link to="/personagens" className="btn-outline text-sm px-3 py-2" title="Personagens">
              👤 Personagens
            </Link>
            <button onClick={toggleAudio} className="btn-outline text-sm px-4 py-2">
              {audioOn ? '🔊' : '🔇'} Som
            </button>
            <button onClick={() => {
              const isOn = window.toggleBgMusic && window.toggleBgMusic()
              setBgmOn(isOn !== false)
            }} className={`btn-outline text-sm px-4 py-2 ${bgmOn ? 'border-gold text-gold' : ''}`} title="Música de fundo (Dark Blues)">
              🎵 Blues
            </button>
            <Link to="/jogar" className="btn-primary text-sm px-4 py-2">
              🎮 Solo
            </Link>
            <Link to="/multiplayer" className="btn-outline text-sm px-4 py-2">
              👥 Multiplayer
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/10 to-transparent" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-float text-5xl mb-4">🕵️</div>
          <h2 className="font-typewriter text-3xl text-gold mb-4 tracking-widest">
            ESCOLHA SEU CASO
          </h2>
          <p className="text-paperDim max-w-xl mx-auto mb-8 text-lg">
            Cada caso é um universo. Escolha o tema, leia o dossiê, colete as pistas e encontre o criminosos entre os suspeitos.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            {[['50', 'Casos Reais'], ['5', 'Temas'], ['3', 'Níveis'], ['∞', 'Horas']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-typewriter text-2xl text-gold">{n}</div>
                <div className="text-paperDim text-sm">{l}</div>
              </div>
            ))}
          </div>

          {/* Mode selector */}
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-noir2 border border-gold/30 rounded-lg px-6 py-4 text-left max-w-sm">
              <div className="text-gold font-typewriter text-sm tracking-wider mb-1">🎮 MODO SOLO</div>
              <div className="text-paperDim text-sm mb-3">Jogue sozinho ou em dupla contra o crimonoso</div>
              <Link to="/jogar" className="btn-gold text-sm">INICIAR JOGO →</Link>
            </div>
            <div className="bg-noir2 border border-gray-700 rounded-lg px-6 py-4 text-left max-w-sm opacity-60">
              <div className="text-gray-400 font-typewriter text-sm tracking-wider mb-1">👥 MODO MULTIPLAYER</div>
              <div className="text-gray-500 text-sm mb-3">Jogue com amigos em tempo real (breve)</div>
              <button className="btn-outline text-sm opacity-50" disabled>EM BREVE</button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-noir2 border-b border-gray-800 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3 items-center flex-wrap">
          <span className="text-paperDim text-sm font-typewriter">TEMA:</span>
          {THEMES.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs font-typewriter tracking-wider px-3 py-1 rounded transition-all ${
                filter === t
                  ? 'bg-gold text-noir'
                  : 'bg-noir border border-gray-700 text-paperDim hover:border-gold'
              }`}
            >
              {t === 'Todos' ? '🎭 TODOS' : `${THEME_ICONS[t]} ${t}`}
            </button>
          ))}
          <input
            type="text"
            placeholder="Buscar caso..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ml-auto bg-noir border border-gray-700 text-paper px-3 py-1 rounded text-sm focus:border-gold outline-none transition-colors w-48"
          />
        </div>
      </div>

      {/* Case Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-typewriter text-gold text-lg tracking-widest">
            {filter === 'Todos' ? 'TODOS OS CASOS' : filter}
          </h3>
          <span className="text-paperDim text-sm">{filtered.length} casos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c, i) => (
            <div
              key={c.id}
              className="card cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
              onClick={() => setShowModal(c)}
            >
              {/* Case header */}
              <div className={`h-2 ${c.theme === 'CRIME' ? 'bg-crimson' : c.theme === 'HORROR' ? 'bg-purple-900' : c.theme === 'OCULTISMO' ? 'bg-purple-800' : c.theme === 'MISTÉRIO' ? 'bg-blue-800' : 'bg-yellow-700'}`} />

              <div className="p-4">
                {/* Theme + Difficulty */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`theme-badge theme-${c.theme}`}>{THEME_ICONS[c.theme]} {c.theme}</span>
                  <span className="text-gold text-xs">{DIFFICULTY_STARS(c.difficulty || 2)}</span>
                </div>

                {/* Title */}
                <h4 className="font-typewriter text-paper text-sm leading-tight mb-2 line-clamp-2">
                  {c.title}
                </h4>

                {/* Location */}
                <div className="flex items-center gap-1 text-paperDim text-xs mb-3">
                  <span>📍</span> {c.location}
                </div>

                {/* Victim */}
                <div className="text-paperDim text-xs mb-3">
                  <span className="text-crimson font-typewriter">VÍTIMA: </span>
                  <span className="line-clamp-1">{c.victim}</span>
                </div>

                {/* Suspects preview */}
                <div className="flex gap-1 flex-wrap mb-3">
                  {c.suspects.map((s, si) => (
                    <span key={si} className="bg-noir border border-gray-700 text-paperDim text-xs px-1.5 py-0.5 rounded">
                      {s.name}
                    </span>
                  ))}
                </div>

                {/* Play button */}
                <button className="w-full btn-primary text-xs py-2 mt-1">
                  INVESTIGAR →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-paperDim">
            <div className="text-4xl mb-4">🔍</div>
            <p>Nenhum caso encontrado para "{search}"</p>
          </div>
        )}
      </div>

      {/* Case Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(null)}>
          <div className="case-file max-w-lg w-full p-8 relative animate-fade-in"
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(null)} className="absolute top-3 right-4 text-paperDim hover:text-gold text-xl">✕</button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`theme-badge theme-${showModal.theme}`}>{THEME_ICONS[showModal.theme]} {showModal.theme}</span>
              <span className="text-paperDim text-xs">{DIFFICULTY_STARS(showModal.difficulty || 2)}</span>
            </div>

            <h3 className="font-typewriter text-gold text-xl mb-2 leading-tight">{showModal.title}</h3>
            <p className="text-paperDim text-sm mb-4">📍 {showModal.location}</p>

            <div className="border-t border-gray-700 pt-4 mb-4">
              <div className="text-crimson font-typewriter text-xs mb-1">A VÍTIMA</div>
              <p className="text-paper text-sm mb-3">{showModal.victim}</p>
              <div className="text-paperDim text-sm italic mb-4">{showModal.crime}</div>
            </div>

            <div className="border-t border-gray-700 pt-4 mb-6">
              <div className="text-gold font-typewriter text-xs mb-2">SUSPETOS</div>
              <div className="grid grid-cols-2 gap-2">
                {showModal.suspects.map((s, si) => (
                  <div key={si} className="bg-noir border border-gray-700 rounded px-3 py-2 text-sm text-paper">
                    👤 {s.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4 mb-6">
              <div className="text-paperDim font-typewriter text-xs mb-1">SOLUÇÃO (reveal after solving)</div>
              <p className="text-paperDim text-sm italic">{showModal.solution}</p>
            </div>

            <Link
              to={`/jogo/${showModal.id}`}
              className="btn-primary w-full text-center block"
              onClick={() => setShowModal(null)}
            >
              🎮 JOGAR ESTE CASO
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center">
        <div className="flex justify-center gap-4 mb-3 flex-wrap">
          <Link to="/caderno" className="text-paperDim hover:text-gold transition-colors text-sm">📓 Caderno</Link>
          <Link to="/ranking" className="text-paperDim hover:text-gold transition-colors text-sm">🏆 Ranking</Link>
          <Link to="/personagens" className="text-paperDim hover:text-gold transition-colors text-sm">👤 Personagens</Link>
          <Link to="/sobre" className="text-paperDim hover:text-gold transition-colors text-sm">📖 Sobre o Projeto</Link>
          <a href="https://github.com/marckcrow/casal-investigador-game" target="__blank" rel="noopener noreferrer" className="text-paperDim hover:text-gold transition-colors text-sm">💻 GitHub</a>
          <a href="https://wa.me/5585985035473?text=Olá! Vi o Casal Investigador e quero conversar!" target="__blank" rel="noopener noreferrer" className="text-paperDim hover:text-gold transition-colors text-sm">💬 Contato</a>
        </div>
        <p className="text-paperDim/50 text-xs">Casal Investigador © 2026 · Feito com ❤️ por Marcondes Rodrigues Jr</p>
      </footer>
    </div>
  )
}
