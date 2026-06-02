import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, PointElement, LineElement, Filler,
} from 'chart.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GoalProgress from '../components/GoalProgress';
import SmartInsights from '../components/SmartInsights';
import FinancialSnapshot from '../components/FinancialSnapshot';
import AchievementCards from '../components/AchievementCards';
import SpendingTrends from '../components/SpendingTrends';
import ActivityTimeline from '../components/ActivityTimeline';
import LessonCard from '../components/LessonCard';
import FAQ from '../components/FAQ';
import AboutSpendly from '../components/AboutSpendly';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const CAT_COLOR = {
  Food:'#2563eb',Travel:'#7c3aed',Rent:'#dc2626',Entertainment:'#d97706',
  Medical:'#16a34a',Shopping:'#0891b2',Recharge:'#9333ea',EMI:'#ea580c',
  Subscriptions:'#0d9488',Education:'#4f46e5',Other:'#6b7280',
};

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0, dir = 'up' }) {
  const [ref, vis] = useReveal();
  const t = { up:'translateY(28px)', left:'translateX(-28px)', right:'translateX(28px)' };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : t[dir],
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

function SectionHead({ eyebrow, title, eyeColor = '#7c3aed', center = false }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 32 }}>
      <p style={{ fontSize:11, fontWeight:700, color:eyeColor, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>{eyebrow}</p>
      <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:800, color:'var(--text)', letterSpacing:'-0.025em', lineHeight:1.2 }}
        dangerouslySetInnerHTML={{ __html: title }} />
    </div>
  );
}

const TIPS = [
  'Follow the 50/30/20 rule — 50% needs, 30% wants, 20% savings.',
  'Emergency fund target: 3–6 months of your monthly expenses.',
  'Pay yourself first — automate savings before spending anything.',
  'Tracking every rupee for 30 days changes how you spend forever.',
  'Compound interest rewards those who start investing early.',
];

const FEATURES = [
  { title:'Expense Tracking', desc:'Log every rupee, auto-categorised.', color:'#2563eb' },
  { title:'Budget Limits',    desc:'Set monthly caps per category.',      color:'#7c3aed' },
  { title:'Savings Goals',    desc:'Name it, track it, hit it.',           color:'#16a34a' },
  { title:'Debt Manager',     desc:'Track EMIs and loans easily.',         color:'#dc2626' },
  { title:'Bill Reminders',   desc:'Never miss a due date again.',         color:'#d97706' },
  { title:'Finance Learn',    desc:'Bite-size money lessons daily.',       color:'#0891b2' },
  { title:'Group Splits',     desc:'Split expenses with friends.',          color:'#9333ea' },
  { title:'Challenges',       desc:'Gamified saving challenges.',           color:'#ea580c' },
];

