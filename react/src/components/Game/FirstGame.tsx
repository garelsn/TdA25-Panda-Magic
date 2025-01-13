import { useState, useEffect } from "react";
import Board from "./Components/Board";
import SaveForm from "./Components/SaveForm";
import BannerSm from "../GlobalComponents/BannerSm";
import ButtonLink from "../GlobalComponents/ButtonLink";
import WinAnimation from "../WinAnimation/WinAnimation";

function FirstGame() {
  const createEmptyBoard = (rows: number, cols: number) =>
    Array.from({ length: rows }, () => Array(cols).fill(""));

  const [board, setBoard] = useState(createEmptyBoard(15, 15));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [imageAndText, setImageAndText] = useState({
    src: "./zarivka_playing_bile.svg",
    text: "Hraje se...",
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"X" | "O" | null>(null);

  useEffect(() => {
    if (!isGameOver) {
      const timer = setTimeout(() => {
        setImageAndText({
          src: "./zarivka_thinking_bile.svg",
          text: "Přemýšlí",
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [board, isGameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || isGameOver) return;

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentPlayer : cell
      )
    );
    setBoard(newBoard);
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
    setImageAndText({ src: "./zarivka_playing_bile.svg", text: "Hraje se..." });
  };

  const playerIndicator = (
    <div className="flex items-center">
      <span className="mr-2 font-bold">{imageAndText.text === "Přemýšlí" ? "Přemýšlí:" : "Na tahu:"}</span>
      <img
        src={currentPlayer === "X" ? "./X_cervene.svg" : "./O_modre.svg"}
        alt={`Hráč ${currentPlayer}`}
        className="w-6 h-6"
      />
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <BannerSm title="Nová hra" url="../../Think-different-Academy_LOGO_oficialni-bile.svg" />
      <WinAnimation board={board} setIsGameOver={setIsGameOver} setWinner={setWinner} />
      <div
        className="h-full absolute top-0 left-0 w-full -z-10"
        style={{ background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)" }}
      ></div>

      {/* Flex container for responsiveness */}
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Board section */}
        <div className="w-full flex justify-center items-center p-4">
          <Board board={board} onCellClick={handleCellClick} x="X_cervene.svg" o="O_modre.svg" currentPlayer={currentPlayer}/>
        </div>

        {/* Sidebar content */}
        <div className="w-full lg:w-1/2 h-16 grid grid-cols-2 lg:grid-cols-1 gap-0 p-4 lg:mt-16 justify-items-center lg:justify-items-start">
          <SaveForm board={board} />
            <div className="hidden lg:block lg:ml-12">
            <ButtonLink link="../search" name="Seznam her" />
            </div>

            <ButtonLink link="../game" name="Nová hra" onClick/>
          
          <div className="mt-28  grid-cols-2 items-center bg-slate-100 w-full lg:min-w-[50%] lg:max-w-[65%] p-4 rounded-xl hidden lg:grid">
            <img src={imageAndText.src} alt="Dynamický obrázek" className="w-20 h-20 mb-2 bg-[#1A1A1A] rounded-lg" />
            {playerIndicator}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstGame;
