import Confetti from "react-confetti";
import { useEffect, useState } from "react";

type BoardProps = {
  board: string[][];
};

const WinAnimation: React.FC<BoardProps> = ({ board }) => {

  // Define the type for windowSize
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // Explicitly define windowSize with types for width and height
  const [windowSize, setWindowSize] = useState <{ width: number | undefined, height: number | undefined }> ({ //typescript nonsence that has to be here for some reason
    width: undefined,
    height: undefined
  });

  function handleWindowSizeChange() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  useEffect(() => { if (!isConfettiActive) {window.onresize = null; }}, [isConfettiActive]) // clearing the onresize event listener

  function fireConfetti() {
    // set event handler
    window.onresize = () => { handleWindowSizeChange(); }
    
    setIsConfettiActive(true);
  }

  function searchForWin() {
    if (isConfettiActive) {
      return;
    }

    // search patterns
    const searchPatterns: Map<string, number[][]> = new Map<string, number[][]>([
      ['horizontalSet', [[-2, 0], [-1, 0], [1, 0], [2, 0]]],
      ['verticalSet', [[0, -2], [0, -1], [0, 1], [0, 2]]],
      ['diagonalSet', [[-2, -2], [-1, -1], [1, 1], [2, 2]]],
      ['antiDiagonalSet', [[2, -2], [1, -1], [-1, 1], [-2, 2]]]
    ])
    function searchByPattern(pattern: number[][], position: number[]): Boolean {
      var symbolToMatch = board[position[0]][position[1]];

      if (symbolToMatch == '') {
        return false;
      }
      for (var modifier of pattern) {
        try {
          if (board[position[0] + modifier[0]][position[1] + modifier[1]] != symbolToMatch) {
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
