import { useState } from 'react';

function SupportWidget() {

  const [open,setOpen] = useState(false);

  const name =
  localStorage.getItem('name')
  || 'User';

  return (

    <>

      {

        open && (

          <div

            className=
            "support-box"

          >

            <div
            className=
            "support-header"
            >

              Need Help?

            </div>

            <div
            style={{
              fontSize:14,
              marginBottom:16
            }}
            >

              Hi {name} 👋

              <br/>

              What do you need help with?

            </div>

            <button
            className=
            "support-option"
            >

              Expenses

            </button>

            <button
            className=
            "support-option"
            >

              Budgets

            </button>

            <button
            className=
            "support-option"
            >

              Goals

            </button>

            <button
            className=
            "support-option"
            >

              Calculator

            </button>

          </div>

        )

      }

      <button

        className=
        "support-float"

        onClick={()=>{

          setOpen(

            !open

          );

        }}

      >

        {

          open

          ? '✕'

          : '💬'

        }

      </button>

    </>

  );

}

export default SupportWidget;