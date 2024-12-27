// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchSubtasks, createSubtask, updateSubtask, deleteSubtask } from '../store/subtaskSlice';

// function TaskDetails({ task, onClose }){
//     const dispatch = useDispatch();
//    const subtasks = useSelector((state) => state.subtasks.subtasks[task.id] || []);
//     const loading = useSelector((state) => state.subtasks.loading);
//       const error = useSelector((state) => state.subtasks.error)
//     const [subtaskName, setSubtaskName] = useState('');
//     const [manpower, setManpower] = useState('');
//      useEffect(() => {
//          dispatch(fetchSubtasks(task.id));
//     }, [dispatch, task.id]);
//     const handleCreateSubtask = async(e) => {
//         e.preventDefault();
//          dispatch(createSubtask({task_id: task.id, name: subtaskName, manpower: manpower, completed: false}));
//         setSubtaskName('');
//        setManpower('');
//     };
//   const handleUpdateSubtask = async(subtask, completed) => {
//        dispatch(updateSubtask({id: subtask.id, updatedSubtask: {...subtask, completed: completed}}))
//    };
//     const handleDeleteSubtask = (id) => {
//            dispatch(deleteSubtask(id))
//     }
//   return (
//     <div>
//         <h2>{task.name} Details</h2>
//            {error && <p>Error: {error}</p>}
//           {loading && <p>Loading</p>}
//         <h3>Add new subtask</h3>
//           <form onSubmit={handleCreateSubtask}>
//              <div>
//                 <label htmlFor="subtaskName">Subtask name:</label>
//                  <input type="text" id="subtaskName" value={subtaskName} onChange={(e) => setSubtaskName(e.target.value)} />
//              </div>
//              <div>
//                   <label htmlFor="manpower">Manpower:</label>
//                    <input type="number" id="manpower" value={manpower} onChange={(e) => setManpower(e.target.value)} />
//                 </div>
//               <button type="submit">Add</button>
//           </form>
//         <h3>Subtasks</h3>
//            <ul>
//             {subtasks.map((subtask) => (
//                 <li key={subtask.id}>
//                     <span>{subtask.name} Manpower: {subtask.manpower}</span>
//                     <input
//                        type="checkbox"
//                        checked={subtask.completed}
//                        onChange={(e) => handleUpdateSubtask(subtask, !subtask.completed)}
//                      />
//                      <button onClick={() => handleDeleteSubtask(subtask.id)}>Delete</button>
//                 </li>
//              ))}
//           </ul>
//         <button onClick={onClose}>Close</button>
//     </div>
//   )
// }
// export default TaskDetails;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubtasks, createSubtask, updateSubtask, deleteSubtask } from '../store/subtaskSlice';
import PropTypes from 'prop-types';


function TaskDetails({ task, onClose }){
    const dispatch = useDispatch();
   const subtasks = useSelector((state) => state.subtasks.subtasks[task.id] || []);
    const loading = useSelector((state) => state.subtasks.loading);
    const error = useSelector((state) => state.subtasks.error)
    const [subtaskName, setSubtaskName] = useState('');
    const [manpower, setManpower] = useState('');
     useEffect(() => {
        dispatch(fetchSubtasks(task.id));
    }, [dispatch, task.id]);
    const handleCreateSubtask = async(e) => {
        e.preventDefault();
         dispatch(createSubtask({task_id: task.id, name: subtaskName, manpower: manpower, completed: false}));
        setSubtaskName('');
       setManpower('');
    };
  const handleUpdateSubtask = async(subtask, completed) => {
       dispatch(updateSubtask({id: subtask.id, updatedSubtask: {...subtask, completed: completed}}))
   };
    const handleDeleteSubtask = (id) => {
           dispatch(deleteSubtask(id))
    }
  return (
    <div>
        <h2>{task.name} Details</h2>
           {error && <p>Error: {error}</p>}
          {loading && <p>Loading</p>}
        <h3>Add new subtask</h3>
          <form onSubmit={handleCreateSubtask}>
             <div>
                <label htmlFor="subtaskName">Subtask name:</label>
                 <input type="text" id="subtaskName" value={subtaskName} onChange={(e) => setSubtaskName(e.target.value)} />
             </div>
             <div>
                  <label htmlFor="manpower">Manpower:</label>
                   <input type="number" id="manpower" value={manpower} onChange={(e) => setManpower(e.target.value)} />
                </div>
              <button type="submit">Add</button>
          </form>
        <h3>Subtasks</h3>
           <ul>
            {subtasks.map((subtask) => (
                <li key={subtask.id}>
                    <span>{subtask.name} Manpower: {subtask.manpower}</span>
                    <input
                       type="checkbox"
                       checked={subtask.completed}
                       onChange={() => handleUpdateSubtask(subtask, !subtask.completed)}
                     />
                     <button onClick={() => handleDeleteSubtask(subtask.id)}>Delete</button>
                </li>
             ))}
          </ul>
        <button onClick={onClose}>Close</button>
    </div>
  )
}
TaskDetails.propTypes = {
     task: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
   }).isRequired,
    onClose: PropTypes.func.isRequired,
};
export default TaskDetails;