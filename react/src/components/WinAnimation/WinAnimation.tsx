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

  // Reset funkce
  const resetWinState = () => {
    console.log("Resetuji vítězný stav");
    setIsGameOver(false);
    setWinner(null);
    setLocalWinner(null);
    setIsConfettiActive(false);
    setShowWinModal(false);
  };

  useEffect(() => {
    if (!socket) return;

    const handleGameStarted = () => {
      console.log("WinAnimation: Nová hra začala, resetuji stavy");
      resetWinState();
    };

    const handleRestartGame = () => {
      console.log("WinAnimation: Hra restartována, resetuji stavy");
      resetWinState();
    };

    // Přidání event listenerů
    socket.on("game_started", handleGameStarted);
    socket.on("restart_game", handleRestartGame);

    // Cleanup
    return () => {
      if (socket) {
        socket.off("game_started", handleGameStarted);
        socket.off("restart_game", handleRestartGame);
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
    } else if (!foundWinner && board.some(row => row.some(cell => cell !== ""))) {
      // Hra probíhá - není vítěz, ale na desce jsou tahy
      console.log("Hra probíhá, žádný vítěz");
    }
  }, [board, setWinner, setIsGameOver, setShowWinModal, localWinner]);

  // Pokud se změní gameId, měli bychom resetovat stav vítězství
  useEffect(() => {
    if (gameId) {
      console.log("Změna gameId, resetuji stavy");
      resetWinState();
    }
  }, [gameId]);

  return (
    <>
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