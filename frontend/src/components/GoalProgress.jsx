function GoalProgress() {

  const goals = [

    {
      title: "Emergency Fund",
      current: 12000,
      target: 20000
    },

    {
      title: "Trip Savings",
      current: 8000,
      target: 15000
    },

    {
      title: "Laptop Fund",
      current: 30000,
      target: 50000
    }

  ];

  return (

    <div
      className="card-modern"
      style={{
        marginTop: 24
      }}
    >

      <h3
        style={{
          marginBottom: 18
        }}
      >

        Goal Progress

      </h3>

      {

        goals.map((goal) => {

          const percent =
            (goal.current / goal.target) * 100;

          return (

            <div
              key={goal.title}
              style={{
                marginBottom: 20
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6
                }}
              >

                <span>

                  {goal.title}

                </span>

                <span>

                  ₹{goal.current}

                  /

                  ₹{goal.target}

                </span>

              </div>

              <div
                style={{
                  height: 10,

                  background:
                    "rgba(255,255,255,0.08)",

                  borderRadius: 20,

                  overflow: "hidden"
                }}
              >

                <div
                  style={{
                    width: `${percent}%`,

                    height: "100%",

                    background:
                      "linear-gradient(90deg,#7c3aed,#4f46e5)",

                    borderRadius: 20,

                    transition:
                      "0.4s"
                  }}
                />

              </div>

            </div>

          );

        })

      }

    </div>

  );

}

export default GoalProgress;