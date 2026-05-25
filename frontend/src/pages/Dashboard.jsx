import { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip,
    Legend, CategoryScale, LinearScale,
    PointElement, LineElement
} from 'chart.js';
import Navbar from '../components/Navbar';

ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale,
    PointElement, LineElement
);

function Dashboard() {
    const [summary, setSummary] = useState([]);
    const [healthScore, setHealthScore] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        fetch('http://localhost:8000/expenses/summary', { headers })
            .then(r => r.json()).then(setSummary);

        fetch('http://localhost:8000/expenses/health-score', { headers })
            .then(r => r.json()).then(setHealthScore);

        fetch('http://localhost:8000/expenses', { headers })
            .then(r => r.json())
            .then(data => setRecentExpenses(data.slice(0, 5)));
    }, []);

    const pieData = {
        labels: summary.map(s => s.category),
        datasets: [{
            data: summary.map(s => s.total),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56',
                '#4BC0C0', '#9966FF', '#FF9F40',
                '#FF6384', '#C9CBCF', '#4BC0C0', '#FF9F40'
            ]
        }]
    };

    const scoreColor = healthScore?.score >= 70 ? 'success'
        : healthScore?.score >= 50 ? 'primary'
        : healthScore?.score >= 30 ? 'warning' : 'danger';

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h3>Welcome back, {name} 👋</h3>

                {/* Health Score + Summary Cards */}
                {healthScore && (
                    <div className="row mt-3 mb-4">
                        <div className="col-md-3">
                            <div className={`card text-white bg-${scoreColor} p-3 text-center`}>
                                <h6>Financial Health Score</h6>
                                <h1>{healthScore.score}/100</h1>
                                <p>{healthScore.label}</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 text-center">
                                <h6>Income This Month</h6>
                                <h3 className="text-success">
                                    ₹{healthScore.total_income.toFixed(0)}
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 text-center">
                                <h6>Expenses This Month</h6>
                                <h3 className="text-danger">
                                    ₹{healthScore.total_expenses.toFixed(0)}
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 text-center">
                                <h6>Savings This Month</h6>
                                <h3 className={healthScore.savings >= 0 ? 'text-success' : 'text-danger'}>
                                    ₹{healthScore.savings.toFixed(0)}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row">
                    {/* Pie Chart */}
                    <div className="col-md-5">
                        <div className="card p-3">
                            <h5>Spending by Category</h5>
                            {summary.length > 0
                                ? <Pie data={pieData} />
                                : <p className="text-muted">No expenses this month yet.</p>
                            }
                        </div>
                    </div>

                    {/* Recent Expenses */}
                    <div className="col-md-7">
                        <div className="card p-3">
                            <h5>Recent Expenses</h5>
                            {recentExpenses.length === 0
                                ? <p className="text-muted">No expenses yet.</p>
                                : (
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Category</th>
                                                <th>Amount</th>
                                                <th>Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentExpenses.map(e => (
                                                <tr key={e.id}>
                                                    <td>{e.date}</td>
                                                    <td>
                                                        <span className="badge bg-primary">
                                                            {e.category}
                                                        </span>
                                                    </td>
                                                    <td>₹{e.amount}</td>
                                                    <td>{e.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;