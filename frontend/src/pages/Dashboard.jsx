import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoalProgress from "../components/GoalProgress";
import SmartInsights from "../components/SmartInsights";
import FinancialSnapshot from "../components/FinancialSnapshot";
import AboutSpendly from "../components/AboutSpendly";
import AchievementCards from "../components/AchievementCards";
import SpendingTrends from "../components/SpendingTrends";
import ActivityTimeline from "../components/ActivityTimeline";
import WhySpendly from '../components/WhySpendly';
import LessonCard from '../components/LessonCard';
import FAQ from '../components/FAQ';

ChartJS.register(ArcElement, Tooltip, Legend);

// Category colours — consistent across the app
const CAT_COLOR = {
  Food: '#2563eb', Travel: '#7c3aed', Rent: '#dc2626',
  Entertainment: '#d97706', Medical: '#16a34a', Shopping: '#0891b2',
  Recharge: '#9333ea', EMI: '#ea580c', Subscriptions: '#0d9488',
  Education: '#4f46e5', Other: '#6b7280',
};

// Small stat card component — reused 4 times at top of dashboard
function StatCard({ label, value, sub, subColor, icon }) {
  return (
    // card-hover adds the glow on hover
    <div className="card card-hover stagger" tabIndex={0} style={{ flex: 1, minWidth: 180 }}>
      <div className="flex items-center gap-8 mb-8">
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span className="text-xs text-muted font-medium" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
      <div className="num text-xl font-bold" style={{ color: 'var(--text)', marginBottom: 4 }}>
        {value}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: subColor || 'var(--text2)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [summary,  setSummary]  = useState([]);
  const [health,   setHealth]   = useState(null);
  const [recent,   setRecent]   = useState([]);
  const name  = localStorage.getItem('name') || 'User';
  const token = localStorage.getItem('token');
  const H     = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // Fetch all data when dashboard loads
  useEffect(() => {
    fetch('http://localhost:8000/expenses/summary',      { headers: H }).then(r => r.json()).then(d => Array.isArray(d) && setSummary(d)).catch(() => {});
    fetch('http://localhost:8000/expenses/health-score', { headers: H }).then(r => r.json()).then(setHealth).catch(() => {});
    fetch('http://localhost:8000/expenses',              { headers: H }).then(r => r.json()).then(d => Array.isArray(d) && setRecent(d.slice(0, 6))).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const chartData = {
    labels: summary.map(s => s.category),
    datasets: [{
      data: summary.map(s => s.total),
      backgroundColor: summary.map(s => CAT_COLOR[s.category] || '#6b7280'),
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const chartOptions = {
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: ctx => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}` },
      },
    },
  };

  const quickActions = [
    { to: '/expenses',   label: 'Add Expense',  icon: '➕', color: 'var(--blue)'  },
    { to: '/income',     label: 'Add Income',   icon: '💰', color: 'var(--green)' },
    { to: '/budgets',    label: 'New Budget',   icon: '📊', color: '#7c3aed'      },
    { to: '/goals',      label: 'New Goal',     icon: '🎯', color: 'var(--yellow)'},
    { to: '/bills',      label: 'New Bill',     icon: '📅', color: '#0891b2'      },
    { to: '/calculator', label: 'Calculator',   icon: '🧮', color: '#9333ea'      },
  ];

  return (
    // Full page layout: navbar → content → footer
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface2)' }}>
      <Navbar />

      <main className="page" style={{ flex: 1 }}>

        {/* ── Greeting row ── */}
        <div className="flex justify-between items-center mb-20">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
              {greeting}, {name} 👋
            </h2>
            <p className="text-muted mt-4" style={{ fontSize: 13 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className="badge badge-blue">Free Plan</span>
        </div>

        {/* ── Stat cards ── */}
        <div className="flex gap-16 mb-20" style={{ flexWrap: 'wrap' }}>
          <StatCard
            icon="💼" label="Balance"
            value={health ? `₹${Number(health.savings).toLocaleString('en-IN')}` : '—'}
            sub={health?.savings >= 0 ? 'Positive this month' : 'Spending more than income'}
            subColor={health?.savings >= 0 ? 'var(--green)' : 'var(--red)'}
          />
          <StatCard
            icon="📥" label="Income"
            value={health ? `₹${Number(health.total_income).toLocaleString('en-IN')}` : '—'}
            sub="This month" subColor="var(--green)"
          />
          <StatCard
            icon="📤" label="Expenses"
            value={health ? `₹${Number(health.total_expenses).toLocaleString('en-IN')}` : '—'}
            sub="This month" subColor="var(--red)"
          />
          <StatCard
            icon="⭐" label="Health Score"
            value={health ? `${health.score}/100` : '—'}
            sub={health?.label}
            subColor={!health ? 'var(--text2)' : health.score >= 70 ? 'var(--green)' : health.score >= 40 ? 'var(--yellow)' : 'var(--red)'}
          />
        </div>

        {/* ── Main content grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 20 }}>

          {/* Doughnut chart */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="flex justify-between items-center">
              <h3 style={{ fontSize: 15 }}>Spending by category</h3>
              <span className="text-xs text-muted">This month</span>
            </div>

            {summary.length > 0 ? (
              <>
                <div style={{ width: 180, margin: '0 auto', position: 'relative' }}>
                  <Doughnut data={chartData} options={chartOptions} />
                  {/* Centre label inside doughnut hole */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    <span className="text-xs text-muted">Total</span>
                    <span className="num font-bold" style={{ fontSize: 15, color: 'var(--text)' }}>
                      ₹{summary.reduce((s, i) => s + i.total, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {summary.map(s => (
                    <div key={s.category} className="flex justify-between items-center">
                      <div className="flex items-center gap-8">
                        <span style={{
                          width: 10, height: 10, borderRadius: '50%',
                          background: CAT_COLOR[s.category] || '#6b7280',
                          flexShrink: 0,
                        }} />
                        <span className="text-sm" style={{ color: 'var(--text2)' }}>{s.category}</span>
                      </div>
                      <span className="num text-sm font-medium">
                        ₹{Number(s.total).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center" style={{ padding: '40px 0', color: 'var(--text2)' }}>
                No expenses this month yet.{' '}
                <Link to="/expenses" style={{ color: 'var(--blue)' }}>Add one →</Link>
              </div>
            )}
          </div>

          {/* Recent transactions */}
          <div className="card">
            <div className="flex justify-between items-center mb-16">
              <h3 style={{ fontSize: 15 }}>Recent transactions</h3>
              <Link to="/expenses" style={{ fontSize: 13, color: 'var(--blue)', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="text-center" style={{ padding: '40px 0', color: 'var(--text2)' }}>
                No transactions yet.
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(e => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 500 }}>{e.note || e.category}</td>
                      <td>
                        <span className="badge" style={{
                          background: (CAT_COLOR[e.category] || '#6b7280') + '18',
                          color: CAT_COLOR[e.category] || '#6b7280',
                        }}>
                          {e.category}
                        </span>
                      </td>
                      <td className="text-muted text-sm">{e.date}</td>
                      <td className="text-right num font-medium text-red">
                        −₹{Number(e.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="card">
          <h3 className="mb-16" style={{ fontSize: 15 }}>Quick actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {quickActions.map(a => (
              <Link
                key={a.to}
                to={a.to}
                className="card card-hover"
                style={{
                  textDecoration: 'none',
                  padding: '16px 14px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: a.color }}>
                  {a.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      <GoalProgress />
      <SmartInsights />
      <FinancialSnapshot />
      <AboutSpendly />
      <AchievementCards />
      <SpendingTrends />
      <ActivityTimeline />
      <WhySpendly />
      <LessonCard/>
      <FAQ/>
      

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
