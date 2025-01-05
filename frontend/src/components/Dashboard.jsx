import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import CreateTask from "./CreateTask";
import TaskList from "./TaskList";
import '../assets/styles/Dashboard.css';
import GanttChart from './GanttChart';
import TaskUpload from "./TaskUpload";
import { selectTasks } from "../store/taskSelectors";
import { fetchTasks } from '../store/taskSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const tasks = useSelector(selectTasks);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
     const [selectedTask, setSelectedTask] = useState(null);


    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

   const handleLogout = () => {
     dispatch(logout());
     navigate('/login');
    };

    const handleSelectTask = (e) => {
        const taskId = e.target.value;
         setSelectedTaskId(taskId);
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
                        <select name='taskSelect' id='taskSelect' onChange={handleSelectTask} value={selectedTaskId || ''}>
                             <option value={''}>Выберите задачу</option>
                              {tasks.map((task) => (
                                  <option key={task.id} value={task.id}>{task.name}</option>
                             ))}
                        </select>
                        {selectedTaskId && <TaskUpload taskId={selectedTaskId} onTaskUploaded={handleTaskUploaded}/>}
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
                        {activeTab === 'tasks' && <TaskList selectedTaskId={selectedTaskId} selectedTask={selectedTask} />}
                        {activeTab === 'gantt' && <GanttChart />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;