import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "./Components/Board";
import DelateButton from "./Components/DelateButton";
import UpdateButton from "./Components/UpdateButton";
import BannerSm from "../GlobalComponents/BannerSm";

interface Game {
  name: string;
  board: string[][];
}

function GamePageEdit() {
  const { uuid } = useParams(); // Získá UUID z URL
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<string[][] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    // Zavolej API pro načtení hry
    const fetchGame = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/games/${uuid}`);
        if (!response.ok) {
          throw new Error(`Chyba při načítání hry: ${response.status}`);
        }
        const data: Game = await response.json();
        setGame(data);
        setBoard(data.board); // Inicializace herní desky
      } catch (err: any) {
        setError(err.message || "Došlo k neznámé chybě.");
      }
    };
    fetchGame();
  }, [uuid, baseUrl]);

  if (error) return <div>Chyba: {error}</div>;
  if (!game || !board) return <div>Načítám...</div>;

  const handleCellClick = (row: number, col: number) => {
    // Pokud je buňka už obsazená, nic se nestane
    if (board[row][col] !== "") return;

    // Aktualizace herního plánu
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentPlayer : cell
      )
    );

    setBoard(newBoard);

    // Přepnutí hráče
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  return (
    <div className="h-screen flex flex-col">
      <BannerSm title={game.name} url="../../Think-different-Academy_LOGO_oficialni-bile.svg" />
      <div
        className="h-full absolute top-0 left-0 w-full -z-10"
        style={{
          background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
        }}
      ></div>
      <div className="flex w-full h-full">
        <div className="w-1/2 flex justify-center items-center p-4">
          <Board board={board} onCellClick={handleCellClick} x="/X_cervene.svg" o="/O_modre.svg"/>
        </div>

        <div className="w-1/2 flex flex-col items-center p-4">
          <div className="h-[60%] flex flex-col justify-center items-center">
            <UpdateButton board={board} />
            <DelateButton />
          </div>

          <div className="h-[35%] flex justify-center items-center bg-slate-100 w-[50%] rounded-xl">
            <div className="w-[80%] flex justify-center items-center">
              <div className="w-[55%] flex justify-center items-center bg-[#1A1A1A] p-7 rounded-md">
                <img src="../../zarivka_playing_bile.svg" alt="Logo" className="w-full h-auto" />
              </div>
              <div className="w-1/2 flex justify-center items-center">
                <p className="text-black font-bold text-lg p-3 flex items-center">
                  Na tahu:
                  <span className="ml-2">
                    {currentPlayer === "X" ? (
                      <img
                        src="../../X_cervene.svg"
                        alt="Hráč X"
                        className="w-6 h-6"
                      />
                    ) : (
                      <img
                        src="../../O_modre.svg"
                        alt="Hráč O"
                        className="w-6 h-6"
                      />
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePageEdit;
