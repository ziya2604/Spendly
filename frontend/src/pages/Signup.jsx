import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { setError('Fill in all fields'); return; }
    if (form.password.length < 6) { setError('Password must be 6+ characters'); return; }
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('name', data.name);
        navigate('/onboarding');
      } else {
        setError(data.detail || 'Signup failed');
      }
    } catch {
      setError('Cannot reach server');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ color: 'var(--blue)', fontSize: 26, letterSpacing: '-0.03em' }}>
            Spendly
          </h1>
          <p className="text-muted mt-4">Create your free account</p>
        </div>

        <div className="card" style={{ padding: 28 }}>

          {error && (
            <div className="badge-red mb-16" style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: '#fef2f2',
              color: 'var(--red)',
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {[
            { key: 'name',     label: 'Full name',      type: 'text',     ph: 'Your name' },
            { key: 'email',    label: 'Email address',  type: 'email',    ph: 'you@example.com' },
            { key: 'password', label: 'Password',       type: 'password', ph: '6+ characters' },
          ].map(f => (
            <div key={f.key} className="mb-16">
              <label className="label">{f.label}</label>
              <input
                className="input"
                type={f.type}
                placeholder={f.ph}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
            </div>
          ))}

          <button
            className="btn btn-primary w-full mt-4"
            onClick={submit}
            disabled={loading}
            style={{ justifyContent: 'center', height: 42, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <hr className="divider" style={{ margin: '20px 0' }} />

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text2)' }}>
            Have an account?{' '}
            <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;