import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Supabase client for analytics
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pvvrkwikmduvpnldcktl.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dnJrd2lrbWR1dnBubGRja3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTk2MjQsImV4cCI6MjA5NzMzNTYyNH0.O7BSycYhxQeDQ-RK0EET0r5PyNwze7IwoR9vuoQH2tE'

async function supabaseTrackPixView() {
  try {
    const ipHash = btoa(navigator.userAgent + new Date().toDateString()).slice(0, 32)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pix_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        ip_hash: ipHash,
        user_agent: navigator.userAgent.slice(0, 100),
        referrer: document.referrer || '/'
      })
    })
    return res.ok
  } catch { return false }
}

async function supabaseGetPixCount() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pix_views?select=id`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      return Array.isArray(data) ? data.length : 0
    }
    return null
  } catch { return null }
}

// Custom SVG icons for social media — noir/detective themed
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 114 0v3M16 11h.01" />
    <line x1="10" y1="16" x2="10" y2="11" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="7" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
  </svg>
)

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
)

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-crimson">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

const MagnifierIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </svg>
)

const BugIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
)

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

// PIX QR Code as data URI (generated from key: d20317c0-c755-408e-9579-0139a27aff3e)
// Using a placeholder approach — we'll embed the QR code image
const PIX_QR_DATA = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=00020126580014br.gov.bcb.pix0136d20317c0-c755-408e-9579-0139a27aff3e5204000053039865405.005802BR5925JOSE%20MARCONDES%20RODRIGUES%20DA%20SILVA%20JUNIOR6009SAO%20PAULO62070505***6304E8C3`

