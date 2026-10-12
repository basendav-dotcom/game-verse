import { useEffect, useState } from 'react'

const gameShell = {
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 20px',
  background: 'radial-gradient(circle at 20% 10%, rgba(34, 211, 238, 0.16), transparent 35%), #08111f',
  color: 'white',
}

function GameFrame({ title, score, children }) {
  return (
    <section style={{ width: 'min(720px, 100%)', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>{title}</h2>
        <strong style={{ color: 'var(--color-cyan-300)', fontSize: '1.1rem' }}>{score}</strong>
      </div>
      {children}
    </section>
  )
}

function NeonDodge() {
  const [running, setRunning] = useState(false)
  const [player, setPlayer] = useState(50)
  const [sparks, setSparks] = useState([])
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!running) return undefined
    const keyHandler = event => {
      if (!['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(event.key)) return
      event.preventDefault()
      setPlayer(value => Math.max(8, Math.min(92, value + (event.key === 'ArrowLeft' || event.key === 'a' ? -7 : 7))))
    }
    const timer = window.setInterval(() => {
      setSparks(items => {
        const moved = items.map(spark => ({ ...spark, y: spark.y + 7 })).filter(spark => spark.y < 100)
        const hit = moved.some(spark => spark.y > 82 && Math.abs(spark.x - player) < 8)
        if (hit) {
          setRunning(false)
          return []
        }
        setScore(value => value + 1)
        return [...moved, { x: Math.floor(Math.random() * 84) + 8, y: 0, id: Date.now() }]
      })
    }, 180)
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [running, player])

  const start = () => {
    setPlayer(50)
    setSparks([])
    setScore(0)
    setRunning(true)
  }

  return (
    <GameFrame title="Neon Dodge" score={`Score ${score}`}>
      <div style={{ position: 'relative', height: 'min(62vh, 480px)', minHeight: '320px', overflow: 'hidden', border: '1px solid rgba(34,211,238,.45)', background: 'linear-gradient(#0b2037, #07101d)', borderRadius: '10px' }}>
        {sparks.map(spark => <span key={spark.id} style={{ position: 'absolute', left: `${spark.x}%`, top: `${spark.y}%`, width: '10px', height: '30px', borderRadius: '8px', background: '#fbbf24', boxShadow: '0 0 18px #fbbf24' }} />)}
        <span style={{ position: 'absolute', left: `${player}%`, bottom: '8%', transform: 'translateX(-50%)', width: '42px', height: '42px', borderRadius: '8px', background: 'var(--color-cyan-400)', boxShadow: '0 0 25px var(--color-cyan-400)' }} />
        {!running && <button className="btn-primary" onClick={start} style={{ position: 'absolute', inset: 0, margin: 'auto', height: 'fit-content', width: 'fit-content' }}>{score ? 'Play Again' : 'Start Game'}</button>}
      </div>
      <p style={{ color: '#94a3b8', marginTop: '14px' }}>Move with A/D or the arrow keys.</p>
    </GameFrame>
  )
}

function MemoryMatch() {
  const [cards, setCards] = useState(() => shuffleCards())
  const [open, setOpen] = useState([])
  const [matched, setMatched] = useState([])
  const [turns, setTurns] = useState(0)

  useEffect(() => {
    if (open.length !== 2) return undefined
    const timer = window.setTimeout(() => {
      if (cards[open[0]] === cards[open[1]]) setMatched(value => [...value, cards[open[0]]])
      setOpen([])
    }, 650)
    return () => window.clearTimeout(timer)
  }, [open, cards])

  const reset = () => {
    setCards(shuffleCards())
    setOpen([])
    setMatched([])
    setTurns(0)
  }

  return (
    <GameFrame title="Memory Match" score={`Turns ${turns}`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
        {cards.map((card, index) => {
          const visible = open.includes(index) || matched.includes(card)
          return <button key={index} onClick={() => { if (visible || open.length === 2) return; setOpen(value => [...value, index]); setTurns(value => value + 1) }} style={{ aspectRatio: '1', border: '1px solid rgba(251,191,36,.4)', borderRadius: '8px', background: visible ? 'rgba(251,191,36,.18)' : '#12243a', color: 'white', fontSize: 'clamp(1.8rem, 7vw, 3rem)', cursor: visible ? 'default' : 'pointer' }}>{visible ? card : '?'}</button>
        })}
      </div>
      {matched.length === 6 && <button className="btn-primary" onClick={reset} style={{ marginTop: '22px' }}>Play Again</button>}
    </GameFrame>
  )
}

function shuffleCards() {
  return ['◆', '◆', '●', '●', '▲', '▲', '★', '★', '✚', '✚', '♥', '♥'].sort(() => Math.random() - 0.5)
}

function OrbitTap() {
  const [running, setRunning] = useState(false)
  const [time, setTime] = useState(30)
  const [score, setScore] = useState(0)
  const [target, setTarget] = useState({ x: 50, y: 50 })

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => setTime(value => {
      if (value <= 1) { setRunning(false); return 0 }
      return value - 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const start = () => { setScore(0); setTime(30); setTarget({ x: 50, y: 50 }); setRunning(true) }
  const hit = () => { setScore(value => value + 1); setTarget({ x: Math.floor(Math.random() * 80) + 10, y: Math.floor(Math.random() * 70) + 15 }) }

  return (
    <GameFrame title="Orbit Tap" score={`${time}s · ${score} hits`}>
      <div style={{ position: 'relative', height: 'min(62vh, 480px)', minHeight: '320px', border: '1px solid rgba(251,113,133,.45)', borderRadius: '10px', background: 'radial-gradient(circle, rgba(251,113,133,.15), #111827 55%)' }}>
        {running && <button aria-label="Hit target" onClick={hit} style={{ position: 'absolute', left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)', width: '58px', height: '58px', borderRadius: '50%', border: '4px solid #fecdd3', background: '#fb7185', boxShadow: '0 0 30px #fb7185', cursor: 'crosshair' }} />}
        {!running && <button className="btn-primary" onClick={start} style={{ position: 'absolute', inset: 0, margin: 'auto', height: 'fit-content', width: 'fit-content' }}>{time === 0 ? 'Play Again' : 'Start Game'}</button>}
      </div>
      <p style={{ color: '#94a3b8', marginTop: '14px' }}>Thirty seconds. One target. Make it count.</p>
    </GameFrame>
  )
}

function LocalGame({ type }) {
  if (type === 'neon-dodge') return <NeonDodge />
  if (type === 'memory-match') return <MemoryMatch />
  return <OrbitTap />
}

export default LocalGame
