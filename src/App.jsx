import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Solo from './pages/Solo'
import Game from './pages/Game'
import Multiplayer from './pages/Multiplayer'
import Sobre from './pages/Sobre'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jogar" element={<Solo />} />
        <Route path="/jogo/:caseId" element={<Game />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </BrowserRouter>
  )
}
