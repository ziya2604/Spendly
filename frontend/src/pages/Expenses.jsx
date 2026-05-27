import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATS = ['Food','Travel','Rent','Entertainment','Medical','Shopping','Recharge','EMI','Subscriptions','Education','Other'];

const CAT_COLOR = {
  Food:'#2563eb',Travel:'#7c3aed',Rent:'#dc2626',Entertainment:'#d97706',
  Medical:'#16a34a',Shopping:'#0891b2',Recharge:'#9333ea',EMI:'#ea580c',
  Subscriptions:'#0d9488',Education:'#4f46e5',Other:'#6b7280',
};

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filter,   setFilter]   = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showSms,  setShowSms]  = useState(false);
  const [sms,      setSms]      = useState('');
  const [form, setForm] = useState({
    amount: '', category: 'Food', note: '', tags: '',
    date: new Date().toISOString().split('T')[0],
  });

  const token = localStorage.getItem('token');
  const H = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = () =>
    fetch('http://localhost:8000/expenses', { headers: H })
      .then(r => r.json()).then(d => Array.isArray(d) && setExpenses(d));

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.amount) return;
    await fetch('http://localhost:8000/expenses', {
      method: 'POST', headers: H, body: JSON.stringify(form),
    });
    setForm({ amount: '', category: 'Food', note: '', tags: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    load();
  };

  const del = async id => {
    if (!window.confirm('Delete this expense?')) return;
    await fetch(`http://localhost:8000/expenses/${id}`, { method: 'DELETE', headers: H });
    load();
  };

  // Regex-based SMS parser
  const parseSms = () => {
    const amt  = sms.match(/(?:rs\.?|inr\.?|₹)\s*(\d+(?:\.\d{1,2})?)/i);
    const merc = sms.match(/(?:to|at|for)\s+([A-Za-z0-9 ]+?)(?:\s+on|\s+via|\.|$)/i);
    if (amt) {
      setForm(f => ({ ...f, amount: amt[1], note: merc ? merc[1].trim() : '' }));
      setShowSms(false); setSms(''); setShowForm(true);
    }
  };

  const filtered = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);
  const total    = filtered.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface2)' }}>
      <Navbar />

      <main className="page" style={{ flex: 1 }}>

        {/* Header */}
        <div className="flex justify-between items-center mb-20">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Expenses</h2>
            <p className="text-muted mt-4 text-sm">
              {filtered.length} transactions · Total ₹{total.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex gap-8">
            <button className="btn btn-ghost" onClick={() => setShowSms(s => !s)}>
              📱 UPI SMS
            </button>
            <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
              + Add expense
            </button>
          </div>
        </div>

        {/* SMS parser panel */}
        {showSms && (
          <div className="card fade-up mb-16">
            <h3 className="mb-8" style={{ fontSize: 14 }}>Paste your UPI SMS</h3>
            <textarea
              className="input mb-8"
              rows={3}
              placeholder='E.g. "Rs.450 debited to Swiggy on 25-05-26 via UPI Ref 123456"'
              value={sms}
              onChange={e => setSms(e.target.value)}
              style={{ resize: 'none' }}
            />
            <button className="btn btn-primary" onClick={parseSms}>
              Extract details
            </button>
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div className="card fade-up mb-16">
            <h3 className="mb-16" style={{ fontSize: 14 }}>New expense</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
              {[
                { key: 'amount',   label: 'Amount ₹',  type: 'number', ph: '0' },
                { key: 'note',     label: 'Description',type: 'text',   ph: 'What was this?' },
                { key: 'tags',     label: 'Tags',       type: 'text',   ph: 'e.g. college' },
                { key: 'date',     label: 'Date',       type: 'date',   ph: '' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input
                    className="input"
                    type={f.type}
                    placeholder={f.ph}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-8 mt-16">
              <button className="btn btn-primary" onClick={add}>Save expense</button>
              <button className="btn btn-ghost"   onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Category filter pills */}
        <div className="flex gap-8 mb-16" style={{ flexWrap: 'wrap' }}>
          {['All', ...CATS].map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="btn"
              style={{
                padding: '5px 14px',
                fontSize: 13,
                background: filter === c ? 'var(--blue)' : 'var(--surface)',
                color:      filter === c ? '#fff' : 'var(--text2)',
                border:     `1px solid ${filter === c ? 'var(--blue)' : 'var(--border)'}`,
                boxShadow:  filter === c ? '0 0 0 3px var(--blue-glow)' : 'none',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Expense table */}
        <div className="card">
          {filtered.length === 0 ? (
            <div className="text-center" style={{ padding: '48px 0', color: 'var(--text2)' }}>
              No expenses yet.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.note || '—'}</td>
                    <td>
                      <span className="badge" style={{
                        background: (CAT_COLOR[e.category] || '#6b7280') + '18',
                        color: CAT_COLOR[e.category] || '#6b7280',
                      }}>
                        {e.category}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{e.tags || '—'}</td>
                    <td className="text-muted text-sm">{e.date}</td>
                    <td className="text-right num font-medium text-red">
                      −₹{Number(e.amount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <button
                        onClick={() => del(e.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16, padding: '0 4px', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default Expenses;