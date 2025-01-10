import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAircrafts, deleteAircraft, updateAircraft } from '../store/aircraftSlice';
import '../assets/styles/AircraftList.css';
import {
  selectAircraftsWithTotalManpower,
  selectAircraftsLoading,
  selectAircraftsError,
} from '../store/aircraftSelectors';
import { fetchTasks, updateTask } from '../store/taskSlice';
import { selectTasksByAircraftId } from '../store/taskSelectors';
import { FaTrash, FaEdit } from 'react-icons/fa';

const AircraftList = () => {
  const dispatch = useDispatch();
  const aircrafts = useSelector(selectAircraftsWithTotalManpower);
  const loading = useSelector(selectAircraftsLoading);
  const error = useSelector(selectAircraftsError);
  const [expandedAircraftId, setExpandedAircraftId] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [editAircraftId, setEditAircraftId] = useState(null);
    const [editAircraft, setEditAircraft] = useState(null);
    const editInputRef = useRef(null);
     const tasks = useSelector((state) =>
      selectTasksByAircraftId(state, selectedAircraft?.id)
    );
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); 
  useEffect(() => {
    dispatch(fetchAircrafts());
  }, [dispatch]);

  useEffect(() => {
        if (selectedAircraft && selectedAircraft.id) {
            dispatch(fetchTasks(selectedAircraft.id));
        }
    }, [dispatch, selectedAircraft]);

    useEffect(() => {
        if (editAircraftId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editAircraftId]);

    const aircraftsWithTotalManpower = useMemo(() => {
        if (!aircrafts) return [];
        return aircrafts.map(aircraft => {
           const aircraftTasks = tasks ? tasks.filter(task => task.aircraft_id === aircraft.id) : [];
            const totalManpower = aircraftTasks.reduce((acc, task) => acc + (task.manpower || 0), 0);
            return { ...aircraft, totalManpower: aircraft.totalManpower || totalManpower };
        });
    }, [aircrafts, tasks]);

  const toggleTasks = (aircraftId) => {
    setExpandedAircraftId((prevId) => (prevId === aircraftId ? null : aircraftId));
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

    const handleSelectAircraft = (aircraft) => {
           setSelectedAircraft(aircraft);
        };
    const handleUpdateTask = async (task, completed) => {
     dispatch(
        updateTask({
              aircraftId: selectedAircraft.id,
                id: task.id,
                updatedTask: { ...task, completed: completed },
           })
        );
    };

    const handleDeleteAircraft = (id) => {
    dispatch(deleteAircraft(id));
  };


   const handleEditClick = (aircraft) => {
        setEditAircraftId(aircraft.id);
        setEditAircraft({ ...aircraft });
    };

    const handleEditAircraftChange = (e) => {
        const { name, value } = e.target;
        setEditAircraft((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSaveAircraft = async (aircraft) => {
        await dispatch(updateAircraft({ id: aircraft.id, updatedAircraft: editAircraft }));
        setEditAircraftId(null);
    };

    const handleCancelEdit = () => {
        setEditAircraftId(null);
    };

    const sortedAircrafts = useMemo(() => {
    if (!aircraftsWithTotalManpower) return [];
    const sortableAircrafts = [...aircraftsWithTotalManpower];
    sortableAircrafts.sort((a, b) => {
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
    return sortableAircrafts;
  }, [aircraftsWithTotalManpower, sortConfig]);


    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

  return (
    <div className="ac-list-container">
      {error && <p className="error-message">Error: {error}</p>}
      {loading && <p>Loading</p>}
      <table className="ac-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>Бортовой номер ВС</th>
            <th onClick={() => requestSort('start_date')}>Дата начала работ</th>
            <th onClick={() => requestSort('finish_date')}>Дата окончания работ</th>
              <th onClick={() => requestSort('totalManpower')}>Трудоемкость</th>
            <th>Осталось дней</th>
            <th onClick={() => requestSort('is_completed')}>Выполнено</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedAircrafts.map((ac) => (
            <React.Fragment key={ac.id}>
              <tr className={`${ac.completed ? 'completed' : ''}`}>
                <td>
                    {editAircraftId === ac.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            ref={editInputRef}
                                            value={editAircraft.name}
                                            onChange={handleEditAircraftChange}
                                        />
                                    ) : (
                                        <div
                                            className="ac-row"
                                            onClick={() => {
                                                toggleTasks(ac.id);
                                                handleSelectAircraft(ac);
                                            }}
                                        >
                                            <span className="ac-name">
                                                <strong>{ac.name}</strong>
                                            </span>
                                        </div>
                                    )}
                </td>
                <td>
                    {editAircraftId === ac.id ? (
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={
                                                editAircraft.start_date
                                                    ? editAircraft.start_date.split('T')[0]
                                                    : ''
                                            }
                                            onChange={handleEditAircraftChange}
                                        />
                                    ) : (
                                        formatDate(ac.start_date)
                                    )}
                </td>
                <td>
                    {editAircraftId === ac.id ? (
                                        <input
                                            type="date"
                                            name="finish_date"
                                            value={
                                                editAircraft.finish_date
                                                    ? editAircraft.finish_date.split('T')[0]
                                                    : ''
                                            }
                                            onChange={handleEditAircraftChange}
                                        />
                                    ) : (
                                        formatDate(ac.finish_date)
                                    )}
                </td>
                <td>{ac.totalManpower}</td>
                <td>{calculateDaysLeft(ac.finish_date)}</td>
                <td>
                  
                </td>
                  <td className="completed">
                                    {editAircraftId === ac.id ? (
                                        <>
                                            <button className='btn-change' onClick={() => handleSaveAircraft(ac)}>
                                                Изменить
                                            </button>
                                            <button className='btn-change' onClick={handleCancelEdit}>Отмена</button>
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit
                                                className="edit-icon"
                                                onClick={() => handleEditClick(ac)}
                                            />
                                            <FaTrash
                                                className="delete-icon"
                                                onClick={() => handleDeleteAircraft(ac.id)}
                                            />
                                        </>
                                    )}
                                </td>
              </tr>
               {expandedAircraftId === ac.id && tasks && tasks.map((task) => (
                                    <tr key={task.id} className={`task-row ${task.completed ? 'completed' : ''}`}>
                                        <td style={{ paddingLeft: '40px' }}>{task.name}</td>
                                          <td></td>
                                         <td></td>
                                         <td>{task.manpower}</td>
                                         <td></td>
                                         <td>
                                               <input
                                                   type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => handleUpdateTask(task, !task.completed)}
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

export default AircraftList;