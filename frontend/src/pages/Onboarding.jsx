import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    question: "When you get money, what do you do first?",
    options: [
      { label: "A", text: "Spend on something I wanted", icon: "🛍️" },
      { label: "B", text: "Save a fixed amount first",   icon: "🏦" },
      { label: "C", text: "Pay bills and plan the rest", icon: "📋" },
      { label: "D", text: "No plan, figure it out later",icon: "🤷" },
    ],
  },
  {
    question: "How often do you check your bank balance?",
    options: [
      { label: "A", text: "Never, I just spend",      icon: "😅" },
      { label: "B", text: "Every day",                icon: "📱" },
      { label: "C", text: "Weekly with a budget",     icon: "📊" },
      { label: "D", text: "Only when I need to",      icon: "👀" },
    ],
  },
  {
    question: "You get ₹5000 extra this month. What happens?",
    options: [
      { label: "A", text: "Buy something I wanted",              icon: "🛒" },
      { label: "B", text: "Put it in savings immediately",       icon: "💰" },
      { label: "C", text: "Split between saving and treating myself", icon: "⚖️" },
      { label: "D", text: "It disappears somehow",              icon: "💨" },
    ],
  },
  {
    question: "How do you feel about budgeting?",
    options: [
      { label: "A", text: "Too restrictive, I don't do it",icon: "🚫" },
      { label: "B", text: "I love it, I track everything", icon: "❤️" },
      { label: "C", text: "I have a rough plan",           icon: "📝" },
      { label: "D", text: "I should but I avoid it",       icon: "🙈" },
    ],
  },
  {
    question: "End of month, you usually:",
    options: [
      { label: "A", text: "Have spent everything",     icon: "💸" },
      { label: "B", text: "Have saved something",      icon: "✅" },
      { label: "C", text: "Exactly on budget",         icon: "🎯" },
      { label: "D", text: "Have no idea where it went",icon: "❓" },
    ],
  },
  {
    question: "When a friend asks to split a big bill:",
    options: [
      { label: "A", text: "Pay without thinking",   icon: "💳" },
      { label: "B", text: "Calculate my exact share",icon: "🔢" },
      { label: "C", text: "Check my budget first",  icon: "🧐" },
      { label: "D", text: "Avoid the situation",    icon: "🏃" },
    ],
  },
  {
    question: "Your financial goal right now is:",
    options: [
      { label: "A", text: "Enjoy life, worry later",      icon: "🎉" },
      { label: "B", text: "Save as much as possible",     icon: "🏆" },
      { label: "C", text: "Balance spending and saving",  icon: "⚖️" },
      { label: "D", text: "I haven't thought about it",   icon: "💭" },
    ],
  },
];

const personalityMap = {
  impulsive: { type: "The Impulsive Spender",  emoji: "🛍️", color: "#ef4444", tip: "Spendly will help you pause before you spend and build awareness around your habits." },
  saver:     { type: "The Cautious Saver",     emoji: "🏦", color: "#10b981", tip: "You're already ahead! Spendly will help you grow your savings with smart goals and tracking." },
  planner:   { type: "The Smart Planner",      emoji: "📋", color: "#7c3aed", tip: "You think before you spend. Spendly will give you the tools to plan even better." },
  avoider:   { type: "The Money Avoider",      emoji: "🙈", color: "#f59e0b", tip: "That's okay — Spendly is designed to make managing money feel easy, not scary." },
};

function Onboarding() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = async (label) => {
    const newAnswers = [...answers, label];
    setAnswers(newAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }

    // Last question — submit
    setLoading(true);
    const res = await fetch('http://localhost:8000/auth/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ answers: newAnswers }),
    });
    const data = await res.json();
    setResult(data.personality_type);
    setLoading(false);
  };

  const progress = ((current + 1) / questions.length) * 100;
  const q = questions[current];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
          <p style={{ color: 'var(--text-secondary)' }}>Analysing your answers...</p>
        </div>
      </div>
    );
  }

  if (result) {
    const key = Object.keys(personalityMap).find(k => personalityMap[k].type === result) || 'planner';
    const info = personalityMap[key];

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div className="fade-in" style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{info.emoji}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>You are</h2>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: info.color, marginBottom: 16 }}>
            {info.type}
          </h1>
          <div className="card-modern" style={{ textAlign: 'left', marginBottom: 24 }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{info.tip}</p>
          </div>
          <button
            className="btn-primary-modern"
            onClick={() => navigate('/dashboard')}
          >
            Go to My Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="fade-in" style={{ maxWidth: 560, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="logo-text" style={{ fontSize: 22 }}>💜 Spendly</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
            Let's understand your money personality
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Question {current + 1} of {questions.length}
            </span>
            <span style={{ fontSize: 13, color: 'var(--accent-light)', fontWeight: 600 }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-modern">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="card-modern" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
            {q.question}
          </h3>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {q.options.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(opt.label)}
              className="slide-in"
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                padding: '14px 18px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'left',
                transition: 'all 0.2s',
                animationDelay: `${i * 0.07}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--bg-card)';
              }}
            >
              <span style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {opt.icon}
              </span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;