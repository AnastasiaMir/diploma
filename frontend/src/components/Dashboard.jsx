import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import CreateTask from "./CreateTask";
import TaskList from "./TaskList";
import '../assets/styles/Dashboard.css';
import GanttChart from './GanttChart';
import TaskUpload from "./TaskUpload";
import { useSelector } from "react-redux";
import { selectAllTasks } from "../store/taskSelectors";
import { fetchTasks } from '../store/taskSlice';

const Dashboard =() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const tasks = useSelector(selectAllTasks)
    const [selectedTask, setSelectedTask] = useState(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    const handleSelectTask = (e) => {
        const taskId = e.target.value;
       const selectedTask = tasks.find(task => task.id === parseInt(taskId));
        setSelectedTask(selectedTask)
    };
     const handleTaskUploaded = () => {
       dispatch(fetchTasks());
    }
    return (
        <div className="main-container">
            <div className="dashboard-header">
                <button onClick={handleLogout} className='logout-button'>Выход</button>
            </div>
            <div className="dashboard-container">
            <div className="dashboard-menu">
                <h3>Меню задач</h3>
                <CreateTask />
                <div className='select-task-container'>
                    <label htmlFor='taskSelect'>Выберите задачу:</label>
                    <select name='taskSelect' id='taskSelect' onChange={handleSelectTask} >
                        <option value={''}>Выберите задачу</option>
                        {tasks.map((task) => (
                            <option key={task.id} value={task.id}>{task.name}</option>
                        ))}
                    </select>
                    {selectedTask &&  <TaskUpload task={selectedTask} onTaskUploaded={handleTaskUploaded}/>}
                </div>
            </div>
            <div className="dashboard-content">
                <div className="tab-buttons">
                    <button
                        className={activeTab === 'tasks' ? 'active' : ''}
                        onClick={() => setActiveTab('tasks')}
                    >
                        Задачи
                    </button>
                    <button
                        className={activeTab === 'gantt' ? 'active' : ''}
                        onClick={() => setActiveTab('gantt')}
                    >
                        Диаграмма Ганта
                    </button>
                </div>
                <div className="tab-content">
                    {activeTab === 'tasks' && <TaskList />}
                    {activeTab === 'gantt' && <GanttChart/>}
                </div>
            </div>
            </div>
        </div>
    );
}

export default Dashboard;