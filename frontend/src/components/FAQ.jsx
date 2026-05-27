import { useState } from 'react';

function FAQ() {

  const faqs = [

    {

      q:'How does Spendly track expenses?',

      a:'Spendly records income and expenses to help you monitor spending patterns and financial habits.'

    },

    {

      q:'Can I create savings goals?',

      a:'Yes. Spendly allows you to create goals and track progress over time.'

    },

    {

      q:'How are budgets calculated?',

      a:'Budgets compare spending against your planned limits and show remaining balance.'

    },

    {

      q:'Can I manage debt repayment?',

      a:'Yes. Debt tracking helps monitor repayments and remaining balances.'

    },

    {

      q:'Is my financial information secure?',

      a:'Spendly stores and processes financial information securely.'

    }

  ];

  const [open,setOpen] = useState(null);

  return (

    <div
      className="card"
      style={{
        marginTop:24
      }}
    >

      <div
        style={{
          marginBottom:28
        }}
      >

        <h2>

          Frequently Asked Questions

        </h2>

        <p className="text-muted">

          Everything about Spendly

        </p>

      </div>

      {

        faqs.map((item,index)=>(

          <div

            key={index}

            className="faq-item"

          >

            <button

              className="faq-button"

              onClick={()=>{

                setOpen(

                  open===index

                  ? null

                  : index

                );

              }}

            >

              <span>

                {item.q}

              </span>

              <span>

                {

                  open===index

                  ? '−'

                  : '+'

                }

              </span>

            </button>

            {

              open===index && (

                <div
                className="faq-answer"
                >

                  {item.a}

                </div>

              )

            }

          </div>

        ))

      }

    </div>

  );

}

export default FAQ;