function FinancialSnapshot() {

  const data = [

    {
      title: "Savings Rate",
      value: "32%",
      color: "#16a34a"
    },

    {
      title: "Largest Expense",
      value: "Food",
      color: "#dc2626"
    },

    {
      title: "Budget Status",
      value: "Healthy",
      color: "#2563eb"
    },

    {
      title: "Monthly Trend",
      value: "+8%",
      color: "#7c3aed"
    }

  ];

  return (

    <div
      className="card"
      style={{
        marginTop: 20
      }}
    >

      <div
        style={{
          marginBottom: 18
        }}
      >

        <h3
          style={{
            fontSize: 15,
            fontWeight: 600
          }}
        >

          Financial Snapshot

        </h3>

        <p
          className="text-muted"
          style={{
            fontSize: 13,
            marginTop: 4
          }}
        >

          Quick overview of your money habits

        </p>

      </div>

      <div
        style={{

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",

          gap: 14

        }}
      >

        {

          data.map((item) => (

            <div

              key={item.title}

              className="card-hover"

              style={{

                border:
                  "1px solid var(--border)",

                borderRadius: 14,

                padding: 18,

                background:
                  "var(--surface)",

                transition:
                  "0.2s ease"

              }}

            >

              <div
                style={{

                  fontSize: 13,

                  color:
                    "var(--text2)",

                  marginBottom: 8

                }}
              >

                {item.title}

              </div>

              <div
                style={{

                  fontSize: 24,

                  fontWeight: 700,

                  color:
                    item.color

                }}
              >

                {item.value}

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default FinancialSnapshot;