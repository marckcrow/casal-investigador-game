/**
 * Enhanced clue types and sample clues per case
 */
export const clueTypes = {
  documento: {
    label: 'Documento',
    icon: '📄',
    color: '#e8c96a',
    description: 'Documentos oficiais, relatórios, certidões, contratos',
  },
  objeto: {
    label: 'Objeto',
    icon: '🔎',
    color: '#c9a84c',
    description: 'Itens físicos encontrados na cena do crime',
  },
  testemunho: {
    label: 'Testemunho',
    icon: '💬',
    color: '#5dade2',
    description: 'Depoimentos e declarações de testemunhas',
  },
  audio: {
    label: 'Áudio',
    icon: '🎙️',
    color: '#9b59b6',
    description: 'Gravações, ligações, mensagens de voz',
  },
  foto: {
    label: 'Fotografia',
    icon: '📸',
    color: '#e74c3c',
    description: 'Fotos, imagens, filmagens',
  },
  digital: {
    label: 'Digital',
    icon: '💻',
    color: '#2ecc71',
    description: 'Dados digitais, redes sociais, e-mails, GPS',
  },
  mensagem: {
    label: 'Mensagem',
    icon: '📱',
    color: '#f39c12',
    description: 'SMS, WhatsApp, e-mail, cartas',
  },
}

export const importanceLevels = {
  baixa: { label: 'Pista Secundária', color: '#8a8070', points: 5 },
  media: { label: 'Pista Relevante', color: '#c9a84c', points: 10 },
  alta: { label: 'Pista Crucial', color: '#c41e3a', points: 20 },
}

/**
 * Sample clues for cases 1-5 from cases.json
 */
