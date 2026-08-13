import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VALUES = [
  { title: 'Transparency', desc: 'No hidden fees, no dark patterns. What you see is what you get — every rupee, clearly.' },
  { title: 'Built for Students', desc: 'We built Spendly for people managing money for the first time. Simple, not dumbed down.' },
  { title: 'Privacy First', desc: 'Your financial data is yours. We never sell it. We never will.' },
  { title: 'Actionable, Not Just Pretty', desc: 'Every feature exists because it changes how you spend and save — not just to look good.' },
];

const STORY = [
  {
    year: '2024',
    title: 'The problem',
    text: 'Most of us kept track of money across five different places — a banking app, a UPI app, a notes file, and a lot of guesswork. Nothing gave a real picture of where the money actually went.',
  },
  {
    year: '2024',
    title: 'The idea',
    text: 'Spendly started as a simple question: what if tracking expenses and actually understanding money lived in one place, built specifically for someone managing their own finances for the first time?',
  },
  {
    year: '2025',
    title: 'The build',
    text: 'Budgeting, goals, and debt tracking came first. Then a full financial education hub, because a budgeting tool without any financial literacy behind it only solves half the problem.',
  },
  {
    year: 'Today',
    title: 'Where it stands',
    text: 'Spendly is a complete platform — expense tracking, budgets, goals, groups, debts, bills, and lessons, all working off the same data instead of feeling like separate tools stitched together.',
  },
];

const HOW_IT_WORKS = [
  {
    key: 'track',
    label: 'Track',
    title: 'Track every rupee without the effort',
    text: 'Log expenses in seconds and let Spendly sort them into categories automatically. Add multiple accounts and see everything consolidated in one dashboard instead of switching between apps.',
  },
  {
    key: 'budget',
    label: 'Budget',
    title: 'Set limits that actually hold',
    text: 'Set a monthly budget per category and get a warning before you go over it, not after. Spending trends show you patterns you would otherwise miss until the money was already gone.',
  },
  {
    key: 'learn',
    label: 'Learn',
    title: 'Understand the money, not just move it',
    text: 'Short lessons and quizzes cover budgeting, saving, credit, and debt basics — built for people learning to manage money for the first time, not for finance majors.',
  },
  {
    key: 'grow',
    label: 'Grow',
    title: 'Build toward something',
    text: 'Set a savings goal with a deadline and watch progress update automatically. Pay down debts with a clear plan instead of a vague intention to "save more."',
  },
];

const STATS = [
  { value: 12, suffix: '+', label: 'Platform features' },
  { value: 6, suffix: '+', label: 'Core financial topics' },
  { value: 100, suffix: '%', label: 'Free to use' },
  { value: 0, suffix: '', label: 'Hidden fees' },
];

const FAQS = [
  {
    q: 'Is Spendly free to use?',
    a: 'Yes. Every core feature — expense tracking, budgets, goals, debts, and the education hub — is free. There are no hidden charges or paywalled essentials.',
  },
  {
    q: 'Is my financial data safe?',
    a: 'Your data is encrypted and never sold or shared with third parties. Spendly is built around the idea that your financial information belongs to you, not to advertisers.',
  },
  {
    q: 'Do I need a finance background to use it?',
    a: 'No. Spendly is built for people managing money for the first time. The education hub exists specifically so you can learn the concepts as you go, without jargon.',
  },
  {
    q: 'Can I track more than one account?',
    a: 'Yes. Multi-account support lets you track a bank account, wallet, or cash side by side and see a consolidated view across all of them.',
  },
  {
    q: 'Does Spendly work on mobile?',
    a: 'Yes. The interface is fully responsive, so logging an expense between classes works the same as it does on a laptop.',
  },
];

// Small self-contained counter that animates up when it scrolls into view
function StatCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 900;
        const startTime = performance.now();

        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          setCount(Math.round(progress * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 'clamp(30px,4vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>
        {count}{suffix}
      </p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{label}</p>
    </div>
  );
}

export default function About() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('track');
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface2)', color: 'var(--text)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0818 0%, #111827 60%, #0f172a 100%)',
        padding: 'clamp(72px, 12vw, 120px) 24px clamp(80px, 10vw, 110px)',
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

          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 48px' }}>
            Founded in 2024, Spendly is redefining how students and young professionals manage money. Our mission is to make budgeting simple, honest, and empowering for everyone.
          </p>
        </div>

        {/* Stats strip, replaces the old team photo block */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          padding: 'clamp(28px,4vw,44px) 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 24,
        }}>
          {STATS.map(s => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 80px' }}>

        {/* Mission */}
        <div style={{ textAlign: 'center', marginBottom: 88 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Our mission</p>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: 700, margin: '0 auto 16px' }}>
            Every student deserves to understand their money.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, maxWidth: 580, margin: '0 auto' }}>
            Most financial tools are built for professionals — complex, jargon-heavy, overwhelming. Spendly was built from scratch for people who are just starting out. No finance degree required.
          </p>
        </div>

        {/* Story timeline — click a milestone to read it */}
        <div style={{ marginBottom: 88 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, textAlign: 'center' }}>Our story</p>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 36, textAlign: 'center' }}>How Spendly came together</h2>

          {/* Step selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {STORY.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActiveStep(i)}
                style={{
                  padding: '10px 20px', borderRadius: 99,
                  border: `1px solid ${activeStep === i ? '#7c3aed' : 'var(--border)'}`,
                  background: activeStep === i ? 'rgba(124,58,237,0.12)' : 'var(--surface)',
                  color: activeStep === i ? '#7c3aed' : 'var(--text2)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {s.year}
              </button>
            ))}
          </div>

          <div style={{
            padding: 'clamp(28px,4vw,40px)', borderRadius: 20,
            background: 'var(--surface)', border: '1px solid var(--border)',
            maxWidth: 700, margin: '0 auto',
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
              {STORY[activeStep].title}
            </h3>
            <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.85 }}>
              {STORY[activeStep].text}
            </p>
          </div>
        </div>

        {/* How it works — tabs */}
        <div style={{ marginBottom: 88 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, textAlign: 'center' }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 36, textAlign: 'center' }}>
            One platform, the whole picture
          </h2>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10, maxWidth: 700, margin: '0 auto 28px',
          }}>
            {HOW_IT_WORKS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: '14px 12px', borderRadius: 14,
                  border: `1px solid ${activeTab === t.key ? '#2563eb' : 'var(--border)'}`,
                  background: activeTab === t.key ? 'rgba(37,99,235,0.1)' : 'var(--surface)',
                  color: activeTab === t.key ? '#2563eb' : 'var(--text2)',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {HOW_IT_WORKS.filter(t => t.key === activeTab).map(t => (
            <div key={t.key} style={{
              padding: 'clamp(28px,4vw,40px)', borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(37,99,235,0.06))',
              border: '1px solid var(--border)',
              maxWidth: 700, margin: '0 auto', textAlign: 'center',
            }}>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>{t.title}</h3>
              <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.85 }}>{t.text}</p>
            </div>
          ))}
        </div>

        {/* Values grid */}
        <div style={{ marginBottom: 88 }}>
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

        {/* FAQ accordion */}
        <div style={{ marginBottom: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Questions</p>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 32 }}>Frequently asked</h2>

          <div style={{ maxWidth: 760 }}>
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} style={{
                  borderBottom: '1px solid var(--border)',
                }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '20px 4px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{f.q}</span>
                    <span style={{
                      fontSize: 18, color: '#7c3aed', flexShrink: 0, marginLeft: 16,
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}>+</span>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? 200 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.25s ease',
                  }}>
                    <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, padding: '0 4px 20px' }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              );
            })}
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