// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice';
import subtaskReducer from './subtaskSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
     subtasks: subtaskReducer,
  },
});

export default store;