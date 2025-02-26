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
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musíte být přihlášeni, abyste se mohli připojit do hry.");
      navigate("/"); // Přesměrování na hlavní stránku
      return;
    }
    const newSocket = io(socketUrl);

    newSocket.emit("join_queue");

    newSocket.on("game_started", (data) => {
      console.log("Game started event received:", data);
      setGameId(data.game_id);
      localStorage.setItem("gameId", data.game_id); // Uložíme ID hry
      localStorage.setItem("player", data.player);  // Uložíme roli hráče ("X" nebo "O")
      console.log("Hra začala! ID hry:", data.game_id, "Hráč:", data.player);
      navigate("/game"); // Přesměrujeme na herní desku
    });

    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
    };
  }, [navigate]);

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
