import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import cases from '../data/cases.json'

const VOICE_SPEEDS = [
  { label: '0.7x', value: 0.7 },
  { label: '1x', value: 1.0 },
  { label: '1.3x', value: 1.3 },
  { label: '1.7x', value: 1.7 },
]

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
  const caseData = Array.isArray(allCases)
    ? allCases.find(c => String(c.id) === String(caseId))
    : (allCases.cases?.find(c => String(c.id) === String(caseId)) || allCases.cases?.[0])

  const gameRef = useRef(null)
  const [step, setStep] = useState('intro')
  const [selectedChar, setSelectedChar] = useState(null)
  const [revealedClues, setRevealedClues] = useState([])
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [voteLocked, setVoteLocked] = useState(false)
  const [result, setResult] = useState(null)
  const [audioVol, setAudioVol] = useState(0.5)
  const [typewriterDone, setTypewriterDone] = useState(false)
  const [bgmOn, setBgmOn] = useState(true)

  // TTS State
  const [availableVoices, setAvailableVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [narrationSpeed, setNarrationSpeed] = useState(1.0)
  const [isNarrating, setIsNarrating] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [imgError, setImgError] = useState({})

  const synthRef = useRef(window.speechSynthesis)
  const utteranceRef = useRef(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices()
      if (voices.length > 0) {
        setAvailableVoices(voices)
        // Prefer pt-BR voice, fallback to any Portuguese or default
        const ptBr = voices.find(v => v.lang === 'pt-BR')
        const pt = voices.find(v => v.lang.startsWith('pt'))
        const en = voices.find(v => v.lang.startsWith('en'))
        setSelectedVoice(ptBr || pt || en || voices[0])
      }
    }
    loadVoices()
    synthRef.current.onvoiceschanged = loadVoices
    return () => { synthRef.current.cancel() }
  }, [])

  const stopNarration = () => {
    synthRef.current.cancel()
    setIsNarrating(false)
  }

  const narrate = useCallback((text) => {
    if (!ttsEnabled || !selectedVoice || !text) return
    stopNarration()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = selectedVoice
    utterance.rate = narrationSpeed
    utterance.pitch = 1
    utterance.lang = 'pt-BR'
    utterance.onstart = () => setIsNarrating(true)
    utterance.onend = () => setIsNarrating(false)
    utterance.onerror = () => setIsNarrating(false)
    utteranceRef.current = utterance
    synthRef.current.speak(utterance)
  }, [ttsEnabled, selectedVoice, narrationSpeed])

  // Narrate when step changes
  useEffect(() => {
    if (!ttsEnabled) return
    if (step === 'intro') {
      narrate(`Caso número ${caseData.id}. ${caseData.title}. ${caseData.crime}`)
    } else if (step === 'case') {
      narrate(`Dossiê oficial. A vítima é ${caseData.victim}. ${caseData.crime}`)
    } else if (step === 'clues') {
      narrate('Colete as evidências. Clique nas pastas para revelar as pistas.')
    } else if (step === 'suspects') {
      narrate('Analise os suspeitos. Quem foi o criminoso? Selecione e confirme seu voto.')
    } else if (step === 'result' && result === 'correct') {
      narrate(`Parabéns! Caso resolvido! O criminoso era ${caseData.suspects[0].name}. ${caseData.solution}`)
    } else if (step === 'result' && result === 'wrong') {
      narrate(`Criminoso escapou! O verdadeiro criminoso era ${caseData.suspects[0].name}. ${caseData.solution}`)
    }
  }, [step, ttsEnabled, caseData, result, narrate])

  // Cleanup on unmount
  useEffect(() => () => { synthRef.current.cancel() }, [])

  useEffect(() => {
    startAmbient?.('rain')
    return () => { stopAmbient?.() }
  }, [])

  useEffect(() => { setAmbientVolume?.(audioVol) }, [audioVol])

  const nextStep = useCallback((targetStep) => {
    const idx = STEPS.indexOf(targetStep)
    const currentIdx = STEPS.indexOf(step)
    if (idx > currentIdx) {
      if (targetStep === 'clues') playSiren?.()
      if (targetStep === 'vote') playVoteLock?.()
      if (targetStep === 'result') {
        const correct = selectedSuspect === caseData.suspects[0].name
        setResult(correct ? 'correct' : 'wrong')
        if (correct) playVictory?.()
        else playDramaticSting?.()
      }
      setStep(targetStep)
    }
  }, [step, selectedSuspect, caseData])

  const revealClue = (clueIdx) => {
    if (!revealedClues.includes(clueIdx)) {
      setRevealedClues([...revealedClues, clueIdx])
      playTypewriter?.()
      if (ttsEnabled) {
        const clueTexts = [
          'Laudo Pericial: Vestígios indicam contato entre a vítima e o primeiro suspeito.',
          'Registro de Chamadas: A vítima ligou para o segundo sospechoso antes de morrer.',
          'Depoimento: Um vizinho viu alguém fledendo da cena do crime.',
        ]
        narrate(clueTexts[clueIdx])
      }
    }
  }

  const handleVote = () => {
    if (!selectedSuspect || voteLocked) return
    setVoteLocked(true)
    playVoteLock?.()
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
        playTypewriter?.()
        i++
      } else {
        clearInterval(interval)
        setTypewriterDone(true)
      }
    }, 30)
    return () => clearInterval(interval)
  }

  const criminalIdx = 0

  const handleImgError = (key) => {
    setImgError(prev => ({ ...prev, [key]: true }))
  }

  const caseImg = !imgError[`intro-${caseData.id}`]
    ? (caseData.imageUrl || `https://picsum.photos/seed/case${caseData.id}/800/450`)
    : `https://picsum.photos/seed/case${caseData.id}/800/450`

  const dossierImg = !imgError[`dossier-${caseData.id}`]
    ? (caseData.dossierImageUrl || `https://picsum.photos/seed/dossier${caseData.id}/800/450`)
    : `https://picsum.photos/seed/dossier${caseData.id}/800/450`

  return (
    <div className="min-h-screen bg-noir text-paper">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/jogar" className="text-paperDim hover:text-gold transition-colors text-sm">← Casos</Link>
          <div className="flex-1 text-center">
            <span className="font-typewriter text-gold text-sm tracking-widest">
              CASO #{String(caseData.id).padStart(2, '0')} · {caseData.theme}
            </span>
          </div>

          {/* TTS Controls */}
          <div className="flex items-center gap-1">
            {/* TTS Toggle */}
            <button
              onClick={() => {
                if (ttsEnabled) { stopNarration(); setTtsEnabled(false) }
                else setTtsEnabled(true)
              }}
              className={`text-xs px-2 py-1 rounded border transition-all ${ttsEnabled ? 'border-gold text-gold' : 'border-gray-700 text-paperDim hover:border-gray-500'}`}
              title="Narrar caso com voz"
            >
              🎙️
            </button>

            {/* Voice selector */}
            {ttsEnabled && (
              <>
                {/* Play/Pause */}
                <button
                  onClick={() => isNarrating ? stopNarration() : narrate(caseData.crime)}
                  className="text-xs px-2 py-1 rounded border border-gold text-gold hover:bg-gold/10 transition-all"
                  title={isNarrating ? 'Parar' : 'Narrar'}
                >
                  {isNarrating ? '⏹' : '▶'}
                </button>

                {/* Speed */}
                <select
                  value={narrationSpeed}
                  onChange={e => setNarrationSpeed(parseFloat(e.target.value))}
                  className="bg-noir border border-gray-700 text-paperDim text-xs px-1 py-1 rounded outline-none cursor-pointer"
                  title="Velocidade da voz"
                >
                  {VOICE_SPEEDS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                {/* Voice */}
                <select
                  value={selectedVoice?.name || ''}
                  onChange={e => {
                    const v = availableVoices.find(x => x.name === e.target.value)
                    if (v) setSelectedVoice(v)
                  }}
                  className="bg-noir border border-gray-700 text-paperDim text-xs px-1 py-1 rounded outline-none cursor-pointer max-w-[100px] truncate"
                  title="Voz da narração"
                >
                  {availableVoices.slice(0, 8).map(v => (
                    <option key={v.name} value={v.name}>{v.name.split(' ')[0]}</option>
                  ))}
                </select>
              </>
            )}

            {/* Volume */}
            <span className="text-paperDim text-xs ml-1">🔊</span>
            <input type="range" min="0" max="1" step="0.1" value={audioVol}
              onChange={e => setAudioVol(parseFloat(e.target.value))}
              className="w-14 accent-gold" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* STEP 0: INTRO */}
        {step === 'intro' && (
          <div className="text-center animate-fade-in">
            {/* Case Image */}
            <div className="relative rounded-xl overflow-hidden mb-6 max-w-lg mx-auto border border-gray-800 shadow-2xl">
              <img
                src={caseImg}
                alt={caseData.title}
                className="w-full h-56 object-cover"
                onError={() => handleImgError(`intro-${caseData.id}`)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/90 via-noir/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="text-4xl mb-1">🕵️</div>
                <h1 className="font-typewriter text-gold text-xl leading-tight">{caseData.title}</h1>
                <p className="text-paperDim text-sm">{caseData.location}</p>
              </div>
              {/* Theme badge */}
              <div className="absolute top-3 right-3">
                <span className={`theme-badge theme-${caseData.theme}`}>{caseData.theme}</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="case-file p-6 mb-6 max-w-lg mx-auto text-left">
              <p className="text-paper italic leading-relaxed text-sm">{caseData.synopsis || caseData.crime}</p>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                className="btn-primary text-lg px-8 py-3"
                onClick={() => nextStep('character')}
              >
                ASSUMIR ESTE CASO →
              </button>
              {ttsEnabled && (
                <button
                  onClick={() => narrate(`${caseData.title}. ${caseData.synopsis || caseData.crime}`)}
                  className="btn-outline text-lg px-6 py-3"
                >
                  {isNarrating ? '⏹ Parar' : '▶ Ouvir Narrativa'}
                </button>
              )}
            </div>
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

            {/* Dossier Image */}
            <div className="rounded-xl overflow-hidden mb-6 max-w-2xl mx-auto border border-gray-800 shadow-xl">
              <img
                src={dossierImg}
                alt="Cena do crime"
                className="w-full h-48 object-cover"
                onError={() => handleImgError(`dossier-${caseData.id}`)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/80 to-transparent" />
              <div className="relative bg-noir2/80 backdrop-blur px-6 py-3 border-t border-gray-800">
                <span className="font-typewriter text-gold text-sm tracking-widest">📋 DOSSIÊ OFICIAL — CASO #{String(caseData.id).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="case-file p-6 mb-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-crimson font-typewriter text-xs mb-1">A VÍTIMA</div>
                  <p className="text-paper text-sm">{caseData.victim}</p>
                </div>
                <div>
                  <div className="text-gold font-typewriter text-xs mb-1">LOCAL</div>
                  <p className="text-paper text-sm">{caseData.location}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-crimson font-typewriter text-xs mb-1">O CRIME</div>
                <p className="text-paper italic text-sm leading-relaxed">{caseData.crime}</p>
              </div>

              <div>
                <div className="text-gold font-typewriter text-xs mb-2">OS {caseData.suspects.length} SUSPETOS</div>
                <div className="grid grid-cols-2 gap-2">
                  {caseData.suspects.map((s, i) => (
                    <div key={i} className="bg-noir border border-gray-700 rounded px-3 py-2 text-sm text-paper flex items-center gap-2">
                      <span className="text-paperDim text-xs">{i + 1}.</span>
                      {s.name}
                      {selectedChar?.id === 'criminal' && i === criminalIdx && (
                        <span className="ml-auto text-crimson text-xs font-typewriter">VOCÊ</span>
                      )}
                    </div>
                  ))}
                </div>
                {selectedChar?.id === 'criminal' && (
                  <div className="mt-3 bg-crimson/10 border border-crimson/30 rounded p-3 text-xs text-paperDim">
                    🎭 Lembre-se: você é o criminoso. Jogue a culpa em {caseData.suspects[1] ? caseData.suspects[1].name : 'outro'} ou {caseData.suspects[2] ? caseData.suspects[2].name : 'outro'}.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button className="btn-primary" onClick={() => nextStep('clues')}>
                COLETAR EVIDÊNCIAS →
              </button>
              {ttsEnabled && (
                <button
                  onClick={() => narrate(`Dossiê oficial. A vítima é ${caseData.victim}. ${caseData.crime}`)}
                  className="btn-outline"
                >
                  {isNarrating ? '⏹ Parar Narração' : '▶ Ouvir Dossiê'}
                </button>
              )}
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
                { idx: 0, label: '📁 LAUDO PERICIAL', text: `Análise técnica do local em ${caseData.location}. vestígios indicam contato físico entre a vítima e ${caseData.suspects[0].name}.` },
                { idx: 1, label: '📁 REGISTRO DE CHAMADAS', text: `Celular da vítima: última chamada às 23h47 para ${caseData.suspects[1] ? caseData.suspects[1].name : 'um número desconhecido'}. Nenhuma resposta.` },
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
                A investigação inicial apontou para {caseData.suspects[1] ? caseData.suspects[1].name : 'outro suspeito'}, mas os detalhes não batem. Há algo errado com esse testemunho.
              </p>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
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
                  onClick={() => setSelectedSuspect(s.name)}
                  className={`case-file flex items-center gap-4 p-4 cursor-pointer transition-all ${
                    selectedSuspect === s.name ? 'border-gold shadow-lg shadow-gold/10' : 'hover:border-gray-600'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-typewriter ${
                    selectedSuspect === s.name ? 'bg-gold text-noir' : 'bg-noir border border-gray-600 text-paperDim'
                  }`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-paper text-sm font-typewriter">{s.name}</div>
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
                  {selectedSuspect === s.name && (
                    <span className="text-gold text-xl">✓</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
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
                  Você identificou corretamente: <span className="text-green-400 font-typewriter">{caseData.suspects[0].name}</span>
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
                  O verdadeiro criminoso era: <span className="text-crimson font-typewriter">{caseData.suspects[0].name}</span>
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
