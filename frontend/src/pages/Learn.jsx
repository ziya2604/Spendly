export default function Learn() {
  const topics = [
    { icon: '💰', title: 'Budgeting Basics', desc: 'Learn how to create and stick to a budget that works for your lifestyle.', lessons: 6, color: '#7c3aed' },
    { icon: '📈', title: 'Investing 101', desc: 'Understand stocks, mutual funds, SIPs, and how to grow your wealth.', lessons: 8, color: '#2563eb' },
    { icon: '🏦', title: 'Saving Strategies', desc: 'Discover proven techniques to save more money every month.', lessons: 5, color: '#0891b2' },
    { icon: '💳', title: 'Debt Management', desc: 'Learn how to pay off debt faster and avoid common traps.', lessons: 7, color: '#9333ea' },
    { icon: '🛡️', title: 'Emergency Funds', desc: 'Why you need one and exactly how to build it step by step.', lessons: 4, color: '#16a34a' },
    { icon: '🎯', title: 'Financial Goals', desc: 'Set SMART financial goals and create a roadmap to achieve them.', lessons: 5, color: '#d97706' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0818', color: '#fff' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 32px 64px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 99, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Financial Education
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
            Learn to Master<br />Your Money
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Bite-sized lessons on budgeting, investing, saving, and more — designed for real life.
          </p>
        </div>
      </div>

      {/* Topics grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 100px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {topics.map(t => (
          <div key={t.title} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 32, cursor: 'pointer', transition: 'all 0.25s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${t.color}20`, border: `1px solid ${t.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>{t.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{t.title}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 20 }}>{t.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{t.lessons} lessons</span>
              <span style={{ fontSize: 13, color: t.color, fontWeight: 600 }}>Start →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}