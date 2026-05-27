function AboutSpendly() {

  const features = [

    {
      icon: "💸",

      title: "Expense Tracking",

      text:
        "Track spending habits and understand where money goes."
    },

    {
      icon: "🎯",

      title: "Budget Goals",

      text:
        "Set financial goals and monitor progress easily."
    },

    {
      icon: "📉",

      title: "Debt Manager",

      text:
        "Stay on top of loans and debt payments."
    },

    {
      icon: "📊",

      title: "Smart Insights",

      text:
        "Get meaningful analytics about finances."
    }

  ];

  return (

    <div
      className="card"
      style={{

        marginTop: 22,

        overflow: "hidden"

      }}
    >

      <div
        style={{

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          marginBottom: 28,

          flexWrap: "wrap",

          gap: 16

        }}
      >

        <div>

          <h2
            style={{
              marginBottom: 8
            }}
          >

            About Spendly

          </h2>

          <p
            className="text-muted"
            style={{
              maxWidth: 520
            }}
          >

            Spendly helps users
            budget smarter,
            track expenses,
            manage debts
            and improve
            financial habits.

          </p>

        </div>

        <div
          style={{

            padding:
            "10px 18px",

            background:
            "rgba(124,58,237,0.12)",

            borderRadius: 999,

            color:"#8b5cf6",

            fontWeight:600

          }}
        >

          Personal Finance Simplified

        </div>

      </div>

      <div
        style={{

          display:"grid",

          gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",

          gap:18

        }}
      >

        {

          features.map((item)=>(

            <div

              key={item.title}

              className="spendly-feature"

              style={{

                padding:24,

                border:
                "1px solid var(--border)",

                borderRadius:18,

                background:
                "var(--surface)",

                transition:
                "0.25s ease",

                cursor:"pointer"

              }}

            >

              <div
                style={{
                  fontSize:34
                }}
              >

                {item.icon}

              </div>

              <h3
                style={{
                  marginTop:12,
                  marginBottom:8
                }}
              >

                {item.title}

              </h3>

              <p
                className="text-muted"
                style={{
                  lineHeight:1.6
                }}
              >

                {item.text}

              </p>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default AboutSpendly;