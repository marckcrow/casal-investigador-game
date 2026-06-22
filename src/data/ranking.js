/**
 * Mock ranking data for Casal Investigador
 */
export const mockRanking = [
  {
    rank: 1,
    playerName: 'Maria do Socorro',
    casesResolved: 48,
    score: 6820,
    title: 'Mestre Investigativo',
    avatar: '🕵️‍♀️',
    country: '🇧🇷',
    date: '2026-06-20',
    streak: 15,
  },
  {
    rank: 2,
    playerName: 'Carlos Eduardo',
    casesResolved: 45,
    score: 6240,
    title: 'Detetive Supremo',
    avatar: '🕵️‍♂️',
    country: '🇧🇷',
    date: '2026-06-21',
    streak: 12,
  },
  {
    rank: 3,
    playerName: 'Ana Beatriz',
    casesResolved: 42,
    score: 5780,
    title: 'Gênio da Dedução',
    avatar: '🔍',
    country: '🇧🇷',
    date: '2026-06-19',
    streak: 8,
  },
  {
    rank: 4,
    playerName: 'Pedro Henrique',
    casesResolved: 38,
    score: 5120,
    title: 'Mestre Investigativo',
    avatar: '🕵️',
    country: '🇵🇹',
    date: '2026-06-18',
    streak: 5,
  },
  {
    rank: 5,
    playerName: 'Juliana Santos',
    casesResolved: 35,
    score: 4680,
    title: 'Detetive Chefe',
    avatar: '🕵️‍♀️',
    country: '🇧🇷',
    date: '2026-06-17',
    streak: 10,
  },
  {
    rank: 6,
    playerName: 'Ricardo Souza',
    casesResolved: 32,
    score: 4150,
    title: 'Investigador Sênior',
    avatar: '🕵️‍♂️',
    country: '🇧🇷',
    date: '2026-06-16',
    streak: 3,
  },
  {
    rank: 7,
    playerName: 'Fernanda Lima',
    casesResolved: 29,
    score: 3720,
    title: 'Investigador Sênior',
    avatar: '🔎',
    country: '🇧🇷',
    date: '2026-06-15',
    streak: 7,
  },
  {
    rank: 8,
    playerName: 'Marcondes Jr',
    casesResolved: 8,
    score: 960,
    title: 'Investigador Atento',
    avatar: '🕵️',
    country: '🇧🇷',
    date: '2026-06-22',
    streak: 2,
    isCurrentPlayer: true,
  },
  {
    rank: 9,
    playerName: 'Lucas Oliveira',
    casesResolved: 15,
    score: 1850,
    title: 'Investigador Júnior',
    avatar: '🔍',
    country: '🇧🇷',
    date: '2026-06-14',
    streak: 1,
  },
  {
    rank: 10,
    playerName: 'Patrícia Costa',
    casesResolved: 12,
    score: 1420,
    title: 'Investigador Júnior',
    avatar: '🕵️‍♀️',
    country: '🇧🇷',
    date: '2026-06-13',
    streak: 0,
  },
]

export const rankingStats = {
  totalPlayers: 1247,
  yourPosition: 8,
  yourTotalScore: 960,
  yourCasesResolved: 8,
}

export const rankTitles = [
  { min: 0, max: 499, title: 'Detetive Iniciante' },
  { min: 500, max: 999, title: 'Investigador Júnior' },
  { min: 1000, max: 1999, title: 'Investigador Atento' },
  { min: 2000, max: 3999, title: 'Investigador Sênior' },
  { min: 4000, max: 5999, title: 'Detetive Chefe' },
  { min: 6000, max: 7999, title: 'Gênio da Dedução' },
  { min: 8000, max: 9999, title: 'Mestre Investigativo' },
  { min: 10000, max: Infinity, title: 'Detetive Supremo' },
]

export function getRankTitle(score) {
  for (let i = rankTitles.length - 1; i >= 0; i--) {
    if (score >= rankTitles[i].min) return rankTitles[i].title
  }
  return 'Detetive Iniciante'
}

export default mockRanking
