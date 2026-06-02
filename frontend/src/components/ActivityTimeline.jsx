import { useState, useEffect } from 'react';

const CAT_COLOR = {
  Food:'#2563eb',Travel:'#7c3aed',Rent:'#dc2626',Entertainment:'#d97706',
  Medical:'#16a34a',Shopping:'#0891b2',Recharge:'#9333ea',EMI:'#ea580c',
  Subscriptions:'#0d9488',Education:'#4f46e5',Other:'#6b7280',
  Income:'#16a34a', Goal:'#7c3aed', Budget:'#2563eb', Bill:'#d97706',
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
};

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    // Pull from expenses + goals + bills for a real timeline
    Promise.all([
      fetch('http://localhost:8000/expenses', { headers:H }).then(r=>r.json()).catch(()=>[]),
      fetch('http://localhost:8000/goals',    { headers:H }).then(r=>r.json()).catch(()=>[]),
      fetch('http://localhost:8000/bills',    { headers:H }).then(r=>r.json()).catch(()=>[]),
      fetch('http://localhost:8000/income',   { headers:H }).then(r=>r.json()).catch(()=>[]),
    ]).then(([expenses, goals, bills, income]) => {
      const items = [];

      if (Array.isArray(expenses)) {
        expenses.slice(0,3).forEach(e => items.push({
          title: `Added ${e.category} Expense`,
          detail: `₹${Number(e.amount).toLocaleString('en-IN')}`,
          date: e.date,
          color: CAT_COLOR[e.category] || '#6b7280',
        }));
      }
      if (Array.isArray(goals)) {
        goals.slice(0,1).forEach(g => items.push({
          title: 'Created Goal',
          detail: g.title,
          date: g.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          color: CAT_COLOR.Goal,
        }));
      }
      if (Array.isArray(income)) {
        income.slice(0,1).forEach(inc => items.push({
          title: 'Added Income',
          detail: `₹${Number(inc.amount).toLocaleString('en-IN')}`,
          date: inc.date,
          color: CAT_COLOR.Income,
        }));
      }
      if (Array.isArray(bills)) {
        bills.slice(0,1).forEach(b => items.push({
          title: 'Bill Reminder',
          detail: b.name || b.title,
          date: b.due_date || b.date,
          color: CAT_COLOR.Bill,
        }));
      }

      // Sort by date descending
      items.sort((a,b) => new Date(b.date) - new Date(a.date));
      setActivities(items.slice(0,5));
    }).catch(() => {});
  }, []);

  return (
    <section style={{ marginBottom:48 }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>History</p>
        <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Activity Timeline</h2>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden' }}>
        {activities.length === 0 ? (
          <div style={{ padding:'48px 24px', textAlign:'center', color:'var(--text3)' }}>
            No activity yet. Start by adding an expense.
          </div>
        ) : activities.map((item, i) => (
          <div key={i}
            style={{ display:'flex', alignItems:'center', gap:16, padding:'18px 24px', borderBottom: i<activities.length-1 ? '1px solid var(--border)' : 'none', transition:'background 0.15s', cursor:'default' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>

            <div style={{ width:12, height:12, borderRadius:'50%', background:item.color, flexShrink:0, boxShadow:`0 0 0 4px ${item.color}20` }} />
            <div style={{ width:40, height:40, borderRadius:12, background:item.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:11, fontWeight:800, color:item.color }}>{item.title[0]}</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{item.title}</p>
              <p style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{item.detail}</p>
            </div>
            <span style={{ fontSize:12, color:'var(--text3)', flexShrink:0 }}>{timeAgo(item.date)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}