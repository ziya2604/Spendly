function AchievementCards() {

  const badges = [

    {
      icon:"🔥",
      title:"7 Day Streak",
      text:"Tracked finances consistently"
    },

    {
      icon:"🎯",
      title:"Goal Setter",
      text:"Created first savings goal"
    },

    {
      icon:"💰",
      title:"Budget Master",
      text:"Stayed within spending limits"
    },

    {
      icon:"📈",
      title:"Money Growth",
      text:"Improved savings habits"
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

        Achievements

      </h2>

      <p
        className="text-muted"
        style={{
          marginBottom:24
        }}
      >

        Small financial wins matter.

      </p>

      <div
        style={{

          display:"grid",

          gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",

          gap:18

        }}
      >

        {

          badges.map((badge)=>(

            <div

              key={badge.title}

              className="achievement-card"

            >

              <div
              style={{
                fontSize:34
              }}
              >

                {badge.icon}

              </div>

              <h4>

                {badge.title}

              </h4>

              <p
              className="text-muted"
              >

                {badge.text}

              </p>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default AchievementCards;