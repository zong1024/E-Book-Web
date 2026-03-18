import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ReaderPage from './pages/ReaderPage'
import './App.css'

function Navbar() {
  const location = useLocation()
  const isReaderPage = location.pathname.startsWith('/reader/')
  
  // 阅读器页面不显示导航栏
  if (isReaderPage) {
    return null
  }
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">📚 EPUB电子书阅读器</Link>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
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