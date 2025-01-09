import { useState } from "react";
import Board from "./Board";
import SaveForm from "./SaveForm";
import BannerSm from "./BannerSm";
function Game(props:any) {


const createEmptyBoard = (rows: number, cols: number): string[][] => {
    return Array.from({ length: rows }, () => Array(cols).fill(""));
};

const [board, setBoard] = useState(createEmptyBoard(15, 15));
const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

const handleCellClick = (row: number, col: number) => {
  // Pokud je buňka už obsazená, nic se nestane
  if (board[row][col] !== "") return;

  // Aktualizace herního plánu
  const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? currentPlayer : cell))
  );

  setBoard(newBoard);

  // Přepnutí hráče
  setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
};
  return (
    <div className="h-screen">
      <BannerSm title="Nová hra"/>
      <SaveForm board={board}/>
      <p>Na tahu: {currentPlayer}</p>
      <Board board={board} onCellClick={handleCellClick}/>
      {
        props.t
      }
      <h1>game</h1>
    </div>
  );
}

export default Game;
