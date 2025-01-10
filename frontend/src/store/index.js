import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import aircraftReducer from './aircraftSlice';
import taskReducer from './taskSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    aircrafts: aircraftReducer,
    tasks: taskReducer,
  },
});

export default store;