import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm =() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
    const { error, loading } = useSelector((state) => state.auth)
    const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
     dispatch(loginUser({ username: username, password: password}))
       .then((result) => {
        if (result.type === 'auth/login/fulfilled'){
           navigate('/dashboard')
        }
      })
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? 'Loading' : null}
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
      <button type="submit">Войти</button>
    </form>
  );
}

export default LoginForm;