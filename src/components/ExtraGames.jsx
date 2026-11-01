import { useEffect, useReducer, useState } from 'react'

function GamePanel({ title, score, children }) {
  return (
    <div className="extra-game-shell">
      <section className="extra-game">
        <div className="extra-game-heading">
          <h2>{title}</h2>
          <strong>{score}</strong>
        </div>
        {children}
      </section>
    </div>
  )
}

function ActionButton({ children, onClick, disabled = false }) {
  return (
    <button className="extra-game-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function initialSnake() {
  return {
    snake: [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }],
    direction: { x: 1, y: 0 },
    food: { x: 11, y: 8 },
    score: 0,
    status: 'ready',
  }
}

function snakeReducer(state, action) {
  if (action.type === 'start') return { ...initialSnake(), status: 'playing' }
  if (action.type === 'turn') {
    const { x, y } = action.direction
    if (x === -state.direction.x && y === -state.direction.y) return state
    return { ...state, direction: { x, y } }
  }
  if (action.type !== 'tick' || state.status !== 'playing') return state

  const head = {
    x: state.snake[0].x + state.direction.x,
    y: state.snake[0].y + state.direction.y,
  }
  const eating = head.x === state.food.x && head.y === state.food.y
  const body = eating ? state.snake : state.snake.slice(0, -1)
  if (
    head.x < 0 || head.x >= 16 || head.y < 0 || head.y >= 16
    || body.some(part => part.x === head.x && part.y === head.y)
  ) {
    return { ...state, status: 'over' }
  }

  const snake = [head, ...state.snake.slice(0, eating ? undefined : -1)]
  if (!eating) return { ...state, snake }
  if (snake.length === 256) {
    return { ...state, snake, score: state.score + 1, status: 'won' }
  }

  let food
  do {
    food = { x: Math.floor(Math.random() * 16), y: Math.floor(Math.random() * 16) }
  } while (snake.some(part => part.x === food.x && part.y === food.y))
  return { ...state, snake, food, score: state.score + 1 }
}

function SnakeGame() {
  const [game, dispatch] = useReducer(snakeReducer, undefined, initialSnake)

  useEffect(() => {
    const onKeyDown = event => {
      const directions = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      }
      if (directions[event.key]) {
        event.preventDefault()
        dispatch({ type: 'turn', direction: directions[event.key] })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (game.status !== 'playing') return undefined
    const timer = window.setInterval(() => dispatch({ type: 'tick' }), 145)
    return () => window.clearInterval(timer)
  }, [game.status])

  const isSnake = (x, y) => game.snake.some(part => part.x === x && part.y === y)
  return (
    <GamePanel title="Snake" score={`Apples ${game.score}`}>
      <div className="snake-board" role="img" aria-label={`Snake game board. Apples eaten: ${game.score}`}>
        {Array.from({ length: 256 }, (_, index) => {
          const x = index % 16
          const y = Math.floor(index / 16)
          const head = game.snake[0].x === x && game.snake[0].y === y
          const food = game.food.x === x && game.food.y === y
          return <span key={index} className={food ? 'snake-food' : isSnake(x, y) ? (head ? 'snake-head' : 'snake-body') : ''} />
        })}
        {game.status !== 'playing' && (
          <div className="extra-game-overlay">
            <p>
              {game.status === 'over'
                ? `Game over — ${game.score} apples!`
                : game.status === 'won'
                  ? 'Perfect run! You filled the whole board!'
                  : 'Eat the apples. Don’t hit the walls or yourself.'}
            </p>
            <ActionButton onClick={() => dispatch({ type: 'start' })}>{game.status === 'ready' ? 'Start Snake' : 'Play again'}</ActionButton>
          </div>
        )}
      </div>
      <p className="extra-game-hint">Use WASD or the arrow keys.</p>
    </GamePanel>
  )
}

function new2048Board() {
  const board = Array(16).fill(0)
  add2048Tile(board)
  add2048Tile(board)
  return { board, score: 0 }
}

function add2048Tile(board) {
  const empty = board.reduce((positions, tile, index) => {
    if (!tile) positions.push(index)
    return positions
  }, [])
  if (!empty.length) return
  board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < 0.9 ? 2 : 4
}

function slide2048Line(line) {
  const values = line.filter(Boolean)
  let score = 0
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === values[i + 1]) {
      values[i] *= 2
      score += values[i]
      values.splice(i + 1, 1)
    }
  }
  while (values.length < 4) values.push(0)
  return { line: values, score }
}

