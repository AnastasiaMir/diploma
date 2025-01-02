import { createSelector } from 'reselect';
import { selectTasks } from './taskSlice';

export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;

export const selectAllTasks = createSelector(
    [selectTasks],
    (tasks) => tasks
);
export const selectTasksWithTotalManpower = createSelector(
    [selectTasks],
    (tasks) => {
        console.log("Tasks:", tasks);
        if (!tasks || tasks.length === 0) {
            return [];
        }

        return tasks.map(task => {
            const totalHours = task.subtasks.reduce((acc, i)=> i.manpower + acc, 0);
            console.log(totalHours)
            return { ...task, totalManpower: totalHours || 0}; 
        });
    }
);