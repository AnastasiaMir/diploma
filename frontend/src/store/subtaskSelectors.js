import { createSelector } from 'reselect';

export const selectSubtasks = (state) => state.subtasks.subtasks;

export const selectSubtasksByTaskId = createSelector(
  [selectSubtasks, (state, taskId) => taskId],
    (subtasks, taskId) => {
      if (!taskId) {
        return []
      }
        return subtasks[taskId] || [];
    }
);