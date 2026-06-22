/**
 * Pool of interrogation questions for Casal Investigador
 */
export const questions = [
  {
    id: 'q1',
    text: 'Onde você estava exatamente na hora do ocorrido?',
    category: 'alibi',
    icon: '🕐',
    effectiveness: 'high',
  },
  {
    id: 'q2',
    text: 'Qual era sua relação com a vítima?',
    category: 'relationship',
    icon: '💔',
    effectiveness: 'high',
  },
  {
    id: 'q3',
    text: 'Por que seu nome apareceu nas pistas do caso?',
    category: 'evidence',
    icon: '🔍',
    effectiveness: 'medium',
  },
  {
    id: 'q4',
    text: 'Você está escondendo alguma informação?',
    category: 'confrontation',
    icon: '🤥',
    effectiveness: 'medium',
  },
  {
    id: 'q5',
    text: 'Alguém pode confirmar seu álibi?',
    category: 'alibi',
    icon: '👥',
    effectiveness: 'high',
  },
  {
    id: 'q6',
    text: 'Você tinha algum motivo para prejudicar a vítima?',
    category: 'motive',
    icon: '💢',
    effectiveness: 'high',
  },
  {
    id: 'q7',
    text: 'O que você sabe sobre o que aconteceu naquela noite?',
    category: 'knowledge',
    icon: '🌙',
    effectiveness: 'medium',
  },
  {
    id: 'q8',
    text: 'Você conhecia alguém que tinha motivo para agir contra a vítima?',
    category: 'motive',
    icon: '🔗',
    effectiveness: 'medium',
  },
  {
    id: 'q9',
    text: 'Há algo que você gostaria de nos contar antes de eu revelar as evidências?',
    category: 'confession',
    icon: '💭',
    effectiveness: 'high',
  },
  {
    id: 'q10',
    text: 'Você já esteve neste local antes do dia do crime?',
    category: 'location',
    icon: '📍',
    effectiveness: 'low',
  },
  {
    id: 'q11',
    text: 'Desde quando você mantém contato com a vítima?',
    category: 'relationship',
    icon: '📅',
    effectiveness: 'medium',
  },
  {
    id: 'q12',
    text: 'Você tinha ciência de algum segredo da vítima?',
    category: 'secret',
    icon: '🤫',
    effectiveness: 'high',
  },
  {
    id: 'q13',
    text: 'Quando foi a última vez que você viu a vítima com vida?',
    category: 'timeline',
    icon: '⏰',
    effectiveness: 'medium',
  },
  {
    id: 'q14',
    text: 'Havia algum conflito entre você e a vítima nos últimos dias?',
    category: 'conflict',
    icon: '⚔️',
    effectiveness: 'high',
  },
  {
    id: 'q15',
    text: 'Você sabia que estava sendo investigado neste caso?',
    category: 'awareness',
    icon: '👁️',
    effectiveness: 'low',
  },
]

export const questionCategories = {
  alibi: { label: 'Álibi', color: '#5dade2', icon: '🕐' },
  relationship: { label: 'Relacionamento', color: '#e74c3c', icon: '💔' },
  evidence: { label: 'Evidências', color: '#c9a84c', icon: '🔍' },
  confrontation: { label: 'Confrontação', color: '#9b59b6', icon: '🤥' },
  motive: { label: 'Motivo', color: '#c41e3a', icon: '💢' },
  knowledge: { label: 'Conhecimento', color: '#2ecc71', icon: '🌙' },
  confession: { label: 'Confissão', color: '#f39c12', icon: '💭' },
  location: { label: 'Local', color: '#3498db', icon: '📍' },
  secret: { label: 'Segredo', color: '#8e44ad', icon: '🤫' },
  timeline: { label: 'Linha do Tempo', color: '#16a085', icon: '⏰' },
  conflict: { label: 'Conflito', color: '#d35400', icon: '⚔️' },
  awareness: { label: 'Consciência', color: '#7f8c8d', icon: '👁️' },
}

export const responseTemplates = {
  truth: [
    'Sim, eu estava lá, mas não fui eu quem...',
    'Eu vi alguém sair do local naquela noite...',
    'Eu só quero que a verdade seja descoberta.',
    'Se eu soubesse que ia acontecer, teria feito algo.',
  ],
  lie: [
    'Eu não sei de nada. Nunca nem falei com essa pessoa.',
    'Isso é um equívoco. Eu posso provar que estava em outro lugar.',
    'Vocês estão perdendo tempo comigo. Procurem em outro lugar.',
    'Eu não tenho nada a ver com isso. Isso é uma conspiração.',
  ],
  evasion: [
    'Prefiro não responder isso agora.',
    'Meu advogado me aconselhou a não comentar este assunto.',
    'Vocês estão confundindo as coisas.',
    'Essa pergunta não é relevante para a investigação.',
  ],
}

export function getRandomQuestions(count = 5, categories = null) {
  let pool = [...questions]
  if (categories && categories.length > 0) {
    pool = pool.filter(q => categories.includes(q.category))
  }
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}

export function getQuestionsByCategory(category) {
  return questions.filter(q => q.category === category)
}

export default questions
