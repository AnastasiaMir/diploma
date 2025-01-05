// import { createSelector } from '@reduxjs/toolkit';


// export const selectTasks = (state) => state.tasks.tasks;
// export const selectTasksLoading = (state) => state.tasks.loading;
// export const selectTasksError = (state) => state.tasks.error;

// export const selectAllTasks = createSelector(
//     [selectTasks],
//     (tasks) => tasks
// );

// export const selectTasksWithTotalManpower = createSelector(
//     [selectTasks],
//     (tasks) => {
//         if (!tasks || tasks.length === 0) {
//             return [];
//         }

//         return tasks.map(task => {
//             // const totalHours = task.subtasks?.reduce((acc, i) => i.manpower + acc, 0) || 0;
//             return { ...task, totalManpower: 0};
//         });
//     }
// );

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
            const taskSubtasks = subtasks[task.id] || [];
             const totalManpower = taskSubtasks.reduce((acc, subtask) => acc + (subtask.manpower || 0), 0);
           return { ...task, totalManpower:1 };
        });
    }
);