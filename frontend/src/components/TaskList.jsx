import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask, updateTask } from '../store/taskSlice';
import '../assets/styles/TaskList.css';
import { selectTasksWithTotalManpower, selectTasksLoading, selectTasksError } from '../store/taskSelectors';
import {fetchSubtasks, updateSubtask} from "../store/subtaskSlice";
import { selectSubtasksByTaskId } from '../store/subtaskSelectors';
import { FaTrash, FaEdit } from 'react-icons/fa';


function TaskList() {
    const dispatch = useDispatch();
    const tasks = useSelector(selectTasksWithTotalManpower);
    const loading = useSelector(selectTasksLoading);
    const error = useSelector(selectTasksError);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null)
    const subtasks = useSelector((state) => selectSubtasksByTaskId(state, selectedTask?.id));
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTask, setEditTask] = useState(null);
    const editInputRef = useRef(null);


    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);
    useEffect(() => {
        if (selectedTask && selectedTask.id) {
          console.log("fetchSubtasks, task_id: ", selectedTask.id);
          dispatch(fetchSubtasks(selectedTask.id));
        }
    }, [dispatch, selectedTask]);
     useEffect(() => {
        if (editTaskId && editInputRef.current) {
           editInputRef.current.focus();
        }
     }, [editTaskId]);

    const toggleSubtasks = (taskId) => {
        setExpandedTaskId(prevId => prevId === taskId ? null : taskId);
      };
    const formatDate = (date) => {
      if (!date) return 'N/A';
       return new Date(date).toLocaleDateString();
        };
       const calculateDaysLeft = (finishDate) => {
        if (!finishDate) return 'N/A';
        const finish = new Date(finishDate);
        const now = new Date();
        const diffInTime = finish.getTime() - now.getTime();
        const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        if(diffInDays < 0){
            return <span className="overdue">0</span>
        }
        return diffInDays;
      };
    const handleSelectTask = (task) => {
     setSelectedTask(task)
    }
     const handleUpdateSubtask = async (subtask, completed) => {
        dispatch(updateSubtask({ id: subtask.id, updatedSubtask: { ...subtask, completed: completed } }));
    };
      const handleUpdateTask = async (task, completed) => {
        dispatch(updateTask({ id: task.id, updatedTask: { ...task, completed: completed } }));
    };

    const handleDeleteTask = (id) => {
         dispatch(deleteTask(id));
    }
    const handleEditClick = (task) => {
         setEditTaskId(task.id);
        setEditTask({ ...task });
      };
    const handleEditTaskChange = (e) => {
          const { name, value } = e.target;
           setEditTask(prevState => ({
            ...prevState,
            [name]: value
        }));
      };

     const handleSaveTask = async (task) => {
          await dispatch(updateTask({ id: task.id, updatedTask: editTask }));
          setEditTaskId(null);
    };
     const handleCancelEdit = () => {
        setEditTaskId(null);
    };

    return (
        <div className="task-list-container">
            {error && <p className='error-message'>Error: {error}</p>}
            {loading && <p>Loading</p>}
            <table className="task-table">
                <thead>
                    <tr>
                        <th>Наименование задачи</th>
                        <th>начало</th>
                        <th>конец</th>
                        <th>сумма нормочасов</th>
                        <th>Осталось дней</th>
                        <th>ВЫПОЛНЕНО</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <React.Fragment key={task.id}>
                            <tr  className={`${task.completed ? 'completed' : ''}`}>
                                  <td>
                                  {editTaskId === task.id ? (
                                            <input
                                                type="text"
                                                name="name"
                                                ref={editInputRef}
                                                value={editTask.name}
                                                onChange={handleEditTaskChange}
                                            />
                                        ) : (
                                        <div className="task-row" onClick={() => {
                                              toggleSubtasks(task.id);
                                              handleSelectTask(task)
                                           }
                                        }>
                                                <span className="task-name">
                                                     <strong>{task.name}</strong>
                                                </span>
                                            </div>
                                    )}

                                </td>
                                <td>
                                  {editTaskId === task.id ? (
                                           <input
                                             type="date"
                                             name="start_date"
                                              value={editTask.start_date ? editTask.start_date.split("T")[0] : ""}
                                              onChange={handleEditTaskChange}
                                           />
                                         ) : (
                                        formatDate(task.start_date)
                                     )}
                                </td>
                                <td>
                                      {editTaskId === task.id ? (
                                           <input
                                             type="date"
                                             name="finish_date"
                                             value={editTask.finish_date ? editTask.finish_date.split("T")[0] : ""}
                                            onChange={handleEditTaskChange}
                                            />
                                         ) : (
                                         formatDate(task.finish_date)
                                        )}
                                </td>
                                <td>
                                      {task.totalManpower}
                                </td>
                                <td >{calculateDaysLeft(task.finish_date)}</td>
                                 <td> <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleUpdateTask(task, !task.completed)}
                                    /></td>
                                    <td>
                                    {editTaskId === task.id ? (
                                         <>
                                           <button onClick={() => handleSaveTask(task)}>Guardar</button>
                                             <button onClick={handleCancelEdit}>Cancelar</button>
                                         </>
                                     ) : (
                                      <>
                                       <FaEdit className='edit-icon' onClick={() => handleEditClick(task)} />
                                        <FaTrash className='delete-icon' onClick={() => handleDeleteTask(task.id)} />
                                     </>
                                      )}
                                    </td>
                            </tr>
                            {expandedTaskId === task.id &&
                                subtasks?.map((subtask) => (
                                        <tr key={subtask.id} className={`subtask-row ${subtask.completed ? 'completed' : ''}`}>
                                          <td>{subtask.name}</td>
                                            <td></td>
                                            <td></td>
                                            <td>{subtask.manpower}</td>
                                            <td></td>
                                          <td> <input
                                                type="checkbox"
                                                checked={subtask.completed}
                                                onChange={() => handleUpdateSubtask(subtask, !subtask.completed)}
                                            /></td>
                                        </tr>
                                ))
                            }
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskList;