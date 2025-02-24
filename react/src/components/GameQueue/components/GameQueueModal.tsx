import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const GameQueueModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [opponentFound, setOpponentFound] = useState(false);
  const navigate = useNavigate();
  const socketUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:5000" : "/";

  useEffect(() => {
    if (!isOpen) return;
    
    const token = localStorage.getItem("token");
    // if (!token) {
    //   alert("Musíte být přihlášeni, abyste se mohli připojit do hry.");
    //   navigate("/");
    //   return;
    // }

    const newSocket = io(socketUrl);
    newSocket.emit("join_queue");

    newSocket.on("game_started", (data) => {
      setGameId(data.game_id);
      localStorage.setItem("gameId", data.game_id);
      localStorage.setItem("player", data.player);
      setOpponentFound(true);

      setTimeout(() => {
        navigate("/game");
      }, 2000); // Počkej 2 sekundy, než přesměruje
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isOpen, navigate]);

  const username = localStorage.getItem("username") || "Já";
  const profilePic = localStorage.getItem("profilePic") || "/pawn.png"; // Používáme pěšce jako výchozí ikonu

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="p-6 rounded-lg shadow-lg w-[480px] h-[480px] relative" style={{ background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)" }}>

        <h1 className="text-4xl text-white font-bold text-center mb-6">Čekání na hráče</h1>

        <div className="flex justify-center items-center space-x-20 mt-20">
          {/* Moje profilovka (pěšec) */}
          <div className="text-center">
            <div className="w-20 h-20 border-2 border-black rounded-lg mx-auto overflow-hidden">
              <img 
                src={profilePic} 
                alt="Můj pěšec" 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-white mt-2">Já</p>
          </div>

          {/* Ikonka soupeře (pěšec) */}
          <div className="text-center">
            <div className="w-20 h-20 border-2 border-black rounded-lg mx-auto overflow-hidden">
              <img 
                src="/pawn.png" 
                alt="Soupeřův pěšec" 
                className="w-full h-full object-cover" 
              />
            </div>
            <p className="text-white mt-2">Soupeř</p>
          </div>
        </div>

        {/* Velké "X" mezi "Já" a "Soupeř" */}
        <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold">
          X
        </div>

        {/* Tlačítko ZRUŠIT */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-[#D9D9D9] text-black border-2 border-red-500 rounded-[30px] px-6 py-2 font-semibold text-[16px] transition-transform duration-200 hover:scale-105"
          >
            ZRUŠIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameQueueModal;