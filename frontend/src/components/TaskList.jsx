import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask, updateTask } from '../store/taskSlice';
import '../assets/styles/TaskList.css';
import {
  selectTasksWithTotalManpower,
  selectTasksLoading,
  selectTasksError,
} from '../store/taskSelectors';
import { fetchSubtasks, updateSubtask } from '../store/subtaskSlice';
import { selectSubtasksByTaskId } from '../store/subtaskSelectors';
import { FaTrash, FaEdit } from 'react-icons/fa';

function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasksWithTotalManpower);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
    const [editTask, setEditTask] = useState(null);
    const editInputRef = useRef(null);
     const subtasks = useSelector((state) =>
      selectSubtasksByTaskId(state, selectedTask?.id)
    );
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // State для сортировки

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
        if (selectedTask && selectedTask.id) {
            dispatch(fetchSubtasks(selectedTask.id));
        }
    }, [dispatch, selectedTask]);

    useEffect(() => {
        if (editTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editTaskId]);

    const tasksWithTotalManpower = useMemo(() => {
        if (!tasks) return [];
        return tasks.map(task => {
           const taskSubtasks = subtasks ? subtasks.filter(subtask => subtask.task_id === task.id) : [];
            const totalManpower = taskSubtasks.reduce((acc, subtask) => acc + (subtask.manpower || 0), 0);
            return { ...task, totalManpower: task.totalManpower || totalManpower };
        });
    }, [tasks, subtasks]);

  const toggleSubtasks = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
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
        if (diffInDays < 0) {
            return <span className="overdue">0</span>;
        }
    return diffInDays;
  };

    const handleSelectTask = (task) => {
           setSelectedTask(task);
        };
    const handleUpdateSubtask = async (subtask, completed) => {
     dispatch(
        updateSubtask({
              taskId: selectedTask.id,
                id: subtask.id,
                updatedSubtask: { ...subtask, completed: completed },
           })
        );
    };

    const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };


   const handleEditClick = (task) => {
        setEditTaskId(task.id);
        setEditTask({ ...task });
    };

    const handleEditTaskChange = (e) => {
        const { name, value } = e.target;
        setEditTask((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSaveTask = async (task) => {
        await dispatch(updateTask({ id: task.id, updatedTask: editTask }));
        setEditTaskId(null);
    };

    const handleCancelEdit = () => {
        setEditTaskId(null);
    };

    const sortedTasks = useMemo(() => {
    if (!tasksWithTotalManpower) return [];
    const sortableTasks = [...tasksWithTotalManpower];
    sortableTasks.sort((a, b) => {
      const { key, direction } = sortConfig;
      const multiplier = direction === 'ascending' ? 1 : -1;

      if (!key) return 0;

      if (key === 'name') {
        return multiplier * a.name.localeCompare(b.name);
      } else if (key === 'start_date' || key === 'finish_date') {
        const dateA = a[key] ? new Date(a[key]) : new Date(0);
        const dateB = b[key] ? new Date(b[key]) : new Date(0);
        return multiplier * (dateA - dateB);
      } else if (key === 'totalManpower') {
        return multiplier * (a.totalManpower - b.totalManpower);
      }
      return 0;
    });
    return sortableTasks;
  }, [tasksWithTotalManpower, sortConfig]);


    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

  return (
    <div className="task-list-container">
      {error && <p className="error-message">Error: {error}</p>}
      {loading && <p>Loading</p>}
      <table className="task-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>Наименование задачи</th>
            <th onClick={() => requestSort('start_date')}>Начало</th>
            <th onClick={() => requestSort('finish_date')}>Конец</th>
              <th onClick={() => requestSort('totalManpower')}>Сумма нормочасов</th>
            <th>Осталось дней</th>
            <th onClick={() => requestSort('is_completed')}>ВЫПОЛНЕНО</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <React.Fragment key={task.id}>
              <tr className={`${task.completed ? 'completed' : ''}`}>
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
                                        <div
                                            className="task-row"
                                            onClick={() => {
                                                toggleSubtasks(task.id);
                                                handleSelectTask(task);
                                            }}
                                        >
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
                                            value={
                                                editTask.start_date
                                                    ? editTask.start_date.split('T')[0]
                                                    : ''
                                            }
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
                                            value={
                                                editTask.finish_date
                                                    ? editTask.finish_date.split('T')[0]
                                                    : ''
                                            }
                                            onChange={handleEditTaskChange}
                                        />
                                    ) : (
                                        formatDate(task.finish_date)
                                    )}
                </td>
                <td>{task.totalManpower}</td>
                <td>{calculateDaysLeft(task.finish_date)}</td>
                <td>
                  
                </td>
                  <td>
                                    {editTaskId === task.id ? (
                                        <>
                                            <button onClick={() => handleSaveTask(task)}>
                                                Изменить
                                            </button>
                                            <button onClick={handleCancelEdit}>Отмена</button>
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit
                                                className="edit-icon"
                                                onClick={() => handleEditClick(task)}
                                            />
                                            <FaTrash
                                                className="delete-icon"
                                                onClick={() => handleDeleteTask(task.id)}
                                            />
                                        </>
                                    )}
                                </td>
              </tr>
               {expandedTaskId === task.id && subtasks && subtasks.map((subtask) => (
                                    <tr key={subtask.id} className={`subtask-row ${subtask.completed ? 'completed' : ''}`}>
                                        <td style={{ paddingLeft: '40px' }}>{subtask.name}</td>
                                          <td></td>
                                         <td></td>
                                         <td>{subtask.manpower}</td>
                                         <td></td>
                                         <td>
                                               <input
                                                   type="checkbox"
                                                    checked={subtask.completed}
                                                    onChange={() => handleUpdateSubtask(subtask, !subtask.completed)}
                                                  />
                                           </td>
                                          <td></td>
                                    </tr>
                                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;