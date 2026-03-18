import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ReaderPage from './pages/ReaderPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">📚 EPUB电子书阅读器</Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reader/:id" element={<ReaderPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
