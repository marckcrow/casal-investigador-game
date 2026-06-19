import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import cases from '../data/cases.json'
import {
  startAmbient, stopAmbient, setAmbientVolume,
  playTypewriter, playStamp, playSiren, playDramaticSting,
  playClick, playVoteLock, playVictory
} from '../lib/audio'

const CHARACTERS = [
  { id: 'detective', emoji: '🔍', name: 'Detetive', color: '#c9a84c', description: 'Você é o detetive principal. Use as pistas para identificar o criminoso.' },
  { id: 'criminal', emoji: '🎭', name: 'Criminoso', color: '#c41e3a', description: 'VOCÊ é o criminoso! Não seja descoberto. Jogue a culpa nos outros.' },
  { id: 'witnessA', emoji: '👁️', name: 'Testemunha', color: '#5dade2', description: 'Você viu algo naquela noite. Use isso para ajudar a investigação.' },
  { id: 'witnessB', emoji: '🗣️', name: 'Testemunha B', color: '#5dade2', description: 'Você ouviu sons estranhos. Sua escuta pode ser crucial.' },
  { id: 'family', emoji: '💔', name: 'Família', color: '#9b59b6', description: 'Você conhecia a vítima. Seu conhecimento pode revelar motivos e inimigos.' },
]

const STEPS = ['intro', 'character', 'case', 'clues', 'suspects', 'vote', 'result']

