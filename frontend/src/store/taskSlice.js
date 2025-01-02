import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async () => {
      try {
        const response = await api.get('/tasks');
        if(response.status >= 200 && response.status < 300){
          return response.data
        }
         throw new Error(`Failed to fetch tasks with status ${response.status}`);
       } catch(error) {
            console.error("Error fetching tasks", error);
         throw error
       }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (newTask) => {
        const response = await api.post('/tasks', newTask);
        return response.data;
    }
);
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, updatedTask }) => {
        const response = await api.put(`/tasks/${id}`, updatedTask);
        return response.data
    }
);
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id) => {
       await api.delete(`/tasks/${id}`);
        return id;
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
                state.tasks = action.payload
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
                state.tasks.push(action.payload)
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message
            })
           .addCase(updateTask.pending, (state) => {
             state.loading = true;
                state.error = null;
          })
         .addCase(updateTask.fulfilled, (state, action) => {
             state.loading = false;
             const updatedTask = action.payload;
           const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
             if (index !== -1) {
               state.tasks[index] = updatedTask;
                }
          })
          .addCase(updateTask.rejected, (state, action) => {
             state.loading = false;
               state.error = action.error.message;
        })
           .addCase(deleteTask.pending, (state) => {
             state.loading = true;
                state.error = null;
          })
           .addCase(deleteTask.fulfilled, (state, action) => {
             state.loading = false;
             const id = action.payload;
           state.tasks = state.tasks.filter((task) => task.id !== id);
          })
           .addCase(deleteTask.rejected, (state, action) => {
             state.loading = false;
             state.error = action.error.message;
        })

    }
});

export const selectTasks = (state) => state.tasks.tasks;

export default taskSlice.reducer;