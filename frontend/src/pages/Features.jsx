import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    {
      icon: '↗',
      title: 'Smart Budget Tracking',
      desc: 'Automatically categorize transactions and track spending patterns with intelligent algorithms.',
      bullets: ['Automatic transaction categorization', 'Real-time spending alerts', 'Budget limit warnings', 'Trend analysis and forecasting'],
      long: 'Every transaction you log gets sorted into the right category on its own, so you stop wasting time on manual entry. Spendly watches your spending in real time and warns you before you go over budget, not after — with simple trend lines that show where your money actually goes each month.',
      cta: 'Set up a budget',
      route: '/budgets',
    },
    {
      icon: '◑',
      title: 'Visual Analytics',
      desc: 'Beautiful charts and graphs that make understanding your finances effortless.',
      bullets: ['Interactive spending breakdowns', 'Income vs expense comparisons', 'Historical trend visualization', 'Monthly/yearly reports'],
      long: 'Numbers on a spreadsheet don\u2019t tell a story — charts do. See exactly how your income stacks up against your expenses, spot patterns over months, and drill into any category to see where the biggest chunk of your money is going.',
      cta: 'Open dashboard',
      route: '/dashboard',
    },
    {
      icon: '◎',
      title: 'Goal Setting & Tracking',
      desc: 'Set financial goals and watch your progress with motivating visual indicators.',
      bullets: ['Unlimited savings goals', 'Progress tracking with milestones', 'Deadline reminders', 'Achievement celebrations'],
      long: 'Whether you\u2019re saving for a laptop, a trip, or an emergency fund, set a target and a deadline and Spendly tracks your progress automatically as you save. Milestone reminders keep you on track instead of letting the goal quietly slip.',
      cta: 'Create a goal',
      route: '/goals',
    },
    {
      icon: '📚',
      title: 'Financial Education Hub',
      desc: 'Learn essential money management skills through our comprehensive lesson library.',
      bullets: ['6+ core financial topics', 'Beginner to advanced content', 'Interactive quizzes', 'Progress tracking'],
      long: 'Most students never get taught how money actually works. This hub covers budgeting, saving, credit, debt, and investing basics in short lessons with quizzes, so you build real financial literacy alongside actually managing your money.',
      cta: 'Start learning',
      route: '/learn',
    },
    {
      icon: '✦',
      title: 'AI Financial Advisor',
      desc: 'Get instant answers to your money questions from our intelligent chatbot.',
      bullets: ['24/7 availability', 'Personalized recommendations', 'Context-aware responses', 'Financial tips and insights'],
      long: 'Ask a question about your spending, a budgeting decision, or a financial concept you don\u2019t understand, and get a straight answer based on your own data — not generic advice copy-pasted from a blog.',
      cta: 'Go to dashboard',
      route: '/dashboard',
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      desc: 'Stay on top of your finances with timely alerts and reminders.',
      bullets: ['Bill payment reminders', 'Budget limit warnings', 'Goal milestone notifications', 'Unusual spending alerts'],
      long: 'Spendly keeps an eye on things so you don\u2019t have to check constantly — a reminder before a bill is due, a warning when a budget is close to its limit, and a nudge when spending looks unusual compared to your normal pattern.',
      cta: 'Manage bills',
      route: '/bills',
    },
    {
      icon: '🔒',
      title: 'Bank-Level Security',
      desc: 'Your financial data is protected with enterprise-grade encryption.',
      bullets: ['256-bit SSL encryption', 'Secure data storage', 'Privacy-first approach', 'No data selling'],
      long: 'Your financial data is encrypted end to end and never sold or shared with third parties. We built Spendly around the same principle we ask you to trust: your money, your data, your control.',
      cta: 'Create free account',
      route: '/signup',
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      desc: 'Access your finances seamlessly on any device, anywhere, anytime.',
      bullets: ['Mobile-optimized interface', 'Cross-device sync', 'Offline access', 'Fast performance'],
      long: 'Log an expense on your phone between classes, check your budget on a laptop later — everything stays in sync. The interface is built to feel just as fast and clean on a small screen as it does on a desktop.',
      cta: 'Get started',
      route: '/signup',
    },
    {
      icon: '📊',
      title: 'Custom Reports',
      desc: 'Generate detailed financial reports to understand your money better.',
      bullets: ['Monthly spending reports', 'Category breakdowns', 'Income analysis', 'Export to CSV/PDF'],
      long: 'Pull a clear report of exactly where your money went this month or this year, broken down by category and income source, and export it whenever you need it for your own records or planning.',
      cta: 'View expenses',
      route: '/expenses',
    },
    {
      icon: '📅',
      title: 'Recurring Transactions',
      desc: 'Automatically track subscriptions and recurring bills.',
      bullets: ['Subscription management', 'Automatic categorization', 'Renewal reminders', 'Cost optimization tips'],
      long: 'Subscriptions are the easiest way to quietly overspend. Spendly tracks every recurring bill and subscription automatically, reminds you before renewals hit, and flags ones you might not be using anymore.',
      cta: 'View bills',
      route: '/bills',
    },
    {
      icon: '💳',
      title: 'Multi-Account Support',
      desc: 'Manage all your financial accounts in one unified dashboard.',
      bullets: ['Unlimited accounts', 'Consolidated view', 'Account comparisons', 'Transfer tracking'],
      long: 'Bank account, wallet, cash-in-hand — track them all from one place instead of juggling separate apps. See a consolidated view of everything or compare accounts side by side.',
      cta: 'View income',
      route: '/income',
    },
    {
      icon: '⚡',
      title: 'Quick Actions',
      desc: 'Perform common tasks instantly with keyboard shortcuts and quick links.',
      bullets: ['Add transactions quickly', 'Fast search functionality', 'Keyboard shortcuts', 'Customizable dashboard'],
      long: 'Logging an expense shouldn\u2019t take five clicks. Quick actions let you add a transaction, search past spending, or jump to any section in seconds, with a dashboard you can arrange the way you actually use it.',
      cta: 'Open dashboard',
      route: '/dashboard',
    },
  ];

  const [activeFeature, setActiveFeature] = useState(null);

  // Close on Escape, lock scroll while modal is open
  useEffect(() => {
    if (activeFeature === null) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveFeature(null);
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeFeature]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0818', color: '#fff' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 32px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(124,58,237,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 99, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Everything you need
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            Powerful Features for Smart<br />Money Management
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Everything you need to take control of your finances, all in one beautiful platform.
          </p>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 100px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {features.map((f, i) => (
          <div
            key={f.title}
            role="button"
            tabIndex={0}
            onClick={() => setActiveFeature(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveFeature(i);
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: 32,
              transition: 'all 0.25s', cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(124,58,237,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Icon box */}
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, marginBottom: 20,
            }}>{f.icon}</div>

            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{f.title}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 18 }}>{f.desc}</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
              {f.bullets.map(b => (
                <li key={b} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', flexShrink: 0, opacity: 0.7 }} />
                  {b}
                </li>
              ))}
            </ul>

            <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>Learn more →</span>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {activeFeature !== null && (
        <div
          onClick={() => setActiveFeature(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(5,3,15,0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 560,
              maxHeight: '85vh', overflowY: 'auto',
              background: '#12101f',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 20,
              padding: 36,
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={() => setActiveFeature(null)}
              aria-label="Close"
              style={{
                position: 'absolute', top: 20, right: 20,
                width: 32, height: 32, borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>

            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 20,
            }}>{features[activeFeature].icon}</div>

            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>
              {features[activeFeature].title}
            </h2>

            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 24 }}>
              {features[activeFeature].long}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
              {features[activeFeature].bullets.map(b => (
                <li key={b} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7c3aed', display: 'inline-block', flexShrink: 0 }} />
                  {b}
                </li>
              ))}
            </ul>

            <Link
              to={features[activeFeature].route}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
              }}
            >
              {features[activeFeature].cta} →
            </Link>
          </div>
        </div>
      )}

      {/* CTA bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '80px 32px', textAlign: 'center', background: 'rgba(255,255,255,0.015)' }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.03em' }}>
          Ready to Transform Your Finances?
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>
          Start your journey to financial freedom today. No credit card required.
        </p>
        <a href="/signup" style={{
          display: 'inline-block', padding: '14px 36px', borderRadius: 10,
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
          boxShadow: '0 8px 28px rgba(124,58,237,0.4)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 36px rgba(124,58,237,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'none'; }}
        >Get Started Free →</a>
      </div>
    </div>
  );
}