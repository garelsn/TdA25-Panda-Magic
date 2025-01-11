import { useState } from "react";
import Board from "./Components/Board";
import SaveForm from "./Components/SaveForm";
import BannerSm from "../GlobalComponents/BannerSm";

import ButtonLink from "../GlobalComponents/ButtonLink";

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
  <div className="h-screen flex flex-col">
    <BannerSm title="Nová hra" />
    <div
      className="h-full absolute top-0 left-0 w-full -z-10"
      style={{
        background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
      }}
    ></div>
    <div className="flex w-full h-full">  
      <div className="w-1/2 flex justify-center items-center p-4">
        <Board board={board} onCellClick={handleCellClick} />
      </div>
      
      <div className="w-1/2 flex flex-col items-center p-4">
        <div className="h-[60%] flex justify-center items-center">
          <SaveForm board={board} />
          <ButtonLink link="../search" name="Seznam her" />
          <ButtonLink link="../game" name="Nová hra" />
        </div>
        <div className="h-[40%] flex justify-center items-center">
          <p className="text-white">Na tahu: {currentPlayer}</p>
        </div>
      </div>


  return (
    <div className="h-screen">
      <BannerSm title="Nová hra"/>
        <WinAnimation board={board}/>
        
      <SaveForm board={board}/>
      <p>Na tahu: {currentPlayer}</p>
      <Board board={board} onCellClick={handleCellClick}/>

      <h1>game</h1>
    </div>
  </div>
);

}

export default FirstGame;
