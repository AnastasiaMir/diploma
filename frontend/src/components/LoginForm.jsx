import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { error, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
             const resultAction = await dispatch(loginUser({ username: username, password: password }));
              if (loginUser.fulfilled.match(resultAction)) {
                   navigate('/dashboard');
                }
           } catch (err) {
              console.error('Error during login', err)
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? 'Loading...' : null}
            <div>
                <label>Имя пользователя:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Пароль:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                Войти
            </button>
        </form>
    );
};

export default LoginForm;