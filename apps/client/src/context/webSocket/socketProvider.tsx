import { useMemo, useEffect, useState } from "react";
import SocketContext from "./socketContext";


const SocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const value = useMemo(() => ({ socket, setSocket }), [socket, setSocket]);

  useEffect(() => {
    const WS_URL = 'http://localhost:8000'
    const ws = new WebSocket(WS_URL);
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
