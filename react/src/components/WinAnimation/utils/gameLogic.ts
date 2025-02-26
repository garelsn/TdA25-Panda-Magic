export const checkWinner = (board: string[][]): "X" | "O" | null => {
    const patterns: number[][][] = [
      [[-2, 0], [-1, 0], [1, 0], [2, 0]], // Horizontální
      [[0, -2], [0, -1], [0, 1], [0, 2]], // Vertikální
      [[-2, -2], [-1, -1], [1, 1], [2, 2]], // Diagonální \
      [[2, -2], [1, -1], [-1, 1], [-2, 2]] // Diagonální /
    ];
  
    const isMatch = (row: number, col: number, pattern: number[][]) => {
      const symbol = board[row][col];
      if (symbol === "") return false;
      return pattern.every(([dx, dy]) => {
        const newRow = row + dx, newCol = col + dy;
        return board[newRow]?.[newCol] === symbol;
      });
    };
  
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        for (const pattern of patterns) {
          if (isMatch(y, x, pattern)) return board[y][x] as "X" | "O";
        }
      }
    }
  
    return null;
  };
  