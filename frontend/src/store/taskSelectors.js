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

export const selectTasksForGantt = createSelector([selectTasks], (tasks) => {
    return tasks.map((task) => {
        const startDate = task.start_date ? new Date(task.start_date) : null;
        const endDate = task.finish_date ? new Date(task.finish_date) : null;

        if (!startDate || !endDate) {
            return {
                id: task.id,
                name: task.name,
                start: null,
                end: null,
                progress: 0,
                dependencies: [],
            };
        }

        const totalDays = Math.max(0, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const today = new Date();
      const daysPassed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
       const progress = totalDays <= 0 ? 0 : Math.min(100, Math.round((daysPassed / totalDays) * 100));
        console.log(`Task: ${task.name}, Start: ${startDate}, End: ${endDate}, Total days: ${totalDays}, Days passed: ${daysPassed}, Progress: ${progress}`);

      return {
            id: task.id,
            name: task.name,
            start: startDate,
            end: endDate,
            progress: progress
        };
    });
});