// Interactive doughnut
function InteractiveDoughnut({ summary }) {
  const [active, setActive] = useState(null);
  const total = summary.reduce((s, i) => s + i.total, 0);

  const chartData = {
    labels: summary.map(s => s.category),
    datasets: [{
      data: summary.map(s => s.total),
      backgroundColor: summary.map((s, i) => {
        const c = CAT_COLOR[s.category] || '#6b7280';
        return active !== null && active !== i ? c + '55' : c;
      }),
      borderWidth: active !== null ? summary.map((_, i) => i === active ? 3 : 0) : 0,
      borderColor: '#fff',
      hoverOffset: 12,
    }],
  };

  const opts = {
    cutout: '68%',
    animation: { duration: 600 },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ₹${Number(ctx.raw).toLocaleString('en-IN')} (${Math.round(ctx.raw / total * 100)}%)` } },
    },
    onClick: (_, els) => setActive(els.length ? (els[0].index === active ? null : els[0].index) : null),
  };

  return (
    <div>
      <div style={{ position:'relative', width:220, margin:'0 auto 28px' }}>
        <Doughnut data={chartData} options={opts} />
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
          {active !== null ? (
            <>
              <p style={{ fontSize:11, color:'var(--text3)', fontWeight:600, marginBottom:2 }}>{summary[active].category}</p>
              <p style={{ fontSize:20, fontWeight:800, color:'var(--text)' }}>₹{Number(summary[active].total).toLocaleString('en-IN')}</p>
              <p style={{ fontSize:11, color:'var(--text3)' }}>{Math.round(summary[active].total / total * 100)}%</p>
            </>
          ) : (
            <>
              <p style={{ fontSize:11, color:'var(--text3)', fontWeight:600, marginBottom:2 }}>Total</p>
              <p style={{ fontSize:20, fontWeight:800, color:'var(--text)' }}>₹{total.toLocaleString('en-IN')}</p>
            </>
          )}
        </div>
      </div>
      <div>
        {summary.map((s, i) => {
          const pct = Math.round(s.total / total * 100);
          const isActive = active === i;
          return (
            <div key={s.category} onClick={() => setActive(isActive ? null : i)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', marginBottom:2, background: isActive ? 'var(--surface2)' : 'transparent', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background=isActive?'var(--surface2)':'transparent'}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:CAT_COLOR[s.category]||'#6b7280', flexShrink:0 }} />
              <span style={{ flex:1, fontSize:13, color:'var(--text)', fontWeight:500 }}>{s.category}</span>
              <span style={{ fontSize:12, color:'var(--text3)', marginRight:8 }}>{pct}%</span>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>₹{Number(s.total).toLocaleString('en-IN')}</span>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize:11, color:'var(--text3)', textAlign:'center', marginTop:12 }}>Click a segment or row to highlight</p>
    </div>
  );
}

// Real budget bars from API
function BudgetVisual({ dark = false }) {
  const [budgets, setBudgets] = useState([]);
  const [hovered, setHovered] = useState(null);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/budgets', { headers:H }).then(r=>r.json()),
      fetch('http://localhost:8000/expenses/summary', { headers:H }).then(r=>r.json()),
    ]).then(([buds, summary]) => {
      if (!Array.isArray(buds) || buds.length === 0) return;
      const spentMap = {};
      if (Array.isArray(summary)) summary.forEach(s => { spentMap[s.category] = s.total; });
      setBudgets(buds.slice(0,4).map(b => ({
        cat: b.category,
        spent: spentMap[b.category] || 0,
        limit: b.limit || b.amount || 0,
        color: CAT_COLOR[b.category] || '#7c3aed',
      })));
    }).catch(() => {});
  }, []);

  const textColor = dark ? '#fff' : 'var(--text)';
  const subColor  = dark ? 'rgba(255,255,255,0.5)' : 'var(--text3)';
  const trackBg   = dark ? 'rgba(255,255,255,0.12)' : '#e5e7eb';
  const bg        = dark ? 'rgba(255,255,255,0.06)' : 'var(--surface)';

  if (budgets.length === 0) return (
    <div style={{ background:bg, borderRadius:16, padding:'28px 24px', color:subColor, textAlign:'center' }}>
      <p>Set budgets to see them here.</p>
    </div>
  );

  return (
    <div style={{ background:bg, borderRadius:16, padding:'28px 24px' }}>
      <p style={{ fontSize:11, fontWeight:700, color:dark?'#a78bfa':'#7c3aed', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:20 }}>
        Monthly Budgets
      </p>
      {budgets.map((b, i) => {
        const pct = b.limit > 0 ? Math.min(100, Math.round((b.spent/b.limit)*100)) : 0;
        const over = pct >= 90;
        return (
          <div key={b.cat} style={{ marginBottom:18, position:'relative' }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:13, fontWeight:600, color:textColor }}>{b.cat}</span>
              <span style={{ fontSize:12, color:over?'#ef4444':subColor, fontWeight:over?700:400 }}>
                ₹{b.spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ height:9, background:trackBg, borderRadius:99, overflow:'hidden', cursor:'pointer' }}>
              <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:over?'#ef4444':b.color, transition:'width 0.8s cubic-bezier(.22,1,.36,1)' }} />
            </div>
            {hovered === i && (
              <div style={{ position:'absolute', right:0, top:-36, background:'#1e293b', color:'#fff', fontSize:11, fontWeight:600, padding:'5px 10px', borderRadius:6, zIndex:10, whiteSpace:'nowrap', boxShadow:'0 4px 12px rgba(0,0,0,0.2)' }}>
                {pct}% used · {100-pct}% left
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Real goal bars from API
function GoalVisual({ dark = false }) {
  const [goals, setGoals] = useState([]);
  const [hovered, setHovered] = useState(null);

  const token = localStorage.getItem('token');
  const H = { Authorization:`Bearer ${token}` };

  useEffect(() => {
    fetch('http://localhost:8000/goals', { headers:H })
      .then(r=>r.json())
      .then(d => Array.isArray(d) && setGoals(d.slice(0,3)))
      .catch(()=>{});
  }, []);

  const textColor = dark ? '#fff' : '#14532d';
  const trackBg   = dark ? 'rgba(255,255,255,0.12)' : '#bbf7d0';
  const bg        = dark ? 'rgba(255,255,255,0.06)' : 'var(--surface)';
  const COLORS    = ['#16a34a','#2563eb','#d97706'];

  if (goals.length === 0) return (
    <div style={{ background:bg, borderRadius:16, padding:'28px 24px', color:dark?'rgba(255,255,255,0.4)':'var(--text3)', textAlign:'center' }}>
      <p>No goals yet. Create one to track here.</p>
    </div>
  );

  return (
    <div style={{ background:bg, borderRadius:16, padding:'28px 24px' }}>
      <p style={{ fontSize:11, fontWeight:700, color:dark?'#6ee7b7':'#16a34a', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:20 }}>
        Your Goals
      </p>
      {goals.map((g, i) => {
        const pct = Math.min(100, Math.round((g.current_amount/g.target_amount)*100));
        const color = COLORS[i % COLORS.length];
        return (
          <div key={g.id} style={{ marginBottom:22, cursor:'pointer' }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:13, fontWeight:600, color:textColor }}>{g.title}</span>
              <span style={{ fontSize:13, fontWeight:800, color }}>{pct}%</span>
            </div>
            <div style={{ height:hovered===i?12:9, background:trackBg, borderRadius:99, overflow:'hidden', transition:'height 0.2s ease' }}>
              <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:99, transition:'width 1s cubic-bezier(.22,1,.36,1)', position:'relative', overflow:'hidden' }}>
                {hovered===i && (
                  <div style={{ position:'absolute', top:0, left:'-100%', width:'60%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', animation:'shimmer 0.8s ease forwards' }} />
                )}
              </div>
            </div>
            <span style={{ fontSize:11, color:'var(--text3)', marginTop:4, display:'block' }}>
              ₹{(g.target_amount - g.current_amount).toLocaleString('en-IN')} to go
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Daily spending line chart (last 7 days)
function SpendingLineChart({ expenses }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  const totals = days.map(day =>
    expenses.filter(e => e.date === day).reduce((s,e) => s + Number(e.amount), 0)
  );

  const data = {
    labels: days.map(d => {
      const dt = new Date(d);
      return dt.toLocaleDateString('en-IN', { weekday:'short', day:'numeric' });
    }),
    datasets: [{
      label: 'Spent (₹)',
      data: totals,
      fill: true,
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124,58,237,0.08)',
      tension: 0.4,
      pointBackgroundColor: '#7c3aed',
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };

  const opts = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}` } },
    },
    scales: {
      x: { grid:{ display:false }, ticks:{ color:'var(--text3)', font:{ size:11 } } },
      y: { grid:{ color:'var(--border)' }, ticks:{ color:'var(--text3)', font:{ size:11 }, callback: v => '₹'+v.toLocaleString('en-IN') } },
    },
  };

  return <Line data={data} options={opts} />;
}

