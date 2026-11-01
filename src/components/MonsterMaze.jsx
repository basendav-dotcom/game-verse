import { useEffect, useRef, useState } from 'react'
import monsterImage from '../assets/images/monster_black_animation.webp'
import monsterWalkSprites from '../assets/images/monster_walk_sprites.png'

const mazeWidth = 31
const mazeHeight = 31

function createMaze() {
  const cells = Array.from({ length: mazeHeight }, () => Array(mazeWidth).fill('#'))
  let seed = 72431
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]]
  const stack = [{ x: 1, y: 1 }]
  cells[1][1] = '.'

  while (stack.length) {
    const current = stack[stack.length - 1]
    const neighbors = directions
      .map(([dx, dy]) => ({ x: current.x + dx, y: current.y + dy, dx, dy }))
      .filter(({ x, y }) => x > 0 && x < mazeWidth - 1 && y > 0 && y < mazeHeight - 1 && cells[y][x] === '#')

    if (!neighbors.length) {
      stack.pop()
      continue
    }

    const next = neighbors[Math.floor(random() * neighbors.length)]
    cells[current.y + next.dy / 2][current.x + next.dx / 2] = '.'
    cells[next.y][next.x] = '.'
    stack.push({ x: next.x, y: next.y })
  }

  for (let y = 1; y < mazeHeight - 1; y++) {
    for (let x = 1; x < mazeWidth - 1; x++) {
      const horizontalPassage = x % 2 === 0 && y % 2 === 1
      const verticalPassage = x % 2 === 1 && y % 2 === 0
      if (cells[y][x] !== '#' || random() > 0.18) continue
      if (horizontalPassage && cells[y][x - 1] === '.' && cells[y][x + 1] === '.') cells[y][x] = '.'
      if (verticalPassage && cells[y - 1][x] === '.' && cells[y + 1][x] === '.') cells[y][x] = '.'
    }
  }

  cells[mazeHeight - 2][mazeWidth - 2] = 'E'
  return cells.map(row => row.join(''))
}

const maze = createMaze()
const exit = { x: mazeWidth - 2, y: mazeHeight - 2 }

const startingKeys = [
  { x: 7, y: 7 },
  { x: 15, y: 15 },
  { x: 23, y: 23 },
]
const fieldOfView = Math.PI / 3
const canvasWidth = 960
const canvasHeight = 540

function wrapAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2
  while (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

function isWall(x, y) {
  const tile = maze[Math.floor(y)]?.[Math.floor(x)]
  return tile === undefined || tile === '#'
}

function findEnemyStep(enemy, player) {
  const start = { x: Math.floor(player.x), y: Math.floor(player.y) }
  const queue = [start]
  const distances = new Map([[`${start.x},${start.y}`, 0]])
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]

  for (let i = 0; i < queue.length; i++) {
    const current = queue[i]
    for (const [dx, dy] of directions) {
      const x = current.x + dx
      const y = current.y + dy
      const key = `${x},${y}`
      if (isWall(x + 0.5, y + 0.5) || distances.has(key)) continue
      distances.set(key, distances.get(`${current.x},${current.y}`) + 1)
      queue.push({ x, y })
    }
  }

  let best = enemy
  let bestDistance = distances.get(`${Math.floor(enemy.x)},${Math.floor(enemy.y)}`) ?? Infinity
  for (const [dx, dy] of directions) {
    const x = Math.floor(enemy.x) + dx
    const y = Math.floor(enemy.y) + dy
    const distance = distances.get(`${x},${y}`)
    if (distance !== undefined && distance < bestDistance) {
      best = { x: x + 0.5, y: y + 0.5 }
      bestDistance = distance
    }
  }
  return best
}

function drawMonster(ctx, image, x, floor, height, frame) {
  const frameCount = 5
  const frameWidth = image.naturalWidth / frameCount
  const scale = height / image.naturalHeight
  ctx.save()
  ctx.translate(x, floor)
  ctx.scale(scale, scale)
  ctx.globalAlpha = 0.94
  ctx.shadowColor = 'rgba(0, 0, 0, .85)'
  ctx.shadowBlur = height * 0.08
  ctx.filter = 'none'
  ctx.drawImage(
    image,
    frame * frameWidth, 0, frameWidth, image.naturalHeight,
    -frameWidth / 2, -image.naturalHeight, frameWidth, image.naturalHeight,
  )
  ctx.restore()
}

function drawScene(ctx, world, time) {
  const { width, height } = ctx.canvas
  const horizon = height * 0.43
  const player = world.player
  const rayCount = 300
  const stripWidth = width / rayCount
  const depthBuffer = new Float32Array(rayCount)

  const flicker = 0.94 + Math.sin(time / 380) * 0.035 + (Math.sin(time / 91) > 0.985 ? 0.08 : 0)
  const ceiling = ctx.createLinearGradient(0, 0, 0, horizon)
  ceiling.addColorStop(0, '#46370f')
  ceiling.addColorStop(0.76, '#77601f')
  ceiling.addColorStop(1, '#aa882d')
  ctx.fillStyle = ceiling
  ctx.fillRect(0, 0, width, horizon)
  const floor = ctx.createLinearGradient(0, horizon, 0, height)
  floor.addColorStop(0, '#765c1b')
  floor.addColorStop(0.42, '#574316')
  floor.addColorStop(1, '#211b0d')
  ctx.fillStyle = floor
  ctx.fillRect(0, horizon, width, height - horizon)

  for (let column = 0; column < rayCount; column++) {
    const camera = (column / rayCount) * 2 - 1
    const rayAngle = player.angle + Math.atan(camera * Math.tan(fieldOfView / 2))
    const rayX = Math.cos(rayAngle)
    const rayY = Math.sin(rayAngle)
    let mapX = Math.floor(player.x)
    let mapY = Math.floor(player.y)
    const deltaX = Math.abs(1 / (rayX || 0.0001))
    const deltaY = Math.abs(1 / (rayY || 0.0001))
    const stepX = rayX < 0 ? -1 : 1
    const stepY = rayY < 0 ? -1 : 1
    let sideX = (rayX < 0 ? player.x - mapX : mapX + 1 - player.x) * deltaX
    let sideY = (rayY < 0 ? player.y - mapY : mapY + 1 - player.y) * deltaY
    let side = 0
    let distance = 0

    while (distance < 18) {
      if (sideX < sideY) {
        distance = sideX
        sideX += deltaX
        mapX += stepX
        side = 0
      } else {
        distance = sideY
        sideY += deltaY
        mapY += stepY
        side = 1
      }
      if (maze[mapY]?.[mapX] === '#') break
    }

    const correctedDistance = Math.max(0.1, distance * Math.cos(rayAngle - player.angle))
    depthBuffer[column] = correctedDistance
    const wallHeight = Math.min(height * 1.5, (height * 0.86) / correctedDistance)
    const wallTop = horizon - wallHeight / 2
    const wallPosition = side === 0
      ? player.y + distance * rayY
      : player.x + distance * rayX
    const wallU = wallPosition - Math.floor(wallPosition)
    const wallCell = Math.floor(wallPosition * 8)
    const variation = Math.sin(wallCell * 12.9898 + mapX * 78.233 + mapY * 37.719) * 5
    const shade = Math.max(0.1, 1 - correctedDistance / 13) * (side ? 0.72 : 1) * flicker
    const red = Math.floor((151 + variation) * shade)
    const green = Math.floor((119 + variation * 0.82) * shade)
    const blue = Math.floor((37 + variation * 0.32) * shade)

    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`
    ctx.fillRect(column * stripWidth, wallTop, stripWidth + 1, wallHeight)
    const seam = Math.min(wallU, 1 - wallU)
    if (seam < 0.018 || Math.abs(wallU - 0.5) < 0.012) {
      ctx.fillStyle = `rgba(43, 31, 8, ${0.24 * shade})`
      ctx.fillRect(column * stripWidth, wallTop, stripWidth + 1, wallHeight)
    }
    if (column % 2 === 0) {
      const stain = Math.sin(mapX * 21 + mapY * 13 + Math.floor(wallU * 19)) > 0.72
      if (stain) {
        ctx.fillStyle = `rgba(45, 33, 8, ${0.055 * shade})`
        ctx.fillRect(column * stripWidth, wallTop + wallHeight * 0.3, stripWidth + 1, wallHeight * 0.28)
      }
    }
    if (wallHeight > 22 && (column % 2 === 0)) {
      ctx.fillStyle = `rgba(255, 226, 135, ${0.07 * shade})`
      ctx.fillRect(column * stripWidth, wallTop + wallHeight * 0.08, stripWidth + 1, Math.max(1, wallHeight * 0.008))
      ctx.fillStyle = `rgba(48, 35, 9, ${0.14 * shade})`
      ctx.fillRect(column * stripWidth, wallTop + wallHeight * 0.94, stripWidth + 1, Math.max(1, wallHeight * 0.012))
    }
  }

  const drawCeilingLight = (x, y) => {
    const dx = x - player.x
    const dy = y - player.y
    const distance = Math.hypot(dx, dy)
    const relativeAngle = wrapAngle(Math.atan2(dy, dx) - player.angle)
    if (Math.abs(relativeAngle) > fieldOfView / 2 || distance < 0.3) return
    const screenX = width / 2 + (relativeAngle / (fieldOfView / 2)) * (width / 2)
    const column = Math.max(0, Math.min(rayCount - 1, Math.floor(screenX / stripWidth)))
    if (depthBuffer[column] < distance - 0.15) return
    const scale = height / distance
    const lampWidth = Math.max(3, scale * 0.32)
    const lampHeight = Math.max(2, scale * 0.035)
    const lampY = horizon - scale * 0.35
    const glow = ctx.createRadialGradient(screenX, lampY, 1, screenX, lampY, lampWidth * 2.3)
    glow.addColorStop(0, `rgba(255, 239, 177, ${0.5 * flicker})`)
    glow.addColorStop(1, 'rgba(255, 226, 135, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(screenX - lampWidth * 2.3, lampY - lampWidth * 2.3, lampWidth * 4.6, lampWidth * 4.6)
    ctx.fillStyle = `rgba(255, 247, 207, ${0.9 * flicker})`
    ctx.fillRect(screenX - lampWidth / 2, lampY - lampHeight / 2, lampWidth, lampHeight)
    ctx.fillStyle = 'rgba(73, 55, 15, .55)'
    ctx.fillRect(screenX - lampWidth / 2, lampY + lampHeight / 2, lampWidth, Math.max(1, lampHeight * 0.3))
  }

  drawCeilingLight(3.5, 5.5)
  drawCeilingLight(15.5, 15.5)
  drawCeilingLight(27.5, 23.5)

  const drawMarker = (x, y, color, size, kind) => {
    const dx = x - player.x
    const dy = y - player.y
    const distance = Math.hypot(dx, dy)
    const relativeAngle = wrapAngle(Math.atan2(dy, dx) - player.angle)
    if (Math.abs(relativeAngle) > fieldOfView / 2 + 0.08 || distance < 0.2) return
    const screenX = width / 2 + (relativeAngle / (fieldOfView / 2)) * (width / 2)
    const column = Math.max(0, Math.min(rayCount - 1, Math.floor(screenX / stripWidth)))
    if (depthBuffer[column] < distance - 0.15) return
    const spriteHeight = Math.min(height * 0.7, (height * size) / distance)
    const floorY = horizon + spriteHeight * 0.5
    if (kind === 'monster') {
      if (world.enemyWalkSprites?.complete && world.enemyWalkSprites.naturalWidth) {
        const walkFrame = world.enemyMoving
          ? Math.floor((time - world.lastEnemyMove) / 150) % 5
          : 0
        drawMonster(ctx, world.enemyWalkSprites, screenX, floorY, spriteHeight, walkFrame)
      }
      return
    }
    const markerSize = Math.max(5, spriteHeight * 0.17)
    ctx.save()
    ctx.translate(screenX, horizon + spriteHeight * 0.25 + Math.sin(time / 220) * 4)
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 18
    if (kind === 'exit') {
      ctx.fillRect(-markerSize / 2, -markerSize * 2, markerSize, markerSize * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(-markerSize, -markerSize * 2.3, markerSize * 2, markerSize * 2.5)
    } else {
      ctx.rotate(Math.PI / 4)
      ctx.fillRect(-markerSize / 2, -markerSize / 2, markerSize, markerSize)
    }
    ctx.restore()
  }

  for (const key of world.keys) {
    if (!key.collected) drawMarker(key.x + 0.5, key.y + 0.5, '#ffe46b', 0.28, 'key')
  }
  drawMarker(exit.x + 0.5, exit.y + 0.5, world.keys.every(key => key.collected) ? '#76ffd1' : '#ff6b5e', 0.75, 'exit')
  drawMarker(world.enemy.x, world.enemy.y, '#1a1008', 1.5, 'monster')

  const monsterDistance = Math.hypot(player.x - world.enemy.x, player.y - world.enemy.y)
  const alarm = Math.max(0, 1 - monsterDistance / 4.5)
  const vignette = ctx.createRadialGradient(width / 2, height * 0.48, height * 0.08, width / 2, height * 0.48, width * 0.7)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(0.66, `rgba(40, 12, 4, ${alarm * (0.08 + Math.sin(time / 115) * 0.035)})`)
  vignette.addColorStop(1, `rgba(0, 0, 0, ${0.68 + alarm * 0.12})`)
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'rgba(255, 236, 155, .75)'
  ctx.fillRect(width / 2 - 1, height / 2, 3, 3)
  if (world.noisePattern) {
    ctx.save()
    ctx.globalAlpha = 0.12
    ctx.fillStyle = world.noisePattern
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}

function MonsterMaze() {
  const canvasRef = useRef(null)
  const worldRef = useRef(null)
  const pressedRef = useRef(new Set())
  const dragRef = useRef(null)
  const [status, setStatus] = useState('intro')
  const [keyCount, setKeyCount] = useState(0)
  const [message, setMessage] = useState('')

  const startGame = () => {
    worldRef.current = {
      player: { x: 1.5, y: 1.5, angle: Math.PI / 2 },
      enemy: { x: mazeWidth - 1.5, y: 1.5 },
      enemyMoveFrom: { x: mazeWidth - 1.5, y: 1.5 },
      enemyMoveTo: { x: mazeWidth - 1.5, y: 1.5 },
      keys: startingKeys.map(key => ({ ...key, collected: false })),
      lastEnemyMove: 0,
    }
    pressedRef.current.clear()
    setKeyCount(0)
    setMessage('')
    setStatus('playing')
  }

  useEffect(() => {
    if (status !== 'playing') return undefined
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return undefined

    let frameId
    let previousTime = 0
    const noiseCanvas = document.createElement('canvas')
    noiseCanvas.width = 96
    noiseCanvas.height = 96
    const noiseContext = noiseCanvas.getContext('2d')
    const noise = noiseContext.createImageData(noiseCanvas.width, noiseCanvas.height)
    for (let i = 0; i < noise.data.length; i += 4) {
      const value = Math.random() * 255
      noise.data[i] = value
      noise.data[i + 1] = value
      noise.data[i + 2] = value
      noise.data[i + 3] = 40
    }
    noiseContext.putImageData(noise, 0, 0)
    worldRef.current.noisePattern = ctx.createPattern(noiseCanvas, 'repeat')
    const monster = new Image()
    monster.onload = () => { if (worldRef.current) worldRef.current.enemyWalkSprites = monster }
    monster.onerror = () => console.error('Failed to load the monster walking sprites.')
    monster.src = monsterWalkSprites
    const keyDown = event => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault()
      pressedRef.current.add(event.key.toLowerCase())
    }
    const keyUp = event => pressedRef.current.delete(event.key.toLowerCase())
    const clearPressed = () => pressedRef.current.clear()
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    window.addEventListener('blur', clearPressed)

    const tick = time => {
      const world = worldRef.current
      if (!world) return
      const delta = Math.min((time - previousTime) / 1000 || 0, 0.05)
      previousTime = time
      const pressed = pressedRef.current
      const player = world.player
      const moveSpeed = 2.15 * delta
      const turnSpeed = 2.2 * delta

      if (pressed.has('arrowleft')) player.angle -= turnSpeed
      if (pressed.has('arrowright')) player.angle += turnSpeed
      const forward = Number(pressed.has('w') || pressed.has('arrowup')) - Number(pressed.has('s') || pressed.has('arrowdown'))
      const strafe = Number(pressed.has('d')) - Number(pressed.has('a'))
      const moveX = (Math.cos(player.angle) * forward + Math.cos(player.angle + Math.PI / 2) * strafe) * moveSpeed
      const moveY = (Math.sin(player.angle) * forward + Math.sin(player.angle + Math.PI / 2) * strafe) * moveSpeed
      if (!isWall(player.x + moveX + Math.sign(moveX) * 0.18, player.y)) player.x += moveX
      if (!isWall(player.x, player.y + moveY + Math.sign(moveY) * 0.18)) player.y += moveY

      let collected = 0
      for (const key of world.keys) {
        if (!key.collected && Math.hypot(player.x - (key.x + 0.5), player.y - (key.y + 0.5)) < 0.48) {
          key.collected = true
          setMessage('Key found. Keep moving.')
        }
        if (key.collected) collected++
      }
      if (collected !== keyCount) setKeyCount(collected)

      if (time - world.lastEnemyMove > 1000) {
        world.enemyMoveFrom = { ...world.enemy }
        world.enemyMoveTo = findEnemyStep(world.enemy, player)
        world.lastEnemyMove = time
      }
      const enemyProgress = Math.min(1, Math.max(0, (time - world.lastEnemyMove) / 750))
      world.enemyMoving = enemyProgress < 1 && Math.hypot(
        world.enemyMoveTo.x - world.enemyMoveFrom.x,
        world.enemyMoveTo.y - world.enemyMoveFrom.y,
      ) > 0
      world.enemy.x = world.enemyMoveFrom.x + (world.enemyMoveTo.x - world.enemyMoveFrom.x) * enemyProgress
      world.enemy.y = world.enemyMoveFrom.y + (world.enemyMoveTo.y - world.enemyMoveFrom.y) * enemyProgress
      if (Math.hypot(player.x - world.enemy.x, player.y - world.enemy.y) < 0.5) {
        setMessage('')
        setStatus('caught')
      }
      if (collected === startingKeys.length && Math.hypot(player.x - exit.x - 0.5, player.y - exit.y - 0.5) < 0.55) {
        setMessage('')
        setStatus('won')
      }

      drawScene(ctx, world, time)
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      window.removeEventListener('blur', clearPressed)
      pressedRef.current.clear()
    }
  }, [keyCount, status])

  const holdControl = key => ({
    onPointerDown: event => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      pressedRef.current.add(key)
    },
    onPointerUp: () => pressedRef.current.delete(key),
    onPointerCancel: () => pressedRef.current.delete(key),
    onLostPointerCapture: () => pressedRef.current.delete(key),
  })

  return (
    <section className="monster-game" aria-label="The Yellow Halls game">
      <div className="monster-hud">
        <span className="monster-game-title">THE YELLOW HALLS</span>
        <span className="monster-key-count" aria-live="polite">✦ {keyCount} / 3 KEYS</span>
      </div>

      <div className="monster-viewport">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          aria-label="First-person view inside a yellow maze"
          onPointerDown={event => {
            dragRef.current = event.clientX
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={event => {
            if (dragRef.current === null || status !== 'playing') return
            const movement = event.clientX - dragRef.current
            dragRef.current = event.clientX
            if (worldRef.current) worldRef.current.player.angle += movement * 0.005
          }}
          onPointerUp={() => { dragRef.current = null }}
          onPointerCancel={() => { dragRef.current = null }}
        />

        {status === 'intro' && (
          <div className="monster-overlay">
            <div className="monster-intro-card">
              <img src={monsterImage} alt="An animated black monster waiting in a yellow hallway" />
              <div className="monster-intro-copy">
                <span className="monster-eyebrow">A GAMEVERSE ORIGINAL</span>
                <h2>The Yellow Halls</h2>
                <p>Three keys. One way out. And something walking the halls with you.</p>
                <button className="btn-primary" onClick={startGame}>Enter the halls</button>
                <small>WASD to move · ← → to turn · drag the view to look</small>
              </div>
            </div>
          </div>
        )}

        {(status === 'caught' || status === 'won') && (
          <div className="monster-overlay">
            <div className="monster-end-card">
              {status === 'caught' && <img src={monsterImage} alt="The animated black monster has caught you in the maze" />}
              <span className="monster-eyebrow">{status === 'won' ? 'YOU ESCAPED' : 'IT FOUND YOU'}</span>
              <h2>{status === 'won' ? 'Back to the light.' : 'Lost in the halls.'}</h2>
              <p>{status === 'won' ? 'You found every key and made it out.' : `You found ${keyCount} of 3 keys. The halls are still waiting.`}</p>
              <button className="btn-primary" onClick={startGame}>Play again</button>
            </div>
          </div>
        )}

        {status === 'playing' && message && <div className="monster-toast" role="status">{message}</div>}

        {status === 'playing' && (
          <div className="monster-touch-controls" aria-label="Touch controls">
            <button aria-label="Move forward" {...holdControl('w')}>▲</button>
            <div className="monster-touch-row">
              <button aria-label="Turn left" {...holdControl('arrowleft')}>◀</button>
              <button aria-label="Move backward" {...holdControl('s')}>▼</button>
              <button aria-label="Turn right" {...holdControl('arrowright')}>▶</button>
            </div>
          </div>
        )}
      </div>

      <p className="monster-controls-hint">
        WASD to move <span>·</span> ← → to turn <span>·</span> find every key, then reach the green exit
      </p>
    </section>
  )
}

export default MonsterMaze
