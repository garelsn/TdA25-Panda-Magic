import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface User {
    username: string;
    email: string;
    profileImage: string;
    uuid:string;
}

export function GetUseUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const socketUrl = process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:5000' 
    : '';
  
    useEffect(() => {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
  
        const token = localStorage.getItem("token");
        // console.log("Token:", token); // Log tokenu (můžeš odstranit, pokud nepotřebuješ)
  
        if (!token) {
          navigate("/login"); // Přesměrování na login, pokud není token
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
            setUser(data); // Nastavení uživatelských dat
          } else if (response.status === 401) {
            localStorage.removeItem("token"); // Odstranění neplatného tokenu
            navigate("/login"); // Přesměrování na login při neautorizovaném přístupu
          } else {
            setError(data.message || "Chyba při načítání profilu"); // Nastavení chyby
          }
        } catch (err) {
          setError("Nepodařilo se připojit k serveru"); // Chyba při selhání sítě
        } finally {
          setIsLoading(false); // Konec načítání
        }
      };
  
      fetchProfile();
    }, [navigate]);
  
    return { user, isLoading, error };
  }