export const sampleClues = {
  1: [
    {
      id: 'c1_1',
      type: 'objeto',
      title: 'Troféu Ensanguentado',
      description: 'Um troféu de futebol do time favorito da vítima, encontrado próximo ao corpo. Vestígios de sangue confirmam que foi usado como arma.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'O troféu era do time que a vítima apoiava fanaticamente — mas trocou de time semanas antes.',
    },
    {
      id: 'c1_2',
      type: 'documento',
      title: 'Relatório Médico-Legal',
      description: 'O laudo do IML indica que a morte ocorreu entre 22h e 22h30, não às 23h15 como declarado pela esposa.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'Há uma discrepância de pelo menos 45 minutos na linha do tempo.',
    },
    {
      id: 'c1_3',
      type: 'testemunho',
      title: 'Depoimento do Vizinho',
      description: '"Vi alguém de capuz fledendo do local por volta das 22h50" — Vizinho do apartamento 402.',
      importance: 'media',
      found: false,
      foundAt: null,
      analysis: 'O vizinho alega estar na casa da mãe na hora do crime, mas não há confirmação.',
    },
    {
      id: 'c1_4',
      type: 'digital',
      title: 'Histórico de Ligações',
      description: 'O celular da vítima mostra que a última ligação foi às 23h47 — para um número não salvo.',
      importance: 'media',
      found: false,
      foundAt: null,
      analysis: 'A ligação durou apenas 12 segundos antes de cair.',
    },
    {
      id: 'c1_5',
      type: 'documento',
      title: 'Rascunho de Testamento',
      description: 'Um documento encontrado na mesa indica que a vítima pretendia alterar o testamento, excluindo Marina e deixando tudo para uma fundação.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'A alteração estava programada para o dia seguinte ao crime.',
    },
  ],
  2: [
    {
      id: 'c2_1',
      type: 'documento',
      title: 'Registro de Propriedade',
      description: 'A escritura da casa mostra que o terreno foi adquirido em 1962, mas não há registros de enterros anteriores.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'O terreno tinha um passado oculto que foi deliberadamente apagado dos registros.',
    },
    {
      id: 'c2_2',
      type: 'objeto',
      title: 'Cartas Subterrâneas',
      description: 'Cartas encontradas sob o assoalho escritas por Tomás Barcellos: "Eles estão vindo. Não confie em ninguém."',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'Tomás descobriu algo perigoso e tentou deixar um registro.',
    },
    {
      id: 'c2_3',
      type: 'foto',
      title: 'Fotografia Antiga',
      description: 'Uma foto em preto e branco mostra uma mulher de vestido branco no quintal da casa. Data de 1978.',
      importance: 'media',
      found: false,
      foundAt: null,
      analysis: 'A mulher da foto é Maria Helena, presa no porão da casa por 20 anos.',
    },
    {
      id: 'c2_4',
      type: 'digital',
      title: 'Mapa do Túnel',
      description: 'Planos arquitetônicos antigos revelam um túnel conectando a casa ao que era uma estação de metrô abandonada.',
      importance: 'media',
      found: false,
      foundAt: null,
      analysis: 'O túnel foi usado para movimentar "mercadorias" — e pessoas.',
    },
    {
      id: 'c2_5',
      type: 'testemunho',
      title: 'Depoimento do Corretor',
      description: '"A casa está livre de qualquer pendência judicial" — Disse o corretor, evitando olhar nos olhos.',
      importance: 'baixa',
      found: false,
      foundAt: null,
      analysis: 'O corretor é filho do antigo dono e sabe de todo o histórico sangrento.',
    },
  ],
  3: [
    {
      id: 'c3_1',
      type: 'objeto',
      title: 'Frasco de Remédio',
      description: 'Um frasco de Gardenal vazio encontrado no apartamento. O rótulo está em nome de Teresa.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'Gardenal é um barbitúrico usado em doses altas para induzir sono profundo.',
    },
    {
      id: 'c3_2',
      type: 'mensagem',
      title: 'Mensagem de WhatsApp',
      description: '"Você vai se arrepender de ter descoberto" — Enviado para o número de Lucas às 22h15.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'Alguém sabia que Lucas estava investigando.',
    },
    {
      id: 'c3_3',
      type: 'digital',
      title: 'Registro de Acesso ao Prédio',
      description: 'O sistema digital do condomínio mostra que Teresa entrou às 20h30 e nunca saiu.',
      importance: 'media',
      found: false,
      foundAt: null,
      analysis: 'Há um registro de saída às 04h15 que não corresponde à identidade de Teresa.',
    },
    {
      id: 'c3_4',
      type: 'audio',
      title: 'Gravações da Câmera',
      description: 'A câmera do corredor registrou alguém usando chave-mestra para abrir a porta de Marcos às 03h47.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'A pessoa nas imagens usa os mesmos sapatos que aparecem nas fotos de Teresa.',
    },
  ],
  4: [
    {
      id: 'c4_1',
      type: 'objeto',
      title: 'Diário Aberto',
      description: 'Um diário encontrado na escrivaninha de Isabela, aberto na página de 14 de outubro.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: '"Ele disse que se eu contasse para alguém, nunca mais veria minha mãe."',
    },
    {
      id: 'c4_2',
      type: 'foto',
      title: 'Foto Reveladora',
      description: 'Uma foto de Pedro com um conhecido traficante da região, tirada há 3 meses.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'Pedro deve dinheiro para o tráfico e está sendo ameaçado.',
    },
    {
      id: 'c4_3',
      type: 'documento',
      title: 'Laudos Médicos',
      description: 'Os laudos mostram que Isabela sofria de bullying severo e teve três internações psiquiátricas em 2 anos.',
      importance: 'media',
      found: false,
      foundAt: null,
      analysis: 'Isabela tinha um histórico de automutilação, consistente com o cenário.',
    },
  ],
  5: [
    {
      id: 'c5_1',
      type: 'mensagem',
      title: 'E-mail Cifrado',
      description: 'Um e-mail enviado por Dr. Sérgio para um endereço desconhecido, com o assunto "O contrato".',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'O e-mail menciona "eliminar a concorrência" e uma quantia em dólares.',
    },
    {
      id: 'c5_2',
      type: 'documento',
      title: 'Contrato Falso',
      description: 'Um documento de sociedade encontrado no cofre, com assinatura falsificada de Augusto.',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'O contrato daria a Sérgio controle total da empresa após a "morte natural" de Augusto.',
    },
    {
      id: 'c5_3',
      type: 'digital',
      title: 'Pesquisa no Celular',
      description: 'O histórico do celular de Augusto mostra buscas recentes sobre "envenenamento por arsênico sintomas".',
      importance: 'alta',
      found: false,
      foundAt: null,
      analysis: 'Augusto descobriu que estava sendo envenenado lentamente.',
    },
  ],
}

export function getCluesForCase(caseId) {
  return sampleClues[caseId] || []
}

export function getClueType(typeId) {
  return clueTypes[typeId] || clueTypes.objeto
}

export default {
  clueTypes,
  importanceLevels,
  sampleClues,
  getCluesForCase,
  getClueType,
}
