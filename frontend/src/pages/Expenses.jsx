import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const CATEGORIES = [
    'Food', 'Travel', 'Rent', 'Entertainment',
    'Medical', 'Shopping', 'Recharge', 'EMI',
    'Subscriptions', 'Education', 'Other'
];

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({
        amount: '', category: 'Food',
        note: '', tags: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [smsText, setSmsText] = useState('');
    const [showSmsParser, setShowSmsParser] = useState(false);

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchExpenses = async () => {
        const res = await fetch('http://localhost:8000/expenses', { headers });
        const data = await res.json();
        setExpenses(data);
    };

    useEffect(() => { fetchExpenses(); }, []);

    const handleAdd = async () => {
        if (!form.amount || !form.date) return;
        await fetch('http://localhost:8000/expenses', {
            method: 'POST',
            headers,
            body: JSON.stringify(form)
        });
        setForm({
            amount: '', category: 'Food',
            note: '', tags: '',
            date: new Date().toISOString().split('T')[0]
        });
        fetchExpenses();
    };

    const handleDelete = async (id) => {
        await fetch(`http://localhost:8000/expenses/${id}`, {
            method: 'DELETE', headers
        });
        fetchExpenses();
    };

    const parseSMS = () => {
        // Regex to extract amount from UPI SMS
        const amountMatch = smsText.match(
            /(?:rs\.?|inr\.?|₹)\s*(\d+(?:\.\d{1,2})?)/i
        );
        // Extract merchant name
        const merchantMatch = smsText.match(
            /(?:to|at|for)\s+([A-Za-z0-9\s]+?)(?:\s+on|\s+via|\s+ref|\.)/i
        );
        // Extract date
        const dateMatch = smsText.match(
            /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/
        );

        if (amountMatch) {
            const amount = amountMatch[1];
            const merchant = merchantMatch ? merchantMatch[1].trim() : '';
            let date = new Date().toISOString().split('T')[0];
            if (dateMatch) {
                const parts = dateMatch[1].split(/[-\/]/);
                if (parts.length === 3) {
                    date = `${parts[2].length === 2 ? '20' + parts[2] : parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
            }
            setForm({
                ...form,
                amount,
                note: merchant,
                date
            });
            setShowSmsParser(false);
            setSmsText('');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h3>Expenses</h3>

                {/* SMS Parser */}
                <button
                    className="btn btn-outline-secondary btn-sm mb-3"
                    onClick={() => setShowSmsParser(!showSmsParser)}
                >
                    📱 Paste UPI SMS to auto-fill
                </button>
                {showSmsParser && (
                    <div className="card p-3 mb-3">
                        <textarea
                            className="form-control mb-2"
                            rows="3"
                            placeholder="Paste your UPI SMS here..."
                            value={smsText}
                            onChange={e => setSmsText(e.target.value)}
                        />
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={parseSMS}
                        >
                            Extract Details
                        </button>
                    </div>
                )}

                {/* Add Expense Form */}
                <div className="card p-4 mb-4">
                    <h5>Add Expense</h5>
                    <div className="row g-2">
                        <div className="col-md-2">
                            <input
                                className="form-control"
                                placeholder="Amount ₹"
                                type="number"
                                value={form.amount}
                                onChange={e => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                className="form-control"
                                placeholder="Note (optional)"
                                value={form.note}
                                onChange={e => setForm({ ...form, note: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                className="form-control"
                                placeholder="Tags"
                                value={form.tags}
                                onChange={e => setForm({ ...form, tags: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                className="form-control"
                                type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                            />
                        </div>
                        <div className="col-md-1">
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleAdd}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="card p-3">
                    <h5>All Expenses</h5>
                    {expenses.length === 0 && (
                        <p className="text-muted">No expenses yet. Add your first one above.</p>
                    )}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Note</th>
                                <th>Tags</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(e => (
                                <tr key={e.id}>
                                    <td>{e.date}</td>
                                    <td>
                                        <span className="badge bg-primary">
                                            {e.category}
                                        </span>
                                    </td>
                                    <td>₹{e.amount}</td>
                                    <td>{e.note}</td>
                                    <td>{e.tags}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(e.id)}
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

export default Expenses;