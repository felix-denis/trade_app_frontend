import { useState, useEffect, useRef } from "react";
import {
  AreaSeries,
  createChart,
  CrosshairMode,
  LineSeries,
} from "lightweight-charts";

function Chart() {
  const chart_container = useRef(null);
  useEffect(() => {
    if (!chart_container.current) return;

    // Create the chart
    const chart = createChart(chart_container.current, {
      width: chart_container.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#1e1e1e" },
        textColor: "#ffffff",
      },
      grid: {
        vertLines: { color: "#eeeeee21" },
        horzLines: { color: "#eeeeee21" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: "#ccc",
      },
      timeScale: {
        borderColor: "#ccc",
      },
    });

    // Save the chart instance (optional)

    const lineseries = chart.addSeries(LineSeries);
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });
    areaSeries.setData([
      { time: "2018-12-22", value: 32.51 },
      { time: "2018-12-23", value: 31.11 },
      { time: "2018-12-24", value: 27.02 },
      { time: "2018-12-25", value: 27.32 },
      { time: "2018-12-26", value: 25.17 },
      { time: "2018-12-27", value: 28.89 },
      { time: "2018-12-28", value: 25.46 },
      { time: "2018-12-29", value: 23.92 },
      { time: "2018-12-30", value: 22.68 },
      { time: "2018-12-31", value: 22.67 },
    ]);

    chart.timeScale().fitContent()
    
    // Clean up on unmount
    return () => chart.remove();
  }, []);

  return (
    <>
      <div ref={chart_container} style={
        {width: '80%', height: '400px'}
      }></div>
    </>
  );
}

export default Chart;
