# 🕵️ Casal Investigador

**Um jogo interativo de investigação criminal para casais e amigos — 50 casos reais, 5 papéis, infinitas possibilidades.**

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Live-black?logo=vercel)](https://casal-investigador-game.vercel.app)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🔗 **Jogue agora:** [casal-investigador-game.vercel.app](https://casal-investigador-game.vercel.app)

---

## 📖 Sobre o Projeto

O **Casal Investigador** é um jogo de investigação criminal inspirado em crimes famosos do Brasil e do mundo. Cada caso é um universo próprio com suspeitos, pistas, um dossiê completo e uma solução lógica.

O jogador escolhe um **papel** (Detetive, Criminoso, Testemunha A/B ou Família) e cada papel revela informações diferentes sobre o mesmo crime. No modo multiplayer, os jogadores precisam **colaborar** para montar o quebra-cabeça completo!

### ✨ Features

- 🔍 **50 casos únicos** — inspirados em crimes reais (homicídios, desaparecimentos, fraudes, mistérios)
- 🎭 **5 papéis jogáveis** — cada um com informações exclusivas e objetivos diferentes
- 🎮 **Modo Solo + Multiplayer** — jogue sozinho ou em grupo via Socket.IO
- 🌙 **7 temas** — Crime, Horror, Ocultismo, Mistério, Suspense, Crime Organizado, Mistério Brasileiro
- 📱 **PWA** — instale no celular como app nativo
- 🎵 **Áudio procedural** — sons ambiente gerados por Web Audio API (sem arquivos externos)
- 🕹️ **Minigames Phaser** — cena interativa de quadro de evidências
- 📖 **Dossiê completo** — local, ano, vítima, suspeitos com motivações, pistas detalhadas
- ♿ **Responsivo** — funciona em desktop, tablet e mobile
- 🌙 **Tema noir/detetive** — visual dark com acentos dourados, fonte typewriter

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| **React** | 19.x | UI components, routing |
| **Vite** | 8.x | Build tool, dev server |
| **Tailwind CSS** | 3.x | Styling, responsive design |
| **React Router DOM** | 6.x | SPA routing (`/`, `/jogar`, `/jogo/:id`, `/multiplayer`, `/sobre`) |
| **Phaser** | 4.x | Minigames interativos (quadro de evidências) |
| **Socket.IO Client** | 4.x | Multiplayer real-time |
| **Howler.js** | 2.x | Audio engine (backup) |
| **Framer Motion** | 12.x | Animações UI |
| **Web Audio API** | Native | Sons procedurais (chuva, drone, SFX) |
| **PWA / Service Worker** | Custom | Offline-first, installable |

### Infraestrutura

| Serviço | Detalhes |
|---|---|
| **Hosting** | Vercel (CDN global) |
| **Multiplayer Server** | Node.js + Socket.IO (opcional, `server/` directory) |
| **Banco de Dados** | Supabase (PostgreSQL) — salas multiplayer |
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
# Build otimizado
npm run build

# Preview da build
npm run preview
```

Os arquivos de produção ficam em `dist/`.

### Deploy na Vercel

```bash
# Deploy (requer token)
npx vercel --prod --force --token SEU_TOKEN
```

---

## 📁 Estrutura do Projeto

```
casal-investigador-game/
├── index.html                  # HTML principal (YouTube BGM iframe incluído)
├── package.json                # Dependências e scripts
├── vite.config.js              # Configuração Vite (+ React plugin)
├── tailwind.config.js          # Cores customizadas (noir, gold, crimson...)
├── vercel.json                 # SPA rewrite rules (exclui assets estáticos)
├── postcss.config.js           # PostCSS para Tailwind
│
├── public/                     # Arquivos estáticos servidos pelo Vite
│   ├── cases.json             # ⭐ DADOS PRINCIPAIS: 50 casos completos
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── favicon.svg            # Ícone
│
├── src/
│   ├── main.jsx               # Entry point React
│   ├── App.jsx                # Rotas (5 rotas)
│   ├── index.css              # Estilos globais + Tailwind + animações custom
│   │
│   ├── pages/
│   │   ├── Home.jsx           # Página inicial: grid de 50 casos + filtros
│   │   ├── Solo.jsx           # Modo solo: seleção de caso
│   │   ├── Game.jsx           # ⭐ Motor do jogo: dossiê, fases, vitória/derrota
│   │   ├── Multiplayer.jsx    # ⭐ Modo multiplayer: lobby, papéis, votação
│   │   └── Sobre.jsx          # Sobre: instruções, colaborar, PIX, redes sociais
│   │
│   ├── data/
│   │   ├── cases.json         # Fonte dos dados (copiada para public/)
│   │   └── enrich_cases.js    # Script de enriquecimento de dados (CHARACTERS config)
│   │
│   ├── game/
│   │   └── GameScene.js       # Cena Phaser: quadro de evidências interativo
│   │
│   └── lib/
│       ├── audio.js           # ⭐ Web Audio API: chuva, drone, SFX procedurais
│       └── socket.js          # Socket.IO client para multiplayer
│
├── server/                     # Servidor multiplayer (Node.js + Express + Socket.IO)
│   ├── index.js
│   └── package.json
│
└── supabase/                   # Migrations SQL para Supabase
    └── migrations/
        ├── 001_multiplayer.sql
        └── 002_add_solution_hint.sql
```

---

## 🎮 Como Funciona

### Fluxo do Jogo

```
Home (50 casos) → Escolher Papel (5 opções) → Ler Dossiê → Investigar → Confrontar → Resultado
```

### Os 5 Papéis

| Papel | Emoji | Descrição | Objetivo |
|---|---|---|---|
| **Detetive** | 🔍 | Líder da investigação. Acesso a todas as pistas. | Identificar o criminoso corretamente |
| **Criminoso** | 😈 | VOCÉ é o culpado! Conhece toda a verdade. | Não ser descoberto pela votação |
| **Testemunha A** | 👁️ | Viu parte da cena. Informações fragmentadas. | Ajudar a identificar o verdadeiro culpado |
| **Testemunha B** | 👁️ | Outra perspectiva. Complementa Testemunha A. | Cruzar informações com outros jogadores |
| **Família** | 👨‍👩‍👧 | Parente da vítima. Conhece segredos ocultos. | Revelar informações que ninguém mais tem |

### Temas dos Casos

| Tema | Quantidade | Badge Color |
|---|---|---|
| CRIME | 11 | Vermelho (#c41e3a) |
| HORROR | 10 | Roxo (#9b59b6) |
| OCULTISMO | 9 | Roxo escuro (#8e44ad) |
| SUSPENSE | 9 | Laranja (#f39c12) |
| MISTÉRIO / MISTERIO | 10 | Azul (#5dade2) |
| CRIME ORGANIZADO | 1 | Vermelho escuro |
| MISTÉRIO BRASILEIRO | 2 | Azul claro |

### Níveis de Dificuldade

| Nível | Quantidade |
|---|---|
| EXTREMO | 23 |
| MEDIO / MÉDIO | 15 |
| DIFÍCIL / DIFICIL | 12 |

---

## 📊 Estrutura de Dados (cases.json)

Cada caso segue este schema:

```json
{
  "id": 1,
  "title": "Título do Caso",
  "theme": "CRIME",
  "level": "DIFÍCIL",
  "tags": ["HOMICÍDIO", "POLÍCIA", "BAIRRO"],
  "location": "Cidade, Estado — Ano",
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
**Campos opcionais:** `level`, `tags`, `location`, `answer_hint`

---

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_SOCKET_URL=http://localhost:3001    # URL do servidor multiplayer (opcional)
```

> Sem `VITE_SOCKET_URL`, o multiplayer usa `http://localhost:3001` (dev mode).

### Tailwind — Cores Customizadas

A paleta noir/detetive é definida em `tailwind.config.js`:

| Nome | Hex | Uso |
|---|---|---|
| `noir` | `#0a0a0a` | Background principal |
| `noir2` | `#111111` | Cards, header |
| `gold` | `#c9a84c` | Destaques, botões, bordas ativas |
| `goldLight` | `#e8c96a` | Hover states |
| `crimson` | `#c41e3a` | Botões primários, alertas |
| `paper` | `#e8e0d0` | Texto principal |
| `paperDim` | `#8a8070` | Texto secundário |

### Animações CSS Customizadas

Definidas em `src/index.css`:
- `fadeSlideIn` — entrada suave de baixo
- `stampReveal` — efeito de carimbo (dossiê)
- `pulse-gold` — pulso dourado (CTAs)
- `float` — flutuação suave (emojis hero)
- `typewriter` — texto digitando
- `scanline` — overlay de linha de varredura (efeito CRT)

---

## 🤝 Como Contribuir

### Adicionando Novos Casos

Edite `public/cases.json` (ou `src/data/cases.json`) e adicione um novo objeto ao array `cases`:

```json
{
  "id": 51,
  "title": "Meu Novo Caso",
  "theme": "MISTÉRIO",
  "level": "MÉDIO",
  "tags": ["DESPARECIMENTO"],
  "location": "São Paulo, SP — 2023",
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

1. Abra uma **Issue** no GitHub descrevendo o bug (com screenshot se possível)
2. Faça fork do projeto
3. Crie uma branch: `git checkout -b fix/descricao-do-bug`
4. Commit suas mudanças: `git commit -m "fix: descricao do bug"`
5. Push: `git push origin fix/descricao-do-bug`
6. Abra um **Pull Request**

### Sugestões de Features

- [ ] Sistema de achievements / conquistas
- [ ] Modo campanha (casos encadeados)
- [ ] Mais minigames Phaser (interrogatório, busca de provas)
- [ ] Trilha sonora original (áudio gravado vs procedural)
- [ ] Dark/Light theme toggle
- [ ] i18n (inglês, espanhol)
- [ ] Leaderboard de detetives
- [ ] Sistema de hints progressivos

---

## 🐛 Troubleshooting Comum

| Problema | Solução |
|---|---|
| `Rt is not iterable` no multiplayer | Hard refresh: **Ctrl+Shift+R** (cache do navegador) |
| Cases não carregam (404) | Verifique se `public/cases.json` existe (não só `src/data/`) |
| Áudio não toca | Browser bloqueou autoplay — clique em qualquer botão primeiro |
| Estilos quebrados | Limpe cache: DevTools → Application → Clear Storage |
| Deploy antigo no Vercel | Use sempre `--prod --force` para invalidar CDN cache |
| Erro "Objects are not valid as a React child" | Verifique se `{s}` foi substituído por `{s.name}` nos `.map()` de suspects |

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

Gostou do jogo? Considere apoiar o desenvolvimento:

**PIX:** `d20317c0-c755-408e-9579-0139a27aff3e`
**Favorecido:** JOSE MARCONDES RODRIGUES DA SILVA JUNIOR

Qualquer valor ajuda a criar novos casos, melhorar o áudio e desenvolver minigames! ☕

---

<p align="center">
  <strong>Casal Investigador</strong> — Feito com ❤️ no Brasil<br/>
  <em>"Todo criminoso deixa um rasto. Cabe ao detetive encontrá-lo."</em>
</p>
