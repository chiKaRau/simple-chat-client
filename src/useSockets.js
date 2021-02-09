import { useState, useEffect } from "react";
import socketio from "socket.io-client";

const useSockets = (url, event) => {
  const [socket, setSocket] = useState();
  const [socketVal, setSocketVal] = useState([]);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const client = socketio.connect(url);

    setSocket(client);
    client.on("connect", () => setConnected(true));
    client.on("disconnect", () => setConnected(false));
    client.on(event, (data) => {
      setSocketVal(data);
    });
  }, [url, event]);

  return { socket, socketVal, isConnected };
};

export default useSockets;
