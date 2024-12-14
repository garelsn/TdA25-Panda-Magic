import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Game {
  name: string;
}

function GamePage() {
  const { uuid } = useParams(); // Získá UUID z URL
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL ||""
  console.log(baseUrl)
  useEffect(() => {
    // Zavolej API pro načtení hry
    fetch(`${baseUrl}/api/v1/games/${uuid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Chyba při načítání hry: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setGame(data))
      .catch((err) => setError(err.message));
  }, [uuid]);

  if (error) return <div>Chyba: {error}</div>;
  if (!game) return <div>Načítám...</div>;
  console.log(game)
  return (
    <div>
      <h1>{game.name}</h1>
    </div>
  );
}

export default GamePage;
