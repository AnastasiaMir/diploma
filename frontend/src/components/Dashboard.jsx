import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CreateTask from "./CreateTask";
import { fetchTasks } from "../store/taskSlice";
import TaskDetails from "./TaskDetails";


function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const tasks = useSelector((state) => state.tasks.tasks);
      const loading = useSelector((state) => state.tasks.loading);
        const error = useSelector((state) => state.tasks.error);
    const [selectedTask, setSelectedTask] = useState(null);
   useEffect(() => {
        dispatch(fetchTasks());
   }, [dispatch]);
   const handleLogout = () => {
       dispatch(logout());
        navigate('/login');
   };

 const handleShowTaskDetails = (task) => {
       setSelectedTask(task);
 };
 const handleCloseTaskDetails = () => {
      setSelectedTask(null);
 }

    return (
    <div>
       <h1>Dashboard</h1>
            {error && <p>Error: {error}</p>}
           {loading && <p>Loading</p>}
            <CreateTask />
      <ul>
       {tasks.map((task) => <li key={task.id}>
           <span onClick={() => handleShowTaskDetails(task)}>
             {task.name}
           </span>
       </li>)}
      </ul>
        {selectedTask && (
            <TaskDetails
             task={selectedTask}
              onClose={handleCloseTaskDetails}
           />
        )}
       <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;