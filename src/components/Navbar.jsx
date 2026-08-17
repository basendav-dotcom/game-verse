import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
  ]

  return (
    <nav className="navbar">
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="/logo.png" alt="GameVerse" style={{ height: '44px', borderRadius: '8px' }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--color-blue-300), var(--color-cyan-400))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            GameVerse
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                color: location.pathname === link.to ? 'var(--color-cyan-300)' : '#94a3b8',
                background: location.pathname === link.to ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            padding: '16px 24px 24px',
            borderTop: '1px solid rgba(74, 140, 199, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === link.to ? 'var(--color-cyan-300)' : '#94a3b8',
                background: location.pathname === link.to ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
