function WhySpendly() {

  const features = [

    {
      title:'Track Everything',
      text:
      'Expenses, income, debts and goals in one place.',
      icon:'📊'
    },

    {
      title:'Smart Insights',
      text:
      'Understand spending habits using analytics.',
      icon:'🧠'
    },

    {
      title:'Stay Consistent',
      text:
      'Challenges and goals keep finances on track.',
      icon:'🎯'
    },

    {
      title:'Learn Finance',
      text:
      'Simple lessons for better money decisions.',
      icon:'📚'
    }

  ];

  return (

    <section
      style={{

        marginTop:60

      }}
    >

      <h2
        style={{

          fontSize:32,

          fontWeight:700,

          marginBottom:12

        }}
      >

        Why Spendly?

      </h2>

      <p
        style={{

          color:'var(--text2)',

          marginBottom:28

        }}
      >

        Everything you need to manage money smarter.

      </p>

      <div
        style={{

          display:'grid',

          gridTemplateColumns:
          'repeat(auto-fit,minmax(230px,1fr))',

          gap:20

        }}
      >

        {

          features.map((item)=>(

            <div

              key={item.title}

              style={{

                background:'var(--surface)',

                padding:24,

                borderRadius:20,

                border:
                '1px solid var(--border)',

                transition:
                '0.2s'

              }}

            >

              <div
                style={{

                  fontSize:30,

                  marginBottom:16

                }}
              >

                {item.icon}

              </div>

              <h3>

                {item.title}

              </h3>

              <p
                style={{

                  color:'var(--text2)',

                  lineHeight:1.6

                }}
              >

                {item.text}

              </p>

            </div>

          ))

        }

      </div>

    </section>

  );

}

export default WhySpendly;