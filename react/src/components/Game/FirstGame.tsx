import { useState, useEffect } from "react";
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
  const [imageAndText, setImageAndText] = useState({
    src: "./zarivka_playing_bile.svg",
    text: "Hraje se...",
  });
  const [isGameOver, setIsGameOver] = useState(false); // Stav pro kontrolu, jestli hra skončila
  const [winner, setWinner] = useState<"X" | "O" | null>(null); // Stav pro vítěze

  useEffect(() => {
    if (isGameOver) return; // Pokud je hra ukončena, neměníme obrázek a text

    const timer = setTimeout(() => {
      setImageAndText({
        src: "./zarivka_thinking_bile.svg", // Obrázek pro "přemýšlí"
        text: "Přemýšlí",
      });
    }, 3000); // Změní obrázek a text po 3 sekundách

    return () => clearTimeout(timer); // Vyčistí časovač při odmontování nebo pokud hra skončí
  }, [board, isGameOver]); // Spustí se po změně herního plánu a když hra skončí

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== "" || isGameOver) return; // Pokud je buňka už obsazená nebo hra skončila, nic se nestane

    // Aktualizace herního plánu
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? currentPlayer : cell))
    );

    setBoard(newBoard);

    // Přepnutí hráče
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

    // Reset obrázku a textu po kliknutí na buňku
    setImageAndText({
      src: "./zarivka_playing_bile.svg",
      text: "Hraje se...",
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <BannerSm title="Nová hra" url="../../Think-different-Academy_LOGO_oficialni-bile.svg" />
      <WinAnimation board={board} setIsGameOver={setIsGameOver} setWinner={setWinner} /> {/* Předáme setWinner do WinAnimation */}
      <div
        className="h-full absolute top-0 left-0 w-full -z-10"
        style={{
          background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
        }}
      ></div>
      <div className="flex w-full h-full">
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
          <Board board={board} onCellClick={handleCellClick} x="X_cervene.svg" o="O_modre.svg" />
        </div>

        <div className="lg:w-1/2 flex flex-col items-center p-4">
          <div className="lg:h-[60%] flex flex-col justify-center items-center">
            <SaveForm board={board} />
            <div className="ml-28">
              <ButtonLink link="../search" name="Seznam her" />
            </div>
            <ButtonLink link="../game" name="Nová hra" onClick/>
          </div>

          <div className="h-[25%] flex justify-center items-center bg-slate-100 w-[50%] rounded-xl">
            <div className="w-[80%] flex justify-center items-center">
            <div className={`w-[55%] flex justify-center items-center bg-[#1A1A1A] p-7 rounded-md ${imageAndText.text === "Přemýšlí" ? "scale-110" : ""}`}>
                <div className={`w-full h-auto ${imageAndText.text === "Přemýšlí" ? "w-[49.5%] p-0" : ""}`}>
                  <img
                    src={imageAndText.src}
                    alt="Dynamický obrázek"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="w-1/2 flex justify-center items-center">
                <p className="text-black font-bold text-lg p-3 flex items-center">
                  {imageAndText.text === "Přemýšlí" ? (
                    <>
                      Přemýšlí:
                      <span className="ml-2">
                        {currentPlayer === "X" ? (
                          <img
                            src="./X_cervene.svg"
                            alt="Hráč X"
                            className="w-6 h-6"
                          />
                        ) : (
                          <img
                            src="./O_modre.svg"
                            alt="Hráč O"
                            className="w-6 h-6"
                          />
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      Na tahu:
                      <span className="ml-2">
                        {currentPlayer === "X" ? (
                          <img
                            src="./X_cervene.svg"
                            alt="Hráč X"
                            className="w-6 h-6"
                          />
                        ) : (
                          <img
                            src="./O_modre.svg"
                            alt="Hráč O"
                            className="w-6 h-6"
                          />
                        )}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstGame;
