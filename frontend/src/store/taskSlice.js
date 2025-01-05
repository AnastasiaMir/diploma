import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/tasks';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (task, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}`, task);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
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
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk для добавления одной подзадачи
export const addSubtask = createAsyncThunk(
    'tasks/addSubtask',
    async ({ taskId, subtaskData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}/${taskId}/subtasks`, subtaskData);
            return { taskId, subtask: response.data };
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk для добавления нескольких подзадач (bulk)
export const addBulkSubtasks = createAsyncThunk(
    'tasks/addBulkSubtasks',
     async ({ taskId, subtasks }, { rejectWithValue }) => {
        try {
            await api.post(`${API_URL}/${taskId}/subtasks/bulk`, subtasks);
            return { taskId, subtasks };
        } catch (error) {
           return rejectWithValue(error.response.data.message);
       }
    }
);


const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.map(task => ({
                    ...task,
                   subtasks: task.subtasks || [],
                }));
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
                state.error = action.payload;
            })
              .addCase(addSubtask.fulfilled, (state, action) => {
                const { taskId, subtask } = action.payload;
                const taskIndex = state.tasks.findIndex(task => task.id === Number(taskId));
                if(taskIndex !== -1) {
                    state.tasks[taskIndex].subtasks = [...state.tasks[taskIndex].subtasks, subtask]
                }
            })
            .addCase(addBulkSubtasks.fulfilled, (state, action) => {
                 const { taskId, subtasks } = action.payload;
                   const taskIndex = state.tasks.findIndex(task => task.id === Number(taskId));
                    if (taskIndex !== -1) {
                        state.tasks[taskIndex].subtasks = [...state.tasks[taskIndex].subtasks, ...subtasks]
                     }
            });
    },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;