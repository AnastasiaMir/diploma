import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from "../store/taskSlice";

const CreateTask = () => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.tasks)

  const handleSubmit = async (e) => {
    e.preventDefault();
     try{
          await dispatch(addTask({ name: name, start_date: startDate, finish_date: finishDate }));
          setName('');
          setStartDate('');
          setFinishDate('');
     }
     catch(err) {
          console.error('Error creating task', err)
      }
  };

  return (
    <form onSubmit={handleSubmit} className="create-task-form">
         {error && <p style={{ color: 'red' }}>{error}</p>}
           {loading ? 'Loading...' : null}
      <div>
        <label htmlFor="name">Task name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required/>
      </div>
      <div>
        <label htmlFor="startDate">Start date:</label>
        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
      </div>
      <div>
        <label htmlFor="finishDate">Finish date:</label>
        <input type="date" id="finishDate" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} required/>
      </div>
        <button type="submit" disabled={loading}>Add task</button>
    </form>
  );
}

export default CreateTask;