import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import cases from '../data/cases.json'
import {
  startAmbient, stopAmbient, playSiren, playVoteLock,
  playDramaticSting, playVictory, playClick
} from '../lib/audio'

// ── Constants ──────────────────────────────────────────────────────────────
const SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
const CHARACTERS = [
  { id: 'criminal', emoji: '🎭', name: 'Criminoso', color: '#c41e3a', desc: 'Você é o criminoso. Não seja descoberto!' },
  { id: 'detective', emoji: '🔍', name: 'Detetive', color: '#c9a84c', desc: 'Use as pistas para encontrar o criminoso.' },
  { id: 'witnessA', emoji: '👁️', name: 'Testemunha A', color: '#5dade2', desc: 'Você viu algo naquela noite.' },
  { id: 'witnessB', emoji: '🗣️', name: 'Testemunha B', color: '#5dade2', desc: 'Você ouviu sons estranhos.' },
  { id: 'family', emoji: '💔', name: 'Família', color: '#9b59b6', desc: 'Você conhecia a vítima profundamente.' },
]

// ── Mock data store (localStorage-persisted, works across tabs) ────────────
const MP_STORAGE_KEY = 'mp_mock_rooms'

function getMockRooms() {
  try {
    const raw = localStorage.getItem(MP_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveMockRooms(rooms) {
  try {
    // Clean up rooms older than 2 hours
    const cutoff = Date.now() - 2 * 60 * 60 * 1000
    const cleaned = {}
    for (const [code, room] of Object.entries(rooms)) {
      if (new Date(room.createdAt).getTime() > cutoff) {
        cleaned[code] = room
      }
    }
    localStorage.setItem(MP_STORAGE_KEY, JSON.stringify(cleaned))
  } catch {}
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no confusing O/0/I/1
  let code = ''
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ── Toast helper ─────────────────────────────────────────────────────────
let toastId = 0

// ── Main Component ────────────────────────────────────────────────────────
export default function Multiplayer() {
  const [view, setView] = useState('landing') // landing | lobby | game | result
  const [socket, setSocket] = useState(null)
  const [myId, setMyId] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [hostId, setHostId] = useState(null)
  const [players, setPlayers] = useState([])
  const [phase, setPhase] = useState('lobby')
  const [phaseLabel, setPhaseLabel] = useState('Sala de Espera')
  const [error, setError] = useState(null)
  const [caseData, setCaseData] = useState(null)
  const [myChar, setMyChar] = useState(null)
  const [criminalIdx, setCriminalIdx] = useState(0)
  const [votedCount, setVotedCount] = useState(0)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [voteEndsAt, setVoteEndsAt] = useState(null)
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [voteLocked, setVoteLocked] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedCaseId, setSelectedCaseId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [joinCode, setJoinCode] = useState(() => {
    // Check if coming from /sala/:code deep link
    try {
      const stored = localStorage.getItem('mp_join_code')
      if (stored) {
        localStorage.removeItem('mp_join_code')
        return stored
      }
    } catch {}
    return ''
  })
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  // Track if we have a pending deep-link join (code pre-filled from /sala/:code)
  const pendingJoinCode = useRef(joinCode || '')
  const [toast, setToast] = useState(null) // { id, message, type }
  const [loading, setLoading] = useState(false)
  const audioStarted = useRef(false)

  // Mock mode flag — true when socket server is unavailable
  const [mockMode, setMockMode] = useState(false)

  const navigate = useNavigate()
  const allCases = cases.cases || cases

  useEffect(() => {
    startAmbient('rain')
    return () => { stopAmbient() }
  }, [])

  // ── Toast auto-dismiss ────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (message, type = 'success') => {
    setToast({ id: ++toastId, message, type })
  }

  // ── Socket setup (optional — falls back to mock mode) ─────────────────
  useEffect(() => {
    let s = null
    try {
      s = io(SERVER_URL, { reconnection: false, timeout: 4000 })
      s.on('connect', () => {
        setSocket(s)
        setMockMode(false)
      })
      s.on('connect_error', () => {
        // Server not available → use mock mode
        setMockMode(true)
      })
    } catch {
      setMockMode(true)
    }
    return () => { try { s?.disconnect() } catch {} }
  }, [])

  // ── Auto-join from deep link (/sala/:code) ───────────────────────────
  useEffect(() => {
    if (pendingJoinCode.current && pendingJoinCode.current.length >= 4) {
      const code = pendingJoinCode.current
      setActiveTab('join')
      // If player already has a name saved, auto-join after a short delay
      try {
        const savedName = localStorage.getItem('mp_player_name')
        if (savedName && savedName.trim()) {
          setPlayerName(savedName.trim())
          setTimeout(() => joinRoom(code, savedName.trim()), 600)
        } else {
          setActiveTab('join')
        }
      } catch {
        setActiveTab('join')
      }
    }
  }, [mockMode]) // re-run when mockMode is resolved

  // ── Actions ─────────────────────────────────────────────────────────────
  const createRoom = useCallback((name, caseId) => {
    setLoading(true)
    setError(null)
    try { localStorage.setItem('mp_player_name', name) } catch {}

    if (mockMode || !socket) {
      // ── MOCK MODE: create room locally ──────────────────────────────
      setTimeout(() => {
        const code = generateRoomCode()
        const resolvedCaseId = caseId || Math.floor(Math.random() * Math.min(allCases.length, 50)) + 1
        const cData = allCases.find(c => String(c.id) === String(resolvedCaseId)) || allCases[0]
        const pid = 'p_' + Date.now().toString(36)

        const room = {
          code,
          creator: name,
          caseId: resolvedCaseId,
          caseData: cData,
          maxPlayers: 5,
          status: 'waiting',
          players: [{
            id: pid,
            name,
            role: 'host',
            charEmoji: '👑',
            charName: 'Host',
            isReady: true,
            joinedAt: new Date().toISOString(),
          }],
          createdAt: new Date().toISOString(),
        }

        mockRooms.set(code, room)
        saveMockRooms(getMockRooms()) // persist to localStorage
        setMyId(pid)
        setRoomId(code)
        setHostId(pid)
        setPlayers(room.players)
        setCaseData(cData)
        setView('lobby')
        setLoading(false)
        showToast('Sala criada com sucesso!')
        playClick()
      }, 600) // simulate network delay
      return
    }

    // ── REAL SOCKET MODE ───────────────────────────────────────────────
    socket.emit('create_room', { playerName: name, caseId: parseInt(caseId) }, (res) => {
      setLoading(false)
      if (res.success) {
        setMyId(res.playerId)
        setRoomId(res.roomId)
        setHostId(res.playerId)
        setPlayers(res.room.players)
        setView('lobby')
        showToast('Sala criada com sucesso!')
      } else {
        setError(res.error || 'Erro ao criar sala.')
      }
    })
  }, [socket, mockMode])

  const joinRoom = useCallback((code, name) => {
    setLoading(true)
    setError(null)
    try { localStorage.setItem('mp_player_name', name) } catch {}

    if (mockMode || !socket) {
      // ── MOCK MODE: join local room ───────────────────────────────────
      setTimeout(() => {
        const rooms = getMockRooms()
        const room = rooms[code.toUpperCase()]
        if (!room) {
          setLoading(false)
          setError('Sala não encontrada. Verifique o código e tente novamente.')
          return
        }
        if (room.players.length >= room.maxPlayers) {
          setLoading(false)
          setError('Esta sala está cheia. Máximo de 5 jogadores.')
          return
        }
        if (room.status !== 'waiting') {
          setLoading(false)
          setError('O jogo nesta sala já começou.')
          return
        }

        const pid = 'p_' + Date.now().toString(36)
        const player = {
          id: pid,
          name,
          role: 'player',
          charEmoji: '👤',
          charName: 'Jogador',
          isReady: true,
          joinedAt: new Date().toISOString(),
        }
        room.players.push(player)
        rooms[code.toUpperCase()] = room
        saveMockRooms(rooms) // persist updated room with new player

        setMyId(pid)
        setRoomId(code.toUpperCase())
        setHostId(room.players[0].id)
        setPlayers([...room.players])
        setCaseData(room.caseData)
        setView('lobby')
        setLoading(false)
        showToast(`Entrou na sala ${code.toUpperCase()}!`)
        playClick()
      }, 500)
      return
    }

    // ── REAL SOCKET MODE ───────────────────────────────────────────────
    socket.emit('join_room', { roomId: code, playerName: name }, (res) => {
      setLoading(false)
      if (res.success) {
        setMyId(res.playerId)
        setRoomId(res.roomId)
        setHostId(res.room.hostId)
        setPlayers(res.room.players)
        setPhase(res.room.phase)
        setPhaseLabel(res.room.phaseLabel)
        setView('lobby')
        showToast('Entrou na sala!')
      } else {
        setError(res.error || 'Erro ao entrar na sala.')
      }
    })
  }, [socket, mockMode])

  const startGame = useCallback(() => {
    if (players.length < 2) {
      setError('Mínimo de 2 jogadores para iniciar.')
      return
    }

    if (mockMode || !socket) {
      // ── MOCK MODE: assign roles and start ───────────────────────────
      const criminalIndex = Math.floor(Math.random() * players.length)
      const roles = ['detective', 'witnessA', 'witnessB', 'family']
      const updatedPlayers = players.map((p, i) => {
        const role = i === criminalIndex ? 'criminal' : roles[i % roles.length]
        const charDef = CHARACTERS.find(c => c.id === role) || CHARACTERS[0]
        return {
          ...p,
          role,
          charEmoji: charDef.emoji,
          charName: charDef.name,
          isCriminal: i === criminalIndex,
        }
      })

      const myPlayer = updatedPlayers.find(p => p.id === myId)
      const myCharDef = CHARACTERS.find(c => c.id === myPlayer.role) || CHARACTERS[0]

      setPlayers(updatedPlayers)
      setMyChar({ ...myCharDef, isCriminal: myPlayer.isCriminal })
      setCriminalIdx(criminalIndex)
      setPhase('character')
      setPhaseLabel('Distribuição de Papéis')
      setView('game')

      if (myPlayer.isCriminal) playDramaticSting()
      else playClick()
      showToast('Partida iniciada!')
      return
    }

    socket.emit('start_game', { playerId: myId }, (res) => {
      if (!res.success) setError(res.error || 'Não foi possível iniciar.')
    })
  }, [socket, mockMode, players, myId])

  const castVote = useCallback((suspectIndex) => {
    if (voteLocked) return
    setSelectedSuspect(suspectIndex)
    setVoteLocked(true)
    playVoteLock()

    if (mockMode || !socket) {
      // ── MOCK MODE: resolve vote locally ──────────────────────────────
      setTimeout(() => {
        const correct = suspectIndex === criminalIdx
        setResult({
          correct,
          criminalName: caseData.suspects[criminalIdx]?.name || 'Desconhecido',
          winnerName: caseData.suspects[suspectIndex]?.name || 'Desconhecido',
          solution: caseData.solution,
          allVotes: players.map(p => ({
            name: p.name,
            vote: suspectIndex === criminalIdx && p.id === myId
              ? caseData.suspects[suspectIndex].name
              : caseData.suspects[Math.floor(Math.random() * caseData.suspects.length)].name,
            isCriminal: p.isCriminal,
          })),
        })
        setView('result')
        if (correct) playVictory()
        else playDramaticSting()
      }, 1200)
      return
    }

    socket.emit('cast_vote', { playerId: myId, suspectIndex }, (res) => {
      if (!res.success) {
        setVoteLocked(false)
        setError(res.error)
      }
    })
  }, [socket, mockMode, voteLocked, myId, criminalIdx, caseData, players])

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast(`${label} copiado!`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      showToast(`${label} copiado!`)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `Vamos jogar Casal Investigador Game comigo? Entre na minha sala: ${roomId}. Acesse: ${window.location.origin}/sala/${roomId}`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  const getInviteLink = () => `${window.location.origin}/sala/${roomId}`

  const isHost = myId === hostId

  // ── Landing ─────────────────────────────────────────────────────────────
  if (view === 'landing') return <LandingView
    createRoom={createRoom}
    joinRoom={joinRoom}
    playerName={playerName}
    setPlayerName={setPlayerName}
    joinCode={joinCode}
    setJoinCode={setJoinCode}
    selectedCaseId={selectedCaseId}
    setSelectedCaseId={setSelectedCaseId}
    error={error}
    setError={setError}
    loading={loading}
    toast={toast}
    mockMode={mockMode}
    initialTab={activeTab}
  />

  // ── Lobby ───────────────────────────────────────────────────────────────
  if (view === 'lobby') return (
    <LobbyView
      roomId={roomId}
      players={players}
      myId={myId}
      hostId={hostId}
      isHost={isHost}
      copied={copied}
      error={error}
      startGame={startGame}
      copyToClipboard={copyToClipboard}
      shareWhatsApp={shareWhatsApp}
      getInviteLink={getInviteLink}
      caseData={caseData}
      mockMode={mockMode}
      navigate={navigate}
    />
  )

  // ── Game ───────────────────────────────────────────────────────────────
  if (view === 'game') return (
    <GameView
      caseData={caseData}
      myChar={myChar}
      players={players}
      phase={phase}
      phaseLabel={phaseLabel}
      votedCount={votedCount}
      totalPlayers={totalPlayers}
      voteEndsAt={voteEndsAt}
      selectedSuspect={selectedSuspect}
      voteLocked={voteLocked}
      castVote={castVote}
      criminalIdx={criminalIdx}
      isHost={isHost}
      myId={myId}
      mockMode={mockMode}
      advancePhase={(targetPhase) => {
        setPhase(targetPhase)
        if (targetPhase === 'case') setPhaseLabel('Dossiê do Caso')
        if (targetPhase === 'clues') { setPhaseLabel('Coleta de Evidências'); playSiren() }
        if (targetPhase === 'suspects') setPhaseLabel('Análise dos Suspeitos')
        if (targetPhase === 'vote') { setPhaseLabel('Votação'); playVoteLock() }
      }}
    />
  )

  // ── Result ─────────────────────────────────────────────────────────────
  if (view === 'result') return (
    <ResultView result={result} roomId={roomId} myId={myId} myChar={myChar} />
  )

  return null
}

// ════════════════════════════════════════════════════════════════════════════
//  LANDING VIEW — Create / Join tabs
// ════════════════════════════════════════════════════════════════════════════

function LandingView({
  createRoom, joinRoom, playerName, setPlayerName,
  joinCode, setJoinCode, selectedCaseId, setSelectedCaseId,
  error, setError, loading, toast, mockMode, initialTab
}) {
  const [tab, setTab] = useState(initialTab || 'create')
  const shuffled = useRef([...cases.cases || cases].sort(() => Math.random() - 0.5).slice(0, 10))

  return (
    <div className="min-h-screen bg-noir">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors text-sm">← Voltar</Link>
          <h1 className="font-typewriter text-gold tracking-widest text-lg flex items-center gap-2">
            👥 MULTIPLAYER
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-10 pb-20">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👥</div>
          <h2 className="font-typewriter text-gold text-2xl mb-2 tracking-widest">JOGUE COM AMIGOS</h2>
          <p className="text-paperDim text-sm leading-relaxed max-w-sm mx-auto">
            Crie uma sala, compartilhe o convite e descubra quem está escondendo a verdade.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'create', label: '🔗 CRIAR SALA', sub: 'Crie uma sala privada e convide de 2 a 5 jogadores.' },
            { key: 'join', label: '🚪 ENTRAR EM SALA', sub: 'Digite o código recebido para entrar na investigação.' },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setError(null) }}
              className={`flex-1 py-3 px-2 text-xs font-typewriter tracking-wider rounded transition-all ${
                tab === t.key
                  ? 'bg-gold text-noir shadow-lg shadow-gold/20'
                  : 'bg-noir2 border border-gray-700 text-paperDim hover:border-gold/50'
              }`}>
              <span className="block text-sm">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab subtitle */}
        <p className="text-paperDim text-xs text-center mb-4 -mt-2">
          {tab === 'create' ? 'Crie uma sala privada e convide de 2 a 5 jogadores.' : 'Digite o código recebido para entrar na investigação.'}
        </p>

        {/* Form */}
        <div className="case-file p-6">
          {/* Name field */}
          <div className="mb-4">
            <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">SEU NOME</label>
            <input
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              className="w-full bg-noir border border-gray-700 text-paper px-4 py-2.5 rounded focus:border-gold outline-none text-sm placeholder:text-gray-600"
              placeholder="Ex: Detetive Marcondes"
              maxLength={20}
              autoFocus
            />
          </div>

          {/* CREATE TAB */}
          {tab === 'create' && (
            <>
              <div className="mb-5">
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">ESCOLHA UM CASO</label>
                <select
                  value={selectedCaseId}
                  onChange={e => setSelectedCaseId(e.target.value)}
                  className="w-full bg-noir border border-gray-700 text-paper px-4 py-2.5 rounded focus:border-gold outline-none text-sm cursor-pointer"
                >
                  <option value="">Aleatório (surpresa!)</option>
                  {shuffled.current.map(c => (
                    <option key={c.id} value={c.id}>
                      #{String(c.id).padStart(2, '0')} — {c.title} ({c.theme})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!playerName.trim()) {
                    setError('Digite seu nome para criar uma sala.')
                    return
                  }
                  createRoom(playerName.trim(), selectedCaseId || null)
                }}
                disabled={loading || !playerName.trim()}
                className="btn-gold w-full py-3.5 text-base font-typewriter tracking-wider disabled:opacity-40 relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
                    Criando...
                  </span>
                ) : '🎮 CRIAR SALA'}
              </button>
            </>
          )}

          {/* JOIN TAB */}
          {tab === 'join' && (
            <>
              <div className="mb-5">
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1.5">CÓDIGO DA SALA</label>
                <input
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full bg-noir border border-gray-700 text-paper px-4 py-2.5 rounded focus:border-gold outline-none text-sm text-center font-mono tracking-[0.3em] uppercase placeholder:tracking-normal placeholder:font-sans"
                  placeholder="Ex: X7K2P"
                  maxLength={5}
                />
              </div>

              <button
                onClick={() => {
                  if (!playerName.trim()) {
                    setError('Digite seu nome para entrar na sala.')
                    return
                  }
                  if (!joinCode.trim() || joinCode.trim().length < 4) {
                    setError('Digite um código de sala válido (5 caracteres).')
                    return
                  }
                  joinRoom(joinCode.trim(), playerName.trim())
                }}
                disabled={loading || !playerName.trim() || joinCode.trim().length < 4}
                className="btn-gold w-full py-3.5 text-base font-typewriter tracking-wider disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
                    Entrando...
                  </span>
                ) : '🚪 ENTRAR NA SALA'}
              </button>
            </>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 text-crimson text-sm bg-crimson/10 border border-crimson/30 rounded-lg p-3 text-center">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Info footer */}
        <div className="mt-6 text-center">
          {mockMode ? (
            <div className="bg-gold/5 border border-gold/20 rounded-lg p-3">
              <p className="text-gold text-xs font-typewriter tracking-wider mb-1">📡 Modo Local Ativo</p>
              <p className="text-paperDim text-xs leading-relaxed">
                Crie uma sala, compartilhe o convite e jogue com seus amigos.
                Integração em tempo real será adicionada futuramente via Supabase Realtime.
              </p>
            </div>
          ) : (
            <p className="text-paperDim text-xs">
              🟢 Conectado ao servidor multiplayer.
            </p>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg shadow-xl text-sm font-medium animate-fade-in ${
          toast.type === 'success' ? 'bg-green-900/90 text-green-200 border border-green-700' :
          toast.type === 'error' ? 'bg-red-900/90 text-red-200 border border-red-700' :
          'bg-noir2 text-paper border border-gray-600'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  LOBBY VIEW — Room waiting area with QR Code & sharing
// ════════════════════════════════════════════════════════════════════════════

function LobbyView({
  roomId, players, myId, hostId, isHost, copied, error,
  startGame, copyToClipboard, shareWhatsApp, getInviteLink,
  caseData, mockMode, navigate
}) {
  const inviteLink = getInviteLink()
  const minPlayers = 2
  const canStart = players.length >= minPlayers

  return (
    <div className="min-h-screen bg-noir">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/multiplayer" className="text-paperDim hover:text-gold transition-colors text-sm">← Voltar</Link>
          <span className="font-typewriter text-gold text-sm tracking-widest">SALA DE ESPERA</span>
          <div className="w-16" /> {/* spacer for centering */}
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8 pb-24">

        {/* Room code card */}
        <div className="text-center mb-6">
          <div className="text-paperDim text-xs font-typewriter tracking-widest mb-1">CÓDIGO DA SALA</div>
          <div
            onClick={() => copyToClipboard(roomId, 'Código')}
            className="inline-block cursor-pointer group"
          >
            <div className="font-mono text-4xl text-gold tracking-[0.35em] select-all px-4 py-2 bg-noir border-2 border-gold/30 rounded-lg group-hover:border-gold/60 transition-colors">
              {roomId}
            </div>
            <div className="text-paperDim text-xs mt-1.5">{copied ? '✅ Copiado!' : 'Toque para copiar'}</div>
          </div>
        </div>

        {/* Case info */}
        {caseData && (
          <div className="case-file p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📋</div>
              <div>
                <div className="text-paperDim text-xs font-typewriter tracking-wider">CASO SELECIONADO</div>
                <div className="text-paper text-sm">{caseData.title}</div>
                <div className="text-paperDim text-xs mt-0.5">{caseData.theme} · Difícil</div>
              </div>
            </div>
          </div>
        )}

        {/* QR Code card */}
        <div className="case-file p-6 mb-6 text-center">
          <div className="text-gold text-sm font-typewriter tracking-widest mb-3">CONVIDE SEUS AMIGOS</div>

          {/* QR Code */}
          <div className="inline-block p-3 bg-white rounded-xl mb-4">
            <QRCodeSVG
              value={inviteLink}
              size={180}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#1a1a1a"
              imageSettings={{
                src: '',
                height: 32,
                width: 32,
                excavate: false,
              }}
            />
          </div>

          <p className="text-paperDim text-xs mb-4">Escaneie o QR Code para entrar na sala</p>

          {/* Share buttons row */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => copyToClipboard(inviteLink, 'Link')}
              className="py-2.5 px-3 bg-noir border border-gray-600 text-paper text-xs rounded hover:border-gold transition-colors flex items-center justify-center gap-1.5"
            >
              📋 Copiar Link
            </button>
            <button
              onClick={() => copyToClipboard(roomId, 'Código')}
              className="py-2.5 px-3 bg-noir border border-gray-600 text-paper text-xs rounded hover:border-gold transition-colors flex items-center justify-center gap-1.5"
            >
              🔢 Copiar Código
            </button>
          </div>

          <button
            onClick={shareWhatsApp}
            className="w-full py-2.5 px-3 bg-[#25D366] text-white text-xs rounded font-medium hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-1.5"
          >
            💬 Compartilhar no WhatsApp
          </button>
        </div>

        {/* Players list */}
        <div className="case-file p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-typewriter text-gold tracking-widest">
              JOGADORES ({players.length}/5)
            </div>
            {!canStart && (
              <span className="text-paperDim text-xs">Mínimo: {minPlayers}</span>
            )}
          </div>

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const p = players[i]
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2.5 rounded border ${
                    p ? 'bg-noir border-gray-800' : 'border-dashed border-gray-800 opacity-40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${
                    p ? 'bg-gold/10' : ''
                  }`}>
                    {p ? (p.charEmoji || '👤') : '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    {p ? (
                      <>
                        <div className="text-paper text-sm truncate flex items-center gap-1.5">
                          {p.name}
                          {p.id === myId && (
                            <span className="text-gold text-xs font-typewriter">(você)</span>
                          )}
                          {p.id === hostId && (
                            <span className="text-gold text-xs">👑</span>
                          )}
                        </div>
                        <div className="text-paperDim text-xs">{p.charName || 'Aguardando...'}</div>
                      </>
                    ) : (
                      <div className="text-paperDim text-sm italic">Aguardando jogador...</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-crimson text-sm bg-crimson/10 border border-crimson/30 rounded-lg p-3 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Start button (host only) */}
        {isHost ? (
          <button
            onClick={startGame}
            disabled={!canStart}
            className="btn-gold w-full py-4 text-base font-typewriter tracking-wider disabled:opacity-40"
          >
            {canStart
              ? `🎮 INICIAR PARTIDA (${players.length} jogadores)`
              : `⏳ AGUARDANDO JOGADORES... (${players.length}/${minPlayers})`
            }
          </button>
        ) : (
          <div className="text-center bg-noir2 border border-gray-700 rounded-lg p-4">
            <p className="text-paperDim text-sm">⏳ Aguardando o host iniciar a partida...</p>
            <p className="text-paperDim text-xs mt-1">
              Jogadores na sala: <span className="text-gold font-typewriter">{players.length}/{5}</span>
            </p>
          </div>
        )}

        {/* Mock mode notice */}
        {mockMode && (
          <div className="mt-4 text-center">
            <p className="text-paperDim text-xs leading-relaxed">
              🔒 Modo de teste local. Integração em tempo real será adicionada futuramente.
            </p>
          </div>
        )}

        {/* Quick actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => copyToClipboard(inviteLink, 'Convite')}
            className="flex-1 py-2 text-xs text-paperDim border border-gray-700 rounded hover:border-gold/50 transition-colors"
          >
            📋 Copiar Convite
          </button>
          <button
            onClick={shareWhatsApp}
            className="flex-1 py-2 text-xs text-paperDim border border-gray-700 rounded hover:border-gold/50 transition-colors"
          >
            💬 WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  GAME VIEW — In-game phases (character, case, clues, suspects, vote)
// ════════════════════════════════════════════════════════════════════════════

function GameView({
  caseData, myChar, players, phase, phaseLabel,
  votedCount, totalPlayers, voteEndsAt, selectedSuspect,
  voteLocked, castVote, criminalIdx, isHost, myId,
  mockMode, advancePhase
}) {
  const [revealedClues, setRevealedClues] = useState([false, false, false])
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (!voteEndsAt) return
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, Math.floor((voteEndsAt - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(interval)
  }, [voteEndsAt])

  const revealClue = (i) => {
    setRevealedClues(prev => { const n = [...prev]; n[i] = true; return n })
    playSiren()
  }

  const clues = [
    { label: 'LAUDO PERICIAL', text: caseData ? `Vestígios indicam contato entre a vítima e ${caseData.suspects[0]?.name || 'um suspeito'}.` : '' },
    { label: 'REGISTRO DE CHAMADAS', text: caseData ? `Última ligação às 23h47 para ${caseData.suspects[1]?.name || 'número desconhecido'}.` : '' },
    { label: 'DEPOIMENTO INICIAL', text: '"Vi alguém sair correndo do prédio por volta das 23h. Usava boné escuro." — Vizinho anônimo.' },
  ]

  return (
    <div className="min-h-screen bg-noir">
      {/* Phase header */}
      <div className="bg-noir2 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-paperDim text-xs font-typewriter">FASE:</span>
            <span className="font-typewriter text-gold text-sm tracking-wider">{phaseLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            {myChar && (
              <div className="text-sm flex items-center gap-1">
                <span style={{ color: myChar.color }}>{myChar.emoji}</span>
                <span style={{ color: myChar.color }} className="hidden sm:inline text-xs">{myChar.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Criminal secret notice */}
        {myChar?.isCriminal && phase !== 'result' && (
          <div className="bg-crimson/10 border border-crimson/30 rounded-lg p-4 mb-6 text-center animate-pulse-gold">
            <div className="text-crimson font-typewriter text-sm tracking-widest mb-1">🎭 VOCÊ É O CRIMINOSO!</div>
            <div className="text-paperDim text-xs">Não seja descoberto! Jogue a culpa nos outros investigadores.</div>
          </div>
        )}

        {/* PHASE: Character assignment */}
        {phase === 'character' && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-4">{myChar?.emoji}</div>
            <h2 className="font-typewriter text-2xl mb-2" style={{ color: myChar?.color || '#c9a84c' }}>
              Você é {myChar?.name}
            </h2>
            <p className="text-paperDim text-sm mb-6 max-w-sm mx-auto">{myChar?.desc}</p>

            {/* Other players (roles hidden) */}
            <div className="case-file p-5 max-w-sm mx-auto mb-6">
              <div className="text-xs font-typewriter text-gold tracking-widest mb-3">INVESTIGADORES NA PARTIDA</div>
              <div className="space-y-2">
                {players.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-noir rounded border border-gray-800">
                    <span className="text-lg">{p.charEmoji}</span>
                    <span className="text-paper text-sm flex-1 text-left">
                      {p.name}
                      {p.id === myId && <span className="text-gold text-xs ml-1">(você)</span>}
                    </span>
                    {p.id === myId ? (
                      <span className="text-xs font-typewriter px-2 py-0.5 rounded" style={{ backgroundColor: myChar?.color + '20', color: myChar?.color }}>
                        {myChar?.name}
                      </span>
                    ) : (
                      <span className="text-paperDim text-xs">???</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => advancePhase('case')} className="btn-primary">
              Ver Dossiê do Caso →
            </button>
          </div>
        )}

        {/* PHASE: Case dossier */}
        {(caseData && phase === 'case') && (
          <div className="animate-fade-in">
            <div className="case-file p-6 mb-6">
              <div className="text-xs font-typewriter text-gold tracking-widest mb-2">// CASO #{String(caseData.id || '').padStart(2, '0')}</div>
              <h2 className="font-typewriter text-gold text-lg mb-2">{caseData.title}</h2>
              <p className="text-paperDim text-xs mb-3">📍 {caseData.location}</p>
              <p className="text-paper italic text-sm leading-relaxed mb-4">{caseData.crime}</p>
              <div className="border-t border-gray-700 pt-3">
                <div className="text-crimson text-xs font-typewriter mb-1">VÍTIMA</div>
                <p className="text-paper text-sm">{caseData.victim}</p>
              </div>
            </div>
            <div className="text-center">
              <button onClick={() => advancePhase('clues')} className="btn-primary">
                Coletar Evidências →
              </button>
            </div>
          </div>
        )}

        {/* PHASE: Clues */}
        {(phase === 'clues' || phase === 'suspects' || phase === 'vote') && (
          <div className="mb-6">
            <h3 className="font-typewriter text-gold text-sm tracking-widest mb-3">EVIDÊNCIAS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {clues.map((clue, i) => (
                <div key={i}>
                  {revealedClues[i] ? (
                    <div className="case-file p-3 border-gold/30">
                      <div className="text-xs font-typewriter text-gold mb-1">📁 {clue.label}</div>
                      <p className="text-paper text-xs leading-relaxed">{clue.text}</p>
                    </div>
                  ) : (
                    <button onClick={() => revealClue(i)}
                      className="case-file w-full p-4 text-center hover:border-gold transition-all opacity-70 hover:opacity-100">
                      <div className="text-xs text-paperDim mb-1 font-typewriter">CLIQUE PARA ABRIR</div>
                      <div className="text-2xl mb-1 opacity-40">📁</div>
                      <div className="text-xs text-paperDim">{clue.label}</div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHASE: Suspects + Vote */}
        {(phase === 'suspects' || phase === 'vote') && caseData && (
          <div className="mb-6">
            <h3 className="font-typewriter text-gold text-sm tracking-widest mb-3">SUSPETOS</h3>
            <div className="space-y-2">
              {caseData.suspects.map((s, i) => (
                <div
                  key={i}
                  onClick={() => !voteLocked && phase === 'vote' && castVote(i)}
                  className={`case-file flex items-center gap-3 p-3 cursor-pointer transition-all ${
                    !voteLocked && phase === 'vote' ? 'hover:border-gold' : ''
                  } ${selectedSuspect === i ? 'border-gold shadow-lg shadow-gold/10' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-typewriter ${
                    selectedSuspect === i ? 'bg-gold text-noir' : 'bg-noir border border-gray-600 text-paperDim'
                  }`}>{i + 1}</div>
                  <div className="flex-1 text-paper text-sm">{s.name}</div>
                  {selectedSuspect === i && <span className="text-gold text-lg">✓</span>}
                </div>
              ))}
            </div>

            {/* Vote UI */}
            {phase === 'vote' && (
              <div className="mt-4 text-center space-y-3">
                {voteLocked ? (
                  <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 text-gold text-sm font-typewriter">
                    ✅ VOTO REGISTRADO! Aguardando resultado...
                  </div>
                ) : (
                  <button
                    onClick={() => castVote(selectedSuspect)}
                    disabled={selectedSuspect === null}
                    className="btn-primary py-3 px-8 disabled:opacity-30"
                  >
                    CONFIRMAR VOTO →
                  </button>
                )}
                {timeLeft !== null && timeLeft > 0 && !voteLocked && (
                  <div className="text-paperDim text-xs">
                    ⏱️ Tempo restante: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                )}
                <div className="text-paperDim text-xs">
                  {votedCount}/{totalPlayers} votaram
                </div>
              </div>
            )}

            {/* Advance button (for non-vote phases in mock mode) */}
            {phase === 'suspects' && mockMode && (
              <div className="mt-4 text-center">
                <button onClick={() => advancePhase('vote')} className="btn-outline text-sm">
                  → Ir para Votação
                </button>
              </div>
            )}
          </div>
        )}

        {/* Phase navigation (mock mode) */}
        {phase === 'clues' && mockMode && revealedClues.every(Boolean) && (
          <div className="text-center">
            <button onClick={() => advancePhase('suspects')} className="btn-primary">
              Analisar Suspetos →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  RESULT VIEW — Vote outcome
// ════════════════════════════════════════════════════════════════════════════

function ResultView({ result, roomId, myId, myChar }) {
  const navigate = useNavigate()
  if (!result) return null

  return (
    <div className="min-h-screen bg-noir">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        {result.correct ? (
          <>
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="font-typewriter text-green-500 text-3xl mb-4 tracking-widest animate-stamp">
              CRIMINOSO IDENTIFICADO!
            </h2>
            <p className="text-paper text-lg mb-2">
              A sala votou corretamente em <span className="text-green-400 font-typewriter">{result.winnerName}</span>
            </p>
          </>
        ) : (
          <>
            <div className="text-8xl mb-6">🎭</div>
            <h2 className="font-typewriter text-crimson text-3xl mb-4 tracking-widest animate-stamp">
              CRIMINOSO ESCAPOU!
            </h2>
            <p className="text-paper text-lg mb-2">
              O criminoso era: <span className="text-crimson font-typewriter">{result.criminalName}</span>
            </p>
            {!result.correct && result.winnerName && (
              <p className="text-paperDim text-sm mb-2">A sala apontou para: {result.winnerName}</p>
            )}
            {result.tie && <p className="text-yellow-500 text-sm">Empate entre: {result.tieSuspects.join(', ')}</p>}
          </>
        )}

        {/* Votes breakdown */}
        {result.allVotes && (
          <div className="case-file p-5 mt-6 text-left max-w-sm mx-auto">
            <div className="text-xs font-typewriter text-gold tracking-widest mb-3">VOTAÇÃO FINAL</div>
            {result.allVotes.map((v, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-800 last:border-0">
                <span className="text-paper text-xs flex-1">{v.name}</span>
                <span className="text-paperDim text-xs">→</span>
                <span className={`text-xs ${v.isCriminal ? 'text-crimson font-typewriter' : 'text-paperDim'}`}>
                  {v.vote || '—'}
                  {v.isCriminal && ' ⚠️'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Solution */}
        {result.solution && (
          <div className="case-file p-5 mt-4 text-left max-w-lg mx-auto">
            <div className="text-xs font-typewriter text-gold tracking-widest mb-2">// SOLUÇÃO DO CASO</div>
            <p className="text-paper italic text-sm leading-relaxed">{result.solution}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <Link to="/multiplayer" className="btn-gold">JOGAR NOVAMENTE</Link>
          <Link to="/" className="btn-outline">PÁGINA INICIAL</Link>
        </div>
      </div>
    </div>
  )
}
