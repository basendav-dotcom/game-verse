import { useState, useEffect } from 'react'
import GameTile from '../components/GameTile'

function Home() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch('https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&tags=All&subType=all&type=all&mobile=all&rewarded=all&amount=45&page=1&format=json')
        const data = await res.json()
        setGames(data)
        // Store games in localStorage so the Play page can access the URL and details
        localStorage.setItem('gameverse_games', JSON.stringify(data))
      } catch (err) {
        console.error('Failed to fetch games:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [])

  // Helper to assign random grid spans for the masonry effect
  const getSpanClass = (index) => {
    // Make the first item a large feature
    if (index === 0) return 'span-col-2 span-row-2'
    
    // Randomly assign some other items to be larger
    const random = Math.random()
    if (random > 0.95) return 'span-col-2 span-row-2'
    if (random > 0.85) return 'span-col-2'
    if (random > 0.75) return 'span-row-2'
    
    return '' // Default 1x1
  }

  return (
    <div className="page-container">
      {/* Hero Mini-Header */}
      <div style={{ textAlign: 'center', padding: '40px 24px 20px' }}>
        <h1 className="gradient-text" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>
          Play Free Online Games
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
          Discover the best free HTML5 games right in your browser.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="game-grid">
          {games.map((game, i) => (
            <GameTile key={game.Md5} game={game} spanClass={getSpanClass(i)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
