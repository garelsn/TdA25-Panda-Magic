import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Pro přesměrování

interface User {
    username: string;
    email: string;
    profileImage: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate(); // Hook pro přesměrování

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Log tokenu

            if (!token) {
                navigate("/login"); // Pokud není token, přesměruj na login
                return;
            }

            const response = await fetch("http://127.0.0.1:5000/api/v1/profile", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }, // Správný formát tokenu
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data);
            } else {
                console.error("Chyba při načítání profilu:", data.message);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Funkce pro odhlášení
    const handleLogout = () => {
        localStorage.removeItem("token"); // Smazání tokenu
        navigate("/login"); // Přesměrování na přihlašovací stránku
    };
    console.log(user);
    return (
        <div>
            {user ? (
                <>
                    <h2>Profil</h2>
                    <p>Uživatel: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <img src={`http://127.0.0.1:5000/uploads/${user.profileImage}`} alt="Profil" />
                    <br />
                    <button onClick={handleLogout}>Odhlásit</button> Přidané tlačítko
                </>
            ) : (
                <p>Načítání...</p>
            )}
        </div>
    );
};

export default Profile;
