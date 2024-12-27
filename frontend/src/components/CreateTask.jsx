import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from "../store/taskSlice";

function CreateTask(){
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createTask({name: name, start_date: startDate, finish_date: finishDate}));
        setName('');
        setStartDate('');
        setFinishDate('');
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Task name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
             </div>
            <div>
                 <label htmlFor="startDate">Start date:</label>
                <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
                <label htmlFor="finishDate">Finish date:</label>
                <input type="date" id="finishDate" value={finishDate} onChange={(e) => setFinishDate(e.target.value)}/>
            </div>
            <button type="submit">Add task</button>
        </form>
    )
}
export default CreateTask;