export default function Sobre() {
  const [activeTab, setActiveTab] = useState('como-jogar')
  const [qrCopied, setQrCopied] = useState(false)
  const [showPixKey, setShowPixKey] = useState(false)
  const [pixViews, setPixViews] = useState(null) // null = loading, number = count, -1 = error/offline
  const trackedRef = useRef(false)

  const copyPixKey = async () => {
    const pixKey = 'd20317c0-c755-408e-9579-0139a27aff3e'
    try {
      await navigator.clipboard.writeText(pixKey)
      setQrCopied(true)
      setTimeout(() => setQrCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = pixKey
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setQrCopied(true)
      setTimeout(() => setQrCopied(false), 2000)
    }
  }

  // Track PIX views whenever the "Apoie" tab is opened
  useEffect(() => {
    if (activeTab !== 'apoie') return
    if (trackedRef.current) return // only track once per session
    trackedRef.current = true

    // Fire-and-forget: track + get count simultaneously
    Promise.all([
      supabaseTrackPixView(),
      supabaseGetPixCount()
    ]).then(([, count]) => {
      if (count !== null) setPixViews(count)
      else setPixViews(-1) // table doesn't exist yet
    })
  }, [activeTab])

  const tabs = [
    { id: 'como-jogar', label: '🎮 Como Jogar', icon: '🎮' },
    { id: 'colaborar', label: '🤝 Colaborar', icon: '🤝' },
    { id: 'apoie', label: '❤️ Apoie o Projeto', icon: '❤️' },
  ]

  return (
    <div className="min-h-screen bg-noir text-paper">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-noir2/90">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors text-sm">← Início</Link>
          <div className="flex-1 text-center">
            <span className="font-typewriter text-gold text-sm tracking-widest">
              SOBRE O PROJETO
            </span>
          </div>
          <div className="w-16" /> {/* spacer */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/10 to-transparent" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-float text-5xl mb-4">🕵️‍♂️</div>
          <h1 className="font-typewriter text-3xl text-gold mb-4 tracking-widest">
            CASAL INVESTIGADOR
          </h1>
          <p className="text-paperDim max-w-xl mx-auto text-lg leading-relaxed">
            Um jogo de investigação criminal interativo com <span className="text-gold font-bold">50 casos reais</span>,
            inspirado em crimes famosos do Brasil e do mundo.
            Jogue sozinho, em dupla ou com amigos!
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Link to="/jogar" className="btn-gold text-sm">🎮 JOGRAR AGORA</Link>
            <Link to="/multiplayer" className="btn-outline text-sm">👥 MULTIPLAYER</Link>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <div className="flex justify-center gap-2 bg-noir2/90 backdrop-blur-sm rounded-lg p-1.5 border border-gray-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 max-w-xs py-2.5 px-4 rounded-md font-typewriter text-xs tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gold text-noir shadow-lg'
                  : 'text-paperDim hover:text-gold hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* ===== COMO JOGAR ===== */}
        {activeTab === 'como-jogar' && (
          <div className="space-y-8 animate-fade-in">
            {/* Step 1 */}
            <div className="case-file p-6">
              <h3 className="font-typewriter text-gold text-lg tracking-wider mb-3 flex items-center gap-2">
                <span className="bg-crimson text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Escolha um Caso
              </h3>
              <p className="text-paperDim leading-relaxed pl-10">
                Na tela inicial, você verá <strong className="text-paper">50 casos</strong> organizados por tema:
                <span className="theme-badge theme-CRIME ml-1 mr-1">Crime</span>,
                <span className="theme-badge theme-HORROR ml-1 mr-1">Horror</span>,
                <span className="theme-badge theme-MISTÉRIO ml-1 mr-1">Mistério</span>,
                <span className="theme-badge theme-SUSPENSE ml-1 mr-1">Suspense</span> e
                <span className="theme-badge theme-OCULTISMO ml-1">Ocultismo</span>.
                Use os filtros para encontrar o caso perfeito, ou deixe a surpresa escolher por você!
              </p>
            </div>

            {/* Step 2 */}
            <div className="case-file p-6">
              <h3 className="font-typewriter text-gold text-lg tracking-wider mb-3 flex items-center gap-2">
                <span className="bg-crimson text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Escolha seu Papel
              </h3>
              <p className="text-paperDim leading-relaxed pl-10 mb-4">
                Cada caso oferece <strong className="text-paper">5 papéis diferentes</strong>. A sua escolha muda completamente a experiência:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-10">
                {[
                  { role: '🔍 Detetive', desc: 'Você lidera a investigação. Tem acesso a todas as pistas e deve deduzir quem é o culpado.' },
                  { role: '😈 Criminoso', desc: 'Você É o culpado! Sua missão: enganar os outros investigadores e escapar impune.' },
                  { role: '👁️ Testemunha', desc: 'Você viu algo importante... mas não tudo. Suas informações são fragmentadas.' },
                  { role: '👁️ Testemunha B', desc: 'Outra testemunha com uma perspectiva diferente. Juntas, as testemunhas formam o quebra-cabeça.' },
                  { role: '👨‍👩‍👧 Família', desc: 'Um parente da vítima. Você conhece segredos que ninguém mais sabe.' },
                ].map(item => (
                  <div key={item.role} className="bg-noir/60 border border-gray-700 rounded-lg p-3 hover:border-gold/40 transition-colors">
                    <div className="font-bold text-gold text-sm mb-1">{item.role}</div>
                    <div className="text-paperDim text-xs leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="case-file p-6">
              <h3 className="font-typewriter text-gold text-lg tracking-wider mb-3 flex items-center gap-2">
                <span className="bg-crimson text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Leia o Dossiê
              </h3>
              <p className="text-paperDim leading-relaxed pl-10">
                Cada caso vem com um <strong className="text-paper">dossiê completo</strong>: local do crime,
                ano, vítima, suspeitos com motivações, e pistas espalhadas pelo cenário.
                Leia com atenção — cada detalhe pode ser a chave para resolver o caso!
              </p>
            </div>

            {/* Step 4 */}
            <div className="case-file p-6">
              <h3 className="font-typewriter text-gold text-lg tracking-wider mb-3 flex items-center gap-2">
                <span className="bg-crimson text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Investigue & Deduza
              </h3>
              <p className="text-paperDim leading-relaxed pl-10">
                Analise as pistas, cruze as informações dos suspeitos, use lógica e intuição.
                No modo <strong className="text-gold">Solo</strong>, você confronta o criminoso diretamente.
                No modo <strong className="text-gold">Multiplayer</strong>, cada jogador tem informações diferentes
                — vocês precisam <em>colaborar</em> para montar o quebra-cabeça completo!
              </p>
            </div>

            {/* Tips */}
            <div className="bg-crimson/10 border border-crimson/30 rounded-lg p-5">
              <h4 className="font-typewriter text-crimson text-base tracking-wider mb-3">💡 Dicas de Investigador</h4>
              <ul className="space-y-2 text-paperDim text-sm">
                <li className="flex items-start gap-2"><span className="text-gold">▸</span> Nem sempre o óbvio é a verdade — desconfie das coincidências demais</li>
                <li className="flex items-start gap-2"><span className="text-gold">▸</span> O criminoso sempre tem um motivo — descubra o "porquê"</li>
                <li className="flex items-start gap-2"><span className="text-gold">▸</span> Testemunhas podem mentir ou estar erradas — cruzamento de informações é essencial</li>
                <li className="flex items-start gap-2"><span className="text-gold">▸</span> Jogue o mesmo caso com papéis diferentes — cada perspectiva revela novos detalhes</li>
                <li className="flex items-start gap-2"><span className="text-gold">▸</span> No multiplayer, comunicação é a arma mais poderosa</li>
              </ul>
            </div>
          </div>
        )}

        {/* ===== COLABORAR ===== */}
        {activeTab === 'colaborar' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <p className="text-paperDim text-lg max-w-xl mx-auto">
                O <strong className="text-gold">Casal Investigador</strong> é um projeto open source e em constante evolução.
                Existem várias formas de colaborar:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub / Code */}
              <div className="case-file p-6 hover:border-gold/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gold/10 p-2.5 rounded-lg text-gold"><CodeIcon /></div>
                  <h3 className="font-typewriter text-gold text-base tracking-wider">Contribua com Código</h3>
                </div>
                <p className="text-paperDim text-sm leading-relaxed mb-4">
                  O projeto está no GitHub. Faça fork, crie cases novos, corrija bugs, adicione funcionalidades.
                  Stack: React + Vite + Tailwind CSS + Phaser (para minigames).
                </p>
                <a href="https://github.com/marckcrow/casal-investigador-game" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-outline text-xs py-2 px-4">
                  <GitHubIcon /> Ver no GitHub →
                </a>
              </div>

              {/* New Cases */}
              <div className="case-file p-6 hover:border-gold/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-crimson/10 p-2.5 rounded-lg text-crimson"><MagnifierIcon /></div>
                  <h3 className="font-typewriter text-gold text-base tracking-wider">Crie Novos Casos</h3>
                </div>
                <p className="text-paperDim text-sm leading-relaxed mb-4">
                  Quer ver um crime famoso transformado em caso? Envie sua sugestão ou crie o case JSON completo
                  com suspeitos, pistas e solução. Cases bem feitos serão adicionados ao jogo!
                </p>
                <a href="https://github.com/marckcrow/casal-investigador-game/issues/new" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-outline text-xs py-2 px-4">
                  📝 Sugerir Caso →
                </a>
              </div>

              {/* Bug Reports */}
              <div className="case-file p-6 hover:border-gold/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gold/10 p-2.5 rounded-lg text-goldLight"><BugIcon /></div>
                  <h3 className="font-typewriter text-gold text-base tracking-wider">Reporte Bugs</h3>
                </div>
                <p className="text-paperDim text-sm leading-relaxed mb-4">
                    Encontrou um erro? Algo não funcionou como esperado? Abra uma issue no GitHub com
                    screenshots e descrição do problema. Toda ajuda conta!
                </p>
                <a href="https://github.com/marckcrow/casal-investigador-game/issues/new" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-outline text-xs py-2 px-4">
                  🐛 Reportar Bug →
                </a>
              </div>

              {/* Share */}
              <div className="case-file p-6 hover:border-gold/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-crimson/10 p-2.5 rounded-lg text-crimson"><ShareIcon /></div>
                  <h3 className="font-typewriter text-gold text-base tracking-wider">Divulgue o Projeto</h3>
                </div>
                <p className="text-paperDim text-sm leading-relaxed mb-4">
                  Gostou do jogo? Compartilhe com amigos, família, grupos de WhatsApp.
                    Quanto mais jogadores, mais rico o projeto fica — e mais casos podemos criar!
                </p>
                <button onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Casal Investigador', url: 'https://casal-investigador-game.vercel.app', text: '🕵️ Jogo de investigação criminal com 50 casos!' })
                  } else {
                    navigator.clipboard.writeText('https://casal-investigador-game.vercel.app')
                    alert('Link copiado!')
                  }
                }} className="inline-flex items-center gap-2 btn-outline text-xs py-2 px-4">
                  🔗 Compartilhar Link
                </button>
              </div>
            </div>

            {/* Tech stack badge */}
            <div className="bg-noir2 border border-gray-800 rounded-lg p-5 text-center">
              <div className="font-typewriter text-paperDim text-xs tracking-widest mb-3">TECNOLOGIAS</div>
              <div className="flex justify-center gap-3 flex-wrap">
                {['React', 'Vite', 'Tailwind CSS', 'Phaser', 'Supabase', 'PWA'].map(tech => (
                  <span key={tech} className="bg-noir border border-gray-700 text-paperDim text-xs px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== APOIE O PROJETO (PIX) ===== */}
        {activeTab === 'apoie' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">❤️</div>
              <h2 className="font-typewriter text-2xl text-gold tracking-widest mb-3">
                Apoie o Casal Investigador
              </h2>
              <p className="text-paperDim max-w-lg mx-auto">
                Este é um projeto independente, feito com ❤️ e muitas horas de pesquisa.
                Seu apoio ajuda a manter o jogo online, criar novos casos e melhorar a experiência.
              </p>
            </div>

            {/* PIX Card */}
            <div className="max-w-md mx-auto">
              <div className="case-file p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Ctext x='10' y='28' font-family='Arial,sans-serif' font-size='20' font-weight='bold' fill='%23f97316'%3E⚡inter%3C/text%3E%3C/svg%3E"
                    alt="PIX" className="h-6" />
                  <span className="font-typewriter text-paper text-lg tracking-wider">Pix</span>
                </div>

                <p className="text-paperDim text-sm mb-4">Escaneie o QR Code para apoiar:</p>

                {/* QR Code Image */}
                <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-lg">
                  <img
                    src={PIX_QR_DATA}
                    alt="QR Code PIX - Jose Marcondes Rodrigues da Silva Junior"
                    className="w-56 h-56"
                    loading="lazy"
                  />
                </div>

                {/* Pix Key */}
                <div className="bg-noir/60 border border-gray-700 rounded-lg p-3 mb-4">
                  <div className="text-paperDim text-xs mb-1">Chave PIX (copia e cola):</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-gold text-xs font-mono break-all select-all">
                      d20317c0-c755-408e-9579-0139a27aff3e
                    </code>
                    <button
                      onClick={copyPixKey}
                      className={`btn-outline text-xs py-1.5 px-3 whitespace-nowrap ${qrCopied ? 'border-green-500 text-green-400' : ''}`}
                    >
                      {qrCopied ? '✅ Copiado!' : '📋 Copiar'}
                    </button>
                  </div>
                </div>

                {/* Recipient info */}
                <div className="border-t border-gray-800 pt-4 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-paperDim">Favorecido:</span>
                    <span className="text-paper font-medium">JOSE MARCONDES RODRIGUES DA SILVA JUNIOR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-paperDim">Chave:</span>
                    <span className="text-gold text-xs font-mono">Aleatória (UUID)</span>
                  </div>
                  {/* View counter badge */}
                  <div className="flex justify-end pt-1">
                    {pixViews === null ? (
                      <span className="text-paperDim/40 text-xs animate-pulse">📡 conectando...</span>
                    ) : pixViews === -1 ? (
                      <span className="text-paperDim/40 text-xs">🔒 indicador indisponível</span>
                    ) : (
                      <span className="text-gold/70 text-xs flex items-center gap-1">
                        <span>👁️</span>
                        <span>{pixViews} {pixViews === 1 ? 'visualização' : 'visualizações'}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-paperDim/60 text-xs mt-4 italic">
                  Qualquer valor é bem-vindo! ☕💜
                </p>
              </div>
            </div>

            {/* What support enables */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { emoji: '📝', title: '+ Novos Casos', desc: 'Pesquisa e criação de casos baseados em crimes reais' },
                { emoji: '🎵', title: '+ Áudio & Música', desc: 'Trilha sonora original, efeitos sonoros e narração' },
                { emoji: '🎮', title: '+ Minigames', desc: 'Cenas interativas com Phaser: interrogatórios, buscas de provas' },
              ].map(item => (
                <div key={item.title} className="bg-noir2 border border-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-typewriter text-gold text-sm mb-1">{item.title}</div>
                  <div className="text-paperDim text-xs leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===== FOOTER with Social Media ===== */}
      <footer className="bg-noir2 border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <a href="https://www.linkedin.com/in/marcondes-rodrigues-junior/" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-noir border border-gray-700 hover:border-[#0A66C2] rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A66C2]/10"
              title="LinkedIn — Marcondes Rodrigues Junior">
              <span className="text-[#0A66C2] group-hover:scale-110 transition-transform"><LinkedInIcon /></span>
              <span className="text-paperDim group-hover:text-[#0A66C2] text-xs font-medium hidden sm:inline">LinkedIn</span>
            </a>

            <a href="https://www.facebook.com/webstreetbr" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-noir border border-gray-700 hover:border-[#1877F2] rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1877F2]/10"
              title="Facebook — Web Street">
              <span className="text-[#1877F2] group-hover:scale-110 transition-transform"><FacebookIcon /></span>
              <span className="text-paperDim group-hover:text-[#1877F2] text-xs font-medium hidden sm:inline">Facebook</span>
            </a>

            <a href="https://www.instagram.com/web.street/" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-noir border border-gray-700 hover:border-[#E4405F] rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#E4405F]/10"
              title="Instagram — @web.street">
              <span className="text-[#E4405F] group-hover:scale-110 transition-transform"><InstagramIcon /></span>
              <span className="text-paperDim group-hover:text-[#E4405F] text-xs font-medium hidden sm:inline">Instagram</span>
            </a>

            <a href="https://github.com/marckcrow" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-noir border border-gray-700 hover:border-[#e8e8e8] rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5"
              title="GitHub — marckcrow">
              <span className="text-[#e8e8e8] group-hover:scale-110 transition-transform"><GitHubIcon /></span>
              <span className="text-paperDim group-hover:text-white text-xs font-medium hidden sm:inline">GitHub</span>
            </a>

            <a href="https://wa.me/5585985035473?text=Olá! Vi o Casal Investigador e quero conversar!" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-2.5 bg-noir border border-gray-700 hover:border-[#25D366] rounded-lg px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#25D366]/10"
              title="WhatsApp — 85 98503-5473">
              <span className="text-[#25D366] group-hover:scale-110 transition-transform"><WhatsAppIcon /></span>
              <span className="text-paperDim group-hover:text-[#25D366] text-xs font-medium hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HeartIcon />
              <span className="font-typewriter text-gold text-sm tracking-wider">CASAL INVESTIGADOR</span>
              <HeartIcon />
            </div>
            <p className="text-paperDim/50 text-xs leading-relaxed max-w-md mx-auto">
              Feito com ❤️ por <strong className="text-paperDim">Marcondes Rodrigues Jr</strong> — Fortaleza, CE, Brasil<br/>
              © {new Date().getFullYear()} Casal Investigador. Todos os direitos reservados.<br/>
              <span className="text-paperDim/40">Projeto open source sob licença MIT.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
