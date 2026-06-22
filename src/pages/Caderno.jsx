import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ClueCard from '../components/ClueCard'
import SuspectCard from '../components/SuspectCard'
import EmptyState from '../components/EmptyState'
import { saveNotes, loadNotes, saveHypothesis, loadHypothesis, saveSuspectLevels, loadSuspectLevels, loadFoundClues } from '../utils/storage'
import { sampleClues } from '../data/clues'
import cases from '../data/cases.json'
import { useAuth } from '../hooks/useAuth'

const TABS = [
  { id: 'pistas', label: '🔍 Pistas', icon: '🔍' },
  { id: 'suspeitos', label: '👤 Suspeitos', icon: '👤' },
  { id: 'anotacoes', label: '📝 Anotações', icon: '📝' },
  { id: 'hipoteses', label: '💡 Hipóteses', icon: '💡' },
]

export default function Caderno() {
  const { user, isLoggedIn } = useAuth()
  const [activeTab, setActiveTab] = useState('pistas')
  const [notes, setNotes] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [suspectLevels, setSuspectLevels] = useState({})
  const [foundClues, setFoundClues] = useState([])
  const [selectedCaseId, setSelectedCaseId] = useState(null)

  const allCases = cases.cases || cases

  // Build storage key with userId for per-user isolation
  const storageKey = (base, caseId) => {
    const prefix = isLoggedIn && user ? `mp_${user.id}_${base}_` : `cig_${base}_`
    return `${prefix}${caseId}`
  }

  // Load data for selected case
  useEffect(() => {
    if (selectedCaseId) {
      setNotes(loadNotes(selectedCaseId))
      setHypothesis(loadHypothesis(selectedCaseId))
      setSuspectLevels(loadSuspectLevels(selectedCaseId))
      const clues = loadFoundClues(selectedCaseId)
      setFoundClues(clues.length > 0 ? clues : [])
    }
  }, [selectedCaseId])

  const handleNotesChange = (e) => {
    const val = e.target.value
    setNotes(val)
    if (selectedCaseId) saveNotes(selectedCaseId, val)
  }

  const handleHypothesisChange = (e) => {
    const val = e.target.value
    setHypothesis(val)
    if (selectedCaseId) saveHypothesis(selectedCaseId, val)
  }

  const handleSuspectLevelChange = (suspectName, level) => {
    const updated = { ...suspectLevels, [suspectName]: level }
    setSuspectLevels(updated)
    if (selectedCaseId) saveSuspectLevels(selectedCaseId, updated)
  }

  const selectedCase = selectedCaseId
    ? allCases.find(c => String(c.id) === String(selectedCaseId))
    : null

  const cluesForCase = selectedCaseId ? (sampleClues[selectedCaseId] || []) : []

  return (
    <div className="min-h-screen bg-noir text-paper">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-noir2/90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors text-sm">← Início</Link>
          <div className="flex-1 text-center">
            <span className="font-typewriter text-gold text-sm tracking-widest">
              📓 CADERNO DE INVESTIGAÇÃO
            </span>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{user.avatar}</span>
              <span className="text-paperDim text-xs hidden sm:inline">{user.name?.split(' ')[0]}</span>
              <span className="bg-gold/20 text-gold text-[10px] px-1.5 py-0.5 rounded border border-gold/30 font-typewriter">SALVO</span>
            </div>
          ) : (
            <Link to="/login" className="text-paperDim hover:text-gold text-xs transition-colors">
              🔑 Login
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Case selector */}
        <div className="mb-6">
          <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-2">
            📁 SELECIONE O CASO PARA INVESTIGAR
          </label>
          <select
            value={selectedCaseId || ''}
            onChange={e => setSelectedCaseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full sm:w-80 bg-noir border border-gray-700 text-paper px-4 py-2.5 rounded focus:border-gold outline-none text-sm font-typewriter"
          >
            <option value="">— Escolha um caso —</option>
            {allCases.map(c => (
              <option key={c.id} value={c.id}>
                #{String(c.id).padStart(2,'0')} — {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-noir2 rounded-lg p-1.5 mb-6 border border-gray-800 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 min-w-0 py-2.5 px-3 rounded-md font-typewriter text-xs tracking-wider
                transition-all duration-200 whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-gold text-noir shadow-lg'
                  : 'text-paperDim hover:text-gold hover:bg-gray-800/50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {!selectedCaseId && (
          <EmptyState
            icon="📓"
            title="Selecione um Caso"
            message="Escolha um caso acima para abrir seu caderno de investigação com pistas, suspeitos e espaço para suas anotações."
            actionLabel="Voltar ao Início"
            action={() => {}}
            actionVariant="ghost"
          />
        )}

        {selectedCaseId && activeTab === 'pistas' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-typewriter text-gold text-sm tracking-widest">
                🔍 PLANEJAMENTO DE {foundClues.length}/{cluesForCase.length} PISTAS
              </h2>
              {foundClues.length > 0 && (
                <span className="text-xs text-gold font-typewriter">
                  {foundClues.length} pista{foundClues.length > 1 ? 's' : ''} coletada{foundClues.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {cluesForCase.length === 0 ? (
              <EmptyState
                icon="📁"
                title="Sem Pistas Registradas"
                message="Este caso ainda não tem pistas no sistema. Jogue o caso para desbloquear as pistas aqui."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cluesForCase.map((clue, i) => (
                  <ClueCard
                    key={clue.id}
                    clue={clue}
                    status={foundClues.includes(clue.id) ? 'found' : 'locked'}
                    compact
                  />
                ))}
              </div>
            )}

            {foundClues.length === 0 && cluesForCase.length > 0 && (
              <div className="mt-4 p-4 bg-noir2 border border-gray-800 rounded-lg text-center">
                <p className="text-paperDim text-sm">
                  💡 Jogue este caso para desbloquear as pistas neste caderno.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedCaseId && activeTab === 'suspeitos' && (
          <div className="animate-fade-in">
            <h2 className="font-typewriter text-gold text-sm tracking-widest mb-4">
              👤 NÍVEL DE SUSPEIÇÃO DOS {selectedCase?.suspects?.length || 3} SUSPETOS
            </h2>

            {selectedCase?.suspects ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCase.suspects.map((suspect, i) => (
                  <SuspectCard
                    key={i}
                    suspect={suspect}
                    index={i}
                    suspicionLevel={suspectLevels[suspect.name] ?? 0}
                    showLevel
                    onLevelChange={(level) => handleSuspectLevelChange(suspect.name, level)}
                    isSelected={suspectLevels[suspect.name] > 0}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon="👤" title="Sem Suspeitos" message="Este caso não tem suspeitos registrados." />
            )}
          </div>
        )}

        {selectedCaseId && activeTab === 'anotacoes' && (
          <div className="animate-fade-in">
            <h2 className="font-typewriter text-gold text-sm tracking-widest mb-4">
              📝 ANOTAÇÕES PESSOAIS
            </h2>
            <p className="text-paperDim text-xs mb-4">
              Suas anotações são salvas automaticamente para o caso #{String(selectedCaseId).padStart(2, '0')}
            </p>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Suas anotações sobre o caso, observações, detalhes importantes..."
              className="w-full h-80 bg-noir border border-gray-700 text-paper px-4 py-3 rounded-lg focus:border-gold outline-none text-sm leading-relaxed resize-y font-serif"
            />
            <div className="mt-2 text-right text-paperDim text-xs">
              {notes.length} caracteres
            </div>
          </div>
        )}

        {selectedCaseId && activeTab === 'hipoteses' && (
          <div className="animate-fade-in">
            <h2 className="font-typewriter text-gold text-sm tracking-widest mb-4">
              💡 SUA HIPÓTESE
            </h2>
            <p className="text-paperDim text-xs mb-4">
              Qual é sua teoria sobre quem cometeu o crime? Suas anotações são salvas automaticamente.
            </p>

            {/* Hypothesis template */}
            <div className="mb-4 p-4 bg-noir2 border border-gray-800 rounded-lg">
              <div className="text-paperDim text-xs font-typewriter tracking-wider mb-2">ESTRUTURA SUGERIDA:</div>
              <div className="space-y-1.5 text-paperDim text-xs">
                <p>1. Quem eu acho que foi o criminoso?</p>
                <p>2. Qual foi o motivo?</p>
                <p>3. Quais pistas comprovam minha teoria?</p>
                <p>4. O que ainda não faz sentido?</p>
              </div>
            </div>

            <textarea
              value={hypothesis}
              onChange={handleHypothesisChange}
              placeholder="Minha hipótese é que... O criminoso é X porque..."
              className="w-full h-64 bg-noir border border-gray-700 text-paper px-4 py-3 rounded-lg focus:border-gold outline-none text-sm leading-relaxed resize-y font-serif"
            />
            <div className="mt-2 text-right text-paperDim text-xs">
              {hypothesis.length} caracteres
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
