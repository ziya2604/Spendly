function ActivityTimeline() {

  const activities = [

    {

      icon:"💸",

      title:
      "Added Food Expense",

      amount:"₹450",

      time:"Today"

    },

    {

      icon:"🎯",

      title:
      "Created Goal",

      amount:
      "Emergency Fund",

      time:"Yesterday"

    },

    {

      icon:"💰",

      title:
      "Added Income",

      amount:"₹20,000",

      time:"2 days ago"

    },

    {

      icon:"📊",

      title:
      "Budget Updated",

      amount:
      "Monthly Budget",

      time:"4 days ago"

    }

  ];

  return (

    <div
      className="card"
      style={{
        marginTop:20
      }}
    >

      <h2>

        Activity Timeline

      </h2>

      <p
        className="text-muted"
        style={{
          marginBottom:24
        }}
      >

        Recent financial activity

      </p>

      {

        activities.map((item)=>(

          <div

            key={
              item.title+
              item.time
            }

            className=
            "timeline-item"

          >

            <div
            className=
            "timeline-icon"
            >

              {item.icon}

            </div>

            <div>

              <div
              style={{
                fontWeight:600
              }}
              >

                {item.title}

              </div>

              <div
              className=
              "text-muted"
              >

                {item.amount}

              </div>

            </div>

            <div
            className=
            "timeline-time"
            >

              {item.time}

            </div>

          </div>

        ))

      }

    </div>

  );

}

export default ActivityTimeline;