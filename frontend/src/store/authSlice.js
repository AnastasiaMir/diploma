import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';


export const loginUser = createAsyncThunk(
  'auth/login',
   async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/login', credentials);
       // Save the token when the login is successful
        localStorage.setItem('token', response.data.token);
        return response.data;
     }catch (err) {
       return rejectWithValue(err.response?.data?.message || 'Login error');
     }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
      async(userData, { rejectWithValue }) => {
           try {
              const response = await api.post('/users/register', userData);
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
    isAuthenticated: !!localStorage.getItem('token'),
    error: null,
      loading: false,
     user: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
         state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
          // In a real app, you would decode the JWT and extract user data
      })
      .addCase(loginUser.rejected, (state, action) => {
         state.loading = false;
           state.error = action.payload;
           state.isAuthenticated = false;
          state.token = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
           state.loading = false;
          state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
           state.loading = false;
          state.error = action.payload;
      })
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;