export default function Game() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const allCases = cases.cases || cases
  const caseData = Array.isArray(allCases) ? allCases.find(c => String(c.id) === String(caseId)) : (allCases.cases?.find(c => String(c.id) === String(caseId)) || allCases.cases?.[0])
  const gameRef = useRef(null)
  const [step, setStep] = useState('intro')
  const [selectedChar, setSelectedChar] = useState(null)
  const [revealedClues, setRevealedClues] = useState([])
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [voteLocked, setVoteLocked] = useState(false)
  const [result, setResult] = useState(null) // 'correct' | 'wrong' | null
  const [audioVol, setAudioVol] = useState(0.5)
  const [typewriterDone, setTypewriterDone] = useState(false)

  // Start ambient on mount
  useEffect(() => {
    startAmbient('rain')
    return () => { stopAmbient() }
  }, [])

  useEffect(() => {
    setAmbientVolume(audioVol)
  }, [audioVol])

  const nextStep = useCallback((targetStep) => {
    const idx = STEPS.indexOf(targetStep)
    const currentIdx = STEPS.indexOf(step)
    if (idx > currentIdx) {
      if (targetStep === 'clues') playSiren()
      if (targetStep === 'vote') playVoteLock()
      if (targetStep === 'result') {
        const correct = selectedSuspect === caseData.suspects[0]
        setResult(correct ? 'correct' : 'wrong')
        if (correct) playVictory()
        else playDramaticSting()
      }
      setStep(targetStep)
    }
  }, [step, selectedSuspect, caseData])

  const revealClue = (clueIdx) => {
    if (!revealedClues.includes(clueIdx)) {
      setRevealedClues([...revealedClues, clueIdx])
      playTypewriter()
    }
  }

  const handleVote = () => {
    if (!selectedSuspect || voteLocked) return
    setVoteLocked(true)
    playVoteLock()
    setTimeout(() => nextStep('result'), 1500)
  }

  const typeText = (text, key) => {
    const el = document.getElementById(`type-${key}`)
    if (!el) return
    el.textContent = ''
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i]
        playTypewriter()
        i++
      } else {
        clearInterval(interval)
        setTypewriterDone(true)
      }
    }, 30)
    return () => clearInterval(interval)
  }

  const criminalIdx = 0 // first suspect is always the criminal in data

  return (
    <div className="min-h-screen bg-noir text-paper">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/jogar" className="text-paperDim hover:text-gold transition-colors text-sm">← Casos</Link>
          <div className="flex-1 text-center">
            <span className="font-typewriter text-gold text-sm tracking-widest">
              CASO #{String(caseData.id).padStart(2, '0')} · {caseData.theme}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-paperDim text-xs">🔊</span>
            <input type="range" min="0" max="1" step="0.1" value={audioVol}
              onChange={e => setAudioVol(parseFloat(e.target.value))}
              className="w-16 accent-gold" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* STEP 0: INTRO */}
        {step === 'intro' && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-6 animate-float">🕵️</div>
            <h1 className="font-typewriter text-gold text-2xl mb-2 tracking-widest">{caseData.title}</h1>
            <p className="text-paperDim mb-8">{caseData.location}</p>
            <div className="case-file p-6 mb-8 text-left max-w-lg mx-auto">
              <p className="text-paper italic leading-relaxed">{caseData.crime}</p>
            </div>
            <button className="btn-primary text-lg px-10 py-4 animate-pulse-gold" onClick={() => nextStep('character')}>
              ASSUMIR ESTE CASO →
            </button>
          </div>
        )}

        {/* STEP 1: CHARACTER SELECTION */}
        {step === 'character' && (
          <div className="animate-fade-in">
            <h2 className="font-typewriter text-gold text-xl mb-2 text-center tracking-widest">ESCOLHA SEU PAPEL</h2>
            <p className="text-paperDim text-center mb-8 text-sm">Cada personagem tem informações diferentes. Escolha sabiamente.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {CHARACTERS.map(char => (
                <button
                  key={char.id}
                  onClick={() => setSelectedChar(char)}
                  className={`case-file p-5 text-left transition-all ${
                    selectedChar?.id === char.id
                      ? 'border-gold shadow-lg shadow-gold/20'
                      : 'hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{char.emoji}</div>
                  <div className="font-typewriter text-gold text-sm tracking-wider mb-1">{char.name}</div>
                  <div className="text-paperDim text-xs leading-relaxed">{char.description}</div>
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                className="btn-gold text-lg px-10 py-4 disabled:opacity-30"
                disabled={!selectedChar}
                onClick={() => nextStep('case')}
              >
                CONFIRMAR PAPEL →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CASE DETAILS */}
        {step === 'case' && (
          <div className="animate-fade-in">
            {/* Selected character badge */}
            {selectedChar && (
              <div className="text-center mb-6">
                <span className="font-typewriter text-xs text-paperDim tracking-widest">VOCÊ É</span>
                <div className="text-2xl mt-1">{selectedChar.emoji} <span className="font-typewriter text-gold">{selectedChar.name}</span></div>
              </div>
            )}

            <div className="case-file p-6 mb-6">
              <div className="text-xs font-typewriter text-gold tracking-widest mb-4">// DOSSIÊ OFICIAL</div>

              <div className="mb-4">
                <div className="text-crimson font-typewriter text-xs mb-1">A VÍTIMA</div>
                <p className="text-paper text-sm">{caseData.victim}</p>
              </div>

              <div className="mb-4">
                <div className="text-crimson font-typewriter text-xs mb-1">O CRIME</div>
                <p className="text-paper italic text-sm leading-relaxed">{caseData.crime}</p>
              </div>

              <div className="mb-4">
                <div className="text-gold font-typewriter text-xs mb-1">LOCAL</div>
                <p className="text-paper text-sm">{caseData.location}</p>
              </div>

              <div>
                <div className="text-gold font-typewriter text-xs mb-2">OS {caseData.suspects.length} SUSPETOS</div>
                <div className="grid grid-cols-2 gap-2">
                  {caseData.suspects.map((s, i) => (
                    <div key={i} className="bg-noir border border-gray-700 rounded px-3 py-2 text-sm text-paper flex items-center gap-2">
                      <span className="text-paperDim text-xs">{i + 1}.</span>
                      {s}
                      {selectedChar?.id === 'criminal' && i === criminalIdx && (
                        <span className="ml-auto text-crimson text-xs font-typewriter">VOCÊ</span>
                      )}
                    </div>
                  ))}
                </div>
                {selectedChar?.id === 'criminal' && (
                  <div className="mt-3 bg-crimson/10 border border-crimson/30 rounded p-3 text-xs text-paperDim">
                    🎭 Lembre-se: você é o criminoso. Jogue a culpa em {caseData.suspects[1] || 'outro'} ou {caseData.suspects[2] || 'outro'}.
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button className="btn-primary" onClick={() => nextStep('clues')}>
                COLETAR EVIDÊNCIAS →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CLUES */}
        {step === 'clues' && (
          <div className="animate-fade-in">
            <h2 className="font-typewriter text-gold text-xl mb-2 text-center tracking-widest">🔍 EVIDÊNCIAS</h2>
            <p className="text-paperDim text-center mb-6 text-sm">Clique nas pastas para revelar as pistas disponíveis.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { idx: 0, label: '📁 LAUDO PERICIAL', text: `Análise técnica do local em ${caseData.location}. vestígios indicam contato físico entre a vítima e ${caseData.suspects[0]}.` },
                { idx: 1, label: '📁 REGISTRO DE CHAMADAS', text: `Celular da vítima: última chamada às 23h47 para ${caseData.suspects[1] || 'um número desconhecido'}. Nenhuma resposta.` },
                { idx: 2, label: '📁 DEPOIMENTO INICIAL', text: `"Vi alguém sair correndo do prédio por volta das 23h. Usava boné escuro." — Vizinho anônimo.` },
              ].map(clue => (
                <div key={clue.idx}>
                  {revealedClues.includes(clue.idx) ? (
                    <div className={`case-file p-4 border-gold/30 ${clue.idx === 0 ? 'border-crimson/30' : ''}`}>
                      <div className="text-xs font-typewriter text-gold mb-2">{clue.label}</div>
                      <p className="text-paper text-sm leading-relaxed">{clue.text}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => revealClue(clue.idx)}
                      className="case-file w-full p-8 text-center hover:border-gold transition-all"
                    >
                      <div className="text-paperDim text-xs font-typewriter tracking-wider mb-2">CLIQUE PARA ABRIR</div>
                      <div className="text-3xl mb-2 opacity-50">📁</div>
                      <div className="text-paperDim text-xs">{clue.label}</div>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Red herrings */}
            <div className="bg-noir2 border border-gray-700 rounded-lg p-4 mb-6">
              <div className="text-paperDim text-xs font-typewriter mb-2">⚠️ INFORMAÇÕES CONFLITANTES</div>
              <p className="text-paperDim text-xs italic">
                A investigação inicial apontou para {caseData.suspects[1] || 'outro suspeito'}, mas os detalhes não batem. Há algo errado com esse testemunho.
              </p>
            </div>

            <div className="text-center">
              <button
                className="btn-primary disabled:opacity-30"
                disabled={revealedClues.length < 3}
                onClick={() => nextStep('suspects')}
              >
                ANALISAR SUSPETOS →
              </button>
              {revealedClues.length < 3 && (
                <p className="text-paperDim text-xs mt-2">Revele todas as 3 pistas primeiro</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: SUSPECTS ANALYSIS */}
        {step === 'suspects' && (
          <div className="animate-fade-in">
            <h2 className="font-typewriter text-gold text-xl mb-6 text-center tracking-widest">⚖️ ANÁLISE DOS SUSPETOS</h2>

            <div className="space-y-3 mb-8">
              {caseData.suspects.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedSuspect(s)}
                  className={`case-file flex items-center gap-4 p-4 cursor-pointer transition-all ${
                    selectedSuspect === s ? 'border-gold shadow-lg shadow-gold/10' : 'hover:border-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-typewriter ${
                    selectedSuspect === s ? 'bg-gold text-noir' : 'bg-noir border border-gray-600 text-paperDim'
                  }`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-paper text-sm font-typewriter">{s}</div>
                    {i === criminalIdx && (
                      <div className="text-xs text-paperDim italic mt-1">
                        {selectedChar?.id === 'criminal'
                          ? 'Este sou eu — deflect! Diga que é inocênte.'
                          : 'Criminoso real. A evidência pesa contra esta pessoa.'}
                      </div>
                    )}
                    {i !== criminalIdx && (
                      <div className="text-xs text-paperDim italic mt-1">
                        {selectedChar?.id === 'criminal'
                          ? 'Culpe esta pessoa! Jogue a suspeita sobre ela.'
                          : 'Sem provas concretas. Apenas circumstantial.'}
                      </div>
                    )}
                  </div>
                  {selectedSuspect === s && (
                    <span className="text-gold text-xl">✓</span>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                className="btn-primary disabled:opacity-30 text-lg px-10 py-4"
                disabled={!selectedSuspect}
                onClick={() => nextStep('vote')}
              >
                CONFIRMAR VOTO →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: VOTE CONFIRMATION */}
        {step === 'vote' && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-6">⚖️</div>
            <h2 className="font-typewriter text-gold text-2xl mb-4 tracking-widest">VOTO REGISTRADO</h2>
            <div className="case-file p-6 mb-8 max-w-sm mx-auto">
              <div className="text-paperDim text-xs mb-2">Você aponta para:</div>
              <div className="text-paper font-typewriter text-xl">{selectedSuspect}</div>
            </div>
            <div className="animate-pulse-gold inline-block">
              <div className="font-typewriter text-paperDim text-sm tracking-widest mb-4">AGUARDE...</div>
            </div>
            <p className="text-paperDim text-sm">Contando votos e verificando soluções...</p>
          </div>
        )}

        {/* STEP 6: RESULT */}
        {step === 'result' && (
          <div className="animate-fade-in text-center">
            {result === 'correct' ? (
              <>
                <div className="relative inline-block mb-6">
                  <div className="text-8xl">✅</div>
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-typewriter px-2 py-0.5 rounded rotate-12">CERTO!</div>
                </div>
                <h2 className="font-typewriter text-green-500 text-3xl mb-4 tracking-widest animate-stamp">
                  CASO RESOLVIDO!
                </h2>
                <p className="text-paper text-lg mb-2">
                  Você identificou corretamente: <span className="text-green-400 font-typewriter">{caseData.suspects[0]}</span>
                </p>
                <div className="case-file p-5 mb-6 max-w-md mx-auto text-left">
                  <div className="text-xs font-typewriter text-gold mb-2">// SOLUÇÃO DO CASO</div>
                  <p className="text-paper italic text-sm leading-relaxed">{caseData.solution}</p>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link to="/jogar" className="btn-gold">JOGAR OUTRO CASO</Link>
                  <Link to="/" className="btn-outline">VER TODOS OS CASOS</Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-8xl mb-6">🎭</div>
                <h2 className="font-typewriter text-crimson text-3xl mb-4 tracking-widest animate-stamp">
                  CRIMINOSO ESCAPOU!
                </h2>
                <p className="text-paper text-lg mb-2">
                  O verdadeiro criminoso era: <span className="text-crimson font-typewriter">{caseData.suspects[0]}</span>
                </p>
                <p className="text-paperDim mb-2">Você acusou: {selectedSuspect}</p>
                <div className="case-file p-5 mb-6 max-w-md mx-auto text-left">
                  <div className="text-xs font-typewriter text-gold mb-2">// SOLUÇÃO DO CASO</div>
                  <p className="text-paper italic text-sm leading-relaxed">{caseData.solution}</p>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link to={`/jogo/${caseData.id}`} className="btn-primary">TENTAR NOVAMENTE</Link>
                  <Link to="/jogar" className="btn-outline">OUTRO CASO</Link>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
