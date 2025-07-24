import { useState, useEffect, useRef } from "react";
import {
  AreaSeries,
  createChart,
  CrosshairMode,
  LineSeries,
} from "lightweight-charts";
import styles from "./chart.module.css"

function Chart() {
  const front_utl = "https://trade-app-frontend-hs44.onrender.com"
  const backend_url = "https://trade-app-backend-bnfm.onrender.com" 
  const chart_container = useRef(null);

  //connecting to the websocket in my backend

  const [isconnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  const websocketurl = "https://trade-app-backend-bnfm.onrender.com/ws";

  useEffect(() => {
    console.log(`attempting to connect to the websocket at ${websocketurl}`);
    ws.current = new WebSocket(websocketurl);

    // Event listener for when the connection is opened
    ws.current.onopen = () => {
      console.log("WebSocket connection established!");
      setIsConnected(true);
      setMessages((prev) => [
        ...prev,
        { type: "info", content: "Connected to WebSocket!" },
      ]);
    };

    // Event listener for incoming messages
    ws.current.onmessage = (event) => {
      console.log("Message from WebSocket:", event.data);
      setMessages((prev) => [
        ...prev,
        { type: "received", content: event.data },
      ]);
    };

    // Event listener for errors
    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: `WebSocket Error: ${error.message || "Unknown error"}`,
        },
      ]);
    };

    // Event listener for when the connection is closed
    ws.current.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      setIsConnected(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "info",
          content: `WebSocket Disconnected: ${event.code} - ${event.reason}`,
        },
      ]);
    };
  }, []);

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

    chart.timeScale().fitContent();

    // Clean up on unmount
    return () => chart.remove();
  }, []);

  return (
    <>
      <div
        ref={chart_container}
        style={{ width: "80%", height: "400px" }}
      ></div>
      <div className={styles.messages_}>
        { messages.length === 0 ? (
          <p>The is no messages that have been recieved.</p>
        ):(
          <ul className={styles.message_}>
            {messages.map((msg, index)=>(
              <li index={index}>{msg.content}</li>
              ))
            }
            <li>This is the money now</li>
          </ul>
        )
      }
      </div>
      <div>
        <p>This is the page now </p>
      </div>
    </>
  );
}

export default Chart;
