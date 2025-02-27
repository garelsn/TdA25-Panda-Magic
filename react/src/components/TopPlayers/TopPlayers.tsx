import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ButtonLink from "../GlobalComponents/ButtonLink";

interface Player {
  rank: number;
  name: string;
  elo: number;
  profileImage: string;
}

const TopPlayers = () => {
  const navigate = useNavigate();
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funkce pro zavření (návrat na domovskou stránku)
  const handleClose = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setIsLoading(true);
      setError(null);
      // Uprav URL dle tvého API endpointu
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:5000/api/v1/top-players"
          : `${window.location.origin}/api/v1/top-players`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Pokud potřebuješ token, odkomentuj následující řádek:
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTopPlayers(data); // Očekává se, že data je pole s 50 nejlepšími hráči
        } else {
          setError(data.message || "Chyba při načítání dat");
        }
      } catch (err) {
        setError("Nepodařilo se připojit k serveru");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)" }}
    >
      {/* Horní část s logem a tlačítkem */}
      <div className="bg-[#1A1A1A] p-6 flex items-center justify-between">
        <Link to="/" className="m-4 z-50">
          <img
            src="./Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-16 h-16" // Upraveno na menší velikost podle obrázku
          />
        </Link>
        <h1 className="text-white text-2xl font-bold  items-center space-x-4">Žebříček</h1>

      </div>

      {/* Hlavní obsah – seznam top hráčů */}
      <div className="p-6 flex justify-center">
        {isLoading ? (
          <p>Načítání...</p>
        ) : error ? (
          <p>Chyba: {error}</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md w-[400px] border border-gray-300">
            <h2 className="text-xl font-bold text-center mb-4">Top hráči</h2>
            {topPlayers.map((player) => (
              <div
                key={player.rank}
                className="bg-[#E8E8E8] p-4 mb-2 rounded-md flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{player.rank}.</span>
                  <div className="w-10 h-10 border-2 border-black rounded-lg overflow-hidden">
                    <img
                      src={player.profileImage}
                      alt={`${player.name} profil`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p>{player.name}</p>
                </div>
                <p>ELO {player.elo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPlayers;
