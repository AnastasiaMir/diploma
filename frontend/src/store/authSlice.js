import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const AUTH_URL = '/api/auth';

export const loginUser = createAsyncThunk(
  '/api/auth/login',
   async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post(`${AUTH_URL}/login`, credentials);
       // Save the token when the login is successful
        localStorage.setItem('token', response.data.token);
        return response.data.token;
     }catch (err) {
       return rejectWithValue(err.response?.data?.message || 'Login error');
     }
    }
);

export const registerUser = createAsyncThunk(
    '/api/auth/register',
      async(userData, { rejectWithValue }) => {
           try {
              const response = await api.post(`${AUTH_URL}/register`, userData);
               return response.data;
            }catch(err){
                return rejectWithValue(err.response?.data?.message || 'Registration error');
            }
      }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    error: null,
      loading: false,
     user: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
    },
       clearError: (state) => {
            state.error = null;
        }
  },
   extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
         state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
         state.loading = false;
           state.error = action.payload;
          state.token = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
           state.loading = false;
          state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
           state.loading = false;
          state.error = action.payload;
      })
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;