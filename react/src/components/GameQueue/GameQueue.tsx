import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const GameQueue = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const socketUrl = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5000' 
    : '/';

  useEffect(() => {
    // Během vývoje (localhost) se bude používat falešný token, pokud není přihlášený uživatel
    const token = localStorage.getItem("token") || (process.env.NODE_ENV === 'development' ? "fakeToken" : null);

    if (!token) {
      if (process.env.NODE_ENV !== 'development') {
        alert("Musíte být přihlášeni, abyste se mohli připojit do hry.");
        navigate("/"); // Přesměrování na hlavní stránku
        return;
      }
    }

    const newSocket = io(socketUrl);

    newSocket.emit("join_queue");

    newSocket.on("game_started", (data) => {
      setGameId(data.game_id);
      localStorage.setItem("gameId", data.game_id);
      localStorage.setItem("player", data.player);
      console.log("Hra začala! ID hry:", data.game_id, "Hráč:", data.player);
      navigate("/game"); // Přesměrování na herní stránku
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate, socketUrl]);

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
