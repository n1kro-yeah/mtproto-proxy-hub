import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import { About } from './pages/About.tsx'
import { ProxyMap } from './pages/ProxyMap.tsx'
import 'flag-icons/css/flag-icons.min.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/map" element={<ProxyMap />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
