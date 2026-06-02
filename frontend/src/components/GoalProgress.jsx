import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#0891b2','#dc2626'];
const ICONS = { default:'🎯', trip:'✈️', laptop:'💻', emergency:'🛡️', phone:'📱', car:'🚗' };

const getIcon = (title='') => {
  const t = title.toLowerCase();
  if (t.includes('trip')||t.includes('travel')) return '✈️';
  if (t.includes('laptop')||t.includes('computer')) return '💻';
  if (t.includes('emergency')) return '🛡️';
  if (t.includes('phone')) return '📱';
  if (t.includes('car')) return '🚗';
  return '🎯';
};

export default function GoalProgress() {
  const [goals, setGoals] = useState([]);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    fetch('http://localhost:8000/goals', { headers:H })
      .then(r => r.json())
      .then(d => Array.isArray(d) && setGoals(d))
      .catch(() => {});
  }, []);

  if (goals.length === 0) return (
    <section style={{ marginBottom:48 }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>Savings tracker</p>
        <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Goal Progress</h2>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'48px 24px', textAlign:'center', color:'var(--text3)' }}>
        <p style={{ marginBottom:12 }}>No goals set yet.</p>
        <Link to="/goals" style={{ color:'var(--blue)', fontWeight:600, fontSize:13 }}>Create your first goal →</Link>
      </div>
    </section>
  );

  return (
    <section style={{ marginBottom:48 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>Savings tracker</p>
          <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Goal Progress</h2>
        </div>
        <Link to="/goals" style={{ fontSize:13, color:'var(--blue)', fontWeight:600, textDecoration:'none' }}>Manage all goals →</Link>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
        {goals.slice(0,3).map((goal, i) => {
          const color = COLORS[i % COLORS.length];
          const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          const remaining = Math.max(0, goal.target_amount - goal.current_amount);

          return (
            <div key={goal.id}
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:24, transition:'transform 0.2s,box-shadow 0.2s,border-color 0.2s', cursor:'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${color}18`; e.currentTarget.style.borderColor=color; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--border)'; }}>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:color+'15', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                    {getIcon(goal.title)}
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:2 }}>{goal.title}</p>
                    <p style={{ fontSize:12, color:'var(--text3)' }}>₹{remaining.toLocaleString('en-IN')} to go</p>
                  </div>
                </div>
                <span style={{ fontSize:22, fontWeight:800, color, letterSpacing:'-0.02em' }}>{pct}%</span>
              </div>

              <div style={{ height:8, background:'var(--border)', borderRadius:99, overflow:'hidden', marginBottom:14 }}>
                <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${color}bb,${color})`, borderRadius:99, transition:'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
              </div>

              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, fontWeight:700, color }}>₹{Number(goal.current_amount).toLocaleString('en-IN')}</span>
                <span style={{ fontSize:12, color:'var(--text3)' }}>of ₹{Number(goal.target_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}