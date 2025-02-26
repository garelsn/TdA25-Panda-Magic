import Confetti from "react-confetti";
import { useEffect, useState } from "react";


type BoardProps = {
  board: string[][];
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<"X" | "O" | null>>;
};

const WinAnimation: React.FC<BoardProps> = ({ board, setIsGameOver, setWinner }) => {
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({
    width: undefined,
    height: undefined,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [winner, setWinnerState] = useState<"X" | "O" | null>(null);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    if (!isConfettiActive) {
      window.onresize = null;
    }
  }, [isConfettiActive]);

  function handleWindowSizeChange() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  function fireConfetti(winner: "X" | "O") {
    window.onresize = handleWindowSizeChange;
    setIsConfettiActive(true);
    setModalVisible(true);
    setWinnerState(winner);
  }

  function searchForWin() {
    if (isConfettiActive) {
      return;
    }

    const searchPatterns: Map<string, number[][]> = new Map<string, number[][]>([
      ["horizontalSet", [
        [-2, 0],
        [-1, 0],
        [1, 0],
        [2, 0],
      ]],
      ["verticalSet", [
        [0, -2],
        [0, -1],
        [0, 1],
        [0, 2],
      ]],
      ["diagonalSet", [
        [-2, -2],
        [-1, -1],
        [1, 1],
        [2, 2],
      ]],
      ["antiDiagonalSet", [
        [2, -2],
        [1, -1],
        [-1, 1],
        [-2, 2],
      ]],
    ]);

    function searchByPattern(pattern: number[][], position: number[]): boolean {
      const symbolToMatch = board[position[0]][position[1]];

      if (symbolToMatch === "") {
        return false;
      }

      for (const modifier of pattern) {
        try {
          if (board[position[0] + modifier[0]][position[1] + modifier[1]] !== symbolToMatch) {
            return false;
          }
        } catch (e) {
          return false;
        }
      }

      return true;
    }

    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        for (const searchPatternKey of searchPatterns) {
          if (searchByPattern(searchPatternKey[1], [y, x])) {
            const winner = board[y][x] === "X" ? "X" : "O";
            fireConfetti(winner);
            setWinner(winner);
            setIsGameOver(true);
            return;
          }
        }
      }
    }
  }

  useEffect(() => {
    if (board) {
      searchForWin();
    }
  }, [board]);

  return (
    <>
      {/* Modal */}
      {modalVisible && winner && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white text-center p-8 rounded-lg shadow-lg relative md:w-[40%] md:h-[20%] lg:w-[30%] lg:h-[20%] flex flex-col md:flex-row items-center justify-center">
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-gray-800 md:text-5xl">
                Vyhrál hráč
              </h2>
              <span className="inline-block w-12 h-12 ml-0 mt-4 md:ml-2 md:mt-0">
                <img
                  src={winner === "X" ? "../../X_cervene.svg" : "../../O_modre.svg"}
                  alt={`Hráč ${winner}`}
                  className="w-full h-full mt-4"
                />
              </span>
            </div>
            <button
              className="absolute top-2 right-3 text-2xl font-bold text-gray-600 md:text-5xl md:right-6 lg:right-4"
              onClick={() => setModalVisible(false)}
            >
              ×
            </button>
          </div>

          {isConfettiActive && <Confetti width={windowSize.width} height={windowSize.height} />}
        </div>
      )}
    </>
  );
};

export default WinAnimation;
