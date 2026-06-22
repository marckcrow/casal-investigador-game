import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
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
  { id: 'family', emoji: '💔', name: 'Família', color: '#9b59b6', desc: 'Você conhecia a vítima intimately.' },
]

// ── Main Component ────────────────────────────────────────────────────────
export default function Multiplayer() {
  const [view, setView] = useState('landing') // landing | lobby | game | result
  const [socket, setSocket] = useState(null)
  const [myId, setMyId] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [hostId, setHostId] = useState(null)
  const [players, setPlayers] = useState([])
  const [phase, setPhase] = useState('lobby')
  const [phaseLabel, setPhaseLabel] = useState('🟢 Sala de Espera')
  const [error, setError] = useState(null)
  const [caseData, setCaseData] = useState(null)
  const [myChar, setMyChar] = useState(null)
  const [criminalIdx, setCriminalIdx] = useState(null)
  const [votedCount, setVotedCount] = useState(0)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [voteEndsAt, setVoteEndsAt] = useState(null)
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [voteLocked, setVoteLocked] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedCaseId, setSelectedCaseId] = useState(1)
  const [playerName, setPlayerName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [playersVoted, setPlayersVoted] = useState({}) // { playerId: voted }
  const audioStarted = useRef(false)

  useEffect(() => {
    startAmbient('rain')
    return () => { stopAmbient() }
  }, [])

  // ── Socket setup ────────────────────────────────────────────────────────
  useEffect(() => {
    const s = io(SERVER_URL, { reconnection: true, reconnectionAttempts: 5 })

    s.on('connect', () => {
      setSocket(s)
      setError(null)
    })
    s.on('connect_error', () => {
      setError(`Não foi possível conectar ao servidor. Verifique sua internet ou aguarde o servidor iniciar.`)
    })
    s.on('player_joined', ({ players: p }) => {
      setPlayers(p)
      playClick()
    })
    s.on('player_left', ({ players: p, hostId: hid }) => {
      setPlayers(p)
      setHostId(hid)
    })
    s.on('vote_update', ({ votedCount: vc, totalPlayers: tp }) => {
      setVotedCount(vc)
      setTotalPlayers(tp)
    })
    s.on('phase_change', ({ phase: p, phaseLabel: pl, voteEndsAt: ve, criminalIdx: ci }) => {
      setPhase(p)
      setPhaseLabel(pl)
      setVoteEndsAt(ve)
      setCriminalIdx(ci)
      if (p === 'clues') playSiren()
      if (p === 'vote') playVoteLock()
      if (p === 'result') {
        playVictory()
        setView('result')
      }
    })
    s.on('character_assigned', ({ charId, charEmoji, charName, charColor, isCriminal, caseData: cd, criminalIdx: ci, suspects }) => {
      const char = CHARACTERS.find(c => c.id === charId)
      setMyChar({ ...char, isCriminal })
      setCaseData({ ...cd, suspects })
      setCriminalIdx(ci)
      setView('game')
      if (isCriminal) playDramaticSting()
    })
    s.on('game_result', (data) => {
      setResult(data)
      if (data.correct) playVictory()
      else playDramaticSting()
      setView('result')
    })

    return () => s.disconnect()
  }, [])

  // ── Actions ─────────────────────────────────────────────────────────────
  const createRoom = useCallback((name, caseId) => {
    if (!socket) return
    setError(null)
    socket.emit('create_room', { playerName: name, caseId: parseInt(caseId) }, (res) => {
      if (res.success) {
        setMyId(res.playerId)
        setRoomId(res.roomId)
        setHostId(res.playerId)
        setPlayers(res.room.players)
        setView('lobby')
      } else {
        setError(res.error || 'Erro ao criar sala.')
      }
    })
  }, [socket])

  const joinRoom = useCallback((code, name) => {
    if (!socket) return
    setError(null)
    socket.emit('join_room', { roomId: code, playerName: name }, (res) => {
      if (res.success) {
        setMyId(res.playerId)
        setRoomId(res.roomId)
        setHostId(res.room.hostId)
        setPlayers(res.room.players)
        setPhase(res.room.phase)
        setPhaseLabel(res.room.phaseLabel)
        setView('lobby')
      } else {
        setError(res.error || 'Erro ao entrar na sala.')
      }
    })
  }, [socket])

  const startGame = useCallback(() => {
    if (!socket) return
    socket.emit('start_game', { playerId: myId }, (res) => {
      if (!res.success) setError(res.error || 'Não foi possível iniciar.')
    })
  }, [socket, myId])

  const advancePhase = useCallback(() => {
    if (!socket) return
    socket.emit('advance_phase', { playerId: myId }, () => {})
  }, [socket, myId])

  const castVote = useCallback((suspectIndex) => {
    if (!socket || voteLocked) return
    setSelectedSuspect(suspectIndex)
    setVoteLocked(true)
    playVoteLock()
    socket.emit('cast_vote', { playerId: myId, suspectIndex }, (res) => {
      if (!res.success) {
        setVoteLocked(false)
        setError(res.error)
      }
    })
  }, [socket, myId, voteLocked])

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isHost = myId === hostId

  // ── Landing ─────────────────────────────────────────────────────────────
  if (view === 'landing') return <LandingView
    createRoom={createRoom} joinRoom={joinRoom}
    playerName={playerName} setPlayerName={setPlayerName}
    joinCode={joinCode} setJoinCode={setJoinCode}
    selectedCaseId={selectedCaseId} setSelectedCaseId={setSelectedCaseId}
    error={error} setError={setError}
  />

  // ── Lobby ───────────────────────────────────────────────────────────────
  if (view === 'lobby') return (
    <LobbyView
      roomId={roomId} players={players} myId={myId} hostId={hostId}
      isHost={isHost} copied={copied} error={error}
      startGame={startGame} copyRoomCode={copyRoomCode}
    />
  )

  // ── Game ───────────────────────────────────────────────────────────────
  if (view === 'game') return (
    <GameView
      caseData={caseData} myChar={myChar} players={players}
      phase={phase} phaseLabel={phaseLabel}
      votedCount={votedCount} totalPlayers={totalPlayers}
      voteEndsAt={voteEndsAt} selectedSuspect={selectedSuspect}
      voteLocked={voteLocked} castVote={castVote}
      criminalIdx={criminalIdx} isHost={isHost} advancePhase={advancePhase}
      myId={myId}
    />
  )

  // ── Result ─────────────────────────────────────────────────────────────
  if (view === 'result') return (
    <ResultView result={result} roomId={roomId} myId={myId} myChar={myChar} />
  )

  return null
}

// ── Sub-views ─────────────────────────────────────────────────────────────

function LandingView({ createRoom, joinRoom, playerName, setPlayerName, joinCode, setJoinCode, selectedCaseId, setSelectedCaseId, error, setError }) {
  const [tab, setTab] = useState('create')
  const shuffled = useRef([...(cases.cases || cases)].sort(() => Math.random() - 0.5).slice(0, 10))

  return (
    <div className="min-h-screen bg-noir">
      <header className="bg-noir2 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors text-sm">← Voltar</Link>
          <h1 className="font-typewriter text-gold tracking-widest text-lg">👥 MULTIPLAYER</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👥</div>
          <h2 className="font-typewriter text-gold text-2xl mb-2 tracking-widest">JOGUE COM AMIGOS</h2>
          <p className="text-paperDim">2 a 5 jogadores · Tempo real · Um crimonoso entre vocês</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['create', 'join'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(null) }}
              className={`flex-1 py-2 text-sm font-typewriter tracking-wider rounded transition-all ${
                tab === t ? 'bg-gold text-noir' : 'bg-noir2 border border-gray-700 text-paperDim hover:border-gold'
              }`}>
              {t === 'create' ? '🔗 CRIAR SALA' : '🚪 ENTRAR EM SALA'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="case-file p-6">
          <div className="mb-4">
            <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1">SEU NOME</label>
            <input value={playerName} onChange={e => setPlayerName(e.target.value)}
              className="w-full bg-noir border border-gray-700 text-paper px-3 py-2 rounded focus:border-gold outline-none text-sm"
              placeholder="Ex: Detetive Marcondes" maxLength={20} />
          </div>

          {tab === 'create' && (
            <>
              <div className="mb-4">
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1">ESCOLHA UM CASO</label>
                <select value={selectedCaseId} onChange={e => setSelectedCaseId(e.target.value)}
                  className="w-full bg-noir border border-gray-700 text-paper px-3 py-2 rounded focus:border-gold outline-none text-sm">
                  <option value="">Aleatório (surpresa!)</option>
                  {shuffled.current.map(c => (
                    <option key={c.id} value={c.id}>#{String(c.id).padStart(2,'0')} — {c.title} ({c.theme})</option>
                  ))}
                </select>
              </div>
              <button
                className="btn-gold w-full py-3 text-base disabled:opacity-40"
                disabled={!playerName.trim()}
                onClick={() => createRoom(playerName.trim(), selectedCaseId || null)}
              >
                🎮 CRIAR SALA
              </button>
            </>
          )}

          {tab === 'join' && (
            <>
              <div className="mb-4">
                <label className="text-paperDim text-xs font-typewriter tracking-wider block mb-1">CÓDIGO DA SALA</label>
                <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full bg-noir border border-gray-700 text-paper px-3 py-2 rounded focus:border-gold outline-none text-sm text-center font-typewriter tracking-widest"
                  placeholder="Ex: X7K2P" maxLength={5} />
              </div>
              <button
                className="btn-gold w-full py-3 text-base disabled:opacity-40"
                disabled={!playerName.trim() || joinCode.trim().length < 4}
                onClick={() => joinRoom(joinCode.trim(), playerName.trim())}
              >
                🚪 ENTRAR NA SALA
              </button>
            </>
          )}

          {error && (
            <div className="mt-3 text-crimson text-sm text-center bg-crimson/10 border border-crimson/20 rounded p-2">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-paperDim text-xs">
          <p>📡 O servidor multiplayer é gratuito e está em manutenção.</p>
          <p className="mt-1">Escolha 2-5 jogadores准备好了!</p>
        </div>
      </div>
    </div>
  )
}

function LobbyView({ roomId, players, myId, hostId, isHost, copied, error, startGame, copyRoomCode }) {
  return (
    <div className="min-h-screen bg-noir">
      <header className="bg-noir2 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-4 text-center">
          <div className="font-typewriter text-gold tracking-widest text-sm">👥 SALA DE ESPERA</div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-10">
        {/* Room code */}
        <div className="text-center mb-8">
          <div className="text-paperDim text-xs font-typewriter tracking-widest mb-2">CÓDIGO DA SALA</div>
          <button onClick={copyRoomCode} className="group">
            <div className="font-typewriter text-4xl text-gold tracking-widest tracking-wider">
              {roomId}
            </div>
            <div className="text-paperDim text-xs mt-1">{copied ? '✅ Copiado!' : 'Clique para copiar'}</div>
          </button>
        </div>

        {/* Players */}
        <div className="case-file p-5 mb-6">
          <div className="text-xs font-typewriter text-gold tracking-widest mb-4">JOGADORES ({players.length}/5)</div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const p = players[i]
              return (
                <div key={i} className="flex items-center gap-3 p-2 rounded bg-noir border border-gray-800">
                  {p ? (
                    <>
                      <div className="text-lg">{p.charEmoji || '👤'}</div>
                      <div className="flex-1">
                        <div className="text-paper text-sm flex items-center gap-2">
                          {p.name}
                          {p.id === myId && <span className="text-paperDim text-xs">(você)</span>}
                          {p.id === hostId && <span className="text-gold text-xs font-typewriter">👑 HOST</span>}
                        </div>
                        <div className="text-paperDim text-xs">{p.charName || 'Aguardando...'}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg opacity-30">👤</div>
                      <div className="flex-1 text-paperDim text-sm italic">Aguardando jogador...</div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-crimson text-sm text-center bg-crimson/10 border border-crimson/20 rounded p-2">
            {error}
          </div>
        )}

        {/* Actions */}
        {isHost ? (
          <button
            className="btn-gold w-full py-4 text-base disabled:opacity-40"
            disabled={players.length < 2}
            onClick={startGame}
          >
            🎮 INICIAR JOGO {players.length < 2 ? '(mín. 2 jogadores)' : ''}
          </button>
        ) : (
          <div className="text-center text-paperDim text-sm bg-noir2 border border-gray-700 rounded p-4">
            ⏳ Aguardando o host iniciar o jogo...
          </div>
        )}

        <div className="mt-4 text-center text-paperDim text-xs">
          Compartilhe o código <span className="font-typewriter text-gold">{roomId}</span> com seus amigos!
        </div>
      </div>
    </div>
  )
}

function GameView({ caseData, myChar, players, phase, phaseLabel, votedCount, totalPlayers, voteEndsAt, selectedSuspect, voteLocked, castVote, criminalIdx, isHost, advancePhase, myId }) {
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
    { label: '📁 LAUDO PERICIAL', text: caseData ? `Vestígios indicam contato entre a vítima e ${caseData.suspects[0].name}.` : '' },
    { label: '📁 REGISTRO DE CHAMADAS', text: caseData ? `Última ligação às 23h47 para ${caseData.suspects[1] ? caseData.suspects[1].name : 'número desconhecido'}.` : '' },
    { label: '📁 DEPOIMENTO INICIAL', text: '"Vi alguém sair correndo do prédio. Usava boné escuro." — Vizinho.' },
  ]

  return (
    <div className="min-h-screen bg-noir">
      {/* Phase header */}
      <div className="bg-noir2 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-typewriter text-xs text-paperDim">FASE:</span>
            <span className="font-typewriter text-gold text-sm tracking-wider">{phaseLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            {myChar && (
              <div className="text-sm">
                <span className="text-paperDim text-xs">Você:</span>{' '}
                <span style={{ color: myChar.color }}>{myChar.emoji} {myChar.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Criminal notice */}
        {myChar?.isCriminal && (
          <div className="bg-crimson/10 border border-crimson/30 rounded-lg p-4 mb-6 text-center">
            <div className="text-crimson font-typewriter text-sm tracking-widest mb-1">🎭 VOCÊ É O CRIMINOSO!</div>
            <div className="text-paperDim text-xs">Não seja descoberto! Jogue a culpa nos outros.</div>
          </div>
        )}

        {/* Case intro */}
        {(caseData && (phase === 'case' || phase === 'character')) ? (
          <div className="case-file p-6 mb-6">
            <div className="text-xs font-typewriter text-gold tracking-widest mb-2">// CASO #{String(caseData.id || '').padStart(2,'0')}</div>
            <h2 className="font-typewriter text-gold text-lg mb-2">{caseData.title}</h2>
            <p className="text-paperDim text-xs mb-3">📍 {caseData.location}</p>
            <p className="text-paper italic text-sm leading-relaxed mb-4">{caseData.crime}</p>
            <div className="border-t border-gray-700 pt-3">
              <div className="text-crimson text-xs font-typewriter mb-1">VÍTIMA</div>
              <p className="text-paper text-sm mb-3">{caseData.victim}</p>
            </div>
          </div>
        ) : null}

        {/* Clues */}
        {(phase === 'clues' || phase === 'suspects' || phase === 'vote') && (
          <div className="mb-6">
            <h3 className="font-typewriter text-gold text-sm tracking-widest mb-3">🔍 EVIDÊNCIAS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {clues.map((clue, i) => (
                <div key={i}>
                  {revealedClues[i] ? (
                    <div className="case-file p-3 border-gold/30">
                      <div className="text-xs font-typewriter text-gold mb-1">{clue.label}</div>
                      <p className="text-paper text-xs leading-relaxed">{clue.text}</p>
                    </div>
                  ) : (
                    <button onClick={() => revealClue(i)}
                      className="case-file w-full p-4 text-center hover:border-gold transition-all opacity-70 hover:opacity-100">
                      <div className="text-xs text-paperDim mb-1">CLIQUE</div>
                      <div className="text-2xl mb-1 opacity-40">📁</div>
                      <div className="text-xs text-paperDim">{clue.label}</div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suspects */}
        {(phase === 'suspects' || phase === 'vote') && caseData && (
          <div className="mb-6">
            <h3 className="font-typewriter text-gold text-sm tracking-widest mb-3">⚖️ SUSPETOS</h3>
            <div className="space-y-2">
              {caseData.suspects.map((s, i) => (
                <div key={i}
                  onClick={() => !voteLocked && phase === 'vote' && castVote(i)}
                  className={`case-file flex items-center gap-3 p-3 cursor-pointer transition-all ${
                    !voteLocked && phase === 'vote'
                      ? 'hover:border-gold'
                      : ''
                  } ${selectedSuspect === i ? 'border-gold shadow-lg shadow-gold/10' : ''} ${
                    voteLocked && selectedSuspect === i ? 'border-gold' : ''
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-typewriter ${
                    selectedSuspect === i ? 'bg-gold text-noir' : 'bg-noir border border-gray-600 text-paperDim'
                  }`}>{i + 1}</div>
                  <div className="flex-1 text-paper text-sm">{s.name}</div>
                  {selectedSuspect === i && <span className="text-gold text-lg">✓</span>}
                </div>
              ))}
            </div>

            {/* Vote progress */}
            {phase === 'vote' && (
              <div className="mt-4 text-center">
                {voteLocked ? (
                  <div className="bg-gold/10 border border-gold/20 rounded p-3 text-gold text-sm font-typewriter">
                    ✅ VOTO REGISTRADO! Aguarde os outros jogadores...
                  </div>
                ) : (
                  <button onClick={() => castVote(selectedSuspect)}
                    disabled={selectedSuspect === null}
                    className="btn-primary py-3 px-8 disabled:opacity-30">
                    🗳️ CONFIRMAR VOTO
                  </button>
                )}
                {timeLeft !== null && timeLeft > 0 && !voteLocked && (
                  <div className="mt-2 text-paperDim text-xs">
                    ⏱️ Tempo restante: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                )}
                <div className="mt-2 text-paperDim text-xs">
                  {votedCount}/{totalPlayers} votaram
                </div>
              </div>
            )}
          </div>
        )}

        {/* Host: advance phase */}
        {isHost && phase !== 'vote' && phase !== 'result' && (
          <div className="text-center">
            <button onClick={advancePhase} className="btn-outline text-xs">
              → Avançar fase (host)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultView({ result, roomId, myId, myChar }) {
  const navigate = useNavigate()
  if (!result) return null

  return (
    <div className="min-h-screen bg-noir">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        {result.correct ? (
          <>
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="font-typewriter text-green-500 text-3xl mb-4 tracking-widest">CRIMINOSO IDENTIFICADO!</h2>
            <p className="text-paper text-lg mb-2">A sala votou corretamente em <span className="text-green-400 font-typewriter">{result.winnerName}</span></p>
          </>
        ) : (
          <>
            <div className="text-8xl mb-6">🎭</div>
            <h2 className="font-typewriter text-crimson text-3xl mb-4 tracking-widest">CRIMINOSO ESCAPOU!</h2>
            <p className="text-paper text-lg mb-2">O crimonoso era: <span className="text-crimson font-typewriter">{result.criminalName}</span></p>
            {!result.correct && <p className="text-paperDim text-sm mb-2">A sala apontou para: {result.winnerName}</p>}
            {result.tie && <p className="text-yellow-500 text-sm">Empate entre: {result.tieSuspects.join(', ')}</p>}
          </>
        )}

        {/* Votes breakdown */}
        {result.allVotes && (
          <div className="case-file p-5 mt-6 text-left max-w-sm mx-auto">
            <div className="text-xs font-typewriter text-gold tracking-widest mb-3">VOTAÇÃO</div>
            {result.allVotes.map((v, i) => (
              <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-800 last:border-0">
                <span className="text-paper text-xs flex-1">{v.name}</span>
                <span className="text-paperDim text-xs">→</span>
                <span className={`text-xs ${v.isCriminal ? 'text-crimson font-typewriter' : 'text-paperDim'}`}>
                  {v.vote || '—'}
                  {v.isCriminal && ' (CRIMINOSO)'}
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
          <Link to="/multiplayer" className="btn-gold">👥 JOGAR NOVAMENTE</Link>
          <Link to="/" className="btn-outline">🏠 PÁGINA INICIAL</Link>
        </div>
      </div>
    </div>
  )
}
