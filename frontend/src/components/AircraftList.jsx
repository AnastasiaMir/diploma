import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAircrafts,
    deleteAircraft,
    updateAircraft,
} from "../store/aircraftSlice";
import "../assets/styles/AircraftList.css";
import {
    selectAircraftsWithTotalManpower,
    selectAircraftsLoading,
    selectAircraftsError,
} from "../store/aircraftSelectors";
import { fetchTasks, updateTask } from "../store/taskSlice";
import { selectTasksByAircraftId } from "../store/taskSelectors";
import { FaTrash, FaEdit } from "react-icons/fa";

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
    const [showModal, setShowModal] = useState(false);
    const [aircraftToDeleteId, setAircraftToDeleteId] = useState(null);
    const [editErrors, setEditErrors] = useState({});

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
        return aircrafts.map((aircraft) => {
            const aircraftTasks = tasks
                ? tasks.filter((task) => task.aircraft_id === aircraft.id)
                : [];
            const totalManpower = aircraftTasks.reduce(
                (acc, task) => acc + (task.manpower || 0),
                0
            );
            return {
                ...aircraft,
                totalManpower: aircraft.totalManpower || totalManpower,
            };
        });
    }, [aircrafts, tasks]);

    const toggleTasks = (aircraftId) => {
        setExpandedAircraftId((prevId) =>
            prevId === aircraftId ? null : aircraftId
        );
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();
    };

    const calculateDaysLeft = (finishDate) => {
        if (!finishDate) return "N/A";
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

    const handleDeleteClick = (id) => {
        setAircraftToDeleteId(id);
        setShowModal(true);
    };


    const handleConfirmDelete = (id) => {
        if (aircraftToDeleteId) {
            dispatch(deleteAircraft(aircraftToDeleteId));
            setShowModal(false);
            setAircraftToDeleteId(null)
        }
    };

    const handleCancelDelete = () => {
        setShowModal(false);
        setAircraftToDeleteId(null);
    };

    const handleEditClick = (aircraft) => {
        setEditAircraftId(aircraft.id);
        setEditAircraft({ ...aircraft });
         setEditErrors({});
    };

    const handleEditAircraftChange = (e) => {
        const { name, value } = e.target;
        setEditAircraft((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setEditErrors(prevState => {
            const newState = {...prevState};
             if (name === "name") {
                 if (!value || value.trim() === "") {
                     newState.name = "Поле не может быть пустым";
                 } else {
                     delete newState.name;
                 }
             }
             if(name === 'start_date' || name === 'finish_date'){
                const startDateInput = document.querySelector('input[name="start_date"]');
                const finishDateInput = document.querySelector('input[name="finish_date"]');
                if(startDateInput && finishDateInput){
                    const startDate = new Date(startDateInput.value);
                    const finishDate = new Date(finishDateInput.value);

                    if (startDate > finishDate) {
                        newState.date = "Дата окончания не может быть раньше даты начала";
                    } else {
                         delete newState.date;
                    }
                }
              }


            return newState;
        });
    };

    const handleSaveAircraft = async (aircraft) => {
        if (Object.keys(editErrors).length > 0) {
            return;
        }
        await dispatch(
            updateAircraft({ id: aircraft.id, updatedAircraft: editAircraft })
        );
        setEditAircraftId(null);
    };

    const handleCancelEdit = () => {
        setEditAircraftId(null);
         setEditErrors({});
    };
    const handleKeyDown = (e, aircraft) => {
        if (e.key === 'Enter') {
            handleSaveAircraft(aircraft);
        }
    };

    const sortedAircrafts = useMemo(() => {
        if (!aircraftsWithTotalManpower) return [];
        const sortableAircrafts = [...aircraftsWithTotalManpower];
        sortableAircrafts.sort((a, b) => {
            const { key, direction } = sortConfig;
            const multiplier = direction === "ascending" ? 1 : -1;

            if (!key) return 0;

            if (key === "name") {
                return multiplier * a.name.localeCompare(b.name);
            } else if (key === "start_date" || key === "finish_date") {
                const dateA = a[key] ? new Date(a[key]) : new Date(0);
                const dateB = b[key] ? new Date(b[key]) : new Date(0);
                return multiplier * (dateA - dateB);
            } else if (key === "totalManpower") {
                return multiplier * (a.totalManpower - b.totalManpower);
            }
            return 0;
        });
        return sortableAircrafts;
    }, [aircraftsWithTotalManpower, sortConfig]);

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
        setSelectedAircraft(null); // можно удалить, закрываем перечень задач если пользователь нажал на сортировку при открытом списке
    };

    return (
        <div className="ac-list-container">
            {error && <p className="error-message">Error: {error}</p>}
            {loading && <p>Loading</p>}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Действительно удалить данные о ВС?</p>
                        <div className="modal-actions">
                            <button className="btn btn-modal" onClick={handleConfirmDelete}>
                                Да
                            </button>
                            <button className="btn btn-modal" onClick={handleCancelDelete}>
                                Нет
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <table className="ac-table">
                <thead>
                <tr>
                    <th onClick={() => requestSort("name")}>Бортовой номер ВС</th>
                    <th onClick={() => requestSort("start_date")}>Дата начала работ</th>
                    <th onClick={() => requestSort("finish_date")}>
                        Дата окончания работ
                    </th>
                    <th onClick={() => requestSort("totalManpower")}>Трудоемкость</th>
                    <th>Осталось дней</th>
                    <th onClick={() => requestSort("is_completed")}>Выполнено</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {sortedAircrafts.map((ac) => (
                    <React.Fragment key={ac.id}>
                        <tr className={`${ac.completed ? "completed" : ""}`}>
                            <td>
                                {editAircraftId === ac.id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="name"
                                            ref={editInputRef}
                                            value={editAircraft.name}
                                            onChange={handleEditAircraftChange}
                                            className={editErrors.name ? "error-input" : ""}
                                            onKeyDown={(e) => handleKeyDown(e, ac)}
                                        />
                                        {editErrors.name && (
                                            <span className="error-message">{editErrors.name}</span>
                                        )}
                                    </div>
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
                                  <div >
                                      <input
                                        type="date"
                                        name="start_date"
                                        value={
                                          editAircraft.start_date
                                            ? editAircraft.start_date.split("T")[0]
                                            : ""
                                        }
                                        onKeyDown={(e) => handleKeyDown(e, ac)}
                                         onChange={handleEditAircraftChange}
                                        className={editErrors.date ? "error-input" : ""}
                                    />
                                 </div>
                                ) : (
                                    formatDate(ac.start_date)
                                )}
                            </td>
                            <td>
                                {editAircraftId === ac.id ? (
                                   <div>
                                        <input
                                            type="date"
                                            name="finish_date"
                                            value={
                                                editAircraft.finish_date
                                                    ? editAircraft.finish_date.split("T")[0]
                                                    : ""
                                            }
                                            onChange={handleEditAircraftChange}
                                            className={editErrors.date ? "error-input" : ""}
                                            onKeyDown={(e) => handleKeyDown(e, ac)}
                                        />
                                        {editErrors.date && (
                                            <span className="error-message">{editErrors.date}</span>
                                        )}
                                    </div>
                                ) : (
                                    formatDate(ac.finish_date)
                                )}
                            </td>
                            <td>{ac.totalManpower}</td>
                            <td>{calculateDaysLeft(ac.finish_date)}</td>
                            <td></td>
                            <td className="completed">
                                {editAircraftId === ac.id ? (
                                    <>
                                        <button
                                            className="btn-change"
                                            onClick={() => handleSaveAircraft(ac)}
                                            disabled={Object.keys(editErrors).length > 0}
                                        >
                                            Изменить
                                        </button>
                                        <button className="btn-change" onClick={handleCancelEdit}>
                                            Отмена
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <FaEdit
                                            className="edit-icon"
                                            onClick={() => handleEditClick(ac)}
                                        />
                                        <FaTrash
                                            className="delete-icon"
                                             onClick={() => handleDeleteClick(ac.id)}
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                        {expandedAircraftId === ac.id &&
                        tasks &&
                        tasks.map((task) => (
                            <tr
                                key={task.id}
                                className={`task-row ${task.completed ? "completed" : ""}`}
                            >
                                <td style={{ paddingLeft: "40px" }}>{task.name}</td>
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
};

export default AircraftList;