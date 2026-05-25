import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function Goals() {

    const token = localStorage.getItem('token');

    const headers = {

        'Content-Type':'application/json',

        'Authorization':`Bearer ${token}`

    };

    const [goals,setGoals] = useState([]);

    const [form,setForm] = useState({

        title:'',

        target_amount:'',

        saved_amount:''

    });

    const fetchGoals = async()=>{

        const res = await fetch(

            'http://localhost:8000/goals',

            {headers}

        );

        const data = await res.json();

        setGoals(data);

    };

    useEffect(()=>{

        fetchGoals();

    },[]);

    const handleAdd = async()=>{

        if(

            !form.title ||

            !form.target_amount

        ) return;

        await fetch(

            'http://localhost:8000/goals',

            {

                method:'POST',

                headers,

                body:JSON.stringify(form)

            }

        );

        setForm({

            title:'',

            target_amount:'',

            saved_amount:''

        });

        fetchGoals();

    };

    const handleDelete = async(id)=>{

        await fetch(

            `http://localhost:8000/goals/${id}`,

            {

                method:'DELETE',

                headers

            }

        );

        fetchGoals();

    };

    return(

    <div>

    <Navbar/>

    <div className="container mt-4">

    <h3>

    Goals

    </h3>

    <div className="card p-3 mb-3">

    <div className="row g-2">

    <div className="col-md-4">

    <input

    className="form-control"

    placeholder="Goal name"

    value={form.title}

    onChange={e=>

    setForm({

    ...form,

    title:e.target.value

    })

    }

    />

    </div>

    <div className="col-md-3">

    <input

    className="form-control"

    type="number"

    placeholder="Target Amount"

    value={form.target_amount}

    onChange={e=>

    setForm({

    ...form,

    target_amount:e.target.value

    })

    }

    />

    </div>

    <div className="col-md-3">

    <input

    className="form-control"

    type="number"

    placeholder="Current Savings"

    value={form.saved_amount}

    onChange={e=>

    setForm({

    ...form,

    saved_amount:e.target.value

    })

    }

    />

    </div>

    <div className="col-md-2">

    <button

    className="btn btn-primary w-100"

    onClick={handleAdd}

    >

    Add

    </button>

    </div>

    </div>

    </div>

    <div className="card p-3">

    {

    goals.length===0

    ?

    <p className="text-muted">

    No goals added yet

    </p>

    :

    goals.map(g=>{

    const percent=

    Math.min(

    100,

    (

    Number(g.saved_amount)

    /

    Number(g.target_amount)

    )*100

    );

    return(

    <div

    key={g.id}

    className="mb-3"

    >

    <div>

    <b>

    {g.title}

    </b>

    </div>

    <small>

    ₹

    {g.saved_amount}

    /

    ₹

    {g.target_amount}

    </small>

    <div

    className="progress"

    >

    <div

    className="progress-bar"

    style={{

    width:

    `${percent}%`

    }}

    >

    {

    percent.toFixed(0)

    }

    %

    </div>

    </div>

    <button

    className=

    "btn btn-danger btn-sm mt-2"

    onClick={()=>

    handleDelete(g.id)

    }

    >

    Delete

    </button>

    </div>

    );

    })

    }

    </div>

    </div>

    </div>

    );

}

export default Goals;