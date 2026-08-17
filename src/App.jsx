import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import PlayGame from './pages/PlayGame'
import About from './pages/About'

function App() {
  return (
    <>
      <div className="bg-mesh" />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play/:id" element={<PlayGame />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
