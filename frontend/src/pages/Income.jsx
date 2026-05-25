import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const SOURCES = ['Salary', 'Freelance', 'Pocket Money', 'Part-time', 'Other'];

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [form, setForm] = useState({
        amount: '', source: 'Salary',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchIncome = async () => {
        const res = await fetch('http://localhost:8000/income', { headers });
        const data = await res.json();
        setIncomes(data);
    };

    useEffect(() => { fetchIncome(); }, []);

    const handleAdd = async () => {
        if (!form.amount) return;
        await fetch('http://localhost:8000/income', {
            method: 'POST',
            headers,
            body: JSON.stringify(form)
        });
        setForm({
            amount: '', source: 'Salary',
            date: new Date().toISOString().split('T')[0],
            note: ''
        });
        fetchIncome();
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:8000/income/${id}`, {
            method: 'DELETE', headers
        });
        fetchIncome();
    };

    const total = incomes.reduce((sum, i) => sum + i.amount, 0);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h3>Income</h3>
                <div className="alert alert-success">
                    Total Income This Month: ₹{total.toFixed(2)}
                </div>

                <div className="card p-4 mb-4">
                    <h5>Add Income</h5>
                    <div className="row g-2">
                        <div className="col-md-3">
                            <input
                                className="form-control"
                                placeholder="Amount ₹"
                                type="number"
                                value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={form.source}
                                onChange={e => setForm({ ...form, source: e.target.value })}
                            >
                                {SOURCES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                className="form-control"
                                type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                className="form-control"
                                placeholder="Note"
                                value={form.note}
                                onChange={e => setForm({ ...form, note: e.target.value })}
                            />
                        </div>
                        <div className="col-md-1">
                            <button
                                className="btn btn-success w-100"
                                onClick={handleAdd}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card p-3">
                    <h5>Income History</h5>
                    {incomes.length === 0 && (
                        <p className="text-muted">No income logged yet.</p>
                    )}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Source</th>
                                <th>Amount</th>
                                <th>Note</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map(i => (
                                <tr key={i.id}>
                                    <td>{i.date}</td>
                                    <td>
                                        <span className="badge bg-success">
                                            {i.source}
                                        </span>
                                    </td>
                                    <td>₹{i.amount}</td>
                                    <td>{i.note}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(i.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Income;