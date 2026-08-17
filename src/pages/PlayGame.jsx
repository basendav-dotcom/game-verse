import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function PlayGame() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    // Retrieve game data from localStorage
    const savedGames = localStorage.getItem('gameverse_games')
    if (savedGames) {
      const parsed = JSON.parse(savedGames)
      const foundGame = parsed.find(g => g.Md5 === id)
      if (foundGame) {
        setGame(foundGame)
        return
      }
    }
    // If game not found, go back home
    navigate('/')
  }, [id, navigate])

  const toggleFullscreen = () => {
    if (!iframeRef.current) return
    if (iframeRef.current.requestFullscreen) {
      iframeRef.current.requestFullscreen()
    } else if (iframeRef.current.webkitRequestFullscreen) { /* Safari */
      iframeRef.current.webkitRequestFullscreen()
    } else if (iframeRef.current.msRequestFullscreen) { /* IE11 */
      iframeRef.current.msRequestFullscreen()
    }
  }

  if (!game) return <div className="page-container"><div className="spinner" /></div>

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '72px 0 0 0' }}>
      
      {/* Top Bar */}
      <div style={{
        padding: '16px 24px',
        background: 'var(--color-navy-900)',
        borderBottom: '1px solid rgba(74, 140, 199, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>←</span> Back
          </Link>
          <div style={{ width: '1px', height: '24px', background: 'rgba(74, 140, 199, 0.2)' }} />
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
            {game.Title}
          </h1>
        </div>

        <button onClick={toggleFullscreen} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          ⛶ Fullscreen
        </button>
      </div>

      {/* Game Iframe Container */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        <iframe
          ref={iframeRef}
          src={game.Url}
          title={game.Title}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="autoplay; fullscreen; microphone"
        />
      </div>

    </div>
  )
}

export default PlayGame
