import { createSelector } from "@reduxjs/toolkit";
import { selectTasks } from "./taskSelectors";

export const selectAircrafts = (state) => state.aircrafts.aircrafts;
export const selectAircraftsLoading = (state) => state.aircrafts.loading;
export const selectAircraftsError = (state) => state.aircrafts.error;

export const selectAircraftsWithTotalManpower = createSelector(
  [selectAircrafts, selectTasks],
  (aircrafts, tasks) => {
    if (!aircrafts || aircrafts.length === 0) {
      return [];
    }

    return aircrafts.map((aircraft) => {
      const totalManpower = aircraft.tasks.reduce(
        (acc, task) => acc + (task.manpower || 0),
        0
      );

      return { ...aircraft, totalManpower };
    });
  }
);

export const selectAircraftsForGantt = createSelector(
  [selectAircrafts],
  (aircrafts) => {
    return aircrafts.map((aircraft) => {
      const startDate = aircraft.start_date
        ? new Date(aircraft.start_date)
        : null;
      const endDate = aircraft.finish_date
        ? new Date(aircraft.finish_date)
        : null;

      if (!startDate || !endDate) {
        return {
          id: aircraft.id,
          name: aircraft.name,
          start: null,
          end: null,
          progress: 0,
        };
      }

      const totalDays = Math.max(
        0,
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      const today = new Date();
      const daysPassed = Math.max(
        0,
        Math.ceil(
          (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      const progress =
        totalDays <= 0
          ? 0
          : Math.min(100, Math.round((daysPassed / totalDays) * 100));

      return {
        id: aircraft.id,
        name: aircraft.name,
        start: startDate,
        end: endDate,
        progress: progress,
      };
    });
  }
);
