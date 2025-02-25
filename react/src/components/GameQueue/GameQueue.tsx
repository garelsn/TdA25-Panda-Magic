import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { GetUseUser } from "../../Fetch/GetUseUser";

const GameQueue = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const socketUrl = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5000' 
    : '/';
  const { user, isLoading } = GetUseUser();
  
  useEffect(() => {
    // Check for token inside the useEffect to avoid early returns
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musíte být přihlášeni, abyste se mohli připojit do hry.");
      navigate("/");
      return;
    }
    
    // Don't proceed if user data isn't loaded yet
    if (!user || isLoading) return;
    
    console.log("Setting up socket connection with user:", user);
    
    const newSocket = io(socketUrl, { 
      transports: ['websocket', 'polling'], // Zkusí WebSocket, pokud selže, použije polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    // Set up connection event handler
    newSocket.on("connect", () => {
      console.log("Socket connected, joining queue with UUID:", user.uuid);
      newSocket.emit("join_queue", { uuid: user.uuid });
    });

    // Set up game started event handler
    newSocket.on("game_started", (data) => {
      console.log("Game started event received:", data);
      setGameId(data.game_id);
      localStorage.setItem("gameId", data.game_id);
      localStorage.setItem("player", data.player);
      console.log("Hra začala! ID hry:", data.game_id, "Hráč:", data.player, "user_uuid:", data.user_uuid);
      navigate("/game");
    });
    
    // Set up error handling
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
    };
  }, [navigate, user, isLoading, socketUrl]);

  return (
    <div>
      {gameId ? (
        <p>Připojen do hry s ID: {gameId}</p>
      ) : (
        <p>Čekám na spárování...</p>
      )}
    </div>
  );
};

export default GameQueue;