import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/styles/Auth.css';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { error, loading } = useSelector((state) => state.auth);
     const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

      const validateForm = () => {
         let isValid = true;
       if (!username.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        } else {
           setUsernameError('');
        }
         if (!password.trim()) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
           setPasswordError('');
        }
          return isValid;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
         if(!validateForm()) return;
        try {
            const resultAction = await dispatch(registerUser({ username: username, password: password }));
            if (registerUser.fulfilled.match(resultAction)) {
                 navigate('/dashboard');
            }
        } catch (err) {
             console.error('Error during registration', err);
        }
    };

    return (
           <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
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
                    Зарегистрироваться
                </button>
                <div className="link-container">
                <p>
                 <Link to="/login">Авторизоваться</Link>
                  </p>
            </div>
            </form>
            
        </div>
    );
};

export default RegisterForm;