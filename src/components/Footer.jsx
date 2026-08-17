import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(74, 140, 199, 0.1)',
      background: 'rgba(10, 14, 26, 0.6)',
      backdropFilter: 'blur(10px)',
      padding: '48px 24px 32px',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <img src="/logo.png" alt="GameVerse" style={{ height: '36px', borderRadius: '6px' }} />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-blue-300)',
            }}>
              GameVerse
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Your go-to destination for free online games. Play, compete, and have fun right in your browser!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#e2e8f0',
            marginBottom: '16px',
          }}>
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/', label: 'Home (All Games)' },
              { to: '/about', label: 'About' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--color-cyan-300)'}
                onMouseLeave={e => e.target.style.color = '#64748b'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid rgba(74, 140, 199, 0.08)',
        textAlign: 'center',
        color: '#475569',
        fontSize: '0.85rem',
      }}>
        © {new Date().getFullYear()} GameVerse. All rights reserved. Powered by GameDistribution API.
      </div>
    </footer>
  )
}

export default Footer
