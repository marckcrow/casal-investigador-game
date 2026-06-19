import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Solo from './pages/Solo'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-noir text-paper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jogar" element={<Solo />} />
          <Route path="/jogo/:caseId" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
