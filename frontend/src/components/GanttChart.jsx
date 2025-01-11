import React, { useRef, useEffect, useState, useCallback, useLayoutEffect} from "react";
import "../assets/styles/GanttChart.css";

const GanttChart = ({ aircrafts }) => {
  const svgRef = useRef(null);
  const aircraftLabelsRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const ganttChartContainerRef = useRef(null);
  const drawChart = useCallback(() => {
    if (!svgRef.current || !aircrafts || aircrafts.length === 0) return;


    const chartData = {
      svg: svgRef.current, 
      container: svgRef.current.parentElement, // родительский контейнер диаграммы
      charWidth: 9, // ширина символа в строке (используется для вычисления ширины названий самолетов)
      maxAircraftNameLength: 0, // максимальная длина имени самолета (в пикселях)
      aircraftNameWidth: 0, // ширина контейнера с названиями самолетов (в пикселях)
      availableWidth: 0, // ширина контейнера диаграммы (в пикселях)
      aircraftHeight: 30, // высота бара с ВС на диаграмме (в пикселях)
      aircraftMargin: 10, // отступ бара с ВС на диаграмме (в пикселях)
      dateHeaderHeight: 60, // высота контейнера с датами (в пикселях)
      minDate: new Date(), // минимальная дата среди всех ВС
      maxDate: new Date(), // максимальная дата среди всех ВС
      oneDayWidth: 40, // ширина одного дня на диаграмме (в пикселях)
      currentDate: null, // текущая дата (для итерации по датам)
      totalDays: 0, // общее количество дней на диаграмме
      todayX: null, // координата X для текущего дня
      today: new Date(), // текущая дата
      currentMonth: null, // текущий месяц
      monthStartX: 1, // стартовый индекс месяца
      i: 0, // счетчик итераций (основан на днях)
    };

    chartData.svg.innerHTML = "";

    aircrafts.forEach((ac) => {

      chartData.maxAircraftNameLength = Math.max(
        chartData.maxAircraftNameLength, 
        ac.name.length * chartData.charWidth 
      );
    });

    chartData.aircraftNameWidth = Math.max(
      120, // минимальная ширина контейнера
      chartData.maxAircraftNameLength 
    );

    chartData.availableWidth = chartData.container.offsetWidth;
    setContainerWidth(chartData.availableWidth);

    aircrafts.forEach((ac) => {
     
      const acStart = new Date(ac.start);
      const acEnd = new Date(ac.end);
   
      chartData.minDate =
        acStart < chartData.minDate ? acStart : chartData.minDate;

      chartData.maxDate = acEnd > chartData.maxDate ? acEnd : chartData.maxDate;
    });

    chartData.currentDate = new Date(chartData.minDate);

 
    const drawMonthHeader = (
      date, 
      startX, 
      endX,  
      oneDayWidth, 
      dateHeaderHeight, 
      svg 
    ) => {
      const x = startX * oneDayWidth; 
      const width = (endX - startX + 1) * oneDayWidth; 
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();

      const monthHeader = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      monthHeader.textContent = `${month} ${year}`.toUpperCase();
      monthHeader.setAttribute("x", x + width / 2);
      monthHeader.setAttribute("y", 10);
  
      monthHeader.setAttribute("font-size", "14px");
      monthHeader.setAttribute("font-weight", "bold");
      svg.appendChild(monthHeader);
    };

    
    const drawMonthAndDates = (date, index) => {
      const x = index * chartData.oneDayWidth;
      if (date.toDateString() === chartData.today.toDateString()) {
        chartData.todayX = x;
      }

      const dateText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      dateText.textContent = String(date.getDate()).padStart(2, "0");
      dateText.setAttribute("x", x + chartData.oneDayWidth / 2);
      dateText.setAttribute("y", 40);
      dateText.setAttribute("text-anchor", "middle");
      dateText.setAttribute("font-size", "12px");
      dateText.setAttribute("fill", "#666");
      chartData.svg.appendChild(dateText);
      const divider = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      divider.setAttribute("x1", x);
      divider.setAttribute("y1", chartData.dateHeaderHeight);
      divider.setAttribute("x2", x);
      divider.setAttribute("y2", chartData.container.offsetHeight);
      divider.setAttribute("stroke", "#ddd");
      divider.setAttribute("stroke-width", "1");
      chartData.svg.appendChild(divider);
      chartData.totalDays+=1;
    };

    while (chartData.currentDate <= chartData.maxDate) {
      const month = chartData.currentDate.toLocaleString("default", { month: "long" });
      if (month !== chartData.currentMonth) {
         if (chartData.currentMonth !== null) {
             drawMonthHeader(
                 new Date(
                    chartData.currentDate.getFullYear(),
                    chartData.currentDate.getMonth() - 1,
                    1
                  ),
                  chartData.monthStartX,
                  chartData.i - 1,
                  chartData.oneDayWidth,
                  chartData.dateHeaderHeight,
                  chartData.svg
              );
          }
          chartData.currentMonth = month;
          chartData.monthStartX = chartData.i;
      }
        drawMonthAndDates(new Date(chartData.currentDate), chartData.i);
        chartData.currentDate.setDate(chartData.currentDate.getDate() + 1);
        chartData.i +=1;
        if (chartData.i > 365) break;
      }

    aircrafts.forEach((ac, index) => {
      const start = new Date(ac.start);
      const end = new Date(ac.end);

      const aircraftStartDays = Math.floor(
        (start - chartData.minDate) / (1000 * 60 * 60 * 24) // дни от начала диаграммы до старта простоя
      );
      const aircraftDurationDays = Math.floor( //длительность бара пррстоя 
        (end - start) / (1000 * 60 * 60 * 24)
      );

      const startX = aircraftStartDays * chartData.oneDayWidth;
      const width = aircraftDurationDays * chartData.oneDayWidth;
      const y =
        index * (chartData.aircraftHeight + chartData.aircraftMargin) +
        chartData.dateHeaderHeight;
      if (startX + width < 0) return;

      // создаем прямоугольный элемент svg для полосы ВС
      const aircraftBar = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      aircraftBar.setAttribute("x", startX);
      aircraftBar.setAttribute("y", y);
      aircraftBar.setAttribute("width", width);
      aircraftBar.setAttribute("height", chartData.aircraftHeight);
      aircraftBar.setAttribute("fill", "rgba(202, 22, 67, 0.8)");
      aircraftBar.setAttribute("rx", 5);
      chartData.svg.appendChild(aircraftBar);

      const progressWidth = (ac.progress / 100) * width;
      const progressBar = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      progressBar.setAttribute("x", startX);
      progressBar.setAttribute("y", y);
      progressBar.setAttribute("width", progressWidth);
      progressBar.setAttribute("height", chartData.aircraftHeight);
      progressBar.setAttribute("fill", "rgba(0, 0, 0, 0.2)");
      progressBar.setAttribute("rx", 5);
      chartData.svg.appendChild(progressBar);
    });


    if (chartData.todayX !== null) {
      const todayColumn = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      todayColumn.setAttribute("x", chartData.todayX);
      todayColumn.setAttribute("y", chartData.dateHeaderHeight);
      todayColumn.setAttribute("width", chartData.oneDayWidth);
      todayColumn.setAttribute(
        "height",
        chartData.container.offsetHeight - chartData.dateHeaderHeight
      );
      todayColumn.setAttribute("fill", "rgba(230, 64, 52, 0.1)");
      chartData.svg.insertBefore(todayColumn, chartData.svg.firstChild);
    }
    chartData.svg.setAttribute(
      "width",
      chartData.totalDays * chartData.oneDayWidth + 20
    );
    chartData.svg.setAttribute(
      "height",
      aircrafts.length * (chartData.aircraftHeight + chartData.aircraftMargin) +
        chartData.dateHeaderHeight +
        20
    );

    // устанавливаем div слева с именами ВС
    if (aircraftLabelsRef.current) {
      aircraftLabelsRef.current.style.width = `${chartData.aircraftNameWidth}px`;
      aircraftLabelsRef.current.innerHTML = "";

      aircrafts.forEach((ac, index) => {
        const y =
          index * (chartData.aircraftHeight + chartData.aircraftMargin) +
          chartData.dateHeaderHeight;
        const aircraftNameDiv = document.createElement("div");
        aircraftNameDiv.textContent = ac.name;
        aircraftNameDiv.style.height = `${chartData.aircraftHeight}px`;
        aircraftNameDiv.style.lineHeight = `${chartData.aircraftHeight}px`;
        aircraftNameDiv.style.padding = "0px";
        aircraftNameDiv.style.textAlign = "left";
        aircraftNameDiv.style.top = `${y}px`;
        aircraftNameDiv.className = "aircraft-name-item";
        aircraftLabelsRef.current.appendChild(aircraftNameDiv);
      });
    }
    
  }, [aircrafts]);

  useEffect(() => {
    drawChart();
  }, [aircrafts, drawChart]);
  


  useEffect(() => {
    const handleResize = () => {
      drawChart();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawChart]);

  return (
    <div
      className="gantt-chart-container"
      style={{overflowY: "auto" }} // maxHeight: "calc(100vh - 220px)", добавить если нижняя прокрутка нужна обязательно
      ref={ganttChartContainerRef}
    >
      <div className="aircraft-labels-container" ref={aircraftLabelsRef}></div>
      <div className="gantt-chart-svg-wrapper" >
        <svg ref={svgRef} className="gantt-svg" />
      </div>
    </div>
  );
};

export default GanttChart;