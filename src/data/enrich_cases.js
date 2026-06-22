// This script enriches the base cases.json with game-specific metadata + images
// Run with: node src/data/enrich_cases.js
import { readFileSync, writeFileSync } from 'fs'

const cases = JSON.parse(readFileSync('./src/data/cases.json', 'utf-8'))

const CHARACTERS = {
  detective: {
    name: 'Detetive',
    emoji: '🔍',
    role: 'detective',
    description: 'Você é o detetive responsável pelo caso. Use sua lógica e as pistas encontradas para identificar o criminoso.',
    goal: 'Identificar corretamente o criminoso entre os suspeitos.',
    secretInfo: null,
  },
  criminal: {
    name: 'Criminoso',
    emoji: '🎭',
    role: 'criminal',
    description: 'VOCÊ é o criminoso. Sua missão é não ser descoberto. Use as pistas contra você para jogar a culpa em outros!',
    goal: 'Não ser identificado como o criminoso ao final da votação.',
    secretInfo: 'Você conhece toda a verdade do crime. Use isso para mentir e desviar as suspeitas.',
  },
  witnessA: {
    name: 'Testemunha A',
    emoji: '👁️',
    role: 'witness',
    description: 'Você presenciou parte da cena do crime. Sua visão pode ser crucial para identificar o criminoso.',
    goal: 'Usar suas informações para ajudar a identificar o verdadeiro criminoso.',
    secretInfo: null,
  },
  witnessB: {
    name: 'Testemunha B',
    emoji: '🗣️',
    role: 'witness',
    description: 'Você ouviu sons e viu movimentos estranhos naquela noite. Algo não encaixa...',
    goal: 'Compartilhar suas observações para ajudar na investigação.',
    secretInfo: null,
  },
  victimFamily: {
    name: 'Família da Vítima',
    emoji: '💔',
    role: 'victim',
    description: 'Você conhecia a vítima profundamente. Seu conhecimento sobre a vítima pode revelar inimigos e motivos.',
    goal: 'Ajudar a encontrar justice para a vítima.',
    secretInfo: null,
  },
}

const DIFFICULTY_MAP = { CRIME: 2, HORROR: 3, SUSPENSE: 2, 'MISTÉRIO': 1, OCULTISMO: 3 }
const SCENE_COLORS = {
  CRIME: 0x1a0a0a,
  HORROR: 0x0a0014,
  OCULTISMO: 0x0d0020,
  'MISTÉRIO': 0x000d1a,
  SUSPENSE: 0x100800,
}

// Image theme mapping — deterministic, no external API calls at runtime
const THEME_IMAGES = {
  CRIME: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',        // courthouse
    'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=800&q=80',        // police tape
    'https://images.unsplash.com/photo-152厄1769756737-4806a1f5f9e9?w=800&q=80',        // crime scene
    'https://images.unsplash.com/photo-1453873531674-2151bcd01707?w=800&q=80',         // detective
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',       // business
  ],
  HORROR: [
    'https://images.unsplash.com/photo-1509248961725-aec71c73d8e0?w=800&q=80',         // dark mansion
    'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80',           // fog
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',         // night
    'https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=800&q=80',       // dark forest
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80',         // spooky
  ],
  OCULTISMO: [
    'https://images.unsplash.com/photo-1509248961895-4b8c2f3c2f9e?w=800&q=80',         // candles
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',        // crystals
    'https://images.unsplash.com/photo-152%20mystic.jpg?w=800&q=80',                 // mystic
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80',        // dark
    'https://images.unsplash.com/photo-1543976158-c1e6b9c3d9e9?w=800&q=80',            // tarot
  ],
  'MISTÉRIO': [
    'https://images.unsplash.com/photo-1471967183320-ee018f6e114a?w=800&q=80',        // foggy street
    'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',        // shadows
    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80',           // dark room
    'https://images.unsplash.com/photo-1557895348-6c8b20e82d2a?w=800&q=80',           // mystery
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',          // magnifying
  ],
  SUSPENSE: [
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80',         // dark suspense
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',       // night mountains
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',       // dark
    'https://images.unsplash.com/photo-1510784722466-f2aa240d1b9a?w=800&q=80',        // tension
    'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800&q=80',        // suspense
  ],
}