function move2048(board, direction) {
  const next = [...board]
  let score = 0
  for (let lineIndex = 0; lineIndex < 4; lineIndex++) {
    const indices = Array.from({ length: 4 }, (_, offset) => {
      if (direction === 'left') return lineIndex * 4 + offset
      if (direction === 'right') return lineIndex * 4 + (3 - offset)
      if (direction === 'up') return offset * 4 + lineIndex
      return (3 - offset) * 4 + lineIndex
    })
    const result = slide2048Line(indices.map(index => board[index]))
    score += result.score
    indices.forEach((index, offset) => { next[index] = result.line[offset] })
  }
  if (next.every((value, index) => value === board[index])) return null
  add2048Tile(next)
  return { board: next, score }
}

function reducer2048(state, action) {
  if (action.type === 'reset') return new2048Board()
  const result = move2048(state.board, action.direction)
  return result ? { board: result.board, score: state.score + result.score } : state
}

function Game2048() {
  const [game, dispatch] = useReducer(reducer2048, undefined, new2048Board)
  const won = game.board.some(tile => tile >= 2048)
  const stuck = game.board.every((tile, index) => {
    if (!tile) return false
    const x = index % 4
    const y = Math.floor(index / 4)
    return (x === 3 || game.board[index + 1] !== tile)
      && (y === 3 || game.board[index + 4] !== tile)
  })

  useEffect(() => {
    const onKeyDown = event => {
      const directions = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }
      if (directions[event.key]) {
        event.preventDefault()
        dispatch({ type: 'move', direction: directions[event.key] })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <GamePanel title="2048" score={`Score ${game.score}`}>
      <div className="game-2048-board" aria-label="2048 game board">
        {game.board.map((tile, index) => (
          <span key={index} className={`game-2048-tile${tile ? ` tile-${Math.min(tile, 2048)}` : ''}`}>{tile || ''}</span>
        ))}
        {(won || stuck) && (
          <div className="extra-game-overlay">
            <p>{won ? '2048! You did it!' : 'No more moves.'}</p>
            <ActionButton onClick={() => dispatch({ type: 'reset' })}>New game</ActionButton>
          </div>
        )}
      </div>
      {!won && !stuck && <p className="extra-game-hint">Use the arrow keys to slide and combine matching tiles.</p>}
    </GamePanel>
  )
}

function getWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  }
  return board.every(Boolean) ? 'draw' : null
}

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(''))
  const [thinking, setThinking] = useState(false)
  const winner = getWinner(board)

  useEffect(() => {
    if (board.filter(Boolean).length === 0 || board.filter(Boolean).length % 2 === 0 || winner) return undefined
    setThinking(true)
    const timer = window.setTimeout(() => {
      const open = board.map((value, index) => value ? -1 : index).filter(index => index >= 0)
      const findWinningMove = mark => open.find(index => {
        const trial = [...board]
        trial[index] = mark
        return getWinner(trial) === mark
      })
      const move = findWinningMove('O')
        ?? findWinningMove('X')
        ?? (board[4] ? open[Math.floor(Math.random() * open.length)] : 4)
      setBoard(current => {
        const next = [...current]
        next[move] = 'O'
        return next
      })
      setThinking(false)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [board, winner])

  const reset = () => { setBoard(Array(9).fill('')); setThinking(false) }
  const result = winner === 'X' ? 'You win!' : winner === 'O' ? 'Computer wins!' : winner === 'draw' ? 'It’s a draw!' : thinking ? 'Computer is thinking…' : 'Your turn — you are X.'
  return (
    <GamePanel title="Tic-Tac-Toe" score={result}>
      <div className="tic-tac-toe-board">
        {board.map((mark, index) => (
          <button
            key={index}
            className={`tic-tac-toe-cell ${mark === 'X' ? 'mark-x' : 'mark-o'}`}
            onClick={() => {
              if (mark || winner || thinking) return
              setBoard(current => {
                const next = [...current]
                next[index] = 'X'
                return next
              })
            }}
            aria-label={`Cell ${index + 1}${mark ? `, ${mark}` : ', empty'}`}
          >
            {mark}
          </button>
        ))}
      </div>
      <ActionButton onClick={reset}>New game</ActionButton>
    </GamePanel>
  )
}

const simonPads = [
  { id: 'green', color: '#34d399', label: 'Green' },
  { id: 'red', color: '#fb7185', label: 'Red' },
  { id: 'yellow', color: '#fbbf24', label: 'Yellow' },
  { id: 'blue', color: '#60a5fa', label: 'Blue' },
]

function SimonSays() {
  const [sequence, setSequence] = useState([])
  const [inputIndex, setInputIndex] = useState(0)
  const [active, setActive] = useState('')
  const [status, setStatus] = useState('ready')
  const [message, setMessage] = useState('Repeat the color sequence.')

  useEffect(() => {
    if (status !== 'showing') return undefined
    let cancelled = false
    const playSequence = async () => {
      await new Promise(resolve => window.setTimeout(resolve, 400))
      for (const color of sequence) {
        if (cancelled) return
        setActive(color)
        await new Promise(resolve => window.setTimeout(resolve, 380))
        if (cancelled) return
        setActive('')
        await new Promise(resolve => window.setTimeout(resolve, 170))
      }
      if (!cancelled) {
        setInputIndex(0)
        setStatus('input')
        setMessage('Your turn!')
      }
    }
    playSequence()
    return () => { cancelled = true }
  }, [sequence, status])

  const start = () => {
    setSequence([simonPads[Math.floor(Math.random() * simonPads.length)].id])
    setStatus('showing')
    setMessage('Watch closely…')
  }

  const choose = color => {
    if (status !== 'input') return
    if (sequence[inputIndex] !== color) {
      setStatus('over')
      setMessage(`Not quite! You reached ${sequence.length - 1} rounds.`)
      return
    }
    setActive(color)
    window.setTimeout(() => setActive(''), 160)
    if (inputIndex === sequence.length - 1) {
      setMessage('Nice! Watch the next round.')
      setSequence(current => [...current, simonPads[Math.floor(Math.random() * simonPads.length)].id])
      setStatus('showing')
    } else {
      setInputIndex(value => value + 1)
    }
  }

  return (
    <GamePanel title="Simon Says" score={`Round ${sequence.length}`}>
      <p className="extra-game-hint">{message}</p>
      <div className="simon-board">
        {simonPads.map(pad => (
          <button
            key={pad.id}
            className={`simon-pad${active === pad.id ? ' simon-pad-active' : ''}`}
            style={{ '--pad-color': pad.color }}
            onClick={() => choose(pad.id)}
            disabled={status !== 'input'}
            aria-label={pad.label}
          />
        ))}
      </div>
      {status !== 'input' && (
        <ActionButton onClick={start}>{status === 'ready' ? 'Start Simon Says' : status === 'over' ? 'Try again' : 'Watch the sequence'}</ActionButton>
      )}
    </GamePanel>
  )
}

function WhackAMole() {
  const [time, setTime] = useState(30)
  const [score, setScore] = useState(0)
  const [mole, setMole] = useState(-1)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return undefined
    const clock = window.setInterval(() => {
      setTime(value => {
        if (value <= 1) { setRunning(false); return 0 }
        return value - 1
      })
    }, 1000)
    const pop = window.setInterval(() => {
      setMole(current => {
        const next = Math.floor(Math.random() * 9)
        return next === current ? (next + 1) % 9 : next
      })
    }, 720)
    return () => { window.clearInterval(clock); window.clearInterval(pop) }
  }, [running])

  const start = () => { setTime(30); setScore(0); setMole(Math.floor(Math.random() * 9)); setRunning(true) }
  return (
    <GamePanel title="Whack-a-Mole" score={`${time}s · ${score} hits`}>
      <div className="mole-board">
        {Array.from({ length: 9 }, (_, index) => (
          <button
            key={index}
            className={`mole-hole${mole === index && running ? ' mole-up' : ''}`}
            onClick={() => { if (running && mole === index) { setScore(value => value + 1); setMole(-1) } }}
            aria-label={mole === index && running ? 'Whack the mole' : 'Empty mole hole'}
            disabled={!running}
          >
            {mole === index && running ? '🐹' : ''}
          </button>
        ))}
        {!running && (
          <div className="extra-game-overlay">
            <p>{time === 0 ? `Time! You scored ${score}.` : 'Catch as many moles as you can in 30 seconds.'}</p>
            <ActionButton onClick={start}>{time === 0 ? 'Play again' : 'Start game'}</ActionButton>
          </div>
        )}
      </div>
    </GamePanel>
  )
}

