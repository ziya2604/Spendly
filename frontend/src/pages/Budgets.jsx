import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATS = ['Food','Travel','Rent','Entertainment','Medical','Shopping','Recharge','EMI','Subscriptions','Education','Other'];
const CAT_COLOR = {
  Food:'#2563eb', Travel:'#7c3aed', Rent:'#dc2626', Entertainment:'#d97706',
  Medical:'#16a34a', Shopping:'#0891b2', Recharge:'#9333ea', EMI:'#ea580c',
  Subscriptions:'#0d9488', Education:'#4f46e5', Other:'#6b7280',
};

export default function Budgets() {
  const [budgets,  setBudgets]  = useState([]);
  const [summary,  setSummary]  = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter,   setFilter]   = useState('All');
  const [search,   setSearch]   = useState('');
  const [sort,     setSort]     = useState('pct');
  const [editId,   setEditId]   = useState(null);
  const [editVal,  setEditVal]  = useState('');
  const [form, setForm] = useState({
    category: 'Food',
    limit_amount: '',
    month: new Date().toISOString().slice(0, 7),
  });

  const token = localStorage.getItem('token');
  const H = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = async () => {
    const [b, s, e] = await Promise.all([
      fetch('http://localhost:8000/budgets',          { headers: H }).then(r => r.json()).catch(() => []),
      fetch('http://localhost:8000/expenses/summary', { headers: H }).then(r => r.json()).catch(() => []),
      fetch('http://localhost:8000/expenses',         { headers: H }).then(r => r.json()).catch(() => []),
    ]);
    if (Array.isArray(b)) setBudgets(b);
    if (Array.isArray(s)) setSummary(s);
    if (Array.isArray(e)) setExpenses(e);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.limit_amount) return;
    await fetch('http://localhost:8000/budgets', {
      method: 'POST', headers: H, body: JSON.stringify(form),
    });
    setForm({ category: 'Food', limit_amount: '', month: new Date().toISOString().slice(0, 7) });
    setShowForm(false);
    load();
  };

  const del = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    await fetch(`http://localhost:8000/budgets/${id}`, { method: 'DELETE', headers: H });
    load();
  };

  const saveEdit = async (b) => {
    if (!editVal) { setEditId(null); return; }
    await fetch(`http://localhost:8000/budgets/${b.id}`, {
      method: 'PUT', headers: H,
      body: JSON.stringify({ ...b, limit_amount: editVal }),
    });
    setEditId(null);
    load();
  };

  const duplicate = async (b) => {
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    await fetch('http://localhost:8000/budgets', {
      method: 'POST', headers: H,
      body: JSON.stringify({ category: b.category, limit_amount: b.limit_amount, month: next.toISOString().slice(0, 7) }),
    });
    load();
  };

  const spent = (cat) => Number(summary.find(s => s.category === cat)?.total || 0);

  const totalBudget = budgets.reduce((s, b) => s + Number(b.limit_amount), 0);
  const totalSpent  = budgets.reduce((s, b) => s + spent(b.category), 0);
  const totalRemain = Math.max(0, totalBudget - totalSpent);
  const overallPct  = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const atRiskCount = budgets.filter(b => {
    const p = (spent(b.category) / Number(b.limit_amount)) * 100;
    return p >= 70;
  }).length;

  // daily chart data
  const today = new Date();
  const dailyData = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      const d = new Date(e.date);
      if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
        map[d.getDate()] = (map[d.getDate()] || 0) + Number(e.amount);
      }
    });
    const days = Array.from({ length: today.getDate() }, (_, i) => i + 1);
    return days.slice(-14).map(d => ({ day: d, val: map[d] || 0 }));
  }, [expenses]);
  const chartMax = Math.max(...dailyData.map(d => d.val), 1);

  // insights
  const insights = useMemo(() => {
    const list = [];
    budgets.forEach(b => {
      const s = spent(b.category);
      const pct = Number(b.limit_amount) > 0 ? (s / Number(b.limit_amount)) * 100 : 0;
      if (s > Number(b.limit_amount))
        list.push({ type: 'danger', cat: b.category, text: `Over by ₹${(s - Number(b.limit_amount)).toLocaleString('en-IN')}` });
      else if (pct >= 80)
        list.push({ type: 'warn', cat: b.category, text: `${Math.round(pct)}% used — almost at limit` });
    });
    return list.slice(0, 3);
  }, [budgets, summary]);

  const processed = useMemo(() => {
    let list = [...budgets];
    if (search) list = list.filter(b => b.category.toLowerCase().includes(search.toLowerCase()));
    if (filter !== 'All') list = list.filter(b => b.category === filter);
    if (sort === 'pct')   list.sort((a, b) => (spent(b.category) / Number(b.limit_amount)) - (spent(a.category) / Number(a.limit_amount)));
    if (sort === 'spent') list.sort((a, b) => spent(b.category) - spent(a.category));
    if (sort === 'name')  list.sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [budgets, search, filter, sort, summary]);

  const overallBarColor = overallPct >= 90 ? 'var(--red)' : overallPct >= 70 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface2)' }}>
      <Navbar />

      {/* ── HERO BANNER ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)',
        padding: '52px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* orbs */}
        <div style={{ position:'absolute', top:-80, left:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, right:-60, width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 28px', position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24 }}>
            <div>
              <div style={{
                display:'inline-block', padding:'5px 14px', borderRadius:20,
                border:'1px solid rgba(124,58,237,0.5)', color:'#a78bfa',
                fontSize:11, fontWeight:700, letterSpacing:'0.1em',
                textTransform:'uppercase', marginBottom:16,
              }}>
                Monthly budgets
              </div>
              <h1 style={{
                fontSize:'clamp(30px, 5vw, 52px)', fontWeight:800,
                letterSpacing:'-0.03em', lineHeight:1.05, color:'#fff', marginBottom:12,
              }}>
                Where does your<br />
                <span style={{ background:'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  money go?
                </span>
              </h1>
              <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', lineHeight:1.7, maxWidth:460 }}>
                Set limits per category, track daily spend, and get notified before you overshoot.
              </p>
            </div>

            <button
              onClick={() => setShowForm(s => !s)}
              style={{
                padding:'13px 28px', background: showForm ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color:'#fff', border: showForm ? '1px solid rgba(255,255,255,0.2)' : 'none',
                borderRadius:10, fontWeight:600, fontSize:14, cursor:'pointer',
                boxShadow: showForm ? 'none' : '0 8px 24px rgba(124,58,237,0.35)',
                transition:'all 0.2s', fontFamily:'inherit',
              }}>
              {showForm ? 'Cancel' : '+ New budget'}
            </button>
          </div>
        </div>
      </div>

      {/* ── STAT BAR ────────────────────────────────────────────── */}
      <div style={{
        background:'var(--surface)', borderBottom:'1px solid var(--border)',
        display:'grid', gridTemplateColumns:'repeat(4, 1fr)',
      }}>
        {[
          { label:'Total budget', value:`₹${totalBudget.toLocaleString('en-IN')}`, sub: `${budgets.length} categories`, color:'var(--blue)' },
          { label:'Spent so far',  value:`₹${totalSpent.toLocaleString('en-IN')}`,  sub:`${Math.round(overallPct)}% of budget`, color: overallPct >= 90 ? 'var(--red)' : overallPct >= 70 ? 'var(--yellow)' : 'var(--text)' },
          { label:'Remaining',     value:`₹${totalRemain.toLocaleString('en-IN')}`, sub:'left this month', color:'var(--green)' },
          { label:'At risk',       value:atRiskCount, sub:`${atRiskCount === 1 ? 'category' : 'categories'} over 70%`, color: atRiskCount > 0 ? 'var(--yellow)' : 'var(--text)' },
        ].map((s, i) => (
          <div key={s.label} className="db-stat-cell" style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <div className="db-stat-label">{s.label}</div>
            <div className="db-stat-value num" style={{ fontSize: 28, color: s.color }}>{s.value}</div>
            <div className="db-stat-sub" style={{ color:'var(--text3)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <main style={{ flex:1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 28px 80px' }}>

          {/* ── ADD FORM ──────────────────────────────────────────── */}
          {showForm && (
            <div className="fade-up" style={{
              background:'var(--surface)', border:'1px solid var(--border)',
              borderRadius:20, padding:28, marginBottom:32,
            }}>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>New budget</h3>
              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:20 }}>Set a monthly spending limit for a category.</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:16 }}>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Monthly limit (₹)</label>
                  <input className="input" type="number" placeholder="e.g. 5000"
                    value={form.limit_amount}
                    onChange={e => setForm({ ...form, limit_amount: e.target.value })} />
                </div>
                <div>
                  <label className="label">Month</label>
                  <input className="input" type="month" value={form.month}
                    onChange={e => setForm({ ...form, month: e.target.value })} />
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                <button className="btn btn-primary" onClick={save}>Save budget</button>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* ── TWO COLUMN LAYOUT ─────────────────────────────────── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>

            {/* LEFT — budget list */}
            <div>
              {/* search + sort bar */}
              {budgets.length > 0 && (
                <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
                  <input
                    className="input"
                    placeholder="Search category..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth:200, padding:'8px 14px', fontSize:13 }}
                  />
                  <select className="input" value={sort} onChange={e => setSort(e.target.value)}
                    style={{ maxWidth:170, padding:'8px 14px', fontSize:13 }}>
                    <option value="pct">Sort: % used</option>
                    <option value="spent">Sort: most spent</option>
                    <option value="name">Sort: A–Z</option>
                  </select>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {['All', ...CATS.filter(c => budgets.some(b => b.category === c))].map(c => (
                      <button key={c} onClick={() => setFilter(c)}
                        style={{
                          padding:'6px 14px', fontSize:12, fontWeight:600,
                          borderRadius:20, cursor:'pointer', fontFamily:'inherit',
                          transition:'all 0.15s',
                          background: filter === c ? 'var(--blue)' : 'var(--surface)',
                          color:      filter === c ? '#fff' : 'var(--text2)',
                          border:     `1px solid ${filter === c ? 'var(--blue)' : 'var(--border)'}`,
                          boxShadow:  filter === c ? '0 0 0 3px var(--blue-glow)' : 'none',
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* budget cards */}
              {processed.length === 0 ? (
                <div style={{
                  background:'var(--surface)', border:'2px dashed var(--border)',
                  borderRadius:20, padding:'64px 32px', textAlign:'center',
                }}>
                  <p style={{ fontSize:32, marginBottom:12 }}>💰</p>
                  <p style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>No budgets yet</p>
                  <p style={{ color:'var(--text2)', fontSize:14, marginBottom:20 }}>
                    Hit "+ New budget" to start tracking your spending by category.
                  </p>
                  <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Add your first budget
                  </button>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {processed.map((b, idx) => {
                    const s        = spent(b.category);
                    const pct      = Number(b.limit_amount) > 0 ? Math.min(100, (s / Number(b.limit_amount)) * 100) : 0;
                    const remain   = Math.max(0, Number(b.limit_amount) - s);
                    const over     = s > Number(b.limit_amount);
                    const barColor = pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--yellow)' : 'var(--green)';
                    const isEditing = editId === b.id;
                    const color    = CAT_COLOR[b.category] || '#6b7280';

                    return (
                      <div key={b.id} className="fade-up" style={{
                        background:'var(--surface)', border:'1px solid var(--border)',
                        borderRadius:16, padding:'20px 24px',
                        borderLeft:`4px solid ${color}`,
                        transition:'box-shadow 0.18s, border-color 0.18s',
                        animationDelay:`${idx * 40}ms`,
                      }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                      >
                        {/* top row */}
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                          <div>
                            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                              <span style={{
                                fontSize:14, fontWeight:700, color:'var(--text)',
                              }}>{b.category}</span>
                              {over && (
                                <span className="badge badge-red" style={{ fontSize:11 }}>Over limit</span>
                              )}
                              {!over && pct >= 80 && (
                                <span className="badge badge-yellow" style={{ fontSize:11 }}>At risk</span>
                              )}
                            </div>
                            <span style={{ fontSize:12, color:'var(--text3)' }}>{b.month}</span>
                          </div>

                          <div style={{ textAlign:'right' }}>
                            {isEditing ? (
                              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <input
                                  className="input"
                                  type="number"
                                  value={editVal}
                                  autoFocus
                                  onChange={e => setEditVal(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(b); if (e.key === 'Escape') setEditId(null); }}
                                  style={{ width:90, padding:'5px 10px', fontSize:13 }}
                                />
                                <button className="btn btn-primary" style={{ padding:'5px 12px', fontSize:12 }} onClick={() => saveEdit(b)}>Save</button>
                                <button className="btn btn-ghost"   style={{ padding:'5px 10px', fontSize:12 }} onClick={() => setEditId(null)}>✕</button>
                              </div>
                            ) : (
                              <>
                                <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end', marginBottom:2 }}>
                                  <span className="num" style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>
                                    ₹{s.toLocaleString('en-IN')}
                                  </span>
                                  <span style={{ color:'var(--text3)', fontSize:13 }}>/</span>
                                  <span style={{ fontSize:13, color:'var(--text2)' }}>₹{Number(b.limit_amount).toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display:'flex', gap:10, justifyContent:'flex-end', alignItems:'center' }}>
                                  <span className="num" style={{ fontSize:13, fontWeight:700, color: barColor }}>{Math.round(pct)}%</span>
                                  <button title="Edit limit"
                                    onClick={() => { setEditId(b.id); setEditVal(b.limit_amount); }}
                                    style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:13, padding:0, transition:'color 0.15s', lineHeight:1 }}
                                    onMouseEnter={e => e.currentTarget.style.color='var(--blue)'}
                                    onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>✎</button>
                                  <button title="Copy to next month"
                                    onClick={() => duplicate(b)}
                                    style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:13, padding:0, transition:'color 0.15s', lineHeight:1 }}
                                    onMouseEnter={e => e.currentTarget.style.color='var(--blue)'}
                                    onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>⧉</button>
                                  <button title="Delete"
                                    onClick={() => del(b.id)}
                                    style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontSize:13, padding:0, transition:'color 0.15s', lineHeight:1 }}
                                    onMouseEnter={e => e.currentTarget.style.color='var(--red)'}
                                    onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>✕</button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* progress */}
                        <div className="progress-track" style={{ height:7 }}>
                          <div className="progress-fill" style={{ width:`${pct}%`, background:barColor }} />
                        </div>

                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                          <span style={{ fontSize:12, color:'var(--text3)' }}>
                            {over
                              ? `₹${(s - Number(b.limit_amount)).toLocaleString('en-IN')} over budget`
                              : `₹${remain.toLocaleString('en-IN')} remaining`}
                          </span>
                          <span style={{ fontSize:12, color:'var(--text3)' }}>
                            ₹{(Number(b.limit_amount) - s > 0 ? (Number(b.limit_amount) - s) / Math.max(1, new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate() - today.getDate()) : 0).toLocaleString('en-IN', { maximumFractionDigits:0 })}/day left
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* overall health */}
              {budgets.length > 0 && (
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:14 }}>Overall health</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
                    <span style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.03em', color: overallBarColor }} className="num">
                      {Math.round(overallPct)}%
                    </span>
                    <span style={{ fontSize:12, color:'var(--text2)' }}>of total budget used</span>
                  </div>
                  <div className="progress-track" style={{ height:8, marginBottom:8 }}>
                    <div className="progress-fill" style={{ width:`${overallPct}%`, background: overallBarColor }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:12, color:'var(--text3)' }}>₹{totalSpent.toLocaleString('en-IN')} spent</span>
                    <span style={{ fontSize:12, color:'var(--text3)' }}>₹{totalBudget.toLocaleString('en-IN')} total</span>
                  </div>
                </div>
              )}

              {/* daily chart */}
              {dailyData.length > 0 && (
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16 }}>
                    <div>
                      <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:4 }}>Daily spend</p>
                      <p style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>
                        {today.toLocaleString('default', { month:'long' })}
                      </p>
                    </div>
                    <span style={{ fontSize:12, color:'var(--text3)' }}>last {dailyData.length}d</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:64 }}>
                    {dailyData.map(({ day, val }) => {
                      const h = val > 0 ? Math.max(5, Math.round((val / chartMax) * 64)) : 3;
                      const isToday = day === today.getDate();
                      return (
                        <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                          <div
                            title={`Day ${day}: ₹${val.toLocaleString('en-IN')}`}
                            style={{
                              width:'100%', height:h,
                              background: isToday ? 'var(--blue)' : val > 0 ? 'var(--blue)' : 'var(--border)',
                              opacity: isToday ? 1 : val > 0 ? 0.35 : 1,
                              borderRadius:3, cursor: val > 0 ? 'pointer' : 'default',
                              transition:'opacity 0.2s',
                            }}
                            onMouseEnter={e => { if (val > 0) e.currentTarget.style.opacity = 1; }}
                            onMouseLeave={e => { if (val > 0 && !isToday) e.currentTarget.style.opacity = 0.35; }}
                          />
                          {dailyData.length <= 10 && (
                            <span style={{ fontSize:9, color: isToday ? 'var(--blue)' : 'var(--text3)' }}>{day}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* insights */}
              {insights.length > 0 && (
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:14 }}>Insights</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {insights.map((ins, i) => {
                      const colors = { danger:'var(--red)', warn:'var(--yellow)', good:'var(--green)' };
                      const bgs    = { danger:'#dc262610', warn:'#d9770610', good:'#16a34a10' };
                      return (
                        <div key={i} style={{
                          padding:'10px 14px', borderRadius:10,
                          background: bgs[ins.type],
                          borderLeft:`3px solid ${colors[ins.type]}`,
                        }}>
                          <p style={{ fontSize:12, fontWeight:700, color:'var(--text)', marginBottom:2 }}>{ins.cat}</p>
                          <p style={{ fontSize:12, color:'var(--text2)' }}>{ins.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* category breakdown */}
              {budgets.length > 0 && (
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:20 }}>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text3)', marginBottom:14 }}>By category</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[...budgets].sort((a,b) => spent(b.category) - spent(a.category)).map(b => {
                      const s = spent(b.category);
                      const pct = Number(b.limit_amount) > 0 ? Math.min(100, (s / Number(b.limit_amount)) * 100) : 0;
                      const color = CAT_COLOR[b.category] || '#6b7280';
                      return (
                        <div key={b.id}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                              <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0 }} />
                              <span style={{ fontSize:13, color:'var(--text2)' }}>{b.category}</span>
                            </div>
                            <span style={{ fontSize:12, fontWeight:600, color:'var(--text)' }} className="num">
                              {Math.round(pct)}%
                            </span>
                          </div>
                          <div className="progress-track" style={{ height:4 }}>
                            <div className="progress-fill" style={{ width:`${pct}%`, background:color, opacity:0.7 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}