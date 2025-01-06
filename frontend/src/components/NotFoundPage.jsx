import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/NotFound.css'; 

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <div>
                <h1>404</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <Link to="/">Go Back Home</Link>
            </div>
        </div>
    );
};

export default NotFoundPage;