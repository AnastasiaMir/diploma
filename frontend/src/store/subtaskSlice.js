import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/subtasks';

export const fetchSubtasks = createAsyncThunk(
    'subtasks/fetchSubtasks',
    async (taskId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/tasks/${taskId}/subtasks`);  // <-- ИЗМЕНЕНИЕ: правильный URL
            if (response.status >= 200 && response.status < 300) {
                return response.data;
            }
            if (response.status === 404) {
                console.log("No subtasks found for this task.");
                return []; // Возвращаем пустой массив, если нет подзадач
            }
            throw new Error(`Failed to fetch subtasks with status ${response.status}`);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createSubtask = createAsyncThunk(
    'subtasks/createSubtask',
    async (newSubtask, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}`, newSubtask);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Create subtask error');
        }
    }
);

export const updateSubtask = createAsyncThunk(
    'subtasks/updateSubtask',
    async ({ id, updatedSubtask }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, updatedSubtask);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Update subtask error');
        }
    }
);

export const deleteSubtask = createAsyncThunk(
    'subtasks/deleteSubtask',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/${id}`);
            return id;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Delete subtask error');
        }
    }
);
// Async thunk для добавления нескольких подзадач (bulk)
export const addBulkSubtasks = createAsyncThunk(
    'subtasks/addBulkSubtasks',
     async ({ taskId, subtasks }, { rejectWithValue }) => {
        try {
            return { taskId, subtasks }
        } catch (error) {
           return rejectWithValue(error.response.data.message);
       }
    }
);

const subtaskSlice = createSlice({
    name: 'subtasks',
    initialState: {
        subtasks: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubtasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubtasks.fulfilled, (state, action) => {
                state.loading = false;
                state.subtasks = action.payload.reduce((acc, subtask) => {
                    if (!acc[subtask.task_id]) {
                        acc[subtask.task_id] = []
                    }
                    acc[subtask.task_id].push(subtask)
                    return acc
                }, {})
            })
            .addCase(fetchSubtasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createSubtask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubtask.fulfilled, (state, action) => {
                state.loading = false;
                const newSubtask = action.payload;
                if (!state.subtasks[newSubtask.task_id]) {
                    state.subtasks[newSubtask.task_id] = [];
                }
                state.subtasks[newSubtask.task_id].push(newSubtask);
            })
            .addCase(createSubtask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(updateSubtask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubtask.fulfilled, (state, action) => {
                state.loading = false;
                const updatedSubtask = action.payload;
                if (state.subtasks[updatedSubtask.task_id]) {
                    const index = state.subtasks[updatedSubtask.task_id].findIndex((subtask) => subtask.id === updatedSubtask.id);
                    if (index !== -1) {
                        state.subtasks[updatedSubtask.task_id][index] = updatedSubtask;
                    }
                }
            })
            .addCase(updateSubtask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(deleteSubtask.pending, (state) => {
                state.loading = true;
                state.error = null;
             })
            .addCase(deleteSubtask.fulfilled, (state, action) => {
                state.loading = false;
                const deletedSubtask = action.payload;
                 Object.keys(state.subtasks).forEach(key => {
                    state.subtasks[key] = state.subtasks[key].filter(subtask => subtask.id !== deletedSubtask);
                  });
            })
            .addCase(deleteSubtask.rejected, (state, action) => {
                 state.loading = false;
                 state.error = action.payload;
            })
            .addCase(addBulkSubtasks.fulfilled, (state, action) => {
                state.loading = false;
               const { taskId, subtasks } = action.payload;
                if (!state.subtasks[taskId]) {
                    state.subtasks[taskId] = [];
                }
                  state.subtasks[taskId] = [...state.subtasks[taskId], ...subtasks];
            });
    },
});

export default subtaskSlice.reducer;