function makeMathQuestion() {
  const operator = ['+', '−', '×'][Math.floor(Math.random() * 3)]
  const a = operator === '×' ? Math.floor(Math.random() * 10) + 2 : Math.floor(Math.random() * 30) + 1
  const b = operator === '×' ? Math.floor(Math.random() * 10) + 2 : Math.floor(Math.random() * 30) + 1
  const first = operator === '−' && b > a ? b : a
  const second = operator === '−' && b > a ? a : b
  const answer = operator === '+' ? a + b : operator === '−' ? first - second : a * b
  const choices = new Set([answer])
  let offset = 1
  while (choices.size < 3) {
    const candidate = answer + (offset % 2 ? offset : -offset)
    if (candidate >= 0) choices.add(candidate)
    offset++
  }
  return {
    a: first,
    b: second,
    operator,
    answer,
    choices: [...choices].sort(() => Math.random() - 0.5),
  }
}

function QuickMath() {
  const [question, setQuestion] = useState(makeMathQuestion)
  const [time, setTime] = useState(30)
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)
  const [feedback, setFeedback] = useState('Solve as many as you can!')

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => {
      setTime(value => {
        if (value <= 1) { setRunning(false); return 0 }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const answer = value => {
    if (!running) return
    if (Number(value) === question.answer) {
      setScore(current => current + 1)
      setFeedback('Correct!')
    } else {
      setFeedback('Try the next one!')
    }
    setQuestion(makeMathQuestion())
  }
  const start = () => { setTime(30); setScore(0); setFeedback('Go!'); setQuestion(makeMathQuestion()); setRunning(true) }

  return (
    <GamePanel title="Quick Math" score={`${time}s · ${score} points`}>
      <div className="quick-math-card">
        <p className="extra-game-hint">{feedback}</p>
        <strong>{question.a} {question.operator} {question.b} = ?</strong>
        <div className="quick-math-answers">
          {question.choices.map((choice, index) => (
            <ActionButton key={`${choice}-${index}`} disabled={!running} onClick={() => answer(choice)}>{choice}</ActionButton>
          ))}
        </div>
        {!running && <ActionButton onClick={start}>{time === 0 ? 'Play again' : 'Start 30-second round'}</ActionButton>}
      </div>
    </GamePanel>
  )
}

function RockPaperScissors() {
  const options = [
    { id: 'rock', label: '🪨 Rock' },
    { id: 'paper', label: '📄 Paper' },
    { id: 'scissors', label: '✂️ Scissors' },
  ]
  const [score, setScore] = useState({ you: 0, computer: 0 })
  const [message, setMessage] = useState('Choose your move to begin.')
  const [lastMove, setLastMove] = useState('')
  const finished = score.you === 5 || score.computer === 5

  const play = choice => {
    if (finished) return
    const computer = options[Math.floor(Math.random() * options.length)].id
    setLastMove(`You chose ${choice}. Computer chose ${computer}.`)
    if (choice === computer) {
      setMessage('It’s a tie!')
      return
    }
    const wins = (choice === 'rock' && computer === 'scissors')
      || (choice === 'paper' && computer === 'rock')
      || (choice === 'scissors' && computer === 'paper')
    setScore(current => ({ ...current, [wins ? 'you' : 'computer']: current[wins ? 'you' : 'computer'] + 1 }))
    setMessage(wins ? 'You win this round!' : 'Computer wins this round!')
  }

  return (
    <GamePanel title="Rock Paper Scissors" score={`${score.you} — ${score.computer}`}>
      <div className="rps-card">
        <p className="extra-game-hint">{finished ? (score.you === 5 ? 'You won the match!' : 'Computer won the match!') : message}</p>
        <p className="rps-last-move">{lastMove || 'First to 5 wins.'}</p>
        <div className="rps-options">
          {options.map(option => (
            <ActionButton key={option.id} onClick={() => play(option.id)} disabled={finished}>{option.label}</ActionButton>
          ))}
        </div>
        {finished && <ActionButton onClick={() => { setScore({ you: 0, computer: 0 }); setMessage('Choose your move to begin.'); setLastMove('') }}>Rematch</ActionButton>}
      </div>
    </GamePanel>
  )
}

const sprintWords = ['planet', 'rocket', 'puzzle', 'jungle', 'comet', 'castle', 'dragon', 'pixel', 'thunder', 'canyon', 'wizard', 'orbit']

function WordSprint() {
  const [word, setWord] = useState(sprintWords[0])
  const [input, setInput] = useState('')
  const [time, setTime] = useState(30)
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('Type each word before time runs out.')

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => {
      setTime(value => {
        if (value <= 1) { setRunning(false); return 0 }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const start = () => {
    setTime(30)
    setScore(0)
    setInput('')
    setWord(sprintWords[Math.floor(Math.random() * sprintWords.length)])
    setMessage('Go!')
    setRunning(true)
  }

  const submit = event => {
    event.preventDefault()
    if (!running) return
    if (input.trim().toLowerCase() === word) {
      setScore(value => value + 1)
      setWord(sprintWords[Math.floor(Math.random() * sprintWords.length)])
      setMessage('Nice typing!')
    } else {
      setMessage('Not quite — try again.')
    }
    setInput('')
  }

  return (
    <GamePanel title="Word Sprint" score={`${time}s · ${score} words`}>
      <div className="word-sprint-card">
        <p className="extra-game-hint">{message}</p>
        <strong>{word}</strong>
        <form className="word-sprint-form" onSubmit={submit}>
          <input
            value={input}
            onChange={event => setInput(event.target.value)}
            placeholder="Type the word…"
            aria-label="Type the displayed word"
            autoComplete="off"
            disabled={!running}
          />
          <ActionButton disabled={!running}>Enter</ActionButton>
        </form>
        {!running && <ActionButton onClick={start}>{time === 0 ? 'Play again' : 'Start 30-second round'}</ActionButton>}
      </div>
    </GamePanel>
  )
}

function ExtraGames({ type }) {
  if (type === 'snake') return <SnakeGame />
  if (type === '2048') return <Game2048 />
  if (type === 'tic-tac-toe') return <TicTacToe />
  if (type === 'simon-says') return <SimonSays />
  if (type === 'whack-a-mole') return <WhackAMole />
  if (type === 'quick-math') return <QuickMath />
  if (type === 'rock-paper-scissors') return <RockPaperScissors />
  if (type === 'word-sprint') return <WordSprint />
  return null
}

export default ExtraGames
