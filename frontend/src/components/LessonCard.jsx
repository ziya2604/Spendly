function LessonCards() {

  const lessons = [

    {

      emoji:"💰",

      title:"50-30-20 Rule",

      description:
      "Learn budgeting using needs, wants and savings."

    },

    {

      emoji:"📈",

      title:"Emergency Fund",

      description:
      "Build savings for unexpected situations."

    },

    {

      emoji:"💳",

      title:"Debt Reduction",

      description:
      "Strategies to reduce debt effectively."

    },

    {

      emoji:"🎯",

      title:"Goal Planning",

      description:
      "Set realistic financial milestones."

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
          marginBottom:22
        }}
      >

        <h2>

          Learn Finance

        </h2>

        <p
          className="text-muted"
        >

          Build smarter money habits

        </p>

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

          lessons.map((lesson)=>(

            <div

              key={lesson.title}

              className="lesson-card"

            >

              <div
              style={{
                fontSize:32
              }}
              >

                {lesson.emoji}

              </div>

              <h4
              style={{
                marginTop:12
              }}
              >

                {lesson.title}

              </h4>

              <p
              className="text-muted"
              >

                {lesson.description}

              </p>

              <button
              className="lesson-btn"
              >

                Explore

              </button>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default LessonCards;