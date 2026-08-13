import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const FEATURES = [
  { icon: '📊', title: 'Smart Budget Tracking', desc: 'Track income and expenses with beautiful visualizations and real-time insights.' },
  { icon: '📚', title: 'Financial Education', desc: 'Learn essential money management skills with curated lessons and quizzes.' },
  { icon: '🤖', title: 'AI Financial Advisor', desc: 'Get instant answers to your finance questions from our intelligent assistant.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your financial data is encrypted with 256-bit SSL and never shared.' },
];

const STATS = [
  { value: '100%', label: 'Free Forever', sub: 'No hidden costs or premium tiers' },
  { value: '0',    label: 'Ads or Tracking', sub: 'We never sell your data or show ads' },
  { value: '24/7', label: 'AI Support', sub: 'Instant financial guidance anytime' },
];

export default function Home() {
  const [tick, setTick] = useState(0);
  const tips = [
    'Save 20% of every paycheck before spending anything else.',
    'Track every expense — awareness is the first step to control.',
    'Build a 3-month emergency fund before investing.',
    'Automate your savings so you never forget.',
  ];

  useEffect(() => {
    const t = setInterval(() => setTick(n => (n + 1) % tips.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#0c0e1a', color: '#f1f5f9' }}>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b3e 100%)',
        padding: '100px 32px 110px',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        {/* Orbs */}
        <div style={{ position:'absolute', top:-80, left:-80, width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, right:-60, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', left:'60%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          {/* Pill */}
          <div style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: 20, marginBottom: 28,
            border: '1px solid rgba(124,58,237,0.5)', color: '#a78bfa',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>Modern Financial Management</div>

          <h1 style={{
            fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.05, color: '#fff', marginBottom: 22,
          }}>
            Take Control of Your<br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Financial Future</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 560,
            margin: '0 auto 40px', lineHeight: 1.75,
          }}>
            Spendly helps you budget smarter, save more, and build lasting financial knowledge with AI-powered insights and education.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15,
              color: '#fff', textDecoration: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              boxShadow: '0 8px 28px rgba(124,58,237,0.4)',
              transition: 'transform 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >Get Started Free →</Link>

            <Link to="/features" style={{
              padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: 15,
              color: '#fff', textDecoration: 'none',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── Tip ticker ── */}
      <div style={{
        background: '#1e1b4b', padding: '13px 32px',
        display: 'flex', alignItems: 'center', gap: 16, overflow: 'hidden',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#818cf8', textTransform: 'uppercase', flexShrink: 0 }}>💡 Tip</span>
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
        <span key={tick} style={{
          fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500,
          animation: 'fadeUp 0.4s ease forwards',
        }}>{tips[tick]}</span>
      </div>

      {/* ── Stats ── */}
      <section style={{ background: '#161b2e', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        }}>
          {STATS.map(({ value, label, sub }, i) => (
            <div key={label} style={{
              padding: '36px 28px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(124,58,237,0.12)' : 'none',
            }}>
              <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', color: '#a78bfa', marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 20, marginBottom: 16,
            border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Everything You Need to Succeed</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 14 }}>
            Powerful features designed to<br />help you manage money like a pro
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Everything in one place — budgets, goals, analytics, education, and AI.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="spendly-feature" style={{
              padding: '28px 28px', borderRadius: 20,
              background: '#161b2e',
              border: '1px solid rgba(124,58,237,0.18)',
              transition: 'all 0.25s ease', cursor: 'default',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                background: 'rgba(124,58,237,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/features" style={{
            fontSize: 13, fontWeight: 600, color: '#a78bfa', textDecoration: 'none',
            borderBottom: '1px solid rgba(167,139,250,0.35)', paddingBottom: 2,
          }}>View all features →</Link>
        </div>
      </section>

      {/* ── Built for Modern Financial Success ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0c29, #1a1040)',
        padding: '80px 32px', margin: '0 0 0 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
          position: 'relative',
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 20, lineHeight: 1.15 }}>
              Built for Modern<br />Financial Success
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 28, margin: '0 0 28px' }}>
              Join thousands of users who have transformed their financial lives with Spendly. Our platform combines powerful tracking tools with educational resources to help you make smarter money decisions.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {['Track unlimited transactions','Comprehensive spending analysis','24/7 AI financial guidance','Dark and light mode','Set and monitor financial goals','Educational resources included'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ color: '#4ade80', fontSize: 14 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '📈', label: 'Average Savings Increase', value: '+42%', color: '#4ade80' },
              { icon: '📚', label: 'Educational Lessons', value: '6+ Topics', color: '#a78bfa' },
              { icon: '🛡️', label: 'Bank-Level Security', value: '256-bit SSL', color: '#60a5fa' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} style={{
                padding: '20px 24px', borderRadius: 16,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', gap: 18,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'rgba(124,58,237,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section style={{ padding: '80px 32px', background: '#0c0e1a' }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          borderRadius: 24, padding: '60px 48px', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(124,58,237,0.3)',
        }}>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 38px)', fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>
            Ready to Transform Your Finances?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 32, margin: '0 0 32px' }}>
            Start your journey to financial freedom today. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: '#fff', color: '#2563eb', textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >Get Started Free</Link>
            <Link to="/features" style={{
              padding: '13px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14,
              background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>See All Features</Link>
          </div>
        </div>
      </section>
    </div>
  );
}