import { Link } from 'react-router-dom'
import InvestigatorCard from '../components/InvestigatorCard'
import { investigators, coupleInfo } from '../data/investigators'

export default function Personagens() {
  return (
    <div className="min-h-screen bg-noir text-paper">
      {/* Header */}
      <header className="bg-noir2 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-noir2/90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-paperDim hover:text-gold transition-colors text-sm">← Início</Link>
          <div className="flex-1 text-center">
            <span className="font-typewriter text-gold text-sm tracking-widest">
              👤 PERSONAGENS
            </span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        <div className="absolute inset-0 opacity-3"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🕵️‍♂️🕵️‍♀️</div>
          <h1 className="font-typewriter text-gold text-3xl mb-4 tracking-widest">
            CASAL INVESTIGADOR
          </h1>
          <p className="text-paperDim max-w-xl mx-auto text-lg leading-relaxed">
            {coupleInfo.tagline}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Investigator Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {investigators.map(inv => (
            <InvestigatorCard
              key={inv.id}
              investigator={inv}
              showStats
              compact={false}
            />
          ))}
        </div>

        {/* Synergy Section */}
        <div
          className="case-file p-6 rounded-lg mb-12"
          style={{ border: '1px solid #c9a84c44', background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">⚡</div>
            <div>
              <div className="font-typewriter text-gold text-lg tracking-wider">
                {coupleInfo.combinedAbility}
              </div>
              <div className="text-paperDim text-xs font-typewriter">
                A força do casal
              </div>
            </div>
          </div>

          <p className="text-paper italic leading-relaxed mb-6">
            {coupleInfo.combinedAbilityDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Pistas Analisadas', value: 'Lógica + Intuição', icon: '🔍' },
              { label: 'Taxa de Acertos', value: '95%+', icon: '✅' },
              { label: 'Método', value: 'Dupla Inspect', icon: '⚙️' },
            ].map(item => (
              <div key={item.label} className="bg-noir border border-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-paperDim text-xs mb-1">{item.label}</div>
                <div className="font-typewriter text-gold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How They Work Together */}
        <div className="mb-12">
          <h2 className="font-typewriter text-gold text-lg tracking-widest mb-6 text-center">
            COMO ELES TRABALHAM JUNTOS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                phase: '📋 Coleta de Pistas',
                marcondes: 'Marcondes cataloga cada evidência, verifica procedência e organiza cronologicamente.',
                carla: 'Carla observa nuances: quem tocou em cada objeto, a postura de quem entregou a pista.',
              },
              {
                phase: '🗣️ Interrogatório',
                marcondes: 'Marcondes formula perguntas técnicas sobre locais, horários e documentos.',
                carla: 'Carla lê a linguagem corporal e detecta contradições no discurso.',
              },
              {
                phase: '🔎 Análise',
                marcondes: 'Marcondes cruza dados, verifica álibis e monta a linha do tempo dos fatos.',
                carla: 'Carla identifica o elemento emocional — o "porquê" por trás de cada ação.',
              },
              {
                phase: '⚖️ Acusação Final',
                marcondes: 'Marcondes apresenta as evidências concretas que sustentam a acusação.',
                carla: 'Carla adiciona a compreensão psicológica do comportamento do criminoso.',
              },
            ].map(item => (
              <div key={item.phase} className="bg-noir2 border border-gray-800 rounded-lg p-5">
                <div className="font-typewriter text-gold text-sm tracking-wider mb-4">{item.phase}</div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">🕵️‍♂️</span>
                    <p className="text-paperDim text-xs leading-relaxed">{item.marcondes}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">🕵️‍♀️</span>
                    <p className="text-paperDim text-xs leading-relaxed">{item.carla}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-noir2 border border-gray-800 rounded-lg">
          <p className="text-paperDim text-sm mb-6">
            Pronto para investigar ao lado de Marcondes e Carla?
          </p>
          <Link
            to="/jogar"
            className="inline-block bg-gold text-noir font-typewriter tracking-widest px-8 py-4 rounded hover:bg-yellow-400 transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-gold/30 text-base"
          >
            🎮 ENTRAR NO CASO
          </Link>
        </div>
      </div>
    </div>
  )
}
