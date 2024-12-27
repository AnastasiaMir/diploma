import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async () => {
        const response = await api.get('/tasks');
          return response.data
    }
);
   export const createTask = createAsyncThunk(
    'tasks/createTask',
       async (newTask) => {
        const response = await api.post('/tasks', newTask);
        return response.data
    }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
    reducers: {},
    extraReducers: (builder) => {
        builder
           .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
          .addCase(fetchTasks.fulfilled, (state, action) => {
              state.loading = false;
                state.tasks = action.payload;
            })
        .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
               state.error = action.error.message;
        })
        .addCase(createTask.pending, (state) => {
               state.loading = true;
               state.error = null;
          })
          .addCase(createTask.fulfilled, (state, action) => {
               state.loading = false;
                state.tasks.push(action.payload);
           })
           .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                 state.error = action.error.message;
           })
    }
});

export default taskSlice.reducer;