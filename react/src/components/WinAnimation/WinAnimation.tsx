import Confetti from "react-confetti";
import { useEffect, useState } from "react";

type BoardProps = {
  board: string[][];
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<"X" | "O" | null>>; // Přidáme setWinner pro předání vítěze
};

const WinAnimation: React.FC<BoardProps> = ({ board, setIsGameOver, setWinner }) => {
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [windowSize, setWindowSize] = useState<{ width: number | undefined, height: number | undefined }>({
    width: undefined,
    height: undefined
  });

  function handleWindowSizeChange() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  useEffect(() => {
    if (!isConfettiActive) {
      window.onresize = null; // clearing the onresize event listener
    }
  }, [isConfettiActive]);

  function fireConfetti() {
    window.onresize = () => { handleWindowSizeChange(); }
    setIsConfettiActive(true);
  }

  function searchForWin() {
    if (isConfettiActive) {
      return;
    }

    const searchPatterns: Map<string, number[][]> = new Map<string, number[][]>([
      ['horizontalSet', [[-2, 0], [-1, 0], [1, 0], [2, 0]]],
      ['verticalSet', [[0, -2], [0, -1], [0, 1], [0, 2]]],
      ['diagonalSet', [[-2, -2], [-1, -1], [1, 1], [2, 2]]],
      ['antiDiagonalSet', [[2, -2], [1, -1], [-1, 1], [-2, 2]]]
    ]);

    function searchByPattern(pattern: number[][], position: number[]): boolean {
      var symbolToMatch = board[position[0]][position[1]];

      if (symbolToMatch == '') {
        return false;
      }

      for (var modifier of pattern) {
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
        for (let searchPatternKey of searchPatterns) {
          if (searchByPattern(searchPatternKey[1] as number[][], [y, x])) {
            fireConfetti();
            setWinner(board[y][x] === "X" ? "X" : "O"); // Nastavení vítěze
            setIsGameOver(true); // Ukončení hry
            return;
          }
        }
      }
    }
  }

  if (board != null) {
    searchForWin();
  }

  return (
    <div className="">
      {isConfettiActive && <Confetti width={windowSize.width} height={windowSize.height} />}
    </div>
  );
}

export default WinAnimation;
