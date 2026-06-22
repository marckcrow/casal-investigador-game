import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Solo from './pages/Solo'
import Game from './pages/Game'
import Multiplayer from './pages/Multiplayer'
import MultiplayerJoin from './pages/MultiplayerJoin'
import Sobre from './pages/Sobre'
import Caderno from './pages/Caderno'
import Ranking from './pages/Ranking'
import Personagens from './pages/Personagens'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogar" element={<Solo />} />
        <Route path="/jogo/:caseId" element={<Game />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/sala/:code" element={<MultiplayerJoin />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/caderno" element={<Caderno />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/personagens" element={<Personagens />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
