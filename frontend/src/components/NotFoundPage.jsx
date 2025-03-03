import { Link } from 'react-router-dom';
import '../assets/styles/NotFound.css'; 

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <div>
                <h1>404</h1>
                <p>Oй! Данной страницы не существует!</p>
                <Link to="/">На главную</Link>
            </div>
        </div>
    );
};

export default NotFoundPage;