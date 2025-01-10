import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/tasks';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (aircraftId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/aircrafts/${aircraftId}/tasks`);  
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            }
            if (response.status === 404) {
                console.log("No tasks found for this aircraft");
                return []; 
            }
            throw new Error(`Failed to fetch tasks with status ${response.status}`);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (newTask, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}`, newTask);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Create task error');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, updatedTask }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, updatedTask);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Update task error');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/${id}`);
            return id;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Delete task error');
        }
    }
);

export const addTasks = createAsyncThunk(
    'tasks/addTasks',
     async ({ aircraftId, tasks }, { rejectWithValue }) => {
        try {
            return { aircraftId, tasks }
        } catch (error) {
           return rejectWithValue(error.response.data.message);
       }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.reduce((acc, task) => {
                    if (!acc[task.aircraft_id]) {
                        acc[task.aircraft_id] = []
                    }
                    acc[task.aircraft_id].push(task)
                    return acc
                }, {})
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                const newTask = action.payload;
                if (!state.tasks[newTask.aircraft_id]) {
                    state.tasks[newTask.aircraft_id] = [];
                }
                state.tasks[newTask.aircraft_id].push(newTask);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;
                if (state.tasks[updatedTask.aircraft_id]) {
                    const index = state.tasks[updatedTask.aircraft_id].findIndex((task) => task.id === updatedTask.id);
                    if (index !== -1) {
                        state.tasks[updatedTask.aircraft_id][index] = updatedTask;
                    }
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
             })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                const deletedTask = action.payload;
                 Object.keys(state.tasks).forEach(key => {
                    state.tasks[key] = state.tasks[key].filter(task => task.id !== deletedTask);
                  });
            })
            .addCase(deleteTask.rejected, (state, action) => {
                 state.loading = false;
                 state.error = action.payload;
            })
            .addCase(addTasks.fulfilled, (state, action) => {
                state.loading = false;
               const { aircraftId, tasks } = action.payload;
                if (!state.tasks[aircraftId]) {
                    state.tasks[aircraftId] = [];
                }
                  state.tasks[aircraftId] = [...state.tasks[aircraftId], ...tasks];
            });
    },
});

export default taskSlice.reducer;