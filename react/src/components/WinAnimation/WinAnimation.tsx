import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "./hooks/useWindowSize";
import useRematch from "./hooks/useRematch";
import { checkWinner } from "./utils/gameLogic";
import WinModal from "./WinModal";

type BoardProps = {
  board: string[][];
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<"X" | "O" | null>>;
  socket: any;
  gameId: string;
  player: "X" | "O";
  showWinModal: boolean;
  setShowWinModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const WinAnimation: React.FC<BoardProps> = ({ 
  board, 
  setIsGameOver, 
  setWinner, 
  socket, 
  gameId, 
  player, 
  showWinModal, 
  setShowWinModal 
}) => {
  const { width, height } = useWindowSize();
  const { rematchRequested, opponentWantsRematch, requestRematch } = useRematch(socket, gameId, player);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [localWinner, setLocalWinner] = useState<"X" | "O" | null>(null);
  
  // Časovače pro hráče (60 sekund = 1 minuta), nyní synchronizovány se serverem
  const [xTimer, setXTimer] = useState(60);
  const [oTimer, setOTimer] = useState(60);
  
  // Aktuální hráč na tahu (X začíná)
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");

  // Reset funkce
  const resetWinState = () => {
    console.log("Resetuji vítězný stav");
    setIsGameOver(false);
    setWinner(null);
    setLocalWinner(null);
    setIsConfettiActive(false);
    setShowWinModal(false);
    // Reset časovačů se provede automaticky díky serveru
  };

  useEffect(() => {
    if (!socket) return;

    const handleGameStarted = (data: any) => {
      console.log("WinAnimation: Nová hra začala, resetuji stavy", data);
      resetWinState();
      // Nastavení výchozích časových limitů z dat od serveru
      if (data.time_limit) {
        setXTimer(data.time_limit);
        setOTimer(data.time_limit);
      }
      setCurrentTurn("X"); // X vždy začíná
    };

    const handleRestartGame = () => {
      console.log("WinAnimation: Hra restartována, resetuji stavy");
      resetWinState();
    };

    const handleMoveMade = (data: any) => {
      // Při tahu aktualizujeme informaci o tom, kdo je na tahu
      if (data.next_turn) {
        setCurrentTurn(data.next_turn);
      }
    };

    const handleTimerUpdate = (data: any) => {
      // Aktualizace časovačů podle serveru
      if (data.X_time !== undefined) setXTimer(data.X_time);
      if (data.O_time !== undefined) setOTimer(data.O_time);
      if (data.current_turn) setCurrentTurn(data.current_turn);
    };

    const handleTimeOut = (data: any) => {
      // Zpracování vypršení času hráči
      if (data.winner) {
        console.log(`Čas vypršel hráči ${data.player}, vyhrává ${data.winner}`);
        setWinner(data.winner);
        setLocalWinner(data.winner);
        setIsGameOver(true);
        setIsConfettiActive(true);
        setShowWinModal(true);
      }
    };

    // Přidání event listenerů
    socket.on("game_started", handleGameStarted);
    socket.on("restart_game", handleRestartGame);
    socket.on("move_made", handleMoveMade);
    socket.on("timer_update", handleTimerUpdate);
    socket.on("time_out", handleTimeOut);

    // Cleanup
    return () => {
      if (socket) {
        socket.off("game_started", handleGameStarted);
        socket.off("restart_game", handleRestartGame);
        socket.off("move_made", handleMoveMade);
        socket.off("timer_update", handleTimerUpdate);
        socket.off("time_out", handleTimeOut);
      }
    };
  }, [socket, setIsGameOver, setWinner, setShowWinModal]);

  useEffect(() => {
    const foundWinner = checkWinner(board);
    if (foundWinner && !localWinner) {
      console.log(`Nalezen vítěz: ${foundWinner}`);
      setWinner(foundWinner);
      setLocalWinner(foundWinner);
      setIsGameOver(true);
      setIsConfettiActive(true);
      setShowWinModal(true);
      
      // Informovat server o výhře
      if (socket && gameId) {
        socket.emit("game_over", {
          game_id: gameId,
          winner: foundWinner,
          reason: "normal"
        });
      }
    } else if (!foundWinner && board.some(row => row.some(cell => cell !== ""))) {
      // Hra probíhá - není vítěz, ale na desce jsou tahy
      console.log("Hra probíhá, žádný vítěz");
    }
  }, [board, setWinner, setIsGameOver, setShowWinModal, localWinner, socket, gameId]);

  // Pokud se změní gameId, měli bychom resetovat stav vítězství
  useEffect(() => {
    if (gameId) {
      console.log("Změna gameId, resetuji stavy");
      resetWinState();
    }
  }, [gameId]);

  // Formátování času (mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Časovače */}
      <div className="flex justify-between mb-4 mt-2 px-4">
        <div className={`p-2 rounded-md ${currentTurn === "X" ? "bg-blue-100 font-bold" : ""}`}>
          Hráč X: {formatTime(xTimer)}
        </div>
        <div className={`p-2 rounded-md ${currentTurn === "O" ? "bg-red-100 font-bold" : ""}`}>
          Hráč O: {formatTime(oTimer)}
        </div>
      </div>
      
      {localWinner && showWinModal && (
        <WinModal 
          winner={localWinner} 
          rematchRequested={rematchRequested} 
          opponentWantsRematch={opponentWantsRematch} 
          requestRematch={requestRematch} 
        />
      )}
      {isConfettiActive && <Confetti width={width} height={height} />}
    </>
  );
};

export default WinAnimation;