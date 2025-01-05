import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import '../assets/styles/Dashboard.css';
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token)
   const handleLogout = () => {
       dispatch(logout());
        navigate('/login');
   };

    return (
      <header className="dashboard-header">
        <nav>
          <ul className="dashboard-nav">
            {token && (
                <>
                    <li className="dashboard-nav-item">
                        <Link to="/" className="dashboard-nav-link">
                            Tasks
                        </Link>
                    </li>
                    <li className="dashboard-nav-item">
                        <Link to="/gantt" className="dashboard-nav-link">
                            Gantt Chart
                        </Link>
                   </li>
                </>
            )}
          </ul>
          {token &&
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          }
        </nav>
      </header>
    );
};

export default Header;