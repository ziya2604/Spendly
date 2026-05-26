import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  '#7c3aed','#a855f7','#10b981','#f59e0b',
  '#ef4444','#3b82f6','#ec4899','#14b8a6',
  '#f97316','#6366f1',
];

function StatCard({ label, value, color, sub }) {
  return (
    <div className="stat-card fade-in">
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 800, color: color || 'var(--text-primary)', marginBottom: 4 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [health, setHealth] = useState(null);
  const [recent, setRecent] = useState([]);
  const name = localStorage.getItem('name') || 'User';
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    fetch('http://localhost:8000/expenses/summary', { headers }).then(r => r.json()).then(setSummary).catch(() => {});
    fetch('http://localhost:8000/expenses/health-score', { headers }).then(r => r.json()).then(setHealth).catch(() => {});
    fetch('http://localhost:8000/expenses', { headers }).then(r => r.json()).then(d => setRecent(Array.isArray(d) ? d.slice(0, 6) : [])).catch(() => {});
  }, []);

  const scoreColor = !health ? 'var(--text-secondary)'
    : health.score >= 70 ? 'var(--accent-green)'
    : health.score >= 50 ? 'var(--accent)'
    : health.score >= 30 ? 'var(--accent-yellow)'
    : 'var(--accent-red)';

  const pieData = {
    labels: summary.map(s => s.category),
    datasets: [{
      data: summary.map(s => s.total),
      backgroundColor: CHART_COLORS,
      borderWidth: 0,
    }],
  };

  const categoryColors = {
    Food: '#f97316', Travel: '#3b82f6', Rent: '#ef4444',
    Entertainment: '#a855f7', Medical: '#10b981', Shopping: '#ec4899',
    Recharge: '#14b8a6', EMI: '#f59e0b', Subscriptions: '#6366f1',
    Education: '#7c3aed', Other: '#94a3b8',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="page-container">

        {/* Greeting */}
        <div className="fade-in" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800 }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {name} 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Here's your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard
            label="Health Score"
            value={health ? `${health.score}/100` : '—'}
            color={scoreColor}
            sub={health?.label}
          />
          <StatCard
            label="Income This Month"
            value={health ? `₹${health.total_income.toFixed(0)}` : '—'}
            color="var(--accent-green)"
          />
          <StatCard
            label="Expenses This Month"
            value={health ? `₹${health.total_expenses.toFixed(0)}` : '—'}
            color="var(--accent-red)"
          />
          <StatCard
            label="Savings"
            value={health ? `₹${health.savings.toFixed(0)}` : '—'}
            color={health?.savings >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
            sub={health?.savings >= 0 ? "You're saving! 🎉" : "Spending more than income"}
          />
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20, marginBottom: 20 }}>

          {/* Pie Chart */}
          <div className="card-modern">
            <p className="section-title" style={{ fontSize: 16, marginBottom: 20 }}>Spending by Category</p>
            {summary.length > 0 ? (
              <Pie
                data={pieData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: 'var(--text-secondary)', font: { size: 11 }, padding: 12 },
                    },
                    tooltip: {
                      callbacks: {
                        label: ctx => ` ₹${ctx.raw.toFixed(0)}`
                      }
                    }
                  },
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No expenses yet</p>
                <Link to="/expenses" style={{ color: 'var(--accent-light)', fontSize: 13, textDecoration: 'none' }}>
                  Add your first expense →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Expenses */}
          <div className="card-modern">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>Recent Expenses</p>
              <Link to="/expenses" style={{ color: 'var(--accent-light)', fontSize: 13, textDecoration: 'none' }}>
                View all →
              </Link>
            </div>
            {recent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💸</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No expenses logged yet</p>
              </div>
            ) : (
              <div>
                {recent.map((e, i) => (
                  <div
                    key={e.id}
                    className="slide-in"
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                      animationDelay: `${i * 0.05}s`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: `${categoryColors[e.category] || '#7c3aed'}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>
                        {e.category === 'Food' ? '🍔' : e.category === 'Travel' ? '✈️' : e.category === 'Rent' ? '🏠' : '💳'}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>
                          {e.note || e.category}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.date}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--accent-red)', fontSize: 15 }}>
                      -₹{e.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-modern">
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { to: '/expenses', label: '+ Add Expense', color: '#7c3aed' },
              { to: '/income', label: '+ Add Income', color: '#10b981' },
              { to: '/groups', label: '+ New Group', color: '#3b82f6' },
              { to: '/goals', label: '+ New Goal', color: '#f59e0b' },
              { to: '/calculator', label: '🧮 Calculator', color: '#ec4899' },
              { to: '/education', label: '📚 Learn', color: '#14b8a6' },
            ].map(action => (
              <Link
                key={action.to}
                to={action.to}
                style={{
                  background: `${action.color}18`,
                  border: `1px solid ${action.color}44`,
                  borderRadius: 10,
                  padding: '8px 16px',
                  color: action.color,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${action.color}30`}
                onMouseLeave={e => e.currentTarget.style.background = `${action.color}18`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;