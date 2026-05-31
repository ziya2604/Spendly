import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
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

ChartJS.register(ArcElement, Tooltip, Legend);

const CAT_COLOR = {
  Food:'#2563eb',Travel:'#7c3aed',Rent:'#dc2626',
  Entertainment:'#d97706',Medical:'#16a34a',Shopping:'#0891b2',
  Recharge:'#9333ea',EMI:'#ea580c',Subscriptions:'#0d9488',
  Education:'#4f46e5',Other:'#6b7280',
};

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Animated counter ── */
function Counter({ target, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0; const end = Number(target); if (end === 0) { setCount(0); return; }
    const step = Math.ceil(end / 40);
    const t = setInterval(() => { start += step; if (start >= end) { setCount(end); clearInterval(t); } else setCount(start); }, 30);
    return () => clearInterval(t);
  }, [visible, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0, direction = 'up' }) {
  const [ref, visible] = useReveal();
  const transforms = { up: 'translateY(36px)', left: 'translateX(-36px)', right: 'translateX(36px)', none: 'none' };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[direction],
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

/* ── Budget tab data ── */
const BUDGET_TABS = [
  { label: 'Track Spending', icon: '📊', headline: 'Know where every rupee goes.', body: 'Categorise expenses automatically. See daily, weekly and monthly breakdowns. Spot patterns before they become problems.', color: '#2563eb' },
  { label: 'Set Budgets',    icon: '🎯', headline: 'Set limits. Stay in control.', body: 'Create custom budgets per category. Get alerted before you overspend. Visual progress bars keep you honest.', color: '#7c3aed' },
  { label: 'Savings Goals',  icon: '💰', headline: 'Save with a purpose.', body: 'Name your goal, set a target, track progress. Whether it\'s a trip, a laptop, or an emergency fund — Spendly keeps you on track.', color: '#16a34a' },
  { label: 'Learn Finance',  icon: '📚', headline: 'Build financial knowledge.', body: 'Bite-size lessons on budgeting, investing, and debt. Learn the concepts banks never teach you — free, simple, and actionable.', color: '#d97706' },
];

/* ── Finance tip ticker ── */
const TIPS = [
  '50/30/20 rule: 50% needs, 30% wants, 20% savings',
  'Emergency fund = 3–6 months of expenses',
  'Pay yourself first — automate your savings',
  'Track every rupee for just 30 days — it changes everything',
  'Compound interest works for you when you invest early',
];

export default function Dashboard() {
  const [summary, setSummary]   = useState([]);
  const [health, setHealth]     = useState(null);
  const [recent, setRecent]     = useState([]);
  const [activeTab, setTab]     = useState(0);
  const [tipIdx, setTipIdx]     = useState(0);
  const [tipVisible, setTipVis] = useState(true);
  const name  = localStorage.getItem('name') || 'User';
  const token = localStorage.getItem('token');
  const H = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };

  useEffect(() => {
    fetch('http://localhost:8000/expenses/summary',      {headers:H}).then(r=>r.json()).then(d=>Array.isArray(d)&&setSummary(d)).catch(()=>{});
    fetch('http://localhost:8000/expenses/health-score', {headers:H}).then(r=>r.json()).then(setHealth).catch(()=>{});
    fetch('http://localhost:8000/expenses',              {headers:H}).then(r=>r.json()).then(d=>Array.isArray(d)&&setRecent(d.slice(0,5))).catch(()=>{});
  }, []);

  // Tip ticker
  useEffect(() => {
    const t = setInterval(() => {
      setTipVis(false);
      setTimeout(() => { setTipIdx(i => (i+1) % TIPS.length); setTipVis(true); }, 400);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const chartData = {
    labels: summary.map(s => s.category),
    datasets: [{ data: summary.map(s=>s.total), backgroundColor: summary.map(s=>CAT_COLOR[s.category]||'#6b7280'), borderWidth:0, hoverOffset:8 }],
  };
  const chartOptions = { cutout:'70%', plugins:{ legend:{display:false}, tooltip:{callbacks:{label:ctx=>` ₹${Number(ctx.raw).toLocaleString('en-IN')}`}} } };

  const tab = BUDGET_TABS[activeTab];

  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', background:'#f8f9fc'}}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)',
        padding: '80px 20px 90px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{position:'absolute',top:'-80px',left:'-80px',width:'400px',height:'400px',background:'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',bottom:'-60px',right:'-60px',width:'350px',height:'350px',background:'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',pointerEvents:'none'}} />

        <div style={{maxWidth:'1100px',margin:'0 auto',textAlign:'center',position:'relative'}}>
          <Reveal>
            <span style={{display:'inline-block',padding:'6px 18px',borderRadius:'20px',border:'1px solid rgba(124,58,237,0.5)',color:'#a78bfa',fontSize:'12px',fontWeight:'600',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'24px'}}>
              Personal Finance Dashboard
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={{fontSize:'clamp(36px, 6vw, 68px)', fontWeight:'800', letterSpacing:'-0.03em', lineHeight:'1.05', color:'#fff', marginBottom:'20px'}}>
              {greeting},<br/>
              <span style={{background:'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{name}.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{fontSize:'18px',color:'rgba(255,255,255,0.55)',maxWidth:'520px',margin:'0 auto 36px',lineHeight:'1.7'}}>
              Your complete financial picture — budgets, goals, and learning. All in one place.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/expenses" style={{padding:'13px 28px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',borderRadius:'10px',textDecoration:'none',fontWeight:'600',fontSize:'14px',boxShadow:'0 8px 24px rgba(124,58,237,0.35)',transition:'transform 0.2s',display:'inline-block'}}
                onMouseEnter={e=>e.target.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.target.style.transform='none'}>
                + Add Expense
              </Link>
              <Link to="/budgets" style={{padding:'13px 28px',background:'rgba(255,255,255,0.1)',color:'#fff',borderRadius:'10px',textDecoration:'none',fontWeight:'600',fontSize:'14px',border:'1px solid rgba(255,255,255,0.15)',backdropFilter:'blur(8px)'}}>
                Manage Budgets
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ STAT CARDS ═══ */}
      <section style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 20px'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0'}}>
          {[
            { label:'Net Balance', val: health ? health.savings : 0, prefix:'₹', color:'#2563eb', sub: health?.savings>=0?'Positive':'Overspending', subColor: health?.savings>=0?'#16a34a':'#dc2626' },
            { label:'Income', val: health ? health.total_income : 0, prefix:'₹', color:'#16a34a', sub:'This month', subColor:'#16a34a' },
            { label:'Expenses', val: health ? health.total_expenses : 0, prefix:'₹', color:'#dc2626', sub:'This month', subColor:'#dc2626' },
            { label:'Health Score', val: health ? health.score : 0, suffix:'/100', color:'#7c3aed', sub: health?.label||'—', subColor:'#7c3aed' },
          ].map((s,i) => (
            <Reveal key={s.label} delay={i*0.08}>
              <div style={{padding:'28px 24px',borderRight:i<3?'1px solid #e5e7eb':'none',cursor:'default',transition:'background 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='#f8f9fc'}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'0.08em',textTransform:'uppercase',color:'#9ca3af',marginBottom:'10px'}}>{s.label}</p>
                <p style={{fontSize:'32px',fontWeight:'800',letterSpacing:'-0.04em',color:s.color,lineHeight:1,marginBottom:'6px'}}>
                  <Counter target={s.val} prefix={s.prefix||''} suffix={s.suffix||''} />
                </p>
                <p style={{fontSize:'12px',fontWeight:'500',color:s.subColor}}>{s.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ FINANCE TIP TICKER ═══ */}
      <div style={{background:'#1e1b4b',padding:'14px 20px',overflow:'hidden'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'flex',alignItems:'center',gap:'16px'}}>
          <span style={{fontSize:'11px',fontWeight:'700',letterSpacing:'0.1em',color:'#818cf8',textTransform:'uppercase',flexShrink:0}}>💡 Finance Tip</span>
          <div style={{width:'1px',height:'16px',background:'rgba(255,255,255,0.15)',flexShrink:0}} />
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.8)',fontWeight:'500',opacity:tipVisible?1:0,transform:tipVisible?'none':'translateY(8px)',transition:'opacity 0.4s, transform 0.4s'}}>
            {TIPS[tipIdx]}
          </p>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'48px 20px 80px',width:'100%'}}>

        {/* ═══ SPENDING + TRANSACTIONS ═══ */}
        <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:'20px',marginBottom:'48px'}}>
          <Reveal direction="left">
            <div style={{background:'#fff',borderRadius:'20px',padding:'28px',border:'1px solid #e5e7eb',height:'100%'}}>
              <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'0.08em',textTransform:'uppercase',color:'#9ca3af',marginBottom:'6px'}}>This month</p>
              <h3 style={{fontSize:'18px',fontWeight:'700',color:'#111827',marginBottom:'24px'}}>Spending by category</h3>
              {summary.length > 0 ? (
                <>
                  <div style={{width:150,margin:'0 auto 24px',position:'relative'}}>
                    <Doughnut data={chartData} options={chartOptions} />
                    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                      <span style={{fontSize:'11px',color:'#9ca3af'}}>Total</span>
                      <span style={{fontWeight:'800',fontSize:'16px',color:'#111827'}}>₹{summary.reduce((s,i)=>s+i.total,0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  {summary.map(s=>(
                    <div key={s.category} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{width:8,height:8,borderRadius:'50%',background:CAT_COLOR[s.category]||'#6b7280',flexShrink:0,display:'block'}} />
                        <span style={{fontSize:'13px',color:'#6b7280'}}>{s.category}</span>
                      </div>
                      <span style={{fontSize:'13px',fontWeight:'600',color:'#111827'}}>₹{Number(s.total).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{textAlign:'center',padding:'40px 0',color:'#9ca3af'}}>
                  <p style={{fontSize:'32px',marginBottom:'12px'}}>📭</p>
                  <p style={{marginBottom:'8px',fontWeight:'500'}}>No expenses yet</p>
                  <Link to="/expenses" style={{color:'#2563eb',fontSize:'13px',fontWeight:'600'}}>Add your first →</Link>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal direction="right">
            <div style={{background:'#fff',borderRadius:'20px',padding:'28px',border:'1px solid #e5e7eb',height:'100%'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px'}}>
                <div>
                  <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'0.08em',textTransform:'uppercase',color:'#9ca3af',marginBottom:'6px'}}>Latest activity</p>
                  <h3 style={{fontSize:'18px',fontWeight:'700',color:'#111827'}}>Recent transactions</h3>
                </div>
                <Link to="/expenses" style={{fontSize:'13px',color:'#2563eb',fontWeight:'600',textDecoration:'none',display:'flex',alignItems:'center',gap:'4px'}}>
                  View all <span>→</span>
                </Link>
              </div>
              {recent.length === 0 ? (
                <div style={{textAlign:'center',padding:'48px 0',color:'#9ca3af'}}>
                  <p style={{fontSize:'32px',marginBottom:'12px'}}>🧾</p>
                  <p>No transactions yet.</p>
                </div>
              ) : (
                <div>
                  {recent.map((e,i) => (
                    <div key={e.id} style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 12px',borderRadius:'12px',marginBottom:'4px',transition:'background 0.15s',cursor:'default'}}
                      onMouseEnter={ev=>ev.currentTarget.style.background='#f8f9fc'}
                      onMouseLeave={ev=>ev.currentTarget.style.background='transparent'}>
                      <div style={{width:'40px',height:'40px',borderRadius:'12px',background:(CAT_COLOR[e.category]||'#6b7280')+'18',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <span style={{fontSize:'11px',fontWeight:'800',color:CAT_COLOR[e.category]||'#6b7280'}}>{(e.category||'O')[0]}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontWeight:'600',fontSize:'14px',color:'#111827',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{e.note||e.category}</p>
                        <p style={{fontSize:'12px',color:'#9ca3af',marginTop:'2px'}}>{e.date} · <span style={{color:CAT_COLOR[e.category]||'#6b7280'}}>{e.category}</span></p>
                      </div>
                      <p style={{fontWeight:'700',fontSize:'15px',color:'#dc2626',flexShrink:0}}>−₹{Number(e.amount).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* ═══ QUICK ACTIONS ═══ */}
        <Reveal>
          <div style={{marginBottom:'56px'}}>
            <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'0.08em',textTransform:'uppercase',color:'#9ca3af',marginBottom:'6px'}}>Jump to</p>
            <h2 style={{fontSize:'26px',fontWeight:'800',color:'#111827',marginBottom:'20px'}}>Quick actions</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'12px'}}>
              {[
                {to:'/expenses',label:'Add Expense',sub:'Log a spend',color:'#2563eb'},
                {to:'/income',label:'Add Income',sub:'Record earnings',color:'#16a34a'},
                {to:'/budgets',label:'New Budget',sub:'Set a limit',color:'#7c3aed'},
                {to:'/goals',label:'New Goal',sub:'Save for it',color:'#d97706'},
                {to:'/bills',label:'New Bill',sub:'Track due dates',color:'#0891b2'},
                {to:'/calculator',label:'Calculator',sub:'Plan numbers',color:'#9333ea'},
              ].map(a=>(
                <Link key={a.to} to={a.to} style={{display:'block',padding:'18px 14px',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'16px',textDecoration:'none',transition:'all 0.22s ease',borderTop:`3px solid ${a.color}`}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow=`0 12px 28px ${a.color}22`}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
                  <p style={{fontSize:'13px',fontWeight:'700',color:'#111827',marginBottom:'4px'}}>{a.label}</p>
                  <p style={{fontSize:'12px',color:'#9ca3af'}}>{a.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ BUDGET TABS ═══ */}
        <div style={{marginBottom:'64px'}}>
          <Reveal>
            <p style={{fontSize:'11px',fontWeight:'700',letterSpacing:'0.08em',textTransform:'uppercase',color:'#9ca3af',marginBottom:'6px',textAlign:'center'}}>What Spendly does</p>
            <h2 style={{fontSize:'clamp(28px,4vw,42px)',fontWeight:'800',color:'#111827',textAlign:'center',letterSpacing:'-0.03em',marginBottom:'32px'}}>
              Powering your finances.<br/>All in one solution.
            </h2>
          </Reveal>

          {/* Tabs */}
          <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'32px',flexWrap:'wrap'}}>
            {BUDGET_TABS.map((t,i)=>(
              <button key={t.label} onClick={()=>setTab(i)} style={{padding:'10px 20px',borderRadius:'40px',border:`2px solid ${i===activeTab?t.color:'#e5e7eb'}`,background:i===activeTab?t.color:'#fff',color:i===activeTab?'#fff':'#6b7280',fontWeight:'600',fontSize:'13px',cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',gap:'6px'}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px',alignItems:'center',background:'#fff',borderRadius:'24px',padding:'48px',border:'1px solid #e5e7eb',minHeight:'260px'}}>
            <div key={activeTab} style={{animation:'tabFadeIn 0.35s ease'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'14px',background:tab.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',marginBottom:'20px'}}>{tab.icon}</div>
              <h3 style={{fontSize:'28px',fontWeight:'800',color:'#111827',letterSpacing:'-0.02em',marginBottom:'14px',lineHeight:1.2}}>{tab.headline}</h3>
              <p style={{fontSize:'16px',color:'#6b7280',lineHeight:'1.8',marginBottom:'24px'}}>{tab.body}</p>
              <Link to={['/expenses','/budgets','/goals','/education'][activeTab]} style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 24px',background:tab.color,color:'#fff',borderRadius:'10px',textDecoration:'none',fontWeight:'600',fontSize:'14px'}}>
                Get started →
              </Link>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {['Set your targets','Track daily progress','Get smart alerts','Hit your goals'].map((item,i)=>(
                <div key={item} style={{display:'flex',alignItems:'center',gap:'14px',padding:'16px 20px',background:i===activeTab%4?tab.color+'0d':'#f8f9fc',borderRadius:'14px',border:`1px solid ${i===activeTab%4?tab.color+'30':'transparent'}`,transition:'all 0.3s'}}>
                  <div style={{width:'28px',height:'28px',borderRadius:'50%',background:tab.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{color:'#fff',fontSize:'13px',fontWeight:'700'}}>{i+1}</span>
                  </div>
                  <span style={{fontSize:'14px',fontWeight:'600',color:'#374151'}}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ COMPONENTS ═══ */}
        <GoalProgress />
        <SmartInsights />
        <FinancialSnapshot />
        <AchievementCards />
        <SpendingTrends />
        <ActivityTimeline />

        {/* ═══ FINANCIAL EDUCATION HIGHLIGHT ═══ */}
        <Reveal>
          <div style={{background:'linear-gradient(135deg,#0f0c29,#1a1040)',borderRadius:'24px',padding:'56px 48px',marginBottom:'32px',marginTop:'32px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-40px',right:'-40px',width:'300px',height:'300px',background:'radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)',pointerEvents:'none'}} />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center',position:'relative'}}>
              <div>
                <span style={{display:'inline-block',padding:'5px 14px',borderRadius:'20px',border:'1px solid rgba(167,139,250,0.4)',color:'#a78bfa',fontSize:'11px',fontWeight:'700',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'20px'}}>Financial Education</span>
                <h2 style={{fontSize:'clamp(24px,3.5vw,38px)',fontWeight:'800',color:'#fff',letterSpacing:'-0.03em',lineHeight:1.15,marginBottom:'16px'}}>
                  Learn money skills<br/>banks won't teach you.
                </h2>
                <p style={{fontSize:'16px',color:'rgba(255,255,255,0.55)',lineHeight:'1.75',marginBottom:'28px'}}>
                  From budgeting basics to understanding EMIs, debt payoff strategies, and building wealth — Spendly's learning hub has you covered.
                </p>
                <Link to="/education" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'13px 28px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',borderRadius:'10px',textDecoration:'none',fontWeight:'600',fontSize:'14px',boxShadow:'0 8px 24px rgba(124,58,237,0.4)'}}>
                  Start Learning →
                </Link>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                {['Budgeting 101','Debt Payoff','Emergency Fund','Invest Early','Credit Score','Tax Basics'].map((topic,i)=>(
                  <Link key={topic} to="/education" style={{padding:'16px',background:'rgba(255,255,255,0.07)',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',textDecoration:'none',transition:'all 0.2s',backdropFilter:'blur(8px)'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(124,58,237,0.2)';e.currentTarget.style.borderColor='rgba(124,58,237,0.5)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}>
                    <p style={{fontSize:'13px',fontWeight:'600',color:'#e2e8f0'}}>{topic}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <LessonCard />
        <FAQ />

        {/* ═══ CTA BANNER ═══ */}
        <Reveal>
          <div style={{background:'linear-gradient(135deg,#2563eb,#7c3aed)',borderRadius:'20px',padding:'48px 40px',textAlign:'center',marginTop:'32px'}}>
            <h2 style={{fontSize:'clamp(22px,3vw,34px)',fontWeight:'800',color:'#fff',marginBottom:'12px',letterSpacing:'-0.02em'}}>
              Start managing your money smarter today.
            </h2>
            <p style={{fontSize:'16px',color:'rgba(255,255,255,0.7)',marginBottom:'28px'}}>Every rupee tracked is a step toward financial freedom.</p>
            <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link to="/expenses" style={{padding:'13px 28px',background:'#fff',color:'#2563eb',borderRadius:'10px',textDecoration:'none',fontWeight:'700',fontSize:'14px'}}>Add Expense</Link>
              <Link to="/goals" style={{padding:'13px 28px',background:'rgba(255,255,255,0.15)',color:'#fff',borderRadius:'10px',textDecoration:'none',fontWeight:'600',fontSize:'14px',border:'1px solid rgba(255,255,255,0.3)'}}>Set a Goal</Link>
            </div>
          </div>
        </Reveal>

      </div>

      <Footer />

      <style>{`
        @keyframes tabFadeIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  );
}