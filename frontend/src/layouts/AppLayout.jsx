import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

export default function AppLayout() {
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const name = localStorage.getItem('name') || localStorage.getItem('username') || 'User';
  const initials = name.slice(0, 2).toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/expenses',  label: 'Expenses'  },
    { to: '/budgets',   label: 'Budgets'   },
    { to: '/goals',     label: 'Goals'     },
    { to: '/features',  label: 'Features'  },
  ];

  const active = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0818', color: '#fff' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: scrolled ? 'rgba(10,8,24,0.97)' : 'rgba(10,8,24,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64,
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16,
        }}>

          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}>₹</div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Spend<span style={{ color: '#a78bfa' }}>ly</span></span>
          </Link>

          {/* Center links */}
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

          {/* Right: Learn + Profile dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <Link to="/learn" style={{
              padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.15)',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            >Learn</Link>

            {/* Profile dropdown */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', borderRadius: 10,
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{initials}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{name}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>

              {dropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#13102a', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: 8, minWidth: 200,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  animation: 'fadeDown 0.15s ease',
                }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{name}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Personal account</p>
                  </div>
                  {[
                    ['/dashboard',  '📊 Dashboard'],
                    ['/income',     '💰 Income'],
                    ['/groups',     '👥 Groups'],
                    ['/debts',      '💳 Debts'],
                    ['/bills',      '🔔 Bills'],
                    ['/challenges', '🏆 Challenges'],
                    ['/calculator', '🧮 Calculator'],
                  ].map(([to, label]) => (
                    <Link key={to} to={to} onClick={() => setDropOpen(false)} style={{
                      display: 'block', padding: '9px 14px', borderRadius: 8,
                      fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                    >{label}</Link>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4, paddingTop: 4 }}>
                    <button onClick={handleLogout} style={{
                      width: '100%', padding: '9px 14px', borderRadius: 8, textAlign: 'left',
                      fontSize: 13, color: '#f87171', background: 'transparent',
                      border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >🚪 Log out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, paddingTop: 64 }}><Outlet /></main>

      <style>{`@keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}