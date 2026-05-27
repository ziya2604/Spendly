import { Link } from 'react-router-dom';

function Footer() {

  return (

    <footer
      style={{

        marginTop:50,

        background:'#09090f',

        borderTop:'1px solid #1e1e2d',

        padding:'50px 32px 20px'

      }}
    >

      <div
        style={{

          display:'grid',

          gridTemplateColumns:

          '2fr 1fr 1fr 1fr',

          gap:'40px',

          marginBottom:'40px'

        }}
      >

        {/* Left */}

        <div>

          <div
            style={{

              display:'flex',

              alignItems:'center',

              gap:'10px',

              marginBottom:'18px'

            }}
          >

            <div
              style={{

                width:'34px',

                height:'34px',

                borderRadius:'10px',

                background:

                'linear-gradient(135deg,#7c3aed,#4f46e5)',

                display:'flex',

                alignItems:'center',

                justifyContent:'center',

                color:'white',

                fontWeight:'700'

              }}
            >

              S

            </div>

            <h2
              style={{
                color:'white'
              }}
            >

              Spendly

            </h2>

          </div>

          <p
            style={{

              color:'#9ca3af',

              lineHeight:'1.8',

              maxWidth:'260px'

            }}
          >

            Smart finance tracking
            built to help you
            spend better,
            save smarter
            and build stronger
            financial habits.

          </p>

          <div
            style={{

              display:'flex',

              gap:'12px',

              marginTop:'22px'

            }}
          >

            <Social>

              📧

            </Social>

            <Social>

              💼

            </Social>

            <Social>

              📱

            </Social>

          </div>

        </div>

        {/* Product */}

        <Section
          title="Product"
          items={[

            'Dashboard',

            'Expenses',

            'Income',

            'Goals'

          ]}
        />

        {/* Features */}

        <Section
          title="Features"
          items={[

            'Budgets',

            'Debt Tracker',

            'Calculator',

            'Learn'

          ]}
        />

        {/* Support */}

        <Section
          title="Resources"
          items={[

            'FAQ',

            'Support',

            'About Spendly',

            'Challenges'

          ]}
        />

      </div>

      <div
        style={{

          borderTop:

          '1px solid #1e1e2d',

          paddingTop:'18px',

          display:'flex',

          justifyContent:

          'space-between',

          color:'#6b7280',

          fontSize:'14px'

        }}
      >

        <span>

          © 2026 Spendly

        </span>

        <span>

          React • FastAPI • ChartJS

        </span>

      </div>

    </footer>

  );

}

function Section({

  title,

  items

}) {

  return (

    <div>

      <h4
        style={{

          color:'white',

          marginBottom:'18px'

        }}
      >

        {title}

      </h4>

      {

        items.map(item=>(

          <div

            key={item}

            style={{

              color:'#9ca3af',

              marginBottom:'12px',

              cursor:'pointer'

            }}

          >

            {item}

          </div>

        ))

      }

    </div>

  );

}

function Social({

  children

}) {

  return (

    <div
      style={{

        width:'38px',

        height:'38px',

        background:'#161625',

        borderRadius:'12px',

        display:'flex',

        alignItems:'center',

        justifyContent:'center',

        cursor:'pointer'

      }}
    >

      {children}

    </div>

  );

}

export default Footer;