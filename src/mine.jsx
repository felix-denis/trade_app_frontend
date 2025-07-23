const ws = new WebSocket("ws://localhost:8000/ws");
ws.onmessage = (event) => {
    console.log("Received live data:", JSON.parse(event.data));
};
ws.onopen = () => {
    console.log("Connected to live data WebSocket");
};
ws.onclose = (event) => {
    console.log("Disconnected from live data WebSocket:", event);
};
ws.onerror = (error) => {
    console.error("WebSocket error:", error);
};