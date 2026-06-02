import { useState, useEffect } from 'react';

export default function SpendingTrends() {
  const [trends, setTrends] = useState([]);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    // Fetch this month + last month expenses to compute real trends
    Promise.all([
      fetch('http://localhost:8000/expenses/summary', { headers:H }).then(r=>r.json()),
      fetch('http://localhost:8000/expenses/summary?period=last_month', { headers:H })
        .then(r=>r.json()).catch(()=>[]),
    ]).then(([thisMonth, lastMonth]) => {
      if (!Array.isArray(thisMonth) || thisMonth.length === 0) {
        setTrends([]);
        return;
      }

      const lastMap = {};
      if (Array.isArray(lastMonth)) {
        lastMonth.forEach(l => { lastMap[l.category] = l.total; });
      }

      const built = thisMonth.map(item => {
        const prev = lastMap[item.category] || 0;
        let changePct = 0;
        if (prev > 0) {
          changePct = Math.round(((item.total - prev) / prev) * 100);
        }
        const isUp = changePct >= 0;
        // For expenses, up is bad (red); for savings, up is good (green)
        const isSavings = item.category.toLowerCase() === 'savings';
        const color = isSavings
          ? (isUp ? '#16a34a' : '#dc2626')
          : (isUp ? '#dc2626' : '#16a34a');

        return {
          category: item.category,
          change: (isUp ? '+' : '') + changePct + '%',
          isUp,
          note: prev === 0
            ? 'New this month'
            : isUp
              ? (isSavings ? 'Excellent growth' : 'Higher than last month')
              : (isSavings ? 'Savings dipped' : 'Spending improved'),
          color,
        };
      }).slice(0, 4); // show top 4 categories

      setTrends(built);
    }).catch(() => {});
  }, []);

  if (trends.length === 0) return (
    <section style={{ marginBottom:48 }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>Month vs last month</p>
        <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Spending Trends</h2>
      </div>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'48px 24px', textAlign:'center', color:'var(--text3)' }}>
        Add expenses over multiple months to see trends here.
      </div>
    </section>
  );

  return (
    <section style={{ marginBottom:48 }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:6 }}>Month vs last month</p>
        <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em' }}>Spending Trends</h2>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, overflow:'hidden' }}>
        {trends.map((item, i) => (
          <div key={item.category}
            style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 24px', borderBottom: i<trends.length-1 ? '1px solid var(--border)' : 'none', transition:'background 0.18s,padding-left 0.18s', cursor:'default' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--surface2)'; e.currentTarget.style.paddingLeft='32px'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.paddingLeft='24px'; }}>

            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:item.color, flexShrink:0, boxShadow:`0 0 0 3px ${item.color}25` }} />
              <div>
                <p style={{ fontWeight:600, fontSize:15, color:'var(--text)' }}>{item.category}</p>
                <p style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>{item.note}</p>
              </div>
            </div>
            <span style={{ fontSize:20, fontWeight:800, color:item.color, letterSpacing:'-0.02em' }}>{item.change}</span>
          </div>
        ))}
      </div>
    </section>
  );
}