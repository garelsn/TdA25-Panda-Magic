import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import Board from "./Components/Board";
import SaveForm from "./Components/SaveForm";
import BannerSm from "../GlobalComponents/BannerSm";
import ButtonLink from "../GlobalComponents/ButtonLink";
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
  const socketUrl = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:5000' 
  : '/';
  const { user, isLoading, error } = GetUseUser();
  console.log(user)

  // Socket se vytvoří jen jednou při mountu komponenty
  console.log(winner)
  useEffect(() => {
    if (!user || isLoading) return; 
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Připojeno k Socket.IO serveru");
      newSocket.emit("join_queue", { uuid: user.uuid});
    });

    newSocket.on("game_started", (data) => {
      const { game_id, player } = data;
      setGameId(game_id);
      setPlayer(player);
      localStorage.setItem("gameId", game_id);
      localStorage.setItem("player", player);
      console.log("Hra začala! ID hry:", data.game_id, "Hráč:", data.player, "user_uuid:", data.user_uuid, "username", data.username);
    });

    newSocket.on("move_made", (data) => {
      const { row, col, player } = data;
      setBoard(prevBoard => {
        const updatedBoard = [...prevBoard];
        updatedBoard[row][col] = player;
        return updatedBoard;
      });
      setCurrentPlayer(player === "X" ? "O" : "X");
      setImageAndText({ src: "./zarivka_playing_bile.svg", text: "Hraje se..." });
    });

    // Zde záměrně neodpojujeme socket, aby zůstal připojený až do konce hry.
    // Pokud bys chtěl socket odpojit, až když hra skončí, přidej níže další useEffect.

    return () => {
      // Nepřidáváme newSocket.disconnect(); – socket zůstane připojený.
    };
  }, []); // spouští se pouze při mountu

  // Odpojení socketu, když hra skončí (volitelně)
  useEffect(() => {
    if (isGameOver && socket) {
      socket.emit("game_over", {"game_id":gameId, winner });
      socket.on("game_over", (data) => {
        console.log("Hra skončila, data přijatá od serveru:", data);
        console.log("Hra skončila, vítěz:", data.winner);
        socket.disconnect();
        console.log("Socket byl odpojen, protože hra skončila.");
    });
      socket.disconnect();
      console.log("Socket byl odpojen, protože hra skončila.");
    }
  }, [isGameOver, socket]);

  // Změna obrázku po 3 sekundách nečinnosti
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

  // Handler pro kliknutí na políčko
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
        alt={`Hráč ${currentPlayer}`}
        className="w-6 h-6"
      />
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <BannerSm title="Nová hra" url="../../Think-different-Academy_LOGO_oficialni-bile.svg" />
      <WinAnimation board={board} setIsGameOver={setIsGameOver} setWinner={setWinner} />
      <div
        className="h-full absolute top-0 left-0 w-full -z-10"
        style={{ background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)" }}
      ></div>

      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full flex justify-center items-center p-4">
          <Board
            board={board}
            onCellClick={handleCellClick}
            x="X_cervene.svg"
            o="O_modre.svg"
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="w-full lg:w-1/2 h-16 grid grid-cols-2 lg:grid-cols-1 gap-0 p-4 lg:mt-16 justify-items-center lg:justify-items-start">
          <SaveForm board={board} />
          <div className="hidden lg:block lg:ml-12">
            <ButtonLink link="../search" name="Seznam her" />
          </div>
          <ButtonLink link="../game" name="Nová hra" />
          <div className="mt-28 flex md:grid md:grid-cols-2 items-center bg-slate-100 w-full lg:min-w-[50%] lg:max-w-[65%] p-4 rounded-xl md:col-span-1 lg:grid col-span-2">
            <img
              src={imageAndText.src}
              alt="Dynamický obrázek"
              className="w-20 h-20 mb-2 bg-[#1A1A1A] rounded-lg mr-14 md:mr-0"
            />
            {playerIndicator}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstGame;
