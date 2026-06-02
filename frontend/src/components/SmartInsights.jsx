import { useState, useEffect } from 'react';

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const TrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);

export default function SmartInsights() {
  const [insights, setInsights] = useState([]);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    // Build insights from real data
    Promise.all([
      fetch('http://localhost:8000/expenses/summary', { headers:H }).then(r=>r.json()),
      fetch('http://localhost:8000/expenses/health-score', { headers:H }).then(r=>r.json()),
      fetch('http://localhost:8000/goals', { headers:H }).then(r=>r.json()),
    ]).then(([summary, health, goals]) => {
      const built = [];

      // Biggest spending category
      if (Array.isArray(summary) && summary.length > 0) {
        const top = summary.reduce((a,b) => a.total > b.total ? a : b);
        built.push({
          color:'#d97706', bg:'rgba(217,119,6,0.08)',
          label:'Heads up', icon:<AlertIcon />,
          title:`${top.category} is your top spend`,
          text:`You've spent ₹${Number(top.total).toLocaleString('en-IN')} on ${top.category} this month. Keep an eye on it.`,
        });
      }

      // Savings rate
      if (health && health.score !== undefined) {
        const isGood = health.score >= 60;
        built.push({
          color: isGood ? '#16a34a' : '#dc2626',
          bg: isGood ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
          label: isGood ? 'Good news' : 'Needs attention',
          icon: <TrendIcon />,
          title: `Financial health: ${health.label || health.score + '/100'}`,
          text: isGood
            ? `Your savings rate looks healthy. You're on the right track.`
            : `Your health score is ${health.score}/100. Try reducing non-essential spending.`,
        });
      }

      // Goal closest to completion
      if (Array.isArray(goals) && goals.length > 0) {
        const g = goals
          .filter(g => g.target_amount > 0)
          .sort((a,b) => (b.current_amount/b.target_amount) - (a.current_amount/a.target_amount))[0];
        if (g) {
          const pct = Math.round((g.current_amount/g.target_amount)*100);
          const left = g.target_amount - g.current_amount;
          built.push({
            color:'#7c3aed', bg:'rgba(124,58,237,0.08)',
            label:'Goal update', icon:<ClockIcon />,
            title:`${g.title} at ${pct}%`,
            text:`Just ₹${Number(left).toLocaleString('en-IN')} more to complete your ${g.title} goal.`,
          });
        }
      }

      // Fallback if no data at all
      if (built.length === 0) {
        built.push({
          color:'#2563eb', bg:'rgba(37,99,235,0.08)',
          label:'Get started', icon:<TrendIcon />,
          title:'Add your first expense',
          text:'Once you log some expenses, smart insights will appear here automatically.',
        });
      }

      setInsights(built);
    }).catch(() => {});
  }, []);

  return (
    <section style={{ marginBottom:48 }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>AI analysis</p>
        <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Smart Insights</h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
        {insights.map((ins, i) => (
          <div key={i}
            style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:22, borderLeft:`4px solid ${ins.color}`, transition:'transform 0.2s,box-shadow 0.2s', cursor:'default' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${ins.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>

            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:ins.bg, color:ins.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {ins.icon}
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:ins.color, textTransform:'uppercase', letterSpacing:'0.06em' }}>{ins.label}</span>
            </div>
            <p style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:6 }}>{ins.title}</p>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.65 }}>{ins.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}