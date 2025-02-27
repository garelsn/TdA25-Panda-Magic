import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameHistory {
  username: string;  // Použití username místo opponent
  result: string;
}

interface User {
  uuid: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
  loginAt: string;
  wins: number;
  losses: number;
  draws: number;
  gameHistory: GameHistory[] | string | null;
}

export function GetUseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const socketUrl = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5000' 
    : window.location.origin;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${socketUrl}/api/v1/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          let processedUser: User = {
            uuid: data.uuid || "",
            username: data.username || "Není zadáno",
            email: data.email || "",
            profileImage: data.profileImage || "",
            createdAt: data.createdAt || "",
            loginAt: data.loginAt || "",
            wins: data.wins || 0,
            losses: data.losses || 0,
            draws: data.draws || 0,
            gameHistory: null,
          };

          if (data.games && typeof data.games === "string") {
            try {
              const parsedGames = JSON.parse(data.games);
              if (Array.isArray(parsedGames)) {
                processedUser.gameHistory = parsedGames.map((game: any) => ({
                  username: game.username || "Neznámý", // Použití username místo opponent
                  result: game.result || "Není k dispozici",
                }));
              }
            } catch (e) {
              console.error("Chyba při parsování gameHistory:", e);
              processedUser.gameHistory = [];
            }
          } else if (Array.isArray(data.games)) {
            processedUser.gameHistory = data.games.map((game: any) => ({
              username: game.username || "Neznámý",
              result: game.result || "Není k dispozici",
            }));
          }

          setUser(processedUser);
        } else if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(data.message || "Chyba při načítání profilu");
        }
      } catch (err) {
        setError("Nepodařilo se připojit k serveru");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return { user, isLoading, error };
}
