import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Board from "./Components/Board";
import BannerSm from "../GlobalComponents/BannerSm";
interface Game {
  name: string;
  board: string[][];
}

function GamePagePlay() {
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
    <div className="h-screen">
      <BannerSm title={game.name} url="../../Think-different-Academy_LOGO_oficialni-bile.svg"/>
      <p>Na tahu: {currentPlayer}</p>
      <Board board={board} onCellClick={handleCellClick} x="../X_cervene.svg" o="../O_modre.svg"/>
    </div>
  );
}

export default GamePagePlay;
