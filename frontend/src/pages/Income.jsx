import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SOURCES = ['Salary','Freelance','Pocket Money','Part-time','Other'];

function Income() {
  const [incomes,  setIncomes]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    amount: '', source: 'Salary', note: '',
    date: new Date().toISOString().split('T')[0],
  });

  const token = localStorage.getItem('token');
  const H = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = () =>
    fetch('http://localhost:8000/income', { headers: H })
      .then(r => r.json()).then(d => Array.isArray(d) && setIncomes(d));

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.amount) return;
    await fetch('http://localhost:8000/income', {
      method: 'POST', headers: H, body: JSON.stringify(form),
    });
    setForm({ amount: '', source: 'Salary', note: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    load();
  };

  const del = async id => {
    if (!window.confirm('Delete this entry?')) return;
    await fetch(`http://localhost:8000/income/${id}`, { method: 'DELETE', headers: H });
    load();
  };

  const total      = incomes.reduce((s, i) => s + Number(i.amount), 0);
  const thisMonth  = new Date().toISOString().slice(0, 7);
  const monthTotal = incomes.filter(i => i.date.startsWith(thisMonth))
                            .reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface2)' }}>
      <Navbar />

      <main className="page" style={{ flex: 1 }}>

        <div className="flex justify-between items-center mb-20">
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Income</h2>
            <p className="text-muted mt-4 text-sm">{incomes.length} entries logged</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            + Add income
          </button>
        </div>

        {/* Summary cards */}
        <div className="flex gap-16 mb-20" style={{ flexWrap: 'wrap' }}>
          {[
            { label: 'This month', value: `₹${monthTotal.toLocaleString('en-IN')}`, color: 'var(--green)' },
            { label: 'All time',   value: `₹${total.toLocaleString('en-IN')}`,      color: 'var(--text)'  },
            { label: 'Entries',    value: incomes.length,                            color: 'var(--blue)'  },
          ].map(s => (
            <div key={s.label} className="card card-hover" style={{ flex: 1, minWidth: 160 }} tabIndex={0}>
              <p className="text-xs text-muted mb-8" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {s.label}
              </p>
              <p className="num font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Add form */}
        {showForm && (
          <div className="card fade-up mb-16">
            <h3 className="mb-16" style={{ fontSize: 14 }}>Log income</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
              {[
                { key: 'amount', label: 'Amount ₹', type: 'number', ph: '0' },
                { key: 'note',   label: 'Note',     type: 'text',   ph: 'Optional note' },
                { key: 'date',   label: 'Date',     type: 'date',   ph: '' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input className="input" type={f.type} placeholder={f.ph}
                    value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="label">Source</label>
                <select className="input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-8 mt-16">
              <button className="btn btn-primary" onClick={add}>Save</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card">
          {incomes.length === 0 ? (
            <div className="text-center" style={{ padding: '48px 0', color: 'var(--text2)' }}>
              No income logged yet.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Note</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {incomes.map(i => (
                  <tr key={i.id}>
                    <td>
                      <span className="badge badge-green">{i.source}</span>
                    </td>
                    <td className="text-muted">{i.note || '—'}</td>
                    <td className="text-muted text-sm">{i.date}</td>
                    <td className="text-right num font-medium text-green">
                      +₹{Number(i.amount).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <button
                        onClick={() => del(i.id)}
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

export default Income;