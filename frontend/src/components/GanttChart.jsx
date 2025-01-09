import React, { useRef, useEffect, useState, useCallback } from 'react';
import '../assets/styles/GanttChart.css';

const GanttChart = ({ tasks }) => {
    const svgRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const ganttChartContainerRef = useRef(null);

    const drawChart = useCallback(() => {
        if (!svgRef.current || !tasks || tasks.length === 0) return;

        const svg = svgRef.current;
        svg.innerHTML = '';
        const container = svg.parentElement;
        const availableWidth = container.offsetWidth;
        setContainerWidth(availableWidth);
        const taskHeight = 30;
        const taskMargin = 10;
        const dateHeaderHeight = 60;

        // Находим минимальную и максимальную даты на основе всех задач
        let minDate = tasks.length > 0 ? new Date(tasks[0].start) : new Date();
        let maxDate = tasks.length > 0 ? new Date(tasks[0].end) : new Date();

       tasks.forEach(task => {
           const taskStart = new Date(task.start);
           const taskEnd = new Date(task.end);
           minDate = taskStart < minDate ? taskStart : minDate;
            maxDate = taskEnd > maxDate ? taskEnd : maxDate;
        });


        const oneDayWidth = 80;
        let currentDate = new Date(minDate);
        let totalDays = 0;
        let todayX = null;
        const today = new Date();



        const drawMonthAndDates = (date, index) => {
           const x = index * oneDayWidth;

            if (date.toDateString() === today.toDateString()) {
                todayX = x;
            }

             const day = String(date.getDate()).padStart(2, '0');
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
             const formattedDate = `${day} ${month} ${year}`;


            const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            dateText.textContent = formattedDate;
            dateText.setAttribute('x', x + oneDayWidth / 2);
            dateText.setAttribute('y', 40);
           dateText.setAttribute('text-anchor', 'middle');
            dateText.setAttribute('font-size', '12px');
          dateText.setAttribute('fill', '#666');
            svg.appendChild(dateText);

            const divider = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            divider.setAttribute('x1', x);
           divider.setAttribute('y1', dateHeaderHeight);
            divider.setAttribute('x2', x);
            divider.setAttribute('y2', container.offsetHeight);
            divider.setAttribute('stroke', '#ddd');
           divider.setAttribute('stroke-width', '1');
            svg.appendChild(divider);

            totalDays++;
        };
        let i = 0
        while (currentDate <= maxDate) {
            drawMonthAndDates(new Date(currentDate), i);
            currentDate.setDate(currentDate.getDate() + 1);
              i++;
             if (i > 365) break;
        }




        tasks.forEach((task, index) => {
            const start = new Date(task.start);
            const end = new Date(task.end);

            const taskStartDays = Math.floor((start - minDate) / (1000 * 60 * 60 * 24));
            const taskDurationDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));


            const startX = taskStartDays * oneDayWidth;
            const width = taskDurationDays * oneDayWidth;
            const y = index * (taskHeight + taskMargin) + dateHeaderHeight;
            
           // Проверяем, находится ли конец задачи за пределами левой границы графика
           if (startX + width < 0) return;


            const taskBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          taskBar.setAttribute('x', startX);
            taskBar.setAttribute('y', y);
          taskBar.setAttribute('width', width);
           taskBar.setAttribute('height', taskHeight);
            taskBar.setAttribute('fill', 'rgba(202, 22, 67, 0.8)');
            taskBar.setAttribute('rx', 5);
            svg.appendChild(taskBar);


            const progressWidth = (task.progress / 100) * width;
           const progressBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
           progressBar.setAttribute('x', startX);
           progressBar.setAttribute('y', y);
           progressBar.setAttribute('width', progressWidth);
            progressBar.setAttribute('height', taskHeight);
          progressBar.setAttribute('fill', 'rgba(0, 0, 0, 0.2)');
            progressBar.setAttribute('rx', 5);
            svg.appendChild(progressBar);

            const taskName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            taskName.textContent = task.name;
          taskName.setAttribute('x', startX + 5);
           taskName.setAttribute('y', y + taskHeight / 2 + 5);
            taskName.setAttribute('font-size', '12px');
            taskName.setAttribute('fill', '#fff');
            svg.appendChild(taskName);
        });

         if (todayX !== null) {
           const todayColumn = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            todayColumn.setAttribute('x', todayX);
           todayColumn.setAttribute('y', dateHeaderHeight);
          todayColumn.setAttribute('width', oneDayWidth);
            todayColumn.setAttribute('height', container.offsetHeight - dateHeaderHeight);
            todayColumn.setAttribute('fill', 'rgba(230, 64, 52, 0.1)');
            svg.insertBefore(todayColumn, svg.firstChild);
        }

        svg.setAttribute('width', totalDays * oneDayWidth + 20);
        svg.setAttribute('height', tasks.length * (taskHeight + taskMargin) + dateHeaderHeight + 20);
    }, [tasks]);

    const handleScroll = useCallback((event) => {
        setScrollLeft(event.target.scrollLeft);
    }, []);

    useEffect(() => {
        drawChart();
    }, [tasks, drawChart]);
  useEffect(() => {
        if (svgRef.current) {
            svgRef.current.parentElement.style.width = `calc(100% + 20px)`;
        }
    }, [scrollLeft]);

    useEffect(() => {
        const handleResize = () => {
            drawChart();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [drawChart]);


    return (
        <div className="gantt-chart-container" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }} ref={ganttChartContainerRef}>
            <div className="gantt-chart-svg-wrapper" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                <svg ref={svgRef} className="gantt-svg" />
            </div>
        </div>
    );
};

export default GanttChart;