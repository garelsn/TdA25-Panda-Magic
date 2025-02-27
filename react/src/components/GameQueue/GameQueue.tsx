import { useEffect, useState } from "react"; 
import io from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { GetUseUser } from "../../Fetch/GetUseUser";

const animalIcons = ["🐤", "🐷", "🐸", "🐰", "🐶", "🐱", "🦊", "🐻"];

const GameQueue = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentAnimal, setCurrentAnimal] = useState("🐤");
  const navigate = useNavigate();
  const socketUrl = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5000' 
    : window.location.origin;
  const { user, isLoading } = GetUseUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimal(animalIcons[Math.floor(Math.random() * animalIcons.length)]);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musíte být přihlášeni, abyste se mohli připojit do hry.");
      navigate("/");
      return;
    }
    
    if (!user || isLoading) return;
    
    const newSocket = io(socketUrl, {  
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000 
    });
    
    newSocket.on("connect", () => {
      newSocket.emit("join_queue", { uuid: user.uuid });
    });

    newSocket.on("game_started", (data) => {
      setGameId(data.game_id);
      localStorage.setItem("gameId", data.game_id);
      localStorage.setItem("player", data.player);
      navigate("/game");
    });
    
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate, user, isLoading, socketUrl]);

  return (
    <div className="flex flex-row min-h-screen justify-center items-center">
      {/* {gameId ? (
        <p>Připojen do hry s ID: {gameId}</p> 
      ) : ( 
        <p>Čekám na spárování...</p> 
      )} */}
      <div className="flex flex-col items-center p-8 rounded-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-white mb-12">Čekání na hráče</h1> 
        <div className="flex items-center justify-between w-full mb-12"> 
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-2 rounded-md mb-2">
              <div className="w-24 h-24 flex items-center justify-center bg-white rounded-md">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">🐤</span>
                </div>
              </div>
            </div>
            <span className="text-white text-lg">Já</span>
          </div> 
          <div className="text-white text-6xl font-bold">X</div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 p-2 rounded-md mb-2 overflow-hidden">
              <div className="w-24 h-24 flex items-center justify-center bg-white rounded-md relative">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">{currentAnimal}</span>
                </div>
              </div>
              
            </div>
            <span className="text-white text-lg">Protivník</span>
            
          </div>
        </div> 
        <Link 
          className="py-2 px-12 bg-white text-blue-900 font-bold rounded-full border-2 border-red-500 hover:bg-red-100 transition-colors"
          to={"/"}
        >
          ZRUŠIT
        </Link>
      </div>
    </div> 
  ); 
}; 

export default GameQueue;
