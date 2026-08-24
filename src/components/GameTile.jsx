import { Link } from 'react-router-dom'

function GameTile({ game, spanClass = '' }) {
  // Use the pre-normalized image url
  const imgUrl = game.image || 'https://via.placeholder.com/512x512?text=Game';

  return (
    <Link to={`/play/${game.id}`} className={`game-tile ${spanClass}`}>
      <img
        src={imgUrl}
        alt={game.title}
        className="game-tile-img"
        loading="lazy"
      />
      <div className="game-tile-overlay">
        <div className="game-tile-title">{game.title}</div>
      </div>
      <div className="play-icon">▶</div>
    </Link>
  )
}

export default GameTile
