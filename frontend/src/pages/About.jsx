import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TEAM = [
  { name: 'Aryan Sharma', role: 'Founder & CEO', initial: 'A' },
  { name: 'Priya Mehta', role: 'Product Design', initial: 'P' },
  { name: 'Rohan Gupta', role: 'Backend Engineer', initial: 'R' },
  { name: 'Simran Kaur', role: 'Frontend Dev', initial: 'S' },
];

const VALUES = [
  { title: 'Transparency', desc: 'No hidden fees, no dark patterns. What you see is what you get — every rupee, clearly.' },
  { title: 'Built for Students', desc: 'We built Spendly for people managing money for the first time. Simple, not dumbed down.' },
  { title: 'Privacy First', desc: 'Your financial data is yours. We never sell it. We never will.' },
  { title: 'Actionable, Not Just Pretty', desc: 'Every feature exists because it changes how you spend and save — not just to look good.' },
];

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface2)', color: 'var(--text)' }}>
      <Navbar />

      {/* Hero — dark like Infinity About Us */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0818 0%, #111827 60%, #0f172a 100%)',
        padding: 'clamp(72px, 12vw, 120px) 24px clamp(64px, 10vw, 100px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 99,
            border: '1px solid rgba(124,58,237,0.45)', color: '#a78bfa',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 24,
          }}>About us</span>

          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20,
          }}>
            Making personal finance<br />
            <span style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              actually make sense.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 32px' }}>
            Founded in 2024, Spendly is redefining how students and young professionals manage money. Our mission is to make budgeting simple, honest, and empowering for everyone.
          </p>
        </div>

        {/* Team photo placeholder — real photo daal sakte ho yahan */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)',
          height: 340,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12,
        }}>
          <div style={{
            display: 'flex', gap: 0,
          }}>
            {TEAM.map((m, i) => (
              <div key={m.name} style={{
                width: 72, height: 72, borderRadius: '50%',
                background: `hsl(${i * 70 + 200}, 60%, 45%)`,
                border: '3px solid rgba(255,255,255,0.15)',
                marginLeft: i > 0 ? -16 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 24,
              }}>{m.initial}</div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            📸 Team photo — replace this div with an &lt;img&gt; tag
          </p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
            Recommended: 900×340px, put it in /public/team.jpg then use src="/team.jpg"
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* Mission */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Our mission</p>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: 700, margin: '0 auto 16px' }}>
            Every student deserves to understand their money.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, maxWidth: 580, margin: '0 auto' }}>
            Most financial tools are built for professionals — complex, jargon-heavy, overwhelming. Spendly was built from scratch for people who are just starting out. No finance degree required.
          </p>
        </div>

        {/* Values grid */}
        <div style={{ marginBottom: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>What we stand for</p>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 32 }}>Our values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={v.title} style={{
                padding: 28, borderRadius: 16,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderTop: `3px solid ${['#7c3aed','#2563eb','#16a34a','#d97706'][i]}`,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>The people</p>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 32 }}>Meet the team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {TEAM.map((m, i) => (
              <div key={m.name} style={{
                padding: 24, borderRadius: 16,
                background: 'var(--surface)', border: '1px solid var(--border)',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `hsl(${i * 70 + 200}, 60%, 50%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 22,
                  margin: '0 auto 14px',
                }}>{m.initial}</div>
                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15, marginBottom: 4 }}>{m.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          borderRadius: 20, padding: 'clamp(36px,6vw,56px)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>
            Ready to take control of your money?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 28 }}>
            Join thousands of students already using Spendly.
          </p>
          <Link to="/dashboard" style={{
            display: 'inline-block', padding: '13px 28px', borderRadius: 12,
            background: '#fff', color: '#7c3aed', fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
          }}>Get Started Free →</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}