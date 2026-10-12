const createArtwork = (title, accent, emoji) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#08111f"/><stop offset="1" stop-color="#172b45"/></linearGradient></defs><rect width="800" height="600" fill="url(#bg)"/><circle cx="670" cy="120" r="150" fill="${accent}" opacity=".18"/><circle cx="150" cy="540" r="190" fill="${accent}" opacity=".12"/><text x="64" y="110" fill="${accent}" font-family="sans-serif" font-size="28" font-weight="700" letter-spacing="4">GAMEVERSE ORIGINAL</text><text x="64" y="360" fill="white" font-family="sans-serif" font-size="76" font-weight="800">${emoji}</text><text x="64" y="445" fill="white" font-family="sans-serif" font-size="42" font-weight="800">${title}</text><rect x="64" y="480" width="130" height="8" rx="4" fill="${accent}"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const localGames = [
  {
    id: 'original-neon-dodge',
    title: 'Neon Dodge',
    description: 'Dodge the falling sparks and chase a new high score.',
    howToPlayText: 'Use A/D or the arrow keys to move. Avoid every falling spark.',
    image: createArtwork('Neon Dodge', '#22d3ee', '✦'),
    type: 'neon-dodge',
    source: 'GameVerse Originals',
  },
  {
    id: 'original-memory-match',
    title: 'Memory Match',
    description: 'Flip the cards and find every matching pair in as few turns as possible.',
    howToPlayText: 'Click two cards to reveal them. Match all six pairs to win.',
    image: createArtwork('Memory Match', '#fbbf24', '◈'),
    type: 'memory-match',
    source: 'GameVerse Originals',
  },
  {
    id: 'original-orbit-tap',
    title: 'Orbit Tap',
    description: 'Hit the moving target before it slips away. How many can you catch?',
    howToPlayText: 'Click the target as many times as possible before the timer reaches zero.',
    image: createArtwork('Orbit Tap', '#fb7185', '◉'),
    type: 'orbit-tap',
    source: 'GameVerse Originals',
  },
]
