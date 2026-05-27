function SpendingTrends() {

  const trends = [

    {

      category:"Food",

      change:"+12%",

      color:"#ef4444",

      note:"Higher than last month"

    },

    {

      category:"Shopping",

      change:"-8%",

      color:"#16a34a",

      note:"Improved spending"

    },

    {

      category:"Transport",

      change:"+4%",

      color:"#f59e0b",

      note:"Stable trend"

    },

    {

      category:"Savings",

      change:"+15%",

      color:"#7c3aed",

      note:"Excellent growth"

    }

  ];

  return (

    <div
      className="card"
      style={{
        marginTop:20
      }}
    >

      <div
        style={{
          marginBottom:20
        }}
      >

        <h2>

          Spending Trends

        </h2>

        <p
          className="text-muted"
        >

          Compare spending behaviour

        </p>

      </div>

      <div
        style={{

          display:"grid",

          gap:14

        }}
      >

        {

          trends.map((item)=>(

            <div

              key={item.category}

              className="trend-card"

            >

              <div>

                <h4>

                  {item.category}

                </h4>

                <div
                className="text-muted"
                >

                  {item.note}

                </div>

              </div>

              <div
                style={{

                  color:item.color,

                  fontWeight:700,

                  fontSize:18

                }}
              >

                {item.change}

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default SpendingTrends;