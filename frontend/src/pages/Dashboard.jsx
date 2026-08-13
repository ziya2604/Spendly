import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Filler,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const CAT_COLOR = {
  Food: '#3b82f6', Travel: '#8b5cf6', Rent: '#ef4444', Entertainment: '#f59e0b',
  Medical: '#10b981', Shopping: '#06b6d4', Recharge: '#a855f7', EMI: '#f97316',
  Subscriptions: '#14b8a6', Education: '#6366f1', Other: '#6b7280',
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const [health,  setHealth]  = useState(null);
  const [summary, setSummary] = useState([]);
  const [recent,  setRecent]  = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals,   setGoals]   = useState([]);
  const [income,  setIncome]  = useState([]);

  const token = localStorage.getItem('token');
  const H = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const go = async () => {
      const [h, s, e, i, b, g] = await Promise.allSettled([
        fetch('http://localhost:8000/expenses/health-score', { headers: H }).then(r => r.json()),
        fetch('http://localhost:8000/expenses/summary',      { headers: H }).then(r => r.json()),
        fetch('http://localhost:8000/expenses',              { headers: H }).then(r => r.json()),
        fetch('http://localhost:8000/income',                { headers: H }).then(r => r.json()),
        fetch('http://localhost:8000/budgets',               { headers: H }).then(r => r.json()),
        fetch('http://localhost:8000/goals',                 { headers: H }).then(r => r.json()),
      ]);
      if (h.status === 'fulfilled') setHealth(h.value);
      if (s.status === 'fulfilled' && Array.isArray(s.value)) setSummary(s.value);
      if (e.status === 'fulfilled' && Array.isArray(e.value)) setRecent(e.value);
      if (i.status === 'fulfilled' && Array.isArray(i.value)) setIncome(i.value);
      if (g.status === 'fulfilled' && Array.isArray(g.value)) setGoals(g.value);
      if (b.status === 'fulfilled' && Array.isArray(b.value)) {
        const spentMap = {};
        if (s.status === 'fulfilled' && Array.isArray(s.value)) s.value.forEach(x => { spentMap[x.category] = x.total; });
        setBudgets(b.value.map(bud => ({ ...bud, spent: spentMap[bud.category] || 0 })));
      }
    };
    go();
  }, []);

  // Build last 6 months
  const now = new Date();
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { label: MONTHS[d.getMonth()], month: d.getMonth() + 1, year: d.getFullYear() };
  });
  const monthlyExp = last6.map(({ month, year }) =>
    recent.filter(e => { const d = new Date(e.date); return d.getMonth() + 1 === month && d.getFullYear() === year; })
      .reduce((s, e) => s + Number(e.amount), 0));
  const monthlyInc = last6.map(({ month, year }) =>
    income.filter(i => { const d = new Date(i.date); return d.getMonth() + 1 === month && d.getFullYear() === year; })
      .reduce((s, i) => s + Number(i.amount), 0));

  const totalIncome   = health?.total_income   || 0;
  const totalExpenses = health?.total_expenses  || 0;
  const netBalance    = health?.savings ?? (totalIncome - totalExpenses);
  const totalSavings  = goals.reduce((s, g) => s + (g.current_amount || 0), 0);

  // Donut chart data
  const donutTotal = summary.reduce((a, i) => a + i.total, 0);
  const donutData = {
    labels: summary.map(s => s.category),
    datasets: [{
      data: summary.map(s => s.total),
      backgroundColor: summary.map(s => CAT_COLOR[s.category] || '#6b7280'),
      borderWidth: 2, borderColor: '#0a0818', hoverOffset: 8,
    }],
  };
  const donutOpts = {
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ₹${Number(ctx.raw).toLocaleString('en-IN')} (${Math.round(ctx.raw / donutTotal * 100)}%)` } },
    },
  };

  // Line chart data
  const lineData = {
    labels: last6.map(m => m.label),
    datasets: [
      { label: 'Income',   data: monthlyInc, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)',  tension: 0.4, fill: true, pointBackgroundColor: '#10b981', pointRadius: 4 },
      { label: 'Spending', data: monthlyExp, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.06)', tension: 0.4, fill: true, pointBackgroundColor: '#8b5cf6', pointRadius: 4 },
    ],
  };
  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)', borderDash: [3, 3] }, ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)', borderDash: [3, 3] }, ticks: { color: 'rgba(255,255,255,0.35)', font: { size: 11 }, callback: v => '₹' + v.toLocaleString('en-IN') } },
    },
  };

  const statCards = [
    { label: 'Total Balance',    value: `₹${Math.abs(netBalance).toLocaleString('en-IN')}`,    icon: '💰', up: netBalance >= 0 },
    { label: 'Monthly Income',   value: `₹${totalIncome.toLocaleString('en-IN')}`,             icon: '↗',  up: true  },
    { label: 'Monthly Expenses', value: `₹${totalExpenses.toLocaleString('en-IN')}`,           icon: '📊', up: false },
    { label: 'Total Savings',    value: `₹${totalSavings.toLocaleString('en-IN')}`,            icon: '🎯', up: true  },
  ];

  const card = {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 28,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0818', color: '#fff', padding: '40px 32px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Page heading */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Financial Overview
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            Track your spending and savings at a glance
          </p>
        </div>

        {/* 4 stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {statCards.map(({ label, value, icon, up }) => (
            <div key={label} style={{ ...card, transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                <span style={{ fontSize: 18 }}>{icon}</span>
              </div>
              <div style={{ fontSize: 'clamp(20px,2vw,26px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>
                {value || '₹0'}
              </div>
              <div style={{ fontSize: 12, color: up ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <span style={{ fontSize: 10 }}>{up ? '↗' : '↘'}</span>
                <span style={{ fontWeight: 700 }}>{up ? '+8.2%' : '-3.1%'}</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row: line + donut side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 16, marginBottom: 24 }}>

          {/* Income vs Expenses line chart */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Income vs Expenses</h3>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#10b981', fontWeight: 600 }}>
                  <span style={{ width: 20, height: 2, background: '#10b981', display: 'inline-block', borderRadius: 2 }} /> Income
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8b5cf6', fontWeight: 600 }}>
                  <span style={{ width: 20, height: 2, background: '#8b5cf6', display: 'inline-block', borderRadius: 2 }} /> Spending
                </span>
              </div>
            </div>
            <div style={{ height: 240 }}>
              {(recent.length > 0 || income.length > 0) ? (
                <Line data={lineData} options={lineOpts} />
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', gap: 8 }}>
                  <span style={{ fontSize: 36 }}>📈</span>
                  <p style={{ fontSize: 13 }}>Add income &amp; expenses to see your trend</p>
                </div>
              )}
            </div>
          </div>

          {/* Spending by Category donut */}
          <div style={{ ...card }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Spending by Category</h3>
            {summary.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 180, marginBottom: 20 }}>
                  <Doughnut data={donutData} options={donutOpts} />
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {summary.slice(0, 5).map(s => {
                    const pct = Math.round(s.total / donutTotal * 100);
                    const color = CAT_COLOR[s.category] || '#6b7280';
                    return (
                      <div key={s.category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{s.category}</span>
                        </span>
                        <span style={{ color, fontWeight: 700 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', gap: 8 }}>
                <span style={{ fontSize: 36 }}>🍩</span>
                <p style={{ fontSize: 13 }}>Add expenses to see breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Progress — full width */}
        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Budget Progress</h3>
            <Link to="/budgets" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Manage budgets →</Link>
          </div>
          {budgets.length > 0 ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                {budgets.slice(0, 6).map(b => {
                  const limit = b.limit || b.amount || 0;
                  const pct = limit > 0 ? Math.min(100, Math.round((b.spent / limit) * 100)) : 0;
                  const over = pct >= 90;
                  return (
                    <div key={b.id || b.category} style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{b.category}</span>
                        <span style={{ color: over ? '#ef4444' : 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                          ₹{(b.spent || 0).toLocaleString('en-IN')} / ₹{limit.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                          width: `${pct}%`, height: '100%', borderRadius: 99,
                          background: over ? '#ef4444' : 'linear-gradient(90deg,#7c3aed,#2563eb)',
                          transition: 'width 0.8s'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: over ? '#ef4444' : 'rgba(255,255,255,0.3)', fontWeight: over ? 700 : 400 }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.25)' }}>
              <p style={{ marginBottom: 10, fontSize: 13 }}>No budgets set yet.</p>
              <Link to="/budgets" style={{ color: '#a78bfa', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>Create your first budget →</Link>
            </div>
          )}
        </div>

        {/* Row 3: Recent Transactions + Goals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Recent Transactions */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Recent Transactions</h3>
              <Link to="/expenses" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>View all →</Link>
            </div>
            {recent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.25)' }}>
                <p style={{ marginBottom: 10, fontSize: 13 }}>No transactions yet.</p>
                <Link to="/expenses" style={{ color: '#a78bfa', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>Add your first →</Link>
              </div>
            ) : recent.slice(0, 6).map(e => {
              const color = CAT_COLOR[e.category] || '#6b7280';
              return (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8, marginBottom: 2, transition: 'background 0.15s', cursor: 'default' }}
                  onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color }}>{(e.category || 'O')[0]}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.note || e.category}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{e.date} · <span style={{ color }}>{e.category}</span></p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>−₹{Number(e.amount).toLocaleString('en-IN')}</p>
                </div>
              );
            })}
          </div>

          {/* Savings Goals */}
          <div style={{ ...card }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Savings Goals</h3>
              <Link to="/goals" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>View all →</Link>
            </div>
            {goals.length > 0 ? goals.slice(0, 4).map((g, idx) => {
              const pct = Math.min(100, Math.round(((g.current_amount || 0) / g.target_amount) * 100));
              const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
              const color = colors[idx % colors.length];
              return (
                <div key={g.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{g.title}</span>
                    <span style={{ fontWeight: 700, color, fontSize: 12 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 1s' }} />
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                    ₹{((g.target_amount || 0) - (g.current_amount || 0)).toLocaleString('en-IN')} remaining
                  </p>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.25)' }}>
                <p style={{ marginBottom: 10, fontSize: 13 }}>No goals yet.</p>
                <Link to="/goals" style={{ color: '#a78bfa', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>Set your first goal →</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}