/**
 * The couple protagonists of Casal Investigador
 */
export const investigators = [
  {
    id: 'rafael',
    name: 'Detetive Rafael',
    role: 'Analista de Evidências',
    emoji: '🔍',
    avatar: '🕵️‍♂️',
    color: '#c9a84c',
    specialAbility: 'Análise Lógica',
    specialAbilityDesc: 'Pode identificar padrões escondidos nas pistas e deduzir conexões entre evidências.',
    personality: 'Metódico, racional e paciente. Prefere seguir as evidências antes de tirar conclusões.',
    personalityTraits: ['Analítico', 'Lógico', 'Paciente', 'Detalhista'],
    backstory: 'Ex-oficial da Polícia Civil com 12 anos de experiência em investigação de homicídios. Formado em Direito pela UFC, especializou-se em criminalística e análise de cenas de crime. Conheceu Marina durante um caso complexo que ambos resolveram juntos — e desde então, são parceiros inseparáveis.',
    strength: 'Análise fria e objetiva de evidências físicas e documentos.',
    weakness: 'Às vezes ignora pistas "sutis" que exigem intuição emocional.',
    synergy: 'Trabalha perfeitamente com Marina — ele fornece a estrutura lógica enquanto ela adiciona a perspectiva emocional e intuitiva.',
    tagline: '"As evidências não mentem. Mas precisam ser lidas com atenção."',
    stats: {
      lógica: 95,
      intuição: 60,
      carisma: 70,
      observação: 85,
    },
  },
  {
    id: 'marina',
    name: 'Investigadora Marina',
    role: 'Especialista em Comportamento',
    emoji: '💡',
    avatar: '🕵️‍♀️',
    color: '#e8c96a',
    specialAbility: 'Leitura Emocional',
    specialAbilityDesc: 'Capaz de detectar contradições em testemunhos e identificar quando alguém está mentindo pelo tom de voz ou linguagem corporal.',
    personality: 'Intuitiva, empática e observadora. Confia no seu "sexto sentido" tanto quanto nas provas concretas.',
    personalityTraits: ['Intuitiva', 'Emática', 'Observadora', 'Perceptiva'],
    backstory: 'Psicóloga forense formada pela UNIFOR, com pós-graduação em perfilamento criminal. Trabalhou como perita emBehavior Analysis em casos de sequestro e desaparecimento. Conheceu Rafael em um caso de homicídio que desafiou todas as evidências físicas — e foi sua intuição que resolveu o caso.',
    strength: 'Capta detalhes emocionais e comportamentais que passam despercebidos pela análise técnica.',
    weakness: 'Às vezes age por impulso intuitivo sem provas concretas suficientes.',
    synergy: 'Complementa Rafael perfeitamente: ele constrói o caso com evidências, ela lê as pessoas por trás das pistas.',
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
  combinedAbilityDesc: 'Quando Rafael e Marina trabalham juntos, cada pista é analisada tanto pela lógica quanto pela intuição, aumentando drasticamente as chances de resolver o caso corretamente.',
}

export default investigators
