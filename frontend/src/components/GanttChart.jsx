import React from 'react';
import { FrappeGantt } from 'frappe-gantt-react';
import '../assets/styles/GanttChart.css';

const GanttChart = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return <p>Нет задач для отображения.</p>;
    }

    const formattedTasks = tasks.map(task => ({
        id: task.id,
        name: task.name,
        start: task.start,
        end: task.end,
        progress: task.progress,
        dependencies: task.dependencies || [],
    }));

    console.log("Gantt tasks:", formattedTasks)

    return (
        <div className="gantt-container">
            <FrappeGantt
                tasks={formattedTasks}
                columnWidth={30}
                onDateChange={(task, start, end) => {
                    console.log(task, start, end);
                }}
            />
        </div>
    );
};

export default GanttChart;