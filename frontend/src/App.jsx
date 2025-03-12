
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import { useSelector } from 'react-redux';
import RegisterForm from "./components/RegisterForm.jsx";
import './assets/styles/global.css';

const App = () => {

    const { token } = useSelector((state) => state.auth);
    console.log(token)
    // const [isTokenChecked, setIsTokenChecked] = useState(false); 

    // useEffect(() => {
    //     setIsTokenChecked(true);
    // }, []);

    // if (!isTokenChecked) {
    //     return <div>Loading...</div>;
    // }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"}/>}/>
                <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginForm />} />
                <Route path="/register" element={token ? <Navigate to="/dashboard"/> :<RegisterForm/>} />
                <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

