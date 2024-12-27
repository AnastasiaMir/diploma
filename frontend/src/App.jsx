
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
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import store from './store';
import RegisterForm from "./components/RegisterForm.jsx";


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm/>} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;