import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const resultAction = await dispatch(registerUser({ username: username, password: password }));
        if (registerUser.fulfilled.match(resultAction)) {
            navigate('/login'); // Redirect to login page after registration
        }
    } catch (err) {
          console.error('Error during registration', err);
    }
  };

  return (
      <form onSubmit={handleRegister}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading ? 'Loading...' : null}
          <div>
              <label>Username:</label>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
          </div>
          <div>
              <label>Password:</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
          </div>
            <button type="submit" disabled={loading}>
              Register
          </button>
      </form>
  );
}

export default RegisterForm;