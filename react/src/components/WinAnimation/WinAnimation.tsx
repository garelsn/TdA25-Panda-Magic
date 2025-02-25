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

const WinAnimation: React.FC<BoardProps> = ({ board, setIsGameOver, setWinner, socket, gameId, player, showWinModal, setShowWinModal }) => {
  const { width, height } = useWindowSize();
  const { rematchRequested, opponentWantsRematch, requestRematch } = useRematch(socket, gameId, player);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [winner, setWinnerState] = useState<"X" | "O" | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("game_started", () => {
      setIsGameOver(false);
      setWinner(null);
      setIsConfettiActive(false);
      setShowWinModal(false);
    });
  }, [socket]);

  useEffect(() => {
    const foundWinner = checkWinner(board);
    if (foundWinner) {
      setWinner(foundWinner);
      setWinnerState(foundWinner);
      setIsGameOver(true);
      setIsConfettiActive(true);
      setShowWinModal(true); 
    }
  }, [board]);

  return (
    <>
      {winner && showWinModal && (
        <WinModal 
          winner={winner} 
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
