import { createSelector } from '@reduxjs/toolkit';

export const selectSubtasks = (state) => state.subtasks.subtasks;
export const selectSubtasksLoading = (state) => state.subtasks.loading;
export const selectSubtasksError = (state) => state.subtasks.error;


export const selectSubtasksByTaskId = createSelector(
    [selectSubtasks, (state, taskId) => taskId],
    (subtasks, taskId) => {
        if (!taskId) {
            return [];
        }
        return subtasks[taskId] || [];
    }
);
