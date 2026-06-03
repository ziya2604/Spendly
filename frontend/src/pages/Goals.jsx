import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    target_amount: "",
    saved_amount: "",
    target_date: "",
    category: "Travel",
  });

  const token = localStorage.getItem("token");

  const H = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadGoals = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/goals",
        { headers: H }
      );

      const data = await res.json();

      if (Array.isArray(data))
        setGoals(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const saveGoal = async () => {
    await fetch(
      "http://localhost:8000/goals",
      {
        method: "POST",
        headers: H,
        body: JSON.stringify(form),
      }
    );

    setShowForm(false);

    setForm({
      title: "",
      target_amount: "",
      saved_amount: "",
      target_date: "",
      category: "Travel",
    });

    loadGoals();
  };

  const totalTarget = goals.reduce(
    (s, g) => s + Number(g.target_amount),
    0
  );

  const totalSaved = goals.reduce(
    (s, g) => s + Number(g.saved_amount),
    0
  );

  const completion =
    totalTarget > 0
      ? Math.round(
          (totalSaved / totalTarget) * 100
        )
      : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface2)",
      }}
    >
      <Navbar />

      {/* HERO */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e293b)",
          padding: "56px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 10,
            }}
          >
            Financial Goals
          </p>

          <h1
            style={{
              color: "#fff",
              fontSize: 48,
              fontWeight: 800,
            }}
          >
            Turn plans into
            <br />
            milestones
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              marginTop: 16,
              maxWidth: 500,
            }}
          >
            Track every goal,
            savings target and
            milestone in one place.
          </p>
        </div>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          background: "var(--surface)",
          borderBottom:
            "1px solid var(--border)",
        }}
      >
        <div className="db-stat-cell">
          <div>Total Goal Value</div>
          <h2>
            ₹
            {totalTarget.toLocaleString(
              "en-IN"
            )}
          </h2>
        </div>

        <div className="db-stat-cell">
          <div>Saved So Far</div>
          <h2>
            ₹
            {totalSaved.toLocaleString(
              "en-IN"
            )}
          </h2>
        </div>

        <div className="db-stat-cell">
          <div>Active Goals</div>
          <h2>{goals.length}</h2>
        </div>

        <div className="db-stat-cell">
          <div>Completion</div>
          <h2>{completion}%</h2>
        </div>
      </div>

      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2>Your Goals</h2>

          <button
            className="btn btn-primary"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            Add Goal
          </button>
        </div>

                <div
        style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 24,
        }}
        >
        <div className="card" style={{ padding: 24 }}>
            <h3>Goal Health</h3>
            <h1>{completion}%</h1>
            <p className="text-muted">
            Overall progress
            </p>
        </div>

        <div className="card" style={{ padding: 24 }}>
            <h3>Remaining Amount</h3>
            <h1>
            ₹
            {(totalTarget - totalSaved).toLocaleString(
                "en-IN"
            )}
            </h1>
            <p className="text-muted">
            Left to achieve all goals
            </p>
        </div>
        </div>
        
                <div
        className="card"
        style={{
            padding: 24,
            marginBottom: 24,
        }}
        >
        <h3>Upcoming Deadlines</h3>

        {goals.length === 0 ? (
            <p className="text-muted">
            No active goals
            </p>
        ) : (
            goals.slice(0, 3).map((goal) => (
            <div
                key={goal.id}
                style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom:
                    "1px solid var(--border)",
                }}
            >
                <span>{goal.title}</span>

                <span>
                {goal.deadline || "No deadline"}
                </span>
            </div>
            ))
        )}
        </div>
                

        {showForm && (
          <div
            className="card"
            style={{
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h3>Create Goal</h3>

            <input
              className="input"
              placeholder="Goal Name"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <br />
            <br />

            <input
              className="input"
              type="number"
              placeholder="Target Amount"
              value={form.target_amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  target_amount:
                    e.target.value,
                })
              }
            />

            <br />
            <br />

            <input
              className="input"
              type="number"
              placeholder="Current Savings"
              value={form.saved_amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  saved_amount:
                    e.target.value,
                })
              }
            />

            <br />
            <br />

            <input
              className="input"
              type="date"
              value={form.target_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  target_date:
                    e.target.value,
                })
              }
            />

            <br />
            <br />

            <button
              className="btn btn-primary"
              onClick={saveGoal}
            >
              Save Goal
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(340px,1fr))",
            gap: 20,
          }}
        >
          {goals.map((goal) => {
            const percent =
              Math.min(
                100,
                (goal.saved_amount /
                  goal.target_amount) *
                  100
              );

            return (
              <div
                key={goal.id}
                className="card"
                style={{
                  padding: 24,
                  borderRadius: 20,
                }}
              >
                <h3>{goal.title}</h3>

                <p
                  style={{
                    color:
                      "var(--text2)",
                    marginBottom: 14,
                  }}
                >
                  {goal.category}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: 12,
                  }}
                >
                  <span>
                    ₹
                    {goal.saved_amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span>
                    ₹
                    {goal.target_amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div
                  style={{
                    background:
                      "var(--border)",
                    height: 10,
                    borderRadius: 999,
                    overflow:
                      "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg,#4f46e5,#7c3aed)",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <span>
                    {Math.round(
                      percent
                    )}
                    %
                  </span>

                  <span>
                    Target:
                    {" "}
                    {goal.deadline}
                  </span>
                </div>

                        <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
        }}
        >
        {[25, 50, 75, 100].map((step) => (
            <div
            key={step}
            style={{
                textAlign: "center",
            }}
            >
            <div
                style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                margin: "0 auto",
                background:
                    percent >= step
                    ? "#4f46e5"
                    : "#d1d5db",
                }}
            />

            <small>{step}%</small>
            </div>
        ))}
        </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
