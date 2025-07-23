import React, { useEffect, useState, useRef } from 'react';

// Main App component
const App = () => {
  // State to hold the WebSocket instance
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null); // Using useRef to persist the WebSocket object across renders

  // The WebSocket URL to connect to.
  // You can replace this with your actual WebSocket server URL.
  // For testing, you can use a public echo WebSocket server like 'wss://echo.websocket.events'
  const websocketUrl = 'ws://localhost:8000/ws';

  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    console.log('Attempting to connect to WebSocket...');
    ws.current = new WebSocket(websocketUrl);

    // Event listener for when the connection is opened
    ws.current.onopen = () => {
      console.log('WebSocket connection established!');
      setIsConnected(true);
      setMessages(prev => [...prev, { type: 'info', content: 'Connected to WebSocket!' }]);
    };

    // Event listener for incoming messages
    ws.current.onmessage = (event) => {
      console.log('Message from WebSocket:', event.data);
      setMessages(prev => [...prev, { type: 'received', content: event.data }]);
    };

    // Event listener for errors
    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setMessages(prev => [...prev, { type: 'error', content: `WebSocket Error: ${error.message || 'Unknown error'}` }]);
    };

    // Event listener for when the connection is closed
    ws.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setIsConnected(false);
      setMessages(prev => [...prev, { type: 'info', content: `WebSocket Disconnected: ${event.code} - ${event.reason}` }]);
    };

    // Cleanup function: close the WebSocket connection when the component unmounts
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection...');
        ws.current.close();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to send a test message
  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const testMessage = `Hello from client! ${new Date().toLocaleTimeString()}`;
      ws.current.send(testMessage);
      setMessages(prev => [...prev, { type: 'sent', content: testMessage }]);
      console.log('Sent message:', testMessage);
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
      setMessages(prev => [...prev, { type: 'warning', content: 'Not connected to WebSocket. Cannot send message.' }]);
    }
  };

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        .container {
          min-height: 100vh;
          background-color: #f3f4f6; /* bg-gray-100 */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem; /* p-4 */
        }

        .card {
          background-color: #fff; /* bg-white */
          padding: 1.5rem; /* p-6 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-xl (simplified) */
          width: 100%; /* w-full */
          max-width: 28rem; /* max-w-md */
        }

        .title {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          color: #1f2937; /* text-gray-800 */
          margin-bottom: 1rem; /* mb-4 */
          text-align: center; /* text-center */
        }

        .status-section {
          margin-bottom: 1rem; /* mb-4 */
          text-align: center; /* text-center */
        }

        .status-text {
          font-size: 1.125rem; /* text-lg */
          font-weight: 600; /* font-semibold */
        }

        .status-connected {
          color: #10b981; /* text-green-600 */
        }

        .status-disconnected {
          color: #ef4444; /* text-red-600 */
        }

        .send-button {
          width: 100%; /* w-full */
          padding: 0.5rem 1rem; /* py-2 px-4 */
          border-radius: 0.375rem; /* rounded-md */
          font-weight: 600; /* font-semibold */
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; /* transition-colors duration-200 */
          border: none;
          cursor: pointer;
        }

        .send-button:enabled {
          background-color: #2563eb; /* bg-blue-600 */
          color: #fff; /* text-white */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
        }

        .send-button:enabled:hover {
          background-color: #1d4ed8; /* hover:bg-blue-700 */
        }

        .send-button:disabled {
          background-color: #d1d5db; /* bg-gray-300 */
          color: #6b7280; /* text-gray-500 */
          cursor: not-allowed; /* cursor-not-allowed */
        }

        .messages-section {
          margin-top: 1.5rem; /* mt-6 */
          height: 16rem; /* h-64 */
          overflow-y: auto; /* overflow-y-auto */
          background-color: #f9fafb; /* bg-gray-50 */
          padding: 0.75rem; /* p-3 */
          border-radius: 0.375rem; /* rounded-md */
          border: 1px solid #e5e7eb; /* border border-gray-200 */
        }

        .messages-title {
          font-size: 1.125rem; /* text-lg */
          font-weight: 500; /* font-medium */
          color: #374151; /* text-gray-700 */
          margin-bottom: 0.5rem; /* mb-2 */
        }

        .no-messages-text {
          color: #6b7280; /* text-gray-500 */
          font-size: 0.875rem; /* text-sm */
        }

        .message-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem; /* space-y-2 */
        }

        .message-item {
          padding: 0.5rem; /* p-2 */
          border-radius: 0.375rem; /* rounded-md */
          font-size: 0.875rem; /* text-sm */
        }

        .message-info {
          background-color: #dbeafe; /* bg-blue-100 */
          color: #1e40af; /* text-blue-800 */
        }

        .message-received {
          background-color: #d1fae5; /* bg-green-100 */
          color: #065f46; /* text-green-800 */
        }

        .message-sent {
          background-color: #ede9fe; /* bg-purple-100 */
          color: #5b21b6; /* text-purple-800 */
        }

        .message-error {
          background-color: #fee2e2; /* bg-red-100 */
          color: #991b1b; /* text-red-800 */
        }

        .message-warning {
          background-color: #fffbeb; /* bg-yellow-100 */
          color: #92400e; /* text-yellow-800 */
        }
        `}
      </style>

      <div className="container">
        <div className="card">
          <h1 className="title">WebSocket Logger</h1>

          <div className="status-section">
            <p className={`status-text ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
              Status: {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>

          <button
            onClick={sendMessage}
            disabled={!isConnected}
            className="send-button"
          >
            Send Test Message
          </button>

          <div className="messages-section">
            <h2 className="messages-title">Messages:</h2>
            {messages.length === 0 ? (
              <p className="no-messages-text">No messages yet. Connect to a WebSocket to see messages.</p>
            ) : (
              <ul className="message-list">
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`message-item ${
                      msg.type === 'info' ? 'message-info' :
                      msg.type === 'received' ? 'message-received' :
                      msg.type === 'sent' ? 'message-sent' :
                      msg.type === 'error' ? 'message-error' :
                      'message-warning' // For 'warning' type
                    }`}
                  >
                    {msg.type === 'info' && 'Info: '}
                    {msg.type === 'received' && 'Received: '}
                    {msg.type === 'sent' && 'Sent: '}
                    {msg.type === 'error' && 'Error: '}
                    {msg.type === 'warning' && 'Warning: '}
                    {msg.content}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
