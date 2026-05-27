function MonthlyChallenges() {

  const challenges = [

    {

      title:
      "Reduce Food Spending",

      progress:80,

      reward:
      "Discipline Badge"

    },

    {

      title:
      "Save ₹5000",

      progress:45,

      reward:
      "Savings Badge"

    },

    {

      title:
      "Track Expenses Daily",

      progress:92,

      reward:
      "Consistency Badge"

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

        Monthly Challenges

      </h2>

      <p
        className="text-muted"
        style={{
          marginBottom:24
        }}
      >

        Build better financial habits

      </p>

      {

        challenges.map((item)=>(

          <div

            key={item.title}

            className=
            "challenge-card"

          >

            <div
            className=
            "challenge-header"
            >

              <h4>

                {item.title}

              </h4>

              <span>

                {item.progress}%

              </span>

            </div>

            <div
            className=
            "challenge-bar"
            >

              <div

                className=
                "challenge-fill"

                style={{

                  width:
                  `${item.progress}%`

                }}

              />

            </div>

            <div
            className=
            "text-muted"
            >

              Reward:

              {item.reward}

            </div>

          </div>

        ))

      }

    </div>

  );

}

export default MonthlyChallenges;