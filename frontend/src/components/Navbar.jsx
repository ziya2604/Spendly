import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';

const LINKS = [
  { to: "/dashboard", label: "Home" },
  { to: '/expenses', label: 'Expenses' },
  { to: '/income', label: 'Income' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/goals', label: 'Goals' },
  { to: '/groups', label: 'Groups' },
  { to: '/debts', label: 'Debts' },
  { to: '/bills', label: 'Bills' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/education', label: 'Learn' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/about', label: 'About' },
];

function Navbar() {

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { theme, toggle } = useTheme();

  const name = localStorage.getItem('name') || 'User';

  const initial = name[0].toUpperCase();

  const logout = () => {

    localStorage.clear();

    navigate('/login');

  };

  return (

    <nav
      style={{

        position: 'sticky',

        top: 0,

        zIndex: 1000,

        height: '68px',

        background: 'rgba(18,18,24,0.85)',

        backdropFilter: 'blur(12px)',

        borderBottom: '1px solid var(--border)',

        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',

        display: 'flex',

        alignItems: 'center',

        padding: '0 22px',

      }}
    >

      {/* Logo */}

      <Link
        to="/dashboard"
        style={{
          textDecoration: 'none',
          flexShrink: 0,
          marginRight: 28,
        }}
      >

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >

          <div
            style={{

              width: 36,

              height: 36,

              borderRadius: 12,

              background:
                'linear-gradient(135deg,#7c3aed,#4f46e5)',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              color: '#fff',

              fontWeight: 700,

              fontSize: 18,

              boxShadow:
                '0 6px 18px rgba(124,58,237,0.35)',

            }}
          >

            ₹

          </div>

          <div>

            <div
              style={{
                color: 'var(--text)',
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: '-0.03em',
              }}
            >

              Spendly

            </div>

            <div
              style={{
                color: 'var(--text2)',
                fontSize: 11,
                marginTop: -2,
              }}
            >

              Smart Finance

            </div>

          </div>

        </div>

      </Link>

      {/* Nav */}

      <div
        style={{

          display: 'flex',

          flex: 1,

          overflowX: 'auto',

          scrollbarWidth: 'none',

          gap: 4,

          alignItems: 'center',

        }}
      >

        {LINKS.map((link) => {

          const active =
            pathname === link.to;

          return (

            <Link
              key={link.to}
              to={link.to}
              style={{

                textDecoration: 'none',

                padding: '9px 14px',

                fontSize: 13,

                borderRadius: 10,

                whiteSpace: 'nowrap',

                transition:
                  'all 0.22s ease',

                fontWeight:
                  active ? 600 : 500,

                color:
                  active
                    ? '#8b5cf6'
                    : 'var(--text2)',

                background:
                  active
                    ? 'rgba(124,58,237,0.12)'
                    : 'transparent',

              }}
              onMouseEnter={(e) => {

                if (!active) {

                  e.currentTarget.style.color =
                    'var(--text)';

                }

              }}
              onMouseLeave={(e) => {

                if (!active) {

                  e.currentTarget.style.color =
                    'var(--text2)';

                }

              }}
            >

              {link.label}

            </Link>

          );

        })}

      </div>

      {/* Right Side */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >

        <button
          onClick={toggle}
          className="btn btn-ghost"
          style={{
            padding: '8px 10px',
            fontSize: 15,
          }}
        >

          {theme === 'dark'
            ? '☀️'
            : '🌙'}

        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >

          <div
            style={{

              width: 36,

              height: 36,

              borderRadius: '50%',

              background:
                'linear-gradient(135deg,#7c3aed,#4f46e5)',

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'center',

              color: '#fff',

              fontWeight: 600,

              fontSize: 13,

            }}
          >

            {initial}

          </div>

          <span
            style={{
              color: 'var(--text)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >

            {name}

          </span>

        </div>

        <button
          onClick={logout}
          className="btn btn-ghost"
          style={{
            fontSize: 13,
          }}
        >

          Logout

        </button>

      </div>

    </nav>

  );

}

export default Navbar;