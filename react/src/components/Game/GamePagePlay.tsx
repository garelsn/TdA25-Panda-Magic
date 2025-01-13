import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Board from "./Components/Board";
import BannerSm from "../GlobalComponents/BannerSm";
import WinAnimation from "../WinAnimation/WinAnimation";
import ButtonLink from "../GlobalComponents/ButtonLink";

interface Game {
  name: string;
  board: string[][];
}

function GamePagePlay() {
  const { uuid } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<string[][] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [imageAndText, setImageAndText] = useState({
    src: "../../zarivka_playing_bile.svg",
    text: "Hraje se...",
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/games/${uuid}`);
        if (!response.ok) {
          throw new Error(`Chyba při načítání hry: ${response.status}`);
        }
        const data: Game = await response.json();
        setGame(data);
        setBoard(data.board);
      } catch (err: any) {
        setError(err.message || "Došlo k neznámé chybě.");
      }
    };
    fetchGame();
  }, [uuid, baseUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageAndText({
        src: "../../zarivka_thinking_bile.svg",
        text: "Přemýšlí",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [board]);

  const handleCellClick = (row: number, col: number) => {
    if (board![row][col] !== "") return;

    const newBoard = board!.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentPlayer : cell
      )
    );

    setBoard(newBoard);
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
    setImageAndText({ src: "../../zarivka_playing_bile.svg", text: "Hraje se..." });
  };

  if (error) return <div>Chyba: {error}</div>;
  if (!game || !board) return <div>Načítám...</div>;

  const playerIndicator = (
    <div className="flex items-center">
      <span className="mr-2 font-bold">
        {imageAndText.text === "Přemýšlí" ? "Přemýšlí:" : "Na tahu:"}
      </span>
      <img
        src={currentPlayer === "X" ? "../../X_cervene.svg" : "../../O_modre.svg"}
        alt={`Hráč ${currentPlayer}`}
        className="w-6 h-6"
      />
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <BannerSm
        title={game.name}
        url="../../Think-different-Academy_LOGO_oficialni-bile.svg"
      />
      
      <div
        className="h-full absolute top-0 left-0 w-full -z-10"
        style={{ background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)" }}
      ></div>
    <WinAnimation board={board} setIsGameOver={setIsGameOver} setWinner={setWinner} />
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full flex justify-center items-center p-4">
          <Board
            board={board}
            onCellClick={handleCellClick}
            x="../X_cervene.svg"
            o="../O_modre.svg"
            currentPlayer={currentPlayer}
          />
        </div>

        <div className="w-full lg:w-1/2 h-16 grid grid-cols-2 lg:grid-cols-1 gap-0 p-4 lg:mt-28 justify-items-center lg:justify-items-start ">
            <ButtonLink link="../search" name="Seznam her" />
          <div className="lg:ml-12">
            <ButtonLink link="../game" name="Restartovat hru" onClick />
          </div>
          <div className="mt-20 grid-cols-2 items-center bg-slate-100 w-full lg:min-w-[50%] lg:max-w-[65%] p-4 rounded-xl hidden lg:grid">
            <img
              src={imageAndText.src}
              alt="Dynamický obrázek"
              className="w-20 h-20 mb-2 bg-[#1A1A1A] rounded-lg"
            />
            {playerIndicator}
          </div>

          <div className="mt-6 grid-cols-2 items-center bg-slate-100 w-full lg:min-w-[50%] lg:max-w-[65%] p-4 rounded-xl hidden lg:grid">
            <img
              src={imageAndText.src}
              alt="Dynamický obrázek"
              className="w-20 h-20 mb-2 bg-[#1A1A1A] rounded-lg"
            />
            "obtiznost"
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePagePlay;
