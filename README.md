# 🕵️ Casal Investigador

> **Um jogo interativo de investigação criminal para casais e amigos.**
> 50 casos reais, 5 papéis, multiplayer, ranking, PWA e muito mais.

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Live-black?logo=vercel)](https://casal-investigador-game.vercel.app)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🔗 **Jogue agora:** [casal-investigador-game.vercel.app](https://casal-investigador-game.vercel.app)

---

## 🎮 Features

### Conteúdo do Jogo
| Feature | Descrição |
|---------|-----------|
| **50 casos únicos** | Crimes reais inspirados em homicídios, desaparecimentos, fraudes e mistérios |
| **5 papéis jogáveis** | Detetive, Criminoso, Testemunha A/B, Família — cada um com informações exclusivas |
| **Modo Solo** | Investigação individual com seleção de tema e caso |
| **Modo Multiplayer** | Salas com código de convite, QR Code, compartilhamento WhatsApp |
| **Sistema de pontuação** | XP, níveis de investigador, títulos, estrelas por caso |
| **Caderno de investigação** | Notas, pistas coletadas, nível de suspeita, hipóteses — por caso |
| **Ranking global** | Quadro de detetives com scores, títulos e posição do jogador |
| **Sistema de achievements** | 12 conquistas com raridades (Comum → Lendário) |
| **Narrações TTS** | Text-to-speech para texto do caso com ajuste de velocidade e voz |
| **Áudio procedural** | Sons ambiente gerados por Web Audio API — sem arquivos externos |
| **QR Code PIX** | Geração local de QR Code para apoio financeiro ao projeto |
| **PWA installable** | Instale como app nativo no celular ou desktop |
| **Erro tracking** | Sistema de log de erros integrado ao Admin Panel |

### Páginas e Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | **Home** | Grid de 50 casos, filtros por tema, acesso a Solo/Multiplayer |
| `/jogar` | **Solo** | Seleção de caso por tema, lista completa com dificuldade |
| `/jogo/:caseId` | **Game** | Motor do jogo: dossiê, pistas, interrogatório, votação, resultado |
| `/multiplayer` | **Multiplayer** | Lobby, criação de sala, entrada por código, gestão de jogadores |
| `/sala/:code` | **MultiplayerJoin** | Deep-link: redireciona para /multiplayer com sala pré-preenchida |
| `/sobre` | **Sobre** | Como jogar, colaborar, PIX, redes sociais — com 3 abas |
| `/caderno` | **Caderno** | Caderno de investigação por caso: pistas, suspeitos, notas, hipóteses |
| `/ranking` | **Ranking** | Quadro de detetives com stats, XP, barra de progresso |
| `/personagens` | **Personagens** | Perfis de Marcondes & Carla, sinergia, como trabalham juntos |
| `/login` | **Login** | Sistema de autenticação com login/cadastro, validação |
| `/admin` | **Admin Panel** | Visão geral, log de erros, jogadores, casos, ranking, configurações |

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **React** | 19.x | UI components, routing, state management |
| **Vite** | 8.x | Build tool, dev server, HMR |
| **Tailwind CSS** | 3.x | Utility-first styling, design system |
| **React Router DOM** | 6.x | SPA routing (11 rotas) |
| **qrcode.react** | 4.x | Geração local de QR Code PIX |
| **Framer Motion** | 12.x | UI animations |
| **Web Audio API** | Native | Áudio procedural (chuva, drone, SFX) |
| **Socket.IO Client** | 4.x | Multiplayer real-time |
| **Supabase Client** | 2.x | Auth, banco de dados, realtime |
| **Service Worker** | Custom | PWA offline-first |
| **Node.js + Socket.IO** | 20.x | Servidor multiplayer (opcional) |

### Infraestrutura

| Serviço | Detalhes |
|---------|---------|
| **Hosting** | Vercel (CDN global, auto-deploy from GitHub) |
| **Multiplayer Server** | Node.js + Socket.IO (`server/` directory) — opcional |
| **Banco de Dados** | Supabase (PostgreSQL + Auth + Realtime) |
| **Fontes** | Google Fonts: *Crimson Pro* (serif) + *Special Elite* (typewriter) |

---

## 🚀 Quick Start

### Pré-requisitos
- **Node.js** ≥ 18
- **npm** ≥ 9

### Instalação

```bash
# Clone o repositório
git clone https://github.com/marckcrow/casal-investigador-game.git
cd casal-investigador-game

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`

### Build de Produção

```bash
npm run build        # Build otimizado em dist/
npm run preview      # Preview da build localmente
```

### Deploy na Vercel

```bash
# Deploy com cache bust (sempre usar --prod --force)
npx vercel --prod --force --token SEU_TOKEN
```

---

## 📁 Estrutura do Projeto

```
casal-investigador-game/
├── index.html                  # HTML principal + YouTube BGM iframe + err-msg div
├── package.json               # Dependências e scripts
├── vite.config.js             # Configuração Vite + React plugin + sourcemap
├── tailwind.config.js         # Design system: cores, fontes, escala tipográfica
├── vercel.json                # SPA rewrite rules (exclui assets estáticos)
├── postcss.config.js          # PostCSS para Tailwind
│
├── public/                    # Arquivos estáticos servidos pelo Vite
│   ├── cases.json             # ⭐ DADOS PRINCIPAIS: 50 casos completos
│   ├── manifest.json          # PWA manifest (installable)
│   ├── sw.js                  # Service Worker (offline-first)
│   └── favicon.svg            # Ícone SVG
│
├── src/
│   ├── main.jsx               # Entry point + Global Error Tracker (__ErrorTracker)
│   ├── App.jsx                # Router com 11 rotas
│   ├── index.css              # Tailwind + animações + CSS custom + design tokens
│   │
│   ├── pages/                 # 11 páginas do app
│   │   ├── Home.jsx           # Grid de casos, filtros, CTA
│   │   ├── Solo.jsx           # Modo solo: lista de casos por tema
│   │   ├── Game.jsx           # ⭐ Motor do jogo completo
│   │   ├── Multiplayer.jsx    # ⭐ Multiplayer: lobby, sala, votação
│   │   ├── MultiplayerJoin.jsx # Deep-link para sala multiplayer
│   │   ├── Sobre.jsx          # 3 abas: como jogar, colaborar, PIX
│   │   ├── Caderno.jsx        # Caderno de investigação por caso
│   │   ├── Ranking.jsx        # Quadro de detetives com XP e progresso
│   │   ├── Personagens.jsx    # Perfis de Marcondes & Carla
│   │   ├── Login.jsx          # Login + cadastro com validação
│   │   └── Admin.jsx          # Admin Panel com 6 abas
│   │
│   ├── components/            # 15 componentes reutilizáveis
│   │   ├── AchievementBadge   # Badge de conquista com raridade
│   │   ├── Badge              # Badge genérico (tema, dificuldade, status)
│   │   ├── Button             # Botões customizados
│   │   ├── Card               # Card base
│   │   ├── CaseCard           # Card de caso com tema, dificuldade, suspeitos
│   │   ├── ClueCard           # Card de pista (locked/found/important)
│   │   ├── EmptyState         # Estado vazio com ícone e CTA
│   │   ├── InvestigatorCard   # Card de investigador (Marcondes/Carla)
│   │   ├── Modal              # Modal com backdrop blur e ESC para fechar
│   │   ├── ProgressBar        # Barra de progresso animada com variantes
│   │   ├── RankingBoard       # Tabela de ranking com medals
│   │   ├── ScoreSummary       # Resumo de pontuação com título e estrelas
│   │   ├── SkeletonLoader     # Loading placeholder
│   │   ├── SuspectCard        # Card de suspeito com slider de suspeita
│   │   └── Toast              # Notificação toast com auto-dismiss
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Auth state + localStorage users + getAllUsers
│   │   ├── useGameProgress.js # XP, nível, pontuação, casos resolvidos
│   │   └── useLocalStorage.js # Hook genérico de localStorage
│   │
│   ├── data/                  # Dados estáticos
│   │   ├── cases.json         # Fonte dos 50 casos (copiada para public/)
│   │   ├── investigators.js   # Perfis Marcondes & Carla
│   │   ├── achievements.js    # 12 conquistas com raridades
│   │   ├── clues.js           # Tipos e níveis de pistas
│   │   └── enrich_cases.js    # Script de enriquecimento de dados
│   │
│   ├── lib/                   # Bibliotecas utilities
│   │   ├── audio.js           # ⭐ Web Audio API: chuva, drone, SFX procedural
│   │   └── socket.js          # Socket.IO client para multiplayer
│   │
│   ├── utils/                 # Funções utilities
│   │   ├── storage.js         # Helpers localStorage (progress, notes, clues)
│   │   └── score.js           # Cálculo de pontuação e títulos
│   │
│   └── game/
│       └── GameScene.js       # Cena Phaser: quadro de evidências interativo
│
├── server/                    # Servidor multiplayer (Node.js + Socket.IO)
│   ├── index.js
│   └── package.json
│
└── supabase/                 # Migrations SQL para Supabase
    ├── migrations/
    │   ├── 001_multiplayer.sql
    │   ├── 002_add_solution_hint.sql
    │   └── 003_pix_analytics.sql
    ├── generate_insert.cjs
    ├── fix_quotes.cjs
    └── migrate_pix.cjs
```

---

## 🎮 Como Funciona

### Fluxo do Jogo

```
Home (50 casos) → Escolher Papel (5 opções) → Ler Dossiê → Coletar Pistas
  → Interrogar Suspeitos → Votar → Resultado (acerto/erro) → XP awarded
```

### Os 5 Papéis

| Papel | Emoji | Descrição | Objetivo |
|-------|-------|-----------|---------|
| **Detetive** | 🔍 | Líder da investigação. Acesso a todas as pistas. | Identificar o criminoso corretamente |
| **Criminoso** | 😈 | Você É o culpado! Conhece toda a verdade. | Não ser descoberto pela votação |
| **Testemunha A** | 👁️ | Viu parte da cena. Informações fragmentadas. | Ajudar a identificar o verdadeiro culpado |
| **Testemunha B** | 🗣️ | Outra perspectiva. Complementa Testemunha A. | Cruzar informações com outros jogadores |
| **Família** | 👨‍👩‍👧 | Parente da vítima. Conhece segredos ocultos. | Revelar informações que ninguém mais tem |

### Temas dos Casos

| Tema | Quantidade | Badge Color |
|------|-----------|-------------|
| CRIME | 11 | 🔴 Vermelho |
| HORROR | 10 | 🟣 Roxo |
| OCULTISMO | 9 | 🟣 Roxo escuro |
| MISTÉRIO | 10 | 🔵 Azul |
| SUSPENSE | 9 | 🟠 Laranja |
| CRIME ORGANIZADO | 1 | 🔴 Vermelho escuro |
| MISTÉRIO BRASILEIRO | 2 | 🔵 Azul claro |

### Níveis de Dificuldade

| Nível | Quantidade | Símbolo |
|-------|-----------|---------|
| EXTREMO | 23 | ★★★ |
| MÉDIO | 15 | ★★☆ |
| FÁCIL | 12 | ★☆☆ |

---

## 📊 Estrutura de Dados (cases.json)

```json
{
  "id": 1,
  "title": "Título do Caso",
  "theme": "CRIME",
  "level": "EXTREMO",
  "tags": ["HOMICÍDIO", "POLÍCIA"],
  "location": "Cidade, Estado — Ano",
  "victim": "Nome da Vítima",
  "synopsis": "Resumo do cenário do crime...",
  "clues": [
    "Pista 1 — detalhe crucial",
    "Pista 2 — contradição",
    "Pista 3 — evidência física"
  ],
  "suspects": [
    {"name": "Nome do Suspeito", "motive": "Motivo possível"},
    {"name": "Outro Suspeito", "motive": "Outro motivo"}
  ],
  "solution": "Explicação completa de quem é o culpado e por quê...",
  "answer_hint": "Dica sutil para ajudar na dedução"
}
```

**Campos obrigatórios:** `id`, `title`, `theme`, `synopsis`, `clues[]`, `suspects[]`, `solution`
**Campos opcionais:** `level`, `tags`, `location`, `victim`, `answer_hint`

---

## 🔐 Sistema de Auth (localStorage)

O sistema de autenticação usa **localStorage** para simplicity (sem backend server):

```js
// Estrutura do usuário salvo
{
  id: string,          // UUID gerado
  name: string,        // Nome completo
  email: string,       // Email
  password: string,    // Senha (plaintext — para demo only)
  avatar: string,      // Emoji avatar
  xp: number,          // XP total acumulado
  level: number,       // Nível atual (1-10)
  totalScore: number,  // Pontuação total
  totalCasesCompleted: number,
  createdAt: string,   // ISO timestamp
  achievements: string[] // IDs das conquistas desbloqueadas
}
```

> ⚠️ **Aviso:** O sistema localStorage é para demonstração. Para produção, substitua por Supabase Auth com senhas hashadas.

---

## ⚙️ Configuração

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SOCKET_URL=http://localhost:3001    # Opcional — servidor multiplayer
```

### Design System — Cores e Tipografia

**Palette** (`tailwind.config.js`):

| Token | Hex | Uso |
|-------|-----|-----|
| `noir` | `#0a0a0a` | Background principal |
| `noir2` | `#111111` | Cards, header |
| `gold` | `#c9a84c` | Destaques, CTAs, bordas ativas |
| `goldLight` | `#e8c96a` | Hover states |
| `crimson` | `#c41e3a` | Alertas, botões primários |
| `paper` | `#f0ece3` | Texto principal (alta legibilidade) |
| `paperDim` | `#b8b0a0` | Texto secundário |

**Fontes:**
- **Special Elite** (Google Fonts) — typewriter/serif para títulos e badges
- **Crimson Pro** (Google Fonts) — serif para corpo de texto

**Escala tipográfica** ( Tailwind `text-*`):

| Classe | Tamanho |
|--------|---------|
| `text-xs` | 13px |
| `text-sm` | 15px |
| `text-base` | 17px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |
| `text-4xl` | 36px |

---

## 🐛 Error Tracking — Admin Panel

O jogo possui um **sistema de tracking de erros** integrado ao Admin Panel:

### Como funciona
1. `src/main.jsx` define `window.__ErrorTracker` com 3 métodos:
   - `log(error, context)` — registra erro no localStorage
   - `getErrors()` — retorna array de erros
   - `clearErrors()` — limpa o log
2. Capture eventos:
   - `window.onerror` — todos erros JavaScript runtime
   - `unhandledrejection` — promessas rejeitadas
3. Cada erro salva: message, stack, URL, timestamp, user agent, context
4. Máximo 100 erros (FIFO), persiste em `mp_error_log`

### Tab Admin → 🐛 Erros
- Lista todos os erros com mensagem, fonte, timestamp
- Stack trace expansível
- Botão "Limpar Registros"
- Info box explicando funcionamento

---

## 🤝 Como Contribuir

### Adicionando Novos Casos

Edite `public/cases.json` e adicione um novo objeto:

```json
{
  "id": 51,
  "title": "Meu Novo Caso",
  "theme": "MISTÉRIO",
  "level": "MÉDIO",
  "tags": ["DESAPARECIMENTO"],
  "location": "São Paulo, SP — 2023",
  "victim": "Nome da Vítima",
  "synopsis": "Descrição do cenário...",
  "clues": ["Pista 1", "Pista 2", "Pista 3"],
  "suspects": [
    {"name": "Suspeito A", "motive": "Motivo"},
    {"name": "Suspeito B", "motive": "Motivo"}
  ],
  "solution": "Quem é o culpado e a explicação lógica...",
  "answer_hint": "Dica sutil"
}
```

> ⚠️ O `id` deve ser único. Use o próximo número disponível.

### Corrigindo Bugs

```bash
git checkout -b fix/descricao-do-bug
# edite os arquivos
git commit -m "fix: descricao do bug"
git push origin fix/descricao-do-bug
# Abra Pull Request no GitHub
```

### Roadmap de Features

- [ ] Sistema de conquistas reais (não só visual)
- [ ] Modo campanha (casos encadeados com história)
- [ ] Mais minigames Phaser (interrogatório, busca de provas)
- [ ] Sistema de hints progressivos
- [ ] Trilha sonora original
- [ ] Dark/Light theme toggle
- [ ] i18n (inglês, espanhol)
- [ ] Leaderboard de detetives com Supabase
- [ ] Sistema de amigos/amigos

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Cases não carregam (404) | Verifique `public/cases.json` existe — não só `src/data/` |
| Áudio não toca | Browser bloqueou autoplay — clique qualquer botão primeiro |
| Estilos quebrados | DevTools → Application → Clear Storage |
| Deploy antigo no Vercel | Use sempre `--prod --force` para invalidar CDN |
| `Objects are not valid as a React child` | Verifique `{s}` foi substituído por `{s.name}` nos `.map()` de suspects |
| Erro ao criar sala multiplayer | Servidor Socket.IO não está rodando — `npm run server` em `server/` |

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Autor

**Marcondes Rodrigues Jr** — Fortaleza, CE, Brasil

- 💼 [LinkedIn](https://www.linkedin.com/in/marcondes-rodrigues-junior/)
- 📘 [Facebook](https://www.facebook.com/webstreetbr)
- 📸 [Instagram](https://www.instagram.com/web.street/)
- 💻 [GitHub](https://github.com/marckcrow)
- 💬 [WhatsApp](https://wa.me/5585985035473)

---

## ❤️ Apoie o Projeto

**PIX:** `d20317c0-c755-408e-9579-0139a27aff3e`
**Favorecido:** JOSE MARCONDES RODRIGUES DA SILVA JUNIOR

O QR Code está disponível na aba **❤️ Apoie o Projeto** na página Sobre do jogo.

Qualquer valor ajuda a criar novos casos, melhorar o áudio e desenvolver minigames! ☕

---

<p align="center">
  <strong>Casal Investigador</strong> — Feito com ❤️ no Brasil<br/>
  <em>"Todo criminoso deixa um rastro. Cabe ao detetive encontrá-lo."</em>
</p>
