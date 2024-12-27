import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchSubtasks = createAsyncThunk(
  'subtasks/fetchSubtasks',
  async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/subtasks`);
    return response.data;
  }
);

export const createSubtask = createAsyncThunk(
    'subtasks/createSubtask',
      async (newSubtask) => {
          const response = await api.post('/subtasks', newSubtask);
            return response.data
      }
);
export const updateSubtask = createAsyncThunk(
   'subtasks/updateSubtask',
    async ({id, updatedSubtask}) => {
        const response = await api.put(`/subtasks/${id}`, updatedSubtask);
          return response.data
   }
);
export const deleteSubtask = createAsyncThunk(
   'subtasks/deleteSubtask',
     async (id) => {
          await api.delete(`/subtasks/${id}`);
            return id;
     }
);

const subtaskSlice = createSlice({
  name: 'subtasks',
  initialState: {
    subtasks: {}, // subtasks grouped by task id, example: { 1: [ {...}, {...}] , 2: [ {...}, {...}] }
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
          const taskId = action.meta.arg // we get the id of the task here
          state.subtasks[taskId] = action.payload; // Store subtasks by task id
       })
       .addCase(fetchSubtasks.rejected, (state, action) => {
           state.loading = false;
           state.error = action.error.message;
       })
      .addCase(createSubtask.pending, (state) => {
            state.loading = true;
             state.error = null;
        })
     .addCase(createSubtask.fulfilled, (state, action) => {
          state.loading = false;
           const taskId = action.payload.task_id;
            if (!state.subtasks[taskId]){
                state.subtasks[taskId] = [];
            }
           state.subtasks[taskId].push(action.payload);
       })
       .addCase(createSubtask.rejected, (state, action) => {
            state.loading = false;
             state.error = action.error.message
        })
      .addCase(updateSubtask.pending, (state) => {
             state.loading = true;
             state.error = null;
        })
    .addCase(updateSubtask.fulfilled, (state, action) => {
            state.loading = false;
        const updatedSubtask = action.payload;
         const taskId = updatedSubtask.task_id;
          if (state.subtasks[taskId]) {
                 state.subtasks[taskId] = state.subtasks[taskId].map(subtask =>
                    subtask.id === updatedSubtask.id ? updatedSubtask : subtask);
               }
      })
     .addCase(updateSubtask.rejected, (state, action) => {
           state.loading = false;
            state.error = action.error.message;
       })
     .addCase(deleteSubtask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(deleteSubtask.fulfilled, (state, action) => {
         state.loading = false;
         const idToDelete = action.payload
           for (const taskId in state.subtasks){
               state.subtasks[taskId] = state.subtasks[taskId].filter(subtask => subtask.id !== idToDelete);
            }
        })
      .addCase(deleteSubtask.rejected, (state, action) => {
            state.loading = false;
           state.error = action.error.message;
     })
    }
});

export default subtaskSlice.reducer;