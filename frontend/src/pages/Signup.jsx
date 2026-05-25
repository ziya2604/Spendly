import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:8000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        setLoading(false);
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('name', data.name);
            navigate('/onboarding');
        } else {
            setError(data.detail || 'Signup failed');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Create your Spendly account</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
                className="form-control mb-3"
                placeholder="Full Name"
                onChange={e => setForm({ ...form, name: e.target.value })}
            />
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
            <button 
                className="btn btn-primary w-100" 
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Signup;