// Fallback images per theme
const FALLBACK_IMAGES = {
  CRIME: 'https://picsum.photos/seed/crime/800/450',
  HORROR: 'https://picsum.photos/seed/horror/800/450',
  OCULTISMO: 'https://picsum.photos/seed/ritual/800/450',
  'MISTÉRIO': 'https://picsum.photos/seed/mystery/800/450',
  SUSPENSE: 'https://picsum.photos/seed/tension/800/450',
}

function getCaseImage(theme, caseId) {
  const themeList = THEME_IMAGES[theme] || THEME_IMAGES['MISTÉRIO']
  const index = (caseId - 1) % themeList.length
  return themeList[index] || FALLBACK_IMAGES[theme] || `https://picsum.photos/seed/case${caseId}/800/450`
}

function getDossierImage(theme, caseId) {
  // Use a different image for dossier than intro
  const themeList = THEME_IMAGES[theme] || THEME_IMAGES['MISTÉRIO']
  const index = (caseId % themeList.length)
  return themeList[index] || FALLBACK_IMAGES[theme] || `https://picsum.photos/seed/dossier${caseId}/800/450`
}

const enriched = cases.cases.map(c => ({
  ...c,
  difficulty: DIFFICULTY_MAP[c.theme] || 2,
  sceneColor: SCENE_COLORS[c.theme] || 0x0a0a0a,
  characters: CHARACTERS,
  evidence: generateEvidence(c),
  redHerrings: generateRedHerrings(c),
  crimeSceneDescription: generateCrimeSceneDescription(c),
  solutionHighlight: generateSolutionHighlight(c),
  // Image URLs for case display
  imageUrl: getCaseImage(c.theme, c.id),
  dossierImageUrl: getDossierImage(c.theme, c.id),
}))

function generateEvidence(c) {
  return [
    { id: 'e1', label: 'Pista Principal', text: c.solution.split('.')[0] + '.', type: 'key' },
    { id: 'e2', label: 'Local do Crime', text: `O crime ocorreu em ${c.location}.`, type: 'location' },
    { id: 'e3', label: 'Documento', text: `Relatório da ocorrência registrado às ${Math.floor(Math.random() * 12) + 8}h${Math.floor(Math.random() * 60).toString().padStart(2, '0')}min.`, type: 'document' },
  ]
}

function generateRedHerrings(c) {
  return [
    `A primeira impressão indicava ${c.suspects[0].name}, mas os detalhes não batiam.`,
    `Vários vizinhos foram ouvidos, mas nenhum viu nada fora do comum àquela hora.`,
    `O celular da vítima tinha 3 chamadas não atendidas. Nenhuma delas do suspeito principal.`,
  ]
}

function generateCrimeSceneDescription(c) {
  return `Um silêncio pesado paira sobre ${c.location}. A equipe técnica trabalha sob luzes azuis piscantes. Sobre a mesa, vestígios de uma noite que mudou tudo. A vítima: ${c.victim}. O tempo urge.`
}

function generateSolutionHighlight(c) {
  return {
    criminal: c.suspects[0].name,
    motive: c.solution.split('.')[0],
    evidence: c.solution,
  }
}

// Write enriched cases back to cases.json for the app to use
writeFileSync('./src/data/cases.json', JSON.stringify({ title: cases.title, subtitle: cases.subtitle, cases: enriched }, null, 2), 'utf-8')
console.log(`✅ Enriched ${enriched.length} cases → cases.json`)
console.log(`📷 Images added (intro + dossier) per case`)
