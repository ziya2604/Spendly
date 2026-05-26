import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const SOURCES = [
  { name: 'Salary',      icon: '💼' },
  { name: 'Freelance',   icon: '💻' },
  { name: 'Pocket Money',icon: '👛' },
  { name: 'Part-time',   icon: '⏰' },
  { name: 'Other',       icon: '📌' },
];

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({
    amount: '', source: 'Salary',
    date: new Date().toISOString().split('T')[0], note: '',
  });
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchIncome = async () => {
    const res = await fetch('http://localhost:8000/income', { headers });
    const data = await res.json();
    setIncomes(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchIncome(); }, []);

  const handleAdd = async () => {
    if (!form.amount) return;
    await fetch('http://localhost:8000/income', {
      method: 'POST', headers, body: JSON.stringify(form),
    });
    setForm({ amount: '', source: 'Salary', date: new Date().toISOString().split('T')[0], note: '' });
    setShowForm(false);
    fetchIncome();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income entry?')) return;
    await fetch(`http://localhost:8000/income/${id}`, { method: 'DELETE', headers });
    fetchIncome();
  };

  const total = incomes.reduce((s, i) => s + i.amount, 0);
  const thisMonth = incomes.filter(i => i.date.startsWith(new Date().toISOString().slice(0, 7)));
  const monthTotal = thisMonth.reduce((s, i) => s + i.amount, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="page-container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: 4 }}>💰 Income</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              {incomes.length} entries · Total ₹{total.toFixed(0)}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', borderRadius: 10, padding: '8px 18px',
              color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >
            + Add Income
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="stat-card fade-in">
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>This Month</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-green)' }}>₹{monthTotal.toFixed(0)}</p>
          </div>
          <div className="stat-card fade-in">
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>All Time</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>₹{total.toFixed(0)}</p>
          </div>
          <div className="stat-card fade-in">
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Entries</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)' }}>{incomes.length}</p>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card-modern fade-in" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Log Income</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Amount ₹</label>
                <input className="input-modern" type="number" placeholder="0.00"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Source</label>
                <select className="input-modern" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                  {SOURCES.map(s => <option key={s.name} value={s.name}>{s.icon} {s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Date</label>
                <input className="input-modern" type="date"
                  value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Note</label>
                <input className="input-modern" placeholder="Optional note"
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleAdd} style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', borderRadius: 10, padding: '10px 24px',
                color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14,
              }}>
                Save Income
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

        {/* Income List */}
        <div className="card-modern">
          {incomes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
              <p style={{ color: 'var(--text-secondary)' }}>No income logged yet</p>
            </div>
          ) : (
            <div>
              {incomes.map((item, i) => (
                <div
                  key={item.id}
                  className="slide-in"
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: i < incomes.length - 1 ? '1px solid var(--border)' : 'none',
                    animationDelay: `${i * 0.04}s`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(16,185,129,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>
                      {SOURCES.find(s => s.name === item.source)?.icon || '💰'}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>
                        {item.note || item.source}
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                          background: 'rgba(16,185,129,0.15)', color: '#10b981',
                        }}>
                          {item.source}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: 15 }}>
                      +₹{item.amount}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 16, padding: 4,
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
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

export default Income;