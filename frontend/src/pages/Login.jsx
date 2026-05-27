import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.email || !form.password) { setError('Fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
    } catch {
      setError('Cannot reach server. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    // Full page centered layout
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: 400 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ color: 'var(--blue)', fontSize: 26, letterSpacing: '-0.03em' }}>
            Spendly
          </h1>
          <p className="text-muted mt-4" style={{ fontSize: 14 }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28 }}>

          {error && (
            <div className="badge badge-red mb-16" style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              display: 'block',
            }}>
              {error}
            </div>
          )}

          <div className="mb-16">
            <label className="label">Email address</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>

          <div className="mb-20">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={submit}
            disabled={loading}
            style={{ justifyContent: 'center', height: 42, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <hr className="divider" style={{ margin: '20px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--blue)', fontWeight: 500, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;