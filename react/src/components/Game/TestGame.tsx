import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import Board from "./Components/Board";
// import SaveForm from "./Components/SaveForm";
import BannerSm from "../GlobalComponents/BannerSm";
// import ButtonLink from "../GlobalComponents/ButtonLink";
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
  const [imageAndText, setImageAndText] = useState({
    src: "./zarivka_playing_bile.svg",
    text: "Hraje se..."
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [showWinModal, setShowWinModal] = useState(true);
  const socketUrl = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:5000' 
  : '/';
  const { user, isLoading} = GetUseUser();
  console.log(user);
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

  useEffect(() => {
    if (!user || isLoading) return; 
    const newSocket = io(socketUrl, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Připojeno k Socket.IO serveru");
      newSocket.emit("join_queue", { uuid: user.uuid });
    });

    newSocket.on("game_started", (data) => {
      setGameId(data.game_id);
      setPlayer(data.player);
      localStorage.setItem("gameId", data.game_id);
      localStorage.setItem("player", data.player);
      setShowWinModal(false);
      setBoard(createEmptyBoard(15, 15));
      setIsGameOver(false);
      setWinner(null);
    });

    newSocket.on("move_made", (data) => {
      setBoard(prevBoard => {
        const updatedBoard = [...prevBoard];
        updatedBoard[data.row][data.col] = data.player;
        return updatedBoard;
      });
      setCurrentPlayer(data.player === "X" ? "O" : "X");
    });
  }, []);

  useEffect(() => {
    if (isGameOver && socket) {
      socket.emit("game_over", { game_id: gameId, winner });
    }
  }, [isGameOver, socket]);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || isGameOver || currentPlayer !== player) return;
    setBoard(prevBoard => {
      const updatedBoard = [...prevBoard];
      updatedBoard[row][col] = player;
      return updatedBoard;
    });
    setCurrentPlayer(player === "X" ? "O" : "X");
    if (socket && gameId) {
      socket.emit("make_move", { game_id: gameId, row, col, player });
    }
  };

  const playerIndicator = (
    <div className="flex items-center">
      <span className="mr-2 font-bold">
        {imageAndText.text === "Přemýšlí" ? "Přemýšlí:" : "Na tahu:"}
      </span>
      <img
        src={currentPlayer === "X" ? "./X_cervene.svg" : "./O_modre.svg"}
        alt={'Hráč ${currentPlayer}'}
        className="w-6 h-6"
      />
    </div>

  );


    
  return (
    <div className="h-screen flex flex-col">
      <BannerSm title="Nová hra" url="../../Think-different-Academy_LOGO_oficialni-bile.svg" />
      <WinAnimation board={board} setIsGameOver={setIsGameOver} setWinner={setWinner} socket={socket} gameId={gameId} player={player as "X" | "O"} showWinModal={showWinModal} setShowWinModal={setShowWinModal} />
      <Board board={board} onCellClick={handleCellClick} x="X_cervene.svg" o="O_modre.svg" currentPlayer={currentPlayer} />
      <div className="mt-28 flex md:grid md:grid-cols-2 items-center bg-slate-100 w-full lg:min-w-[50%] lg:max-w-[65%] p-4 rounded-xl md:col-span-1 lg:grid col-span-2">
            <img
              src={imageAndText.src}
              alt="Dynamický obrázek"
              className="w-20 h-20 mb-2 bg-[#1A1A1A] rounded-lg mr-14 md:mr-0"
            />
            {playerIndicator}
          </div>
    </div>
  );
}

export default FirstGame;
