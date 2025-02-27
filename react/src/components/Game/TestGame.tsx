import { useState, useEffect, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import Board from "./Components/Board";
import BannerSm from "../GlobalComponents/BannerSm";
import WinAnimation from "../WinAnimation/WinAnimation";
import { GetUseUser } from "../../Fetch/GetUseUser";

function FirstGame() {
  const createEmptyBoard = (rows: number, cols: number) =>
    Array.from({ length: rows }, () => Array(cols).fill(""));

  const [board, setBoard] = useState(createEmptyBoard(15, 15));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [player, setPlayer] = useState(localStorage.getItem("player") || "");
  const [gameId, setGameId] = useState(localStorage.getItem("gameId") || "");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [imageAndText, setImageAndText] = useState({
    src: "./zarivka_playing_bile.svg",
    text: "Hraje se..."
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const socketUrl = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:5000' 
  : window.location.origin;
  const { user, isLoading } = GetUseUser();

  // Funkce pro kompletní reset hry
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard(15, 15));
    setCurrentPlayer("X");
    setIsGameOver(false);
    setWinner(null);
    setShowWinModal(false);
    setImageAndText({
      src: "./zarivka_playing_bile.svg",
      text: "Hraje se..."
    });
  }, []);

  // Setup socket events
  const setupSocketEvents = useCallback((newSocket: Socket) => {
    // Set up connection event handler
    newSocket.on("connect", () => {
      console.log("Připojeno k Socket.IO serveru");
      setSocketConnected(true);
      
      if (user?.uuid) {
        console.log("Připojování do fronty s UUID:", user.uuid);
        newSocket.emit("join_queue", { uuid: user.uuid });
      } else {
        console.warn("User UUID není k dispozici, nemohu se připojit do fronty");
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Odpojeno od Socket.IO serveru");
      setSocketConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Chyba připojení k Socket.IO serveru:", error);
      setSocketConnected(false);
    });

    newSocket.on("game_started", (data) => {
      console.log("Hra začala, data:", data);
      // Nejprve resetujeme hru
      resetGame();
      // Poté nastavíme nové hodnoty
      setGameId(data.game_id);
      setPlayer(data.player);
      localStorage.setItem("gameId", data.game_id);
      localStorage.setItem("player", data.player);
    });

    newSocket.on("move_made", (data) => {
      console.log("Tah proveden:", data);
      if (isGameOver) return; // Ignorujeme tahy, pokud je hra ukončena
      
      setBoard(prevBoard => {
        const updatedBoard = [...prevBoard];
        updatedBoard[data.row][data.col] = data.player;
        return updatedBoard;
      });
      setCurrentPlayer(data.player === "X" ? "O" : "X");
    });

    // Přidání event listeneru pro restart hry
    newSocket.on("restart_game", () => {
      console.log("Restartování hry");
      resetGame();
    });
  }, [user, resetGame]);

  // Initialize socket connection
  useEffect(() => {
    // Don't proceed if user data isn't loaded yet
    if (!user?.uuid || isLoading) return;
    
    console.log("Inicializace Socket.IO spojení...");
    const newSocket = io(socketUrl, { 
      transports: ['websocket', 'polling'], // Zkusí WebSocket, pokud selže, použije polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    setupSocketEvents(newSocket);
    setSocket(newSocket);

    // Clean up socket connection when component unmounts
    return () => {
      console.log("Ukončení Socket.IO spojení...");
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.off("game_started");
      newSocket.off("move_made");
      newSocket.off("restart_game"); // Odstraníme event listener
      newSocket.close();
    };
  }, [user, isLoading, socketUrl, setupSocketEvents]);

  // Reconnect if user changes
  useEffect(() => {
    if (socket && user?.uuid && !socketConnected) {
      console.log("Pokus o opětovné připojení se změněným uživatelem:", user.uuid);
      socket.connect();
    }
  }, [user, socket, socketConnected]);

  // Handle thinking animation
  useEffect(() => {
    if (!isGameOver) {
      const timer = setTimeout(() => {
        setImageAndText({
          src: "./zarivka_thinking_bile.svg",
          text: "Přemýšlí",
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [board, isGameOver]);

  // Handle game over
  useEffect(() => {
    if (isGameOver && socket && socketConnected && gameId) {
      console.log("Hra skončila, odesílám informace:", { game_id: gameId, winner });
      socket.emit("game_over", { game_id: gameId, winner });
    }
  }, [isGameOver, socket, socketConnected, gameId, winner]);

  const handleCellClick = (row: number, col: number) => {
    // Kontrola, že hra neskončila a že je hráč na tahu
    if (board[row][col] || isGameOver || currentPlayer !== player) return;
    
    setBoard(prevBoard => {
      const updatedBoard = [...prevBoard];
      updatedBoard[row][col] = player;
      return updatedBoard;
    });
    
    setCurrentPlayer(player === "X" ? "O" : "X");
    
    if (socket && socketConnected && gameId) {
      console.log("Odesílám tah:", { game_id: gameId, row, col, player });
      socket.emit("make_move", { game_id: gameId, row, col, player });
    } else {
      console.warn("Nelze odeslat tah - socket není připojen nebo chybí gameId");
    }
  };

  const playerIndicator = (
    <div className="flex items-center">
      <span className="mr-2 font-bold">
        {imageAndText.text === "Přemýšlí" ? "Přemýšlí:" : "Na tahu:"}
      </span>
      <img
        src={currentPlayer === "X" ? "./X_cervene.svg" : "./O_modre.svg"}
        alt={`Hráč ${currentPlayer}`}
        className="w-6 h-6"
      />
    </div>
  );

  // Socket connection status indicator (for debugging)
  const connectionStatus = (
    <div className="text-xs text-gray-500 absolute top-2 right-2">
      {socketConnected ? "✅ Připojeno" : "❌ Odpojeno"}
    </div>
  );
    
  return (
    <div>
        {connectionStatus}
        <BannerSm title="Nová hra" url="../../Think-different-Academy_LOGO_oficialni-bile.svg" />
      <div className="h-[80vh] flex flex-col relative p-4">
    
      <WinAnimation 
        board={board} 
        setIsGameOver={setIsGameOver} 
        setWinner={setWinner} 
        socket={socket} 
        gameId={gameId} 
        player={player as "X" | "O"} 
        showWinModal={showWinModal} 
        setShowWinModal={setShowWinModal} 
      />
      
      {/* Main content area with proper spacing */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full mt-4">
        {/* Game board */}
        <div className="w-full md:w-auto">
          <Board 
            board={board} 
            onCellClick={handleCellClick} 
            x="X_cervene.svg" 
            o="O_modre.svg" 
            currentPlayer={currentPlayer} 
          />
        </div>
        
        {/* Player status indicator */}
        <div className="flex items-center bg-slate-100 p-4 rounded-xl w-full md:w-64">
          <img
            src={imageAndText.src}
            alt="Dynamický obrázek"
            className="w-20 h-20 bg-[#1A1A1A] rounded-lg mr-4"
          />
          <div className="flex flex-col">
            {playerIndicator}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default FirstGame;