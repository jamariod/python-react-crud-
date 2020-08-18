import React, {useState, useEffect} from 'react';


const url = 'http://localhost:5000/items';

export const Items = () => {
   const [name, setName] = useState('');
   const [date, setDate] = useState('');
   const [editing, setEditing] = useState(false)
   const [id, setId] = useState('')
   const [items, setItems] = useState([])
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editing) {
            const res = await fetch(url, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify({
                     name,
                     date
                 })
             })
             const data = await res.json(); 
             console.log(data)
        } else {
            const res = await fetch(`http://localhost:5000/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    date  
                })
            }) 
            const data = await res.json();
            console.log(data)
            setEditing(false);
            setId('');
        }
        await getItems();
        setName('');
        setDate('');
    };
    const getItems = async () => {
        const res = await fetch('http://localhost:5000/items')
        const data = await res.json();
        setItems(data)
    }
    useEffect(() => {
        getItems();
    }, [])
    const editItem = async (id) => {
        const res = await fetch(`http://localhost:5000/items/${id}`)
        const data = await res.json();
        setEditing(true);
        setId(id);
        setName(data.name)
        setDate(data.date)
    } 
    const deleteItem =  async (id) => {
       const userResponse = window.confirm("Are you sure you want to delete task?")
       if (userResponse) {
        const res = await fetch(`http://localhost:5000/items/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        console.log(data)
        await getItems();
       }
    } 
    return (
        <div className="row">
        <div className="col-md-4">
            <form onSubmit={handleSubmit} className="card card-body">
                <div className="form-group">
                    <input type="text" 
                    onChange={e => setName(e.target.value)} 
                    value={name} 
                    className="form-control"
                    placeholder="Item"
                    autoFocus
                />
                </div>
                <div className="form-group">
                    <input type="date" 
                    onChange={e => setDate(e.target.value)} 
                    value={date} 
                    className="form-control"
                    placeholder="Start Date"
                    autoFocus
                />
                </div>
                <button className="btn btn-primary btn-block">
                    {editing ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
        <div className="col-md-6">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                       <td>
                       <button className="btn btn-secondary btn-sm btn-block"
                       onClick={e => editItem(item.id)}
                       >
                            Edit
                        </button>
                        <button className="btn btn-danger btn-sm btn-block"
                        onClick={() => deleteItem(item.id)}
                        >
                            Delete
                        </button>
                       </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </div>
    )
}
  
 

