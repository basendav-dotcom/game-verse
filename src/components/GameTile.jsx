import { Link } from 'react-router-dom'

function GameTile({ game, spanClass = '' }) {
  // Use the highest quality thumbnail available
  const imgUrl = game.Asset && game.Asset.length > 0
    ? game.Asset.find(a => a.includes('512x512')) || game.Asset[0]
    : 'https://via.placeholder.com/512x512?text=Game';

  return (
    <Link to={`/play/${game.Md5}`} className={`game-tile ${spanClass}`}>
      <img
        src={imgUrl}
        alt={game.Title}
        className="game-tile-img"
        loading="lazy"
      />
      <div className="game-tile-overlay">
        <div className="game-tile-title">{game.Title}</div>
      </div>
      <div className="play-icon">▶</div>
    </Link>
  )
}

export default GameTile
