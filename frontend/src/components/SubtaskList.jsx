import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubtask } from '../store/subtaskSlice';
import { selectSubtasksLoading, selectSubtasksError } from '../store/subtaskSelectors';
import '../assets/styles/TaskDetails.css';
const SubtaskList = ({ taskId }) => {
  const [subtaskName, setSubtaskName] = useState('');
  const [manpower, setManpower] = useState('');
  const [completed, setCompleted] = useState(false);
    const dispatch = useDispatch();
    const loading = useSelector(selectSubtasksLoading);
    const error = useSelector(selectSubtasksError);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addSubtask({ taskId, subtask: { name: subtaskName, manpower: parseInt(manpower, 10), completed } }));
    setSubtaskName('');
    setManpower('');
    setCompleted(false);
  };
    if (loading) {
        return <p>Loading subtasks...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
  return (
    <div className="subtask-container">
      <form onSubmit={handleSubmit} className="subtask-form">
          <div className="form-group">
        <label htmlFor="subtaskName">Subtask Name:</label>
        <input
          type="text"
          id="subtaskName"
          value={subtaskName}
          onChange={(e) => setSubtaskName(e.target.value)}
          required
        />
        </div>
          <div className="form-group">
        <label htmlFor="manpower">Manpower:</label>
        <input
          type="number"
          id="manpower"
          value={manpower}
          onChange={(e) => setManpower(e.target.value)}
          required
            />
          </div>
         <div className="form-group">
        <label htmlFor="completed">Completed:</label>
        <input
          type="checkbox"
          id="completed"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
             />
         </div>
        <button type="submit" className="create-subtask-button">Add Subtask</button>
      </form>
      {/* Здесь вы можете добавить отображение существующих подзадач, если они есть */}
    </div>
  );
};

export default SubtaskList;