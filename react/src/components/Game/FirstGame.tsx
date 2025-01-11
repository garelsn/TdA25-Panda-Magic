import { useState } from "react";
import Board from "./Components/Board";
import SaveForm from "./Components/SaveForm";
import BannerSm from "../GlobalComponents/BannerSm";
import WinAnimation from "../WinAnimation/WinAnimation";
function FirstGame() {


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

        <WinAnimation board={board}/>
        
      <SaveForm board={board}/>
      <p>Na tahu: {currentPlayer}</p>
      <Board board={board} onCellClick={handleCellClick}/>

      <h1>game</h1>
    </div>
  );
}

export default FirstGame;
