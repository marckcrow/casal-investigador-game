import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cases from '../data/cases.json'

const THEMES = ['Todos', 'CRIME', 'HORROR', 'OCULTISMO', 'MISTÉRIO', 'SUSPENSE']
const THEME_ICONS = { CRIME: '💀', HORROR: '👻', OCULTISMO: '🔮', 'MISTÉRIO': '🗝️', SUSPENSE: '⏱️' }

export default function Solo() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Todos')
  const [selectedCase, setSelectedCase] = useState(null)

  const allCases = cases.cases || cases
  const filtered = Array.isArray(allCases) ? allCases.filter(c => filter === 'Todos' || c.theme === filter) : []

  const startGame = (c) => {
    navigate(`/jogo/${c.id}`)
  }

  return (
    <div className="min-h-screen bg-noir">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors">← Voltar</Link>
          <div className="flex-1">
            <h1 className="font-typewriter text-gold tracking-widest text-lg">🎮 MODO SOLO</h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="bg-noir2 border border-gold/20 rounded-lg p-6 mb-8 text-center">
          <div className="text-4xl mb-3">🕵️</div>
          <h2 className="font-typewriter text-gold text-xl mb-3 tracking-widest">INVESTIGUE SOZINHO</h2>
          <p className="text-paperDim max-w-lg mx-auto">
            Você é o detetive. Leia o caso, analise as pistas e vote no suspeito. O criminal também está no jogo — e vai tentar te enganar.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            ['📋', 'LEIA O CASO', 'Conheça o crime, a vítima e os suspeitos'],
            ['🔍', 'COLETE PISTAS', 'Analise as evidências e suspeitas'],
            ['🎭', 'ESCOLHA SEU PAPEL', 'Você é o detetive ou... o criminoso?'],
            ['🗳️', 'VOTE', 'Aponte o suspeito e veja se acertou!'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-noir2 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-typewriter text-gold text-xs tracking-wider mb-1">{title}</div>
              <div className="text-paperDim text-xs">{desc}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {THEMES.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`text-xs font-typewriter tracking-wider px-3 py-1.5 rounded transition-all ${
                filter === t ? 'bg-gold text-noir' : 'bg-noir2 border border-gray-700 text-paperDim hover:border-gold'
              }`}>
              {t === 'Todos' ? '🎭 TODOS' : `${THEME_ICONS[t]} ${t}`}
            </button>
          ))}
        </div>

        {/* Case list */}
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id}
              className="card flex items-center gap-4 p-4 cursor-pointer hover:border-gold/50"
              onClick={() => startGame(c)}>
              <div className="text-2xl">{THEME_ICONS[c.theme]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`theme-badge theme-${c.theme}`}>{c.theme}</span>
                  <span className="text-paperDim text-xs">#{String(c.id).padStart(2, '0')}</span>
                </div>
                <h4 className="font-typewriter text-paper text-sm truncate">{c.title}</h4>
                <p className="text-paperDim text-xs truncate">📍 {c.location} · Vítima: {c.victim}</p>
              </div>
              <div className="text-gold text-sm">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
