import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
    {
        question: "When you get money, what do you do first?",
        options: [
            { label: "A", text: "Spend on something I wanted" },
            { label: "B", text: "Save a fixed amount first" },
            { label: "C", text: "Pay bills and plan the rest" },
            { label: "D", text: "No plan, figure it out later" }
        ]
    },
    {
        question: "How often do you check your bank balance?",
        options: [
            { label: "A", text: "Never, I just spend" },
            { label: "B", text: "Every day" },
            { label: "C", text: "Weekly with a budget" },
            { label: "D", text: "Only when I need to" }
        ]
    },
    {
        question: "You get ₹5000 extra this month. What happens?",
        options: [
            { label: "A", text: "Buy something I wanted" },
            { label: "B", text: "Put it in savings immediately" },
            { label: "C", text: "Split between saving and treating myself" },
            { label: "D", text: "It disappears somehow" }
        ]
    },
    {
        question: "How do you feel about budgeting?",
        options: [
            { label: "A", text: "Too restrictive, I don't do it" },
            { label: "B", text: "I love it, I track everything" },
            { label: "C", text: "I have a rough plan" },
            { label: "D", text: "I should but I avoid it" }
        ]
    },
    {
        question: "End of month, you usually:",
        options: [
            { label: "A", text: "Have spent everything" },
            { label: "B", text: "Have saved something" },
            { label: "C", text: "Exactly on budget" },
            { label: "D", text: "Have no idea where it went" }
        ]
    },
    {
        question: "When a friend asks to split a big bill:",
        options: [
            { label: "A", text: "Pay without thinking" },
            { label: "B", text: "Calculate my exact share" },
            { label: "C", text: "Check my budget first" },
            { label: "D", text: "Avoid the situation" }
        ]
    },
    {
        question: "Your financial goal right now is:",
        options: [
            { label: "A", text: "Enjoy life, worry later" },
            { label: "B", text: "Save as much as possible" },
            { label: "C", text: "Balance spending and saving" },
            { label: "D", text: "I haven't thought about it" }
        ]
    }
];

function Onboarding() {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleAnswer = async (label) => {
        const newAnswers = [...answers, label];
        setAnswers(newAnswers);

        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else {
            // All questions answered — submit
            const res = await fetch('http://localhost:8000/auth/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ answers: newAnswers })
            });
            const data = await res.json();
            setResult(data.personality_type);
        }
    };

    if (result) {
        return (
            <div className="container mt-5 text-center" style={{ maxWidth: '500px' }}>
                <h2>Your Financial Personality</h2>
                <div className="alert alert-success mt-4">
                    <h3>{result}</h3>
                </div>
                <p className="mt-3">
                    Spendly will now give you personalised tips based on your type.
                </p>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/dashboard')}
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    const q = questions[current];

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <p className="text-muted">Question {current + 1} of {questions.length}</p>
            <div className="progress mb-4">
                <div 
                    className="progress-bar" 
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
            </div>
            <h4 className="mb-4">{q.question}</h4>
            {q.options.map(opt => (
                <button
                    key={opt.label}
                    className="btn btn-outline-primary w-100 mb-2 text-start"
                    onClick={() => handleAnswer(opt.label)}
                >
                    <strong>{opt.label}.</strong> {opt.text}
                </button>
            ))}
        </div>
    );
}

export default Onboarding;