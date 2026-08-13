import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/',         label: 'Home'     },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/learn',    label: 'Learn'    },
    { to: '/features', label: 'Features' },
    { to: '/about',    label: 'About'    },
  ];

  const active = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0818', color: '#fff' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? 'rgba(10,8,24,0.97)' : 'rgba(10,8,24,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 32px', height: 64,
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', gap: 16,
        }}>

          {/* Left: Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: '#fff',
              boxShadow: '0 0 16px rgba(124,58,237,0.5)',
            }}>₹</div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Spend<span style={{ color: '#a78bfa' }}>ly</span>
            </span>
          </Link>

          {/* Center: Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '8px 16px', borderRadius: 8,
                fontSize: 14, fontWeight: 500,
                color: active(to) ? '#fff' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none', transition: 'all 0.2s',
                borderBottom: active(to) ? '2px solid #7c3aed' : '2px solid transparent',
                background: active(to) ? 'rgba(124,58,237,0.12)' : 'transparent',
              }}
                onMouseEnter={e => { if (!active(to)) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                onMouseLeave={e => { if (!active(to)) { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'transparent'; } }}
              >{label}</Link>
            ))}
          </div>

          {/* Right: Learn button + Login/Signup or Dashboard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <Link to="/learn" style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.15)',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            >Learn</Link>

            {isLoggedIn ? (
              <Link to="/dashboard" style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
              }}>Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                >Log in</Link>
                <Link to="/signup" style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                  color: '#fff', textDecoration: 'none',
                  background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                  boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'none'; }}
                >Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1, paddingTop: 64 }}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#060412', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '56px 32px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 48, marginBottom: 52 }}>

            {/* Brand */}
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>₹</div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Spend<span style={{ color: '#a78bfa' }}>ly</span></span>
              </Link>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 240, marginBottom: 20 }}>
                Smart money management and financial education for everyone.
              </p>
              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Twitter', icon: '𝕏' },
                  { label: 'GitHub', icon: '⌥' },
                  { label: 'LinkedIn', icon: 'in' },
                ].map(s => (
                  <a key={s.label} href="#" style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; e.currentTarget.style.color = '#a78bfa'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Product</p>
              {[
                ['/features', 'Features'],
                ['/dashboard', 'Dashboard'],
                ['/learn', 'Education'],
                ['/learn', 'AI Advisor'],
              ].map(([to, label]) => (
                <Link key={label} to={to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 12, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >{label}</Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Company</p>
              {[
                ['/about', 'About Us'],
                ['#', 'Blog'],
                ['#', 'Careers'],
                ['#', 'Contact'],
              ].map(([to, label]) => (
                <Link key={label} to={to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 12, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >{label}</Link>
              ))}
            </div>

            {/* Legal */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Legal</p>
              {[['#', 'Privacy Policy'], ['#', 'Terms of Service'], ['#', 'Cookie Policy'], ['#', 'Security']].map(([to, label]) => (
                <a key={label} href={to} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', marginBottom: 12, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© {new Date().getFullYear()} Spendly. All rights reserved.</p>
            <a href="mailto:support@spendly.com" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>✉</span> support@spendly.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}