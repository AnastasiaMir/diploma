import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import CreateAircraft from "./CreateAircraft";
import AircraftList from "./AircraftList";
import "../assets/styles/Dashboard.css";
import GanttChart from "./GanttChart";
import TaskUpload from "./TaskUpload";
import { selectAircraftsForGantt } from "../store/aircraftSelectors";
import { fetchAircrafts } from "../store/aircraftSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("aircrafts");
  const aircraftsForGantt = useSelector(selectAircraftsForGantt);
  const aircrafts = useSelector((state) => state.aircrafts.aircrafts);
  const [selectedAircraftId, setSelectedAircraftId] = useState(null);
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (token) {
      dispatch(fetchAircrafts({ signal }));
    } else {
      navigate("/login");
    }
    return () => controller.abort();
  }, [dispatch, navigate, token]);

  // useEffect(() => {
  //   if (token) {
  //     dispatch(fetchAircrafts());
  //   } else {
  //     navigate("/login");
  //   }
  // }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSelectAircraft = (e) => {
    const aircraftId = e.target.value;
    setSelectedAircraftId(aircraftId);
    const selectedAircraft = aircrafts.find(
      (ac) => ac.id === parseInt(aircraftId)
    );
    setSelectedAircraft(selectedAircraft);
  };

  const handleAircraftUploaded = () => {
    dispatch(fetchAircrafts());
  };
  if (!token) {
    return <p>Пожалуйста, войдите в личный кабинет</p>;
  }

  return (
    <div className="main-container">
      <div className="dashboard-header">
        <div className="div-company-name">
          <h2 className="company-name">ООО "ИнтерТех"</h2>
          <p className="company-name">Корпоративный портал</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Выход
        </button>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-menu">
          <h3>Меню работ</h3>
          <CreateAircraft />
          <div className="select-task-container">
            <label htmlFor="taskSelect">Выберите бортовой номер ВС:</label>
            <select
              name="taskSelect"
              id="taskSelect"
              onChange={handleSelectAircraft}
              value={selectedAircraftId || ""}
            >
              <option value={""}>Выберите бортовой номер ВС: </option>
              {aircrafts.map((ac) => (
                <option key={ac.id} value={ac.id}>
                  {ac.name}
                </option>
              ))}
            </select>
            {selectedAircraftId && (
              <TaskUpload
                aircraftId={selectedAircraftId}
                onAircraftUploaded={handleAircraftUploaded}
              />
            )}
          </div>
        </div>
        <div className="dashboard-content">
          <div className="tab-buttons">
            <button
              className={activeTab === "aircrafts" ? "active" : ""}
              onClick={() => setActiveTab("aircrafts")}
            >
              Перечень ВС
            </button>
            <button
              className={activeTab === "gantt" ? "active" : ""}
              onClick={() => setActiveTab("gantt")}
            >
              График простоя ВС
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "aircrafts" && <AircraftList />}
            {activeTab === "gantt" && (
              <GanttChart aircrafts={aircraftsForGantt} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
