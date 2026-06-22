// This script enriches the base cases.json with game-specific metadata
// Run with: node src/data/enrich_cases.js
import cases from './cases.json' assert { type: 'json' }
import { writeFileSync } from 'fs'

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

const enriched = cases.map(c => ({
  ...c,
  difficulty: DIFFICULTY_MAP[c.theme] || 2,
  sceneColor: SCENE_COLORS[c.theme] || 0x0a0a0a,
  characters: CHARACTERS,
  evidence: generateEvidence(c),
  redHerrings: generateRedHerrings(c),
  crimeSceneDescription: generateCrimeSceneDescription(c),
  solutionHighlight: generateSolutionHighlight(c),
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

writeFileSync('./cases_enriched.json', JSON.stringify(enriched, null, 2), 'utf-8')
console.log(`Enriched ${enriched.length} cases → cases_enriched.json`)
