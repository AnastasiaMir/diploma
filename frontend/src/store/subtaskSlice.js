import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchSubtasks = createAsyncThunk(
    'subtasks/fetchSubtasks',
    async (task_id, { rejectWithValue }) => {
        if (task_id) {
            try {
                const response = await api.get(`/subtasks?task_id=${task_id}`);
                if (response.status >= 200 && response.status < 300) {
                    return response.data;
                }
                if (response.status === 404) {
                    console.log("No existen sub tareas con este task_id");
                    return [];
                }
                 throw new Error(`Failed to fetch subtasks with status ${response.status}`);
            } catch (error) {
                // console.error('Error fetching subtasks:', error);
                 return rejectWithValue(error.message);
            }
        }
        return [];
    }
);
export const createSubtask = createAsyncThunk(
    'subtasks/createSubtask',
    async (newSubtask) => {
         const response = await api.post('/subtasks', newSubtask);
        return response.data;
     }
);
export const updateSubtask = createAsyncThunk(
    'subtasks/updateSubtask',
    async ({ id, updatedSubtask }) => {
        const response = await api.put(`/subtasks/${id}`, updatedSubtask);
        return response.data
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
            })
          .addCase(fetchSubtasks.fulfilled, (state, action) => {
               state.loading = false;
               state.subtasks = action.payload.reduce((acc, subtask) => {
                  if(!acc[subtask.task_id]) {
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
            state.error = action.error.message;
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
           state.error = action.error.message;
      })

    }
});
export default subtaskSlice.reducer;