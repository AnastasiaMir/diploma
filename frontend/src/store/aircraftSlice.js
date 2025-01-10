import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/aircrafts';

export const fetchAircrafts = createAsyncThunk(
    'aircrafts/fetchAircrafts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const addAircraft = createAsyncThunk(
    'aircrafts/addAircraft',
    async (aircraft, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_URL}`, aircraft);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const deleteAircraft = createAsyncThunk(
    'aircrafts/deleteAircraft',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_URL}/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e.response.data.message);
        }
    }
);

export const updateAircraft = createAsyncThunk(
    'aircrafts/updateAircraft',
    async ({ id, updatedAircraft }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, updatedAircraft);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


export const addTasks = createAsyncThunk(
    'aircrafts/addTasks',
     async ({ aircraftId, tasks }, { rejectWithValue }) => {
        try {
            await api.post(`${API_URL}/${aircraftId}/tasks/bulk`, tasks);
            return { aircraftId, tasks };
        } catch (error) {
           return rejectWithValue(error.response.data.message);
       }
    }
);


const aircraftSlice = createSlice({
    name: 'aircrafts',
    initialState: {
        aircrafts: [],
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
            .addCase(fetchAircrafts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAircrafts.fulfilled, (state, action) => {
                state.loading = false;
                state.aircrafts = action.payload.map(aircraft => ({
                    ...aircraft,
                   tasks: aircraft.tasks || [],
                }));
            })
            .addCase(fetchAircrafts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAircraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAircraft.fulfilled, (state, action) => {
                state.loading = false;
                state.aircrafts.push(action.payload);
            })
            .addCase(addAircraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAircraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAircraft.fulfilled, (state, action) => {
                state.loading = false;
                state.aircrafts = state.aircrafts.filter(a => a.id !== action.payload);
            })
            .addCase(deleteAircraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAircraft.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAircraft.fulfilled, (state, action) => {
                state.loading = false;
                const updatedAircraft = action.payload;
                const index = state.aircrafts.findIndex((a) => a.id === updatedAircraft.id);
                if (index !== -1) {
                    state.aircrafts[index] = updatedAircraft;
                }
            })
            .addCase(updateAircraft.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addTasks.fulfilled, (state, action) => {
                 const { aircraftId, tasks } = action.payload;
                   const aircraftIndex = state.aircrafts.findIndex(a => a.id === Number(aircraftId));
                    if (aircraftIndex !== -1) {
                        state.aircrafts[aircraftIndex].tasks = [...state.aircrafts[aircraftIndex].tasks, ...tasks]
                     }
            });
    },
});

export const { clearError } = aircraftSlice.actions;
export default aircraftSlice.reducer;