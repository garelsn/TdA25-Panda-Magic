import React from "react";

type BoardProps = {
  board: string[][];
  onCellClick: (row: number, col: number) => void;
  x: string;
  o: string;
  currentPlayer: "X" | "O"; // Přidáno pro kontrolu aktuálního hráče
};

const Board: React.FC<BoardProps> = ({ board, onCellClick, x, o, currentPlayer }) => {
  return (
    <div
      className="grid grid-cols-15 gap-0.5 w-fit"
      style={{
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`, // Dynamický počet sloupců
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            onClick={() => onCellClick(rowIndex, colIndex)}
            key={`${rowIndex}-${colIndex}`}
            className={`w-5 h-5 md:w-8 md:h-8 lg:w-10 lg:h-10 flex items-center justify-center cursor-pointer rounded-md bg-white 
              ${cell === "" ? `hover:scale-110 transition-transform duration-200 ease-out` : ""}
              ${
                cell === "" && currentPlayer === "X"
                  ? "hover:bg-red-200"
                  : cell === "" && currentPlayer === "O"
                  ? "hover:bg-blue-200"
                  : ""
              }`}
          >
            {cell === "X" && <img src={x} alt="X" className="w-8 h-8" />}
            {cell === "O" && <img src={o} alt="O" className="w-8 h-8" />}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
