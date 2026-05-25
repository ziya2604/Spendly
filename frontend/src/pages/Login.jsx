import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const res = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('name', data.name);
            navigate('/dashboard');
        } else {
            setError(data.detail || 'Login failed');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2>Login to Spendly</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
                className="form-control mb-3"
                placeholder="Email"
                type="email"
                onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <input
                className="form-control mb-3"
                placeholder="Password"
                type="password"
                onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Login
            </button>
            <p className="mt-3 text-center">
                No account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}

export default Login;