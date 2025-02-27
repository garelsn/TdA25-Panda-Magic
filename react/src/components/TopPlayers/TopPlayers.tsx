import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import ButtonLink from "../GlobalComponents/ButtonLink";

interface Player {
  rank: number;
  username: string;
  elo: number;
  profileImage: string;
}

const TopPlayers = () => {
  // const navigate = useNavigate();
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funkce pro zavření (návrat na domovskou stránku)
  // const handleClose = () => {
  //   navigate("/");
  // };

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setIsLoading(true);
      setError(null);
      // Uprav URL dle tvého API endpointu
      const apiUrl =
        process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:5000/api/v1/users"
          : `${window.location.origin}/api/v1/users`;
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

  // Seřazení hráčů podle ELO bodů - přesunuto do useEffect, aby se neprovádělo při každém renderu
  useEffect(() => {
    if (topPlayers.length > 0) {
      setTopPlayers(prev => [...prev].sort((a, b) => b.elo - a.elo));
    }
  }, [topPlayers.length]);

  // Funkce pro vytvoření dvojic hráčů pro layout na PC
  const createPlayerPairs = () => {
    const pairs = [];
    for (let i = 0; i < topPlayers.length; i += 2) {
      // Vytváříme páry hráčů (i, i+1)
      pairs.push(topPlayers.slice(i, i + 2));
    }
    return pairs;
  };

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
            className="w-56 h-16" // Upraveno na menší velikost podle obrázku
          />
        </Link>
        <h1 className="text-white text-2xl font-bold items-center space-x-4">Žebříček</h1>
      </div>

      {/* Hlavní obsah – seznam top hráčů */}
      <div className="p-6 flex justify-center">
        {isLoading ? (
          <p className="text-white">Načítání...</p>
        ) : error ? (
          <p className="text-white">Chyba: {error}</p>
        ) : (
          <div className="w-full max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Top hráči</h2>
            
            {/* Mobilní zobrazení - jeden sloupec (defaultní) */}
            <div className="md:hidden">
              {topPlayers.map((player, index) => (
                <div
                  key={player.rank || index}
                  className="bg-white p-4 mb-2 rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{index + 1}.</span>
                    <div className="w-10 h-10 border-2 border-black rounded-lg overflow-hidden">
                      <img
                        src={player.profileImage}
                        alt={`${player.username} profil`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p>{player.username}</p>
                  </div>
                  <p>ELO: {player.elo}</p>
                </div>
              ))}
            </div>
            
            {/* PC zobrazení - dva sloupce */}
            <div className="hidden md:block">
              {createPlayerPairs().map((pair, pairIndex) => (
                <div key={pairIndex} className="flex gap-4 mb-2">
                  {pair.map((player, playerIndex) => (
                    <div
                      key={player.rank || (pairIndex * 2 + playerIndex)}
                      className="bg-white p-4 rounded-md flex items-center justify-between flex-1 "
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xl">{pairIndex * 2 + playerIndex + 1}.</span>
                        <div className="w-10 h-10 border-2 border-black rounded-lg overflow-hidden">
                          <img
                            src={player.profileImage}
                            alt={`${player.username} profil`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-2xl">{player.username}</p>
                      </div>
                      <p className="text-2xl">ELO: {player.elo}</p>
                    </div>
                  ))}
                  {/* Pokud je v páru jen jeden hráč, přidáme prázdný div pro zachování layoutu */}
                  {pair.length === 1 && <div className="flex-1"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPlayers;