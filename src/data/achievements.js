/**
 * Achievement definitions for Casal Investigador
 */
export const achievements = [
  {
    id: 'primeira_pista',
    name: 'Primeira Pista Encontrada',
    description: 'Revele sua primeira pista em qualquer caso.',
    icon: '🔍',
    condition: 'Encontre 1 pista',
    unlocked: false,
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'primeiro_caso',
    name: 'Primeiro Caso Resolvido',
    description: 'Resolva seu primeiro caso identificando o criminoso corretamente.',
    icon: '🏆',
    condition: 'Resolva 1 caso',
    unlocked: false,
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'interrogador_experiente',
    name: 'Interrogador Experiente',
    description: 'Realize 10 interrogatórios bem-sucedidos na fase de suspeitos.',
    icon: '🗣️',
    condition: 'Complete 10 interrogatórios',
    unlocked: false,
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'mestre_evidencias',
    name: 'Mestre das Evidências',
    description: 'Encontre todas as pistas disponíveis em 10 casos diferentes.',
    icon: '📋',
    condition: 'Encontre 100% das pistas em 10 casos',
    unlocked: false,
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'resolveu_sem_errar',
    name: 'Resolveu Sem Errar',
    description: 'Resolva um caso sem cometer nenhum erro de acusação.',
    icon: '⭐',
    condition: 'Resolva 1 caso com 0 erros',
    unlocked: false,
    xpReward: 250,
    rarity: 'rare',
  },
  {
    id: 'casal_em_acao',
    name: 'Casal Investigador em Ação',
    description: 'Resolva 5 casos no modo multiplayer com diferentes parceiros.',
    icon: '👥',
    condition: 'Ganhe 5 rodadas multiplayer',
    unlocked: false,
    xpReward: 400,
    rarity: 'epic',
  },
  {
    id: 'genio_deducao',
    name: 'Gênio da Dedução',
    description: 'Alcance a pontuação máxima (150+) em um caso.',
    icon: '🧠',
    condition: 'Marque 150+ pontos em um caso',
    unlocked: false,
    xpReward: 500,
    rarity: 'legendary',
  },
  {
    id: 'olho_aguia',
    name: 'Olho de Águia',
    description: 'Identifique o motivo correto do crime em 5 casos diferentes.',
    icon: '🦅',
    condition: 'Identifique o motivo correto em 5 casos',
    unlocked: false,
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'colecionador_pistas',
    name: 'Colecionador de Pistas',
    description: 'Colete um total de 50 pistas ao longo de todos os casos.',
    icon: '📦',
    condition: 'Encontre 50 pistas no total',
    unlocked: false,
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'maratona_casos',
    name: 'Maratona de Casos',
    description: 'Resolva 10 casos seguidos sem perder nenhum.',
    icon: '🎯',
    condition: 'Resolva 10 casos consecutivos',
    unlocked: false,
    xpReward: 500,
    rarity: 'legendary',
  },
  {
    id: 'detetive_chefe',
    name: 'Detetive Chefe',
    description: 'Atinga o nível 5 de investigador.',
    icon: '👮',
    condition: 'Atinga Nível 5',
    unlocked: false,
    xpReward: 300,
    rarity: 'epic',
  },
  {
    id: 'caçador_proficiente',
    name: 'Caçador Proficiente',
    description: 'Explore todos os 5 temas de casos disponíveis.',
    icon: '🎭',
    condition: 'Resolva pelo menos 1 caso de cada tema',
    unlocked: false,
    xpReward: 250,
    rarity: 'rare',
  },
]

/**
 * Get achievement by ID
 */
export function getAchievement(id) {
  return achievements.find(a => a.id === id) || null
}

/**
 * Get all achievements of a specific rarity
 */
export function getAchievementsByRarity(rarity) {
  return achievements.filter(a => a.rarity === rarity)
}

/**
 * Rarity display config
 */
export const rarityConfig = {
  common: { label: 'Comum', color: '#8a8070', bg: '#8a807022' },
  rare: { label: 'Raro', color: '#5dade2', bg: '#5dade222' },
  epic: { label: 'Épico', color: '#9b59b6', bg: '#9b59b622' },
  legendary: { label: 'Lendário', color: '#f39c12', bg: '#f39c1222' },
}

export default achievements
