import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function Debts() {

    const token = localStorage.getItem('token');

    const headers = {

        'Content-Type':'application/json',

        'Authorization':`Bearer ${token}`

    };

    const [debts,setDebts]=useState([]);

    const [form,setForm]=useState({

        person_name:'',

        amount:'',

        debt_type:'I Owe'

    });

    const fetchDebts=async()=>{

        const res=await fetch(

            'http://localhost:8000/debts',

            {headers}

        );

        const data=await res.json();

        setDebts(data);

    };

    useEffect(()=>{

        fetchDebts();

    },[]);

    const handleAdd=async()=>{

        if(

        !form.person_name||

        !form.amount

        ) return;

        await fetch(

        'http://localhost:8000/debts',

        {

        method:'POST',

        headers,

        body:JSON.stringify(form)

        }

        );

        setForm({

        person_name:'',

        amount:'',

        debt_type:'I Owe'

        });

        fetchDebts();

    };

    const handleDelete=async(id)=>{

        await fetch(

        `http://localhost:8000/debts/${id}`,

        {

        method:'DELETE',

        headers

        }

        );

        fetchDebts();

    };

    return(

    <div>

    <Navbar/>

    <div className="container mt-4">

    <h3>

    Debt Tracker

    </h3>

    <div className="card p-3 mb-3">

    <div className="row g-2">

    <div className="col-md-4">

    <input

    className="form-control"

    placeholder="Person Name"

    value={form.person_name}

    onChange={e=>

    setForm({

    ...form,

    person_name:e.target.value

    })

    }

    />

    </div>

    <div className="col-md-3">

    <input

    className="form-control"

    type="number"

    placeholder="Amount"

    value={form.amount}

    onChange={e=>

    setForm({

    ...form,

    amount:e.target.value

    })

    }

    />

    </div>

    <div className="col-md-3">

    <select

    className="form-select"

    value={form.debt_type}

    onChange={e=>

    setForm({

    ...form,

    debt_type:e.target.value

    })

    }

    >

    <option>

    I Owe

    </option>

    <option>

    Owes Me

    </option>

    </select>

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

    debts.length===0

    ?

    <p>

    No debts added

    </p>

    :

    debts.map(d=>(

    <div

    key={d.id}

    className="border-bottom pb-2 mb-2"

    >

    <b>

    {d.person_name}

    </b>

    <br/>

    ₹{d.amount}

    —

    {d.debt_type}

    <br/>

    <button

    className=

    "btn btn-danger btn-sm mt-2"

    onClick={()=>

    handleDelete(d.id)

    }

    >

    Delete

    </button>

    </div>

    ))

    }

    </div>

    </div>

    </div>

    );

}

export default Debts;