import { useState, useEffect } from 'react';

export default function FinancialSnapshot() {
  const [health, setHealth] = useState(null);
  const [summary, setSummary] = useState([]);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    fetch('http://localhost:8000/expenses/health-score', { headers:H })
      .then(r => r.json()).then(setHealth).catch(() => {});
    fetch('http://localhost:8000/expenses/summary', { headers:H })
      .then(r => r.json()).then(d => Array.isArray(d) && setSummary(d)).catch(() => {});
  }, []);

  const biggestCat = summary.length > 0
    ? summary.reduce((a,b) => a.total > b.total ? a : b).category
    : '—';

  const savingsRate = health && health.total_income > 0
    ? Math.round((health.savings / health.total_income) * 100)
    : null;

  const budgetStatus = health
    ? (health.score >= 75 ? 'Healthy' : health.score >= 50 ? 'Moderate' : 'At Risk')
    : '—';

  const budgetColor = health
    ? (health.score >= 75 ? '#16a34a' : health.score >= 50 ? '#d97706' : '#dc2626')
    : '#6b7280';

  const trend = health && health.total_expenses > 0 ? '+0%' : '—';

  const stats = [
    { label:'Savings Rate',    value: savingsRate !== null ? `${savingsRate}%` : '—', sub:'Of monthly income', color:'#16a34a' },
    { label:'Biggest Expense', value: biggestCat,   sub:'Top category',  color:'#dc2626' },
    { label:'Budget Status',   value: budgetStatus, sub:'Within limits', color: budgetColor },
    { label:'Health Score',    value: health ? `${health.score}/100` : '—', sub: health?.label || 'Your score', color:'#7c3aed' },
  ];

  return (
    <section style={{ marginBottom:48 }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>Overview</p>
        <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Financial Snapshot</h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden' }}>
        {stats.map((item, i) => (
          <div key={item.label}
            style={{ padding:'28px 24px', borderRight: i<3 ? '1px solid var(--border)' : 'none', borderTop:`3px solid ${item.color}`, transition:'background 0.2s', cursor:'default' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <p style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>{item.label}</p>
            <p style={{ fontSize:30, fontWeight:800, color:item.color, letterSpacing:'-0.03em', lineHeight:1, marginBottom:6 }}>{item.value}</p>
            <p style={{ fontSize:12, color:'var(--text3)' }}>{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}