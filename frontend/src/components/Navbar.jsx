import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';
import {FaHome,FaWallet,FaMoneyBillWave,FaBullseye,FaUsers,FaBook,FaCalculator,FaReceipt,FaCalendarAlt,FaTrophy,FaCreditCard} from 'react-icons/fa';
const navItems=[
{path:'/dashboard',label:'Dashboard',icon:<FaHome/>},
{path:'/expenses',label:'Expenses',icon:<FaWallet/>},
{path:'/income',label:'Income',icon:<FaMoneyBillWave/>},
{path:'/budgets',label:'Budgets',icon:<FaReceipt/>},
{path:'/groups',label:'Groups',icon:<FaUsers/>},
{path:'/goals',label:'Goals',icon:<FaBullseye/>},
{path:'/debts',label:'Debts',icon:<FaCreditCard/>},
{path:'/bills',label:'Bills',icon:<FaCalendarAlt/>},
{path:'/challenges',label:'Challenges',icon:<FaTrophy/>},
{path:'/education',label:'Learn',icon:<FaBook/>},
{path:'/calculator',label:'Calculator',icon:<FaCalculator/>},
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const name = localStorage.getItem('name') || 'User';

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar-modern">
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div className="logo-text">
            <div className="logo-finance">
                <div className="bar bar1"></div>
                <div className="bar bar2"></div>
                <div className="bar bar3"></div>
            </div>

            <span>
                Spendly
            </span>
            </div>
        <div className="nav-links" style={{ flexWrap: 'wrap' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-modern ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={toggle}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 12px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 16,
          }}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 10, padding: '6px 14px',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 13,
          }}>
            {name[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
            {name}
          </span>
        </div>

        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: '1px solid var(--accent-red)',
            borderRadius: 8,
            padding: '6px 14px',
            color: 'var(--accent-red)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'var(--accent-red)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--accent-red)';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;