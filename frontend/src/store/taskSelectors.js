import { createSelector } from '@reduxjs/toolkit';

export const selectTasks = (state) => state.tasks.tasks;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;


export const selectTasksByAircraftId = createSelector(
    [selectTasks, (state, aircraftId) => aircraftId],
    (tasks, aircraftId) => {
        if (!aircraftId) {
            return [];
        }
        return tasks[aircraftId] || [];
    }
);