export default function Dashboard() {
  const [summary,  setSummary]  = useState([]);
  const [health,   setHealth]   = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [tipIdx,   setTipIdx]   = useState(0);
  const [tipVis,   setTipVis]   = useState(true);
  const scrollRef    = useRef(null);
  const scrollPaused = useRef(false);

  const name  = localStorage.getItem('name') || 'User';
  const token = localStorage.getItem('token');
  const H = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };

  useEffect(() => {
    fetch('http://localhost:8000/expenses/summary',      { headers:H }).then(r=>r.json()).then(d=>Array.isArray(d)&&setSummary(d)).catch(()=>{});
    fetch('http://localhost:8000/expenses/health-score', { headers:H }).then(r=>r.json()).then(setHealth).catch(()=>{});
    fetch('http://localhost:8000/expenses',              { headers:H }).then(r=>r.json()).then(d=>Array.isArray(d)&&setRecent(d)).catch(()=>{});
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTipVis(false);
      setTimeout(() => { setTipIdx(i => (i+1)%TIPS.length); setTipVis(true); }, 350);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    let pos = 0;
    const tick = setInterval(() => {
      if (scrollPaused.current) return;
      pos += 0.6;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
    }, 16);
    return () => clearInterval(tick);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ minHeight:'100vh', background:'var(--surface2)', color:'var(--text)' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ position:'relative', overflow:'hidden', background:'linear-gradient(140deg,#0a0818 0%,#111827 55%,#0f172a 100%)', padding:'clamp(64px,10vw,100px) 24px clamp(52px,8vw,80px)', textAlign:'center' }}>
        <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:400, background:'radial-gradient(ellipse,rgba(124,58,237,0.14) 0%,transparent 68%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', maxWidth:740, margin:'0 auto' }}>
          <Reveal>
            <span style={{ display:'inline-block', padding:'6px 18px', borderRadius:99, border:'1px solid rgba(124,58,237,0.4)', color:'#a78bfa', fontSize:12, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:20 }}>
              Your Financial Dashboard
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontSize:'clamp(34px,6vw,64px)', fontWeight:900, color:'#fff', letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:16 }}>
              {greeting},<br />
              <span style={{ background:'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {name}.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontSize:'clamp(14px,2vw,17px)', color:'rgba(255,255,255,0.55)', marginBottom:32, lineHeight:1.8 }}>
              Track every rupee. Set goals. Build better habits. All in one place.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/expenses" style={{ padding:'13px 28px', borderRadius:12, background:'#7c3aed', color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none', boxShadow:'0 8px 24px rgba(124,58,237,0.4)', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(124,58,237,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 24px rgba(124,58,237,0.4)'; }}>
                + Add Expense
              </Link>
              <Link to="/goals" style={{ padding:'13px 28px', borderRadius:12, border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.85)', fontWeight:600, fontSize:14, textDecoration:'none', transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                My Goals
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HEALTH SCORE BAR — real data */}
      <section style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))' }}>
          {[
            { label:'Net Balance',  val: health ? `₹${Math.abs(health.savings||0).toLocaleString('en-IN')}` : '—', color:'#2563eb', sub: health?.savings >= 0 ? '▲ Positive' : '▼ Overspending', subOk: health?.savings >= 0 },
            { label:'Income',       val: health ? `₹${(health.total_income||0).toLocaleString('en-IN')}` : '—',    color:'#16a34a', sub:'This month', subOk:true },
            { label:'Expenses',     val: health ? `₹${(health.total_expenses||0).toLocaleString('en-IN')}` : '—',  color:'#dc2626', sub:'This month', subOk:false },
            { label:'Health Score', val: health ? `${health.score}/100` : '—', color:'#7c3aed', sub:health?.label||'—', subOk:true },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ padding:'28px 16px', textAlign:'center', borderRight: i<arr.length-1 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>{s.label}</p>
              <p style={{ fontSize:'clamp(22px,3.5vw,34px)', fontWeight:900, color:s.color, letterSpacing:'-0.02em', lineHeight:1 }}>{s.val}</p>
              <p style={{ fontSize:12, marginTop:6, color:s.subOk?'#16a34a':'#dc2626', fontWeight:500 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIP TICKER */}
      <div style={{ background:'linear-gradient(90deg,#eff6ff,#f5f3ff)', borderBottom:'1px solid var(--border)', padding:'11px 24px', display:'flex', alignItems:'center', gap:14 }}>
        <span style={{ flexShrink:0, fontSize:11, fontWeight:700, color:'#2563eb', textTransform:'uppercase', letterSpacing:'0.1em', background:'#dbeafe', padding:'4px 10px', borderRadius:6 }}>
          💡 Tip
        </span>
        <p style={{ fontSize:13, color:'#1e40af', fontWeight:500, flex:1, opacity:tipVis?1:0, transform:tipVis?'none':'translateY(4px)', transition:'opacity 0.35s,transform 0.35s' }}>
          {TIPS[tipIdx]}
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth:1140, margin:'0 auto', padding:'56px 24px 80px' }}>

        {/* SPENDING OVERVIEW */}
        <Reveal>
          <div style={{ marginBottom:80 }}>
            <SectionHead eyebrow="This month" title="Where is your money going?" eyeColor="#2563eb" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>

              {/* Pie chart */}
              <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:28 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:20 }}>By category</h3>
                {summary.length > 0 ? (
                  <InteractiveDoughnut summary={summary} />
                ) : (
                  <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)' }}>
                    <p style={{ marginBottom:10 }}>No expenses logged yet.</p>
                    <Link to="/expenses" style={{ color:'#2563eb', fontWeight:600, fontSize:13 }}>Add your first →</Link>
                  </div>
                )}
              </div>

              {/* Line chart — daily trend last 7 days */}
              <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:28 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text)', marginBottom:20 }}>Last 7 days</h3>
                {recent.length > 0 ? (
                  <SpendingLineChart expenses={recent} />
                ) : (
                  <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text3)' }}>
                    <p>No data to show yet.</p>
                  </div>
                )}
              </div>

              {/* Recent transactions */}
              <div style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', padding:28 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>Recent transactions</h3>
                  <Link to="/expenses" style={{ fontSize:12, color:'#2563eb', fontWeight:600, textDecoration:'none' }}>View all →</Link>
                </div>
                {recent.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text3)' }}>
                    <p>No transactions yet.</p>
                  </div>
                ) : recent.slice(0,5).map(e => (
                  <div key={e.id}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 8px', borderRadius:10, transition:'background 0.15s', cursor:'default' }}
                    onMouseEnter={ev => ev.currentTarget.style.background='var(--surface2)'}
                    onMouseLeave={ev => ev.currentTarget.style.background='transparent'}>
                    <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:(CAT_COLOR[e.category]||'#6b7280')+'18', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:11, fontWeight:800, color:CAT_COLOR[e.category]||'#6b7280' }}>{(e.category||'O')[0]}</span>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.note || e.category}</p>
                      <p style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{e.date} · <span style={{ color:CAT_COLOR[e.category]||'#6b7280' }}>{e.category}</span></p>
                    </div>
                    <p style={{ fontSize:14, fontWeight:700, color:'#dc2626', flexShrink:0 }}>−₹{Number(e.amount).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* QUICK ACTIONS */}
        <Reveal>
          <div style={{ marginBottom:80 }}>
            <SectionHead eyebrow="Jump to" title="Quick actions" eyeColor="#7c3aed" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:14 }}>
              {[
                { to:'/expenses',   label:'Add Expense',  sub:'Log a spend',     color:'#2563eb' },
                { to:'/income',     label:'Add Income',   sub:'Record earnings', color:'#16a34a' },
                { to:'/budgets',    label:'New Budget',   sub:'Set a limit',     color:'#7c3aed' },
                { to:'/goals',      label:'New Goal',     sub:'Save for it',     color:'#d97706' },
                { to:'/bills',      label:'New Bill',     sub:'Track due dates', color:'#0891b2' },
                { to:'/calculator', label:'Calculator',   sub:'Plan numbers',    color:'#9333ea' },
              ].map((a, i) => (
                <Reveal key={a.to} delay={i*0.04}>
                  <Link to={a.to} style={{ display:'block', padding:'18px 14px', background:'var(--surface)', border:`1px solid var(--border)`, borderTop:`3px solid ${a.color}`, borderRadius:12, textDecoration:'none', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 28px ${a.color}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:4 }}>{a.label}</p>
                    <p style={{ fontSize:12, color:'var(--text3)' }}>{a.sub}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* FEATURE SCROLL STRIP */}
        <div style={{ marginBottom:88 }}>
          <div style={{ display:'grid', gridTemplateColumns:'minmax(240px,380px) 1fr', gap:48, alignItems:'center' }}>
            <Reveal dir="left">
              <SectionHead eyebrow="Everything you need" title="Powering every<br/>financial decision." eyeColor="#2563eb" />
              <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.8, marginBottom:28, marginTop:-16 }}>
                From tracking daily chai to saving for a laptop — Spendly has a tool for every rupee you spend or save.
              </p>
              <Link to="/expenses" style={{ display:'inline-block', padding:'12px 24px', borderRadius:10, background:'#2563eb', color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none' }}>
                Explore features →
              </Link>
            </Reveal>
            <div style={{ position:'relative', overflow:'hidden' }}>
              <div ref={scrollRef}
                onMouseEnter={() => scrollPaused.current=true}
                onMouseLeave={() => scrollPaused.current=false}
                style={{ display:'flex', gap:14, overflowX:'hidden', paddingBottom:4 }}>
                {[...FEATURES,...FEATURES].map((f,i) => (
                  <div key={i} style={{ flexShrink:0, width:166, padding:'18px 16px', background:'var(--surface)', borderRadius:12, border:`1px solid var(--border)`, borderTop:`3px solid ${f.color}`, transition:'box-shadow 0.2s,transform 0.2s', cursor:'default' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 24px ${f.color}22`; e.currentTarget.style.transform='translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:f.color+'18', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                      <div style={{ width:12, height:12, borderRadius:3, background:f.color }} />
                    </div>
                    <p style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:4 }}>{f.title}</p>
                    <p style={{ fontSize:11, color:'var(--text3)', lineHeight:1.5 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ position:'absolute', top:0, left:0, width:48, height:'100%', background:'linear-gradient(to right,var(--surface2),transparent)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', top:0, right:0, width:48, height:'100%', background:'linear-gradient(to left,var(--surface2),transparent)', pointerEvents:'none' }} />
            </div>
          </div>
        </div>

        {/* BUDGET SECTION — real data */}
        <Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:0, marginBottom:72, borderRadius:20, overflow:'hidden', background:'linear-gradient(135deg,#1e1b4b,#2e1065)' }}>
            <div style={{ padding:'clamp(32px,5vw,52px) clamp(24px,4vw,48px)' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#a78bfa', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>Budget management</p>
              <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:900, color:'#fff', letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:16 }}>
                Set limits.<br /><span style={{ color:'#a78bfa' }}>Stay in control.</span>
              </h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.8, marginBottom:20 }}>
                Create monthly budgets for every category. Visual progress bars update as you spend — so you always know exactly where you stand.
              </p>
              <ul style={{ paddingLeft:0, listStyle:'none', marginBottom:32 }}>
                {['Category-wise spending caps','Live progress that updates instantly','Alert when you are close to limit'].map(item => (
                  <li key={item} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:10 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#a78bfa', flexShrink:0 }} />{item}
                  </li>
                ))}
              </ul>
              <Link to="/budgets" style={{ display:'inline-block', padding:'12px 24px', borderRadius:10, background:'#7c3aed', color:'#fff', fontWeight:700, fontSize:13, textDecoration:'none', boxShadow:'0 8px 20px rgba(124,58,237,0.4)' }}>
                Set Budgets →
              </Link>
            </div>
            <div style={{ padding:'clamp(24px,4vw,40px)' }}>
              <BudgetVisual dark={true} />
            </div>
          </div>
        </Reveal>

        {/* GOALS SECTION — real data */}
        <Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:0, marginBottom:72, borderRadius:20, overflow:'hidden', background:'linear-gradient(135deg,#052e16,#14532d)' }}>
            <div style={{ padding:'clamp(24px,4vw,40px)' }}>
              <GoalVisual dark={true} />
            </div>
            <div style={{ padding:'clamp(32px,5vw,52px) clamp(24px,4vw,48px)' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#6ee7b7', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>Savings goals</p>
              <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:900, color:'#fff', letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:16 }}>
                Save with<br /><span style={{ color:'#6ee7b7' }}>a purpose.</span>
              </h2>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.8, marginBottom:20 }}>
                Name your goal, set a target and deadline. Spendly tells you how close you are — every single day.
              </p>
              <ul style={{ paddingLeft:0, listStyle:'none', marginBottom:32 }}>
                {['Emergency fund, trip, gadgets — any goal','Visual progress tracking','Deadline countdown'].map(item => (
                  <li key={item} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:10 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#6ee7b7', flexShrink:0 }} />{item}
                  </li>
                ))}
              </ul>
              <Link to="/goals" style={{ display:'inline-block', padding:'12px 24px', borderRadius:10, background:'#16a34a', color:'#fff', fontWeight:700, fontSize:13, textDecoration:'none', boxShadow:'0 8px 20px rgba(22,163,74,0.4)' }}>
                Set a Goal →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* EDUCATION SECTION */}
        <Reveal>
          <div style={{ background:'linear-gradient(135deg,#0c1445,#1e3a5f)', borderRadius:20, padding:'clamp(36px,5vw,56px)', marginBottom:80, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-40px', right:'-40px', width:240, height:240, borderRadius:'50%', background:'rgba(37,99,235,0.2)', filter:'blur(60px)', pointerEvents:'none' }} />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:40, position:'relative' }}>
              <div>
                <span style={{ display:'inline-block', padding:'5px 14px', borderRadius:99, border:'1px solid rgba(147,197,253,0.4)', color:'#93c5fd', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                  Financial Education
                </span>
                <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.25, marginBottom:14 }}>
                  Learn money skills<br />banks won't teach you.
                </h2>
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.8, marginBottom:24 }}>
                  Budgeting, debt payoff, investing, tax basics — free, simple, actually actionable.
                </p>
                <Link to="/education" style={{ display:'inline-block', padding:'11px 22px', borderRadius:10, background:'rgba(255,255,255,0.1)', color:'#fff', fontWeight:700, fontSize:13, textDecoration:'none', border:'1px solid rgba(255,255,255,0.2)' }}>
                  Start Learning →
                </Link>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:10, alignContent:'flex-start' }}>
                {['Budgeting 101','Debt Payoff','Emergency Fund','Invest Early','Credit Score','Tax Basics'].map(topic => (
                  <Link key={topic} to="/education" style={{ padding:'8px 14px', borderRadius:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.75)', fontSize:12, fontWeight:600, textDecoration:'none', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(37,99,235,0.3)'; e.currentTarget.style.borderColor='rgba(37,99,235,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}>
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* SUB-COMPONENTS — all now pull real data */}
        <Reveal><div style={{ marginBottom:56 }}><AboutSpendly /></div></Reveal>
        <Reveal><div style={{ marginBottom:48 }}><GoalProgress /></div></Reveal>
        <Reveal delay={0.05}><div style={{ marginBottom:48 }}><SmartInsights /></div></Reveal>
        <Reveal><div style={{ marginBottom:48 }}><FinancialSnapshot /></div></Reveal>
        <Reveal delay={0.05}><div style={{ marginBottom:48 }}><AchievementCards /></div></Reveal>
        <Reveal><div style={{ marginBottom:48 }}><SpendingTrends /></div></Reveal>
        <Reveal delay={0.05}><div style={{ marginBottom:48 }}><ActivityTimeline /></div></Reveal>
        <LessonCard />
        <FAQ />

        {/* ABOUT SECTION */}
        <Reveal>
          <div style={{ marginTop:72, background:'linear-gradient(140deg,#0a0818,#111827)', borderRadius:20, overflow:'hidden' }}>
            <div style={{ padding:'clamp(40px,6vw,60px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:48, alignItems:'center' }}>
                <div>
                  <span style={{ display:'inline-block', padding:'5px 14px', borderRadius:99, border:'1px solid rgba(124,58,237,0.4)', color:'#a78bfa', fontSize:11, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>
                    About Spendly
                  </span>
                  <h2 style={{ fontSize:'clamp(26px,4vw,38px)', fontWeight:900, color:'#fff', letterSpacing:'-0.025em', lineHeight:1.2, marginBottom:16 }}>
                    Making personal finance<br />
                    <span style={{ background:'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                      actually make sense.
                    </span>
                  </h2>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.85, marginBottom:24 }}>
                    Founded in 2024, Spendly was built from scratch for students and young professionals managing money for the first time.
                  </p>
                  <Link to="/about" style={{ display:'inline-block', padding:'11px 22px', borderRadius:10, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.85)', fontWeight:700, fontSize:13, textDecoration:'none', border:'1px solid rgba(255,255,255,0.15)' }}>
                    Our Story →
                  </Link>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  {[
                    { title:'Transparency',      desc:'No hidden fees. No dark patterns.',         color:'#7c3aed' },
                    { title:'Built for Students', desc:'Simple, not dumbed down.',                  color:'#2563eb' },
                    { title:'Privacy First',      desc:"Your data is yours. Always.",               color:'#16a34a' },
                    { title:'Actionable',         desc:'Every feature changes how you spend.',      color:'#d97706' },
                  ].map(v => (
                    <div key={v.title} style={{ padding:20, borderRadius:12, background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.08)`, borderTop:`2px solid ${v.color}` }}>
                      <p style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:6 }}>{v.title}</p>
                      <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* BOTTOM CTA */}
        <Reveal>
          <div style={{ marginTop:56, background:'linear-gradient(135deg,#7c3aed,#2563eb)', borderRadius:20, padding:'clamp(36px,5vw,52px)', textAlign:'center' }}>
            <h2 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'#fff', letterSpacing:'-0.02em', marginBottom:10 }}>
              Every rupee tracked is a step toward freedom.
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.65)', marginBottom:28 }}>Start taking control of your money today.</p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/expenses" style={{ padding:'12px 26px', borderRadius:10, background:'#fff', color:'#7c3aed', fontWeight:700, fontSize:14, textDecoration:'none' }}>Add Expense</Link>
              <Link to="/goals"    style={{ padding:'12px 26px', borderRadius:10, border:'1px solid rgba(255,255,255,0.35)', color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none' }}>Set a Goal</Link>
            </div>
          </div>
        </Reveal>
      </div>

      <Footer />
      <style>{`@keyframes shimmer { from { left:-100%; } to { left:150%; } }`}</style>
    </div>
  );
}