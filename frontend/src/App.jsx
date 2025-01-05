
// import React, { useEffect } from 'react';
// import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
// import gantt from 'dhtmlx-gantt';

// const App = () => {
//     useEffect(() => {
//         gantt.init('gantt_here');
//         gantt.parse({
//             data: [
// { id: 1, text: 'GeeksforGeeks Course Planning', start_date: '2024-06-01', duration: 5, progress: 1 },
// { id: 2, text: 'Content Creation', start_date: '2024-06-06', duration: 15, progress: 0.5, parent: 1 },
//             ],
//         });
//     }, []);

//     return (
//         <div>
//             <h1 style={{ color: 'green', textAlign: 'center' }}>График работ по ремонут воздушных судов</h1>
//             <h3 style={{ textAlign: 'center' }}>Using dhtmlx-gantt</h3>
//             <div id="gantt_here" style={{ width: '100%', height: '400px', margin: 'auto' }}></div>
//         </div>
//     );
// };

// export default App;
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import { useSelector } from 'react-redux';
import RegisterForm from "./components/RegisterForm.jsx";
import './assets/styles/global.css';

function App() {
    const token = useSelector((state) => state.auth.token);

    return (
            <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to={ token ? "/dashboard" : "/login"}/>}/>
                    <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginForm />} />
                    <Route path="/register" element={token ? <Navigate to="/dashboard"/> :<RegisterForm/>} />
                    <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
    );
}

export default App;