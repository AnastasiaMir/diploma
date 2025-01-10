
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/Auth.css'; 

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
      const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const dispatch = useDispatch();
    const { error, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();


     const validateForm = () => {
         let isValid = true;
       if (!username.trim()) {
            setUsernameError('Введите имя пользователя');
            isValid = false;
        } else {
           setUsernameError('');
        }
         if (!password.trim()) {
            setPasswordError('Введите пароль');
            isValid = false;
        } else {
           setPasswordError('');
        }
          return isValid;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if(!validateForm()) return;
        try {
           const resultAction = await dispatch(loginUser({ username: username, password: password }));
             if (loginUser.fulfilled.match(resultAction)) {
                navigate('/dashboard');
           }
       } catch (err) {
            console.error('Error during login', err)
      }
    };
    const getErrorMessage = () => {
       if (error) {
            if (error.includes('User not found')) {
                 return "Данное имя пользователя не существует. Пожалуйста введите корректное имя или зарегистрируйтесь";
            } else if (error.includes('Incorrect password')) {
                return "Пароль неверный. Пожалуйста введите корректный пароль";
            } else {
                 return error
            }
        }
       return '';

    }

    return (
          <div className="auth-container">
        <form className="auth-form" onSubmit={handleLogin}>
            <h2>Login</h2>
             {error && <p className="error-message">{getErrorMessage()}</p>}
            <div>
                <label>Имя пользователя:</label>
                <input
                    type="text"
                   value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     onBlur={() => validateForm()}
                />
                 {usernameError && <p className="error-message">{usernameError}</p>}
            </div>
            <div>
                <label>Пароль:</label>
                <input
                    type="password"
                     value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => validateForm()}
                 />
                  {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn">
                Login
            </button>
             <div className="link-container">
                <p>
                     У Вас нет аккаунта?
                 <Link to="/register">Зарегистрироваться</Link>
                  </p>
            </div>
        </form>
        </div>
    );
};

export default LoginForm;