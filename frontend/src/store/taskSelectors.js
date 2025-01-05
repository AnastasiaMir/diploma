import { createSelector } from '@reduxjs/toolkit';
import { selectSubtasks } from './subtaskSelectors';

export const selectTasks = (state) => state.tasks.tasks;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;

export const selectTasksWithTotalManpower = createSelector(
    [selectTasks, selectSubtasks],
    (tasks, subtasks) => {
        if (!tasks || tasks.length === 0) {
            return [];
        }

        return tasks.map(task => {
             const totalManpower = task.subtasks.reduce((acc, subtask) => acc + (subtask.manpower || 0), 0);

           return { ...task, totalManpower };
        });
    }
);