/**
 * The couple protagonists of Casal Investigador
 * Based on real couple: Marcondes & Carla
 */
export const investigators = [
  {
    id: 'marcondes',
    name: 'Detetive Marcondes',
    role: 'Analista de Evidências',
    emoji: '🔍',
    avatar: '🕵️‍♂️',
    color: '#c9a84c',
    specialAbility: 'Análise Lógica',
    specialAbilityDesc: 'Pode identificar padrões escondidos nas pistas e deduzir conexões entre evidências.',
    personality: 'Metódico, racional e paciente. Prefere seguir as evidências antes de tirar conclusões.',
    personalityTraits: ['Analítico', 'Lógico', 'Paciente', 'Detalhista'],
    backstory: 'Profissional de TI com expertise em análise de dados e sistemas. Formado em Gestão em TI e Análise de Sistemas, desenvolveu uma habilidade única de conectar pontos que outros não veem. Sua experiência com tecnologia o torna perfeito para investigações digitais e análise forense de dados. Conheceu Carla durante um projeto desafiador — e desde então, são parceiros inseparáveis tanto na vida quanto nas investigações.',
    strength: 'Análise fria e objetiva de evidências físicas, digitais e documentos.',
    weakness: 'Às vezes ignora pistas "sutis" que exigem intuição emocional.',
    synergy: 'Trabalha perfeitamente com Carla — ele fornece a estrutura lógica enquanto ela adiciona a perspectiva emocional e intuitiva.',
    tagline: '"As evidências não mentem. Mas precisam ser lidas com atenção."',
    stats: {
      lógica: 95,
      intuição: 60,
      carisma: 70,
      observação: 85,
    },
  },
  {
    id: 'carla',
    name: 'Investigadora Carla',
    role: 'Especialista em Comportamento',
    emoji: '💡',
    avatar: '🕵️‍♀️',
    color: '#e8c96a',
    specialAbility: 'Leitura Emocional',
    specialAbilityDesc: 'Capaz de detectar contradições em testemunhos e identificar quando alguém está mentindo pelo tom de voz ou linguagem corporal.',
    personality: 'Intuitiva, empática e observadora. Confia no seu "sexto sentido" tanto quanto nas provas concretas.',
    personalityTraits: ['Intuitiva', 'Empática', 'Observadora', 'Perceptiva'],
    backstory: 'Observadora nata com uma mente afiada para detalhes. Tem a capacidade única de ler pessoas e situações além do óbvio. Sua intuição já resolveu casos que pareciam impossíveis. Conheceu Marcondes em um desafio que exigia tanto lógica quanto emoção — foi ela quem viu o que ninguém mais via, e ele que provou o que ela sentia.',
    strength: 'Capta detalhes emocionais e comportamentais que passam despercebidos pela análise técnica.',
    weakness: 'Às vezes age por impulso intuitivo sem provas concretas suficientes.',
    synergy: 'Complementa Marcondes perfeitamente: ele constrói o caso com evidências, ela lê as pessoas por trás das pistas.',
    tagline: '"As pessoas deixam pistas também — só que no olhar, no tom de voz, na hesitação."',
    stats: {
      lógica: 65,
      intuição: 95,
      carisma: 85,
      observação: 90,
    },
  },
]

export const coupleInfo = {
  name: 'Casal Investigador',
  tagline: 'Juntos, desvendamos qualquer mistério.',
  combinedAbility: 'Sinergia Investigativa',
  combinedAbilityDesc: 'Quando Marcondes e Carla trabalham juntos, cada pista é analisada tanto pela lógica quanto pela intuição, aumentando drasticamente as chances de resolver o caso corretamente.',
}

export default investigators
