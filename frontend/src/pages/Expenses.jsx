import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const CATEGORIES = [
  { name: 'Food',          icon: '🍔' },
  { name: 'Travel',        icon: '✈️' },
  { name: 'Rent',          icon: '🏠' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Medical',       icon: '💊' },
  { name: 'Shopping',      icon: '🛍️' },
  { name: 'Recharge',      icon: '📱' },
  { name: 'EMI',           icon: '🏦' },
  { name: 'Subscriptions', icon: '📺' },
  { name: 'Education',     icon: '📚' },
  { name: 'Other',         icon: '📌' },
];

const CAT_COLORS = {
  Food: '#f97316', Travel: '#3b82f6', Rent: '#ef4444',
  Entertainment: '#a855f7', Medical: '#10b981', Shopping: '#ec4899',
  Recharge: '#14b8a6', EMI: '#f59e0b', Subscriptions: '#6366f1',
  Education: '#7c3aed', Other: '#94a3b8',
};

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: '', category: 'Food', note: '', tags: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [smsText, setSmsText] = useState('');
  const [showSms, setShowSms] = useState(false);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchExpenses = async () => {
    const res = await fetch('http://localhost:8000/expenses', { headers });
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleAdd = async () => {
    if (!form.amount || !form.date) return;
    await fetch('http://localhost:8000/expenses', {
      method: 'POST', headers, body: JSON.stringify(form),
    });
    setForm({ amount: '', category: 'Food', note: '', tags: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await fetch(`http://localhost:8000/expenses/${id}`, { method: 'DELETE', headers });
    fetchExpenses();
  };

  const parseSMS = () => {
    const amountMatch = smsText.match(/(?:rs\.?|inr\.?|₹)\s*(\d+(?:\.\d{1,2})?)/i);
    const merchantMatch = smsText.match(/(?:to|at|for)\s+([A-Za-z0-9\s]+?)(?:\s+on|\s+via|\s+ref|\.)/i);
    const dateMatch = smsText.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
    if (amountMatch) {
      let date = new Date().toISOString().split('T')[0];
      if (dateMatch) {
        const parts = dateMatch[1].split(/[-\/]/);
        if (parts.length === 3) {
          date = `${parts[2].length === 2 ? '20' + parts[2] : parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
        }
      }
      setForm({ ...form, amount: amountMatch[1], note: merchantMatch ? merchantMatch[1].trim() : '', date });
      setShowSms(false);
      setSmsText('');
      setShowForm(true);
    }
  };

  const filtered = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="page-container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: 4 }}>💸 Expenses</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              {filtered.length} transactions · Total ₹{total.toFixed(0)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowSms(!showSms)}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '8px 16px', color: 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
              }}
            >
              📱 UPI SMS
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', borderRadius: 10, padding: '8px 16px',
                color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* SMS Parser */}
        {showSms && (
          <div className="card-modern fade-in" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>📱 Paste UPI SMS</p>
            <textarea
              className="input-modern"
              rows={3}
              placeholder='E.g. "Rs.450 debited from SBI to Swiggy on 25-05-26 via UPI"'
              value={smsText}
              onChange={e => setSmsText(e.target.value)}
              style={{ resize: 'none', marginBottom: 12 }}
            />
            <button
              onClick={parseSMS}
              style={{
                background: 'var(--accent)', border: 'none', borderRadius: 8,
                padding: '8px 20px', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}
            >
              Extract Details
            </button>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="card-modern fade-in" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>New Expense</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Amount ₹</label>
                <input className="input-modern" type="number" placeholder="0.00"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Category</label>
                <select className="input-modern" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Note</label>
                <input className="input-modern" placeholder="What was this for?"
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Tags</label>
                <input className="input-modern" placeholder="e.g. college, trip"
                  value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Date</label>
                <input className="input-modern" type="date"
                  value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleAdd} style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                border: 'none', borderRadius: 10, padding: '10px 24px',
                color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14,
              }}>
                Save Expense
              </button>
              <button onClick={() => setShowForm(false)} style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 24px', color: 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 14,
              }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                background: filter === cat ? 'var(--accent)' : 'var(--bg-card)',
                border: `1px solid ${filter === cat ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 20, padding: '5px 14px',
                color: filter === cat ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expense List */}
        <div className="card-modern">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💸</div>
              <p style={{ color: 'var(--text-secondary)' }}>No expenses found</p>
            </div>
          ) : (
            <div>
              {filtered.map((e, i) => (
                <div
                  key={e.id}
                  className="slide-in"
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    animationDelay: `${i * 0.03}s`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${CAT_COLORS[e.category] || '#7c3aed'}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>
                      {CATEGORIES.find(c => c.name === e.category)?.icon || '💳'}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>
                        {e.note || e.category}
                      </p>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                          background: `${CAT_COLORS[e.category] || '#7c3aed'}22`,
                          color: CAT_COLORS[e.category] || '#7c3aed',
                        }}>
                          {e.category}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{e.date}</span>
                        {e.tags && (
                          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                            #{e.tags}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-red)', fontSize: 15 }}>
                      -₹{e.amount}
                    </span>
                    <button
                      onClick={() => handleDelete(e.id)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: 'var(--text-secondary)', cursor: 'pointer',
                        fontSize: 16, padding: 4, borderRadius: 6,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Expenses;