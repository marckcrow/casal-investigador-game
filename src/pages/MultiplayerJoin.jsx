import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

/**
 * MultiplayerJoin — Deep-link route for /sala/:code
 * Redirects to /multiplayer with the room code pre-filled via localStorage.
 * The Multiplayer component reads this on mount to auto-switch to "join" tab
 * and fill in the code.
 */
export default function MultiplayerJoin() {
  const { code } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (code) {
      // Store the join code so Multiplayer can pick it up
      localStorage.setItem('mp_join_code', code.toUpperCase())
      navigate('/multiplayer', { replace: true })
    }
  }, [code, navigate])

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin">🔗</div>
        <p className="font-typewriter text-gold tracking-widest">ENTRANDO NA SALA...</p>
        <p className="text-paperDim text-sm mt-2">Código: <span className="text-gold font-mono">{code?.toUpperCase()}</span></p>
      </div>
    </div>
  )
}
