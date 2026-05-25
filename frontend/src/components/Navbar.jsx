import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const name = localStorage.getItem('name');

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
            <Link className="navbar-brand fw-bold" to="/dashboard">
                💰 Spendly
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/expenses">Expenses</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/income">Income</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/budgets">Budgets</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/groups">Groups</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/goals">Goals</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/education">Education</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/debts">Debts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/bills">Bills</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/challenges">Challenges</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/calculator">Calculator</Link>
                    </li>
                </ul>
                <span className="navbar-text me-3 text-white">
                    Hi, {name}
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;