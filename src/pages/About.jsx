import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="page-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
        <span className="tag">ℹ️ About</span>
        <h1
          className="gradient-text"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            marginTop: '16px',
            marginBottom: '12px',
          }}
        >
          About GameVerse
        </h1>
      </div>

      <div className="glass-card animate-fade-in-up" style={{ padding: '40px', animationDelay: '100ms' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <img
            src="/logo.png"
            alt="GameVerse"
            style={{
              height: '100px',
              borderRadius: '16px',
              filter: 'drop-shadow(0 0 20px rgba(74, 140, 199, 0.3))',
            }}
          />
        </div>

        <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.05rem' }}>
          <p style={{ marginBottom: '20px' }}>
            <strong style={{ color: 'var(--color-cyan-300)' }}>GameVerse</strong> is your free online gaming playground.
            We bring together a collection of fun, addictive HTML5 games that you can play right in your browser — no
            downloads, no sign-ups, no hassle.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Our library is powered by the amazing <strong style={{ color: 'var(--color-purple-400)' }}>GameDistribution API</strong>, 
            giving you access to dozens of high-quality titles. Just click a game tile and start playing instantly!
          </p>
          <p style={{ marginBottom: '32px' }}>
            Built with React, Tailwind CSS, and a passion for gaming.
          </p>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {[
            { emoji: '🎯', title: 'Free Forever', desc: 'No hidden costs or paywalls' },
            { emoji: '⚡', title: 'Instant Play', desc: 'No downloads required' },
            { emoji: '📱', title: 'Responsive', desc: 'Play on any device' },
            { emoji: '🔄', title: 'Always Fresh', desc: 'New content from live APIs' },
          ].map(f => (
            <div
              key={f.title}
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(74, 140, 199, 0.06)',
                border: '1px solid rgba(74, 140, 199, 0.1)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{f.emoji}</div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1rem',
                color: '#e2e8f0',
                marginBottom: '4px',
              }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="btn-primary" style={{ fontSize: '1.1rem', padding: '14px 40px' }}>
            🎮 Start Playing
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
