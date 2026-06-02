import { useState, useEffect } from 'react';

const BoltIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const TrendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
  </svg>
);

// Static badge definitions — unlocked dynamically based on real data
const BADGE_DEFS = [
  { id:'streak',  title:'7-Day Streak',  desc:'Tracked finances every day for a week', color:'#d97706', icon:<BoltIcon />,  check: (d) => d.expenseCount >= 7 },
  { id:'goal',    title:'Goal Setter',   desc:'Created your first savings goal',        color:'#7c3aed', icon:<TargetIcon />,check: (d) => d.goalCount >= 1 },
  { id:'budget',  title:'Budget Master', desc:'Stayed within budget this month',        color:'#16a34a', icon:<CheckIcon />, check: (d) => d.healthScore >= 70 },
  { id:'growth',  title:'Money Growth',  desc:'Improved savings rate by 10%+',         color:'#0891b2', icon:<TrendIcon />, check: (d) => d.savingsRate >= 10 },
];

export default function AchievementCards() {
  const [badges, setBadges] = useState([]);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/expenses', { headers:H }).then(r=>r.json()),
      fetch('http://localhost:8000/expenses/health-score', { headers:H }).then(r=>r.json()),
      fetch('http://localhost:8000/goals', { headers:H }).then(r=>r.json()),
    ]).then(([expenses, health, goals]) => {
      const expenseCount = Array.isArray(expenses) ? expenses.length : 0;
      const goalCount = Array.isArray(goals) ? goals.length : 0;
      const healthScore = health?.score || 0;
      const savingsRate = health?.total_income > 0
        ? Math.round((health.savings / health.total_income) * 100)
        : 0;

      const data = { expenseCount, goalCount, healthScore, savingsRate };

      // Show unlocked badges first, locked ones greyed out
      setBadges(BADGE_DEFS.map(b => ({ ...b, unlocked: b.check(data) })));
    }).catch(() => {
      setBadges(BADGE_DEFS.map(b => ({ ...b, unlocked: false })));
    });
  }, []);

  return (
    <section style={{ marginBottom:48 }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>Milestones</p>
        <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Achievements</h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
        {badges.map(badge => (
          <div key={badge.id}
            style={{
              background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:20, padding:'22px 20px',
              opacity: badge.unlocked ? 1 : 0.45,
              transition:'transform 0.2s,box-shadow 0.2s,border-color 0.2s',
              cursor:'default', position:'relative',
            }}
            onMouseEnter={e => {
              if (!badge.unlocked) return;
              e.currentTarget.style.transform='translateY(-4px)';
              e.currentTarget.style.boxShadow=`0 12px 28px ${badge.color}20`;
              e.currentTarget.style.borderColor=badge.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform='none';
              e.currentTarget.style.boxShadow='none';
              e.currentTarget.style.borderColor='var(--border)';
            }}>

            {!badge.unlocked && (
              <span style={{ position:'absolute', top:12, right:14, fontSize:10, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                🔒 Locked
              </span>
            )}

            <div style={{ width:48, height:48, borderRadius:14, background:badge.color+'15', color:badge.color, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
              {badge.icon}
            </div>
            <p style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:6 }}>{badge.title}</p>
            <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6 }}>{badge.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}