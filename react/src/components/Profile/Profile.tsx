import { useNavigate } from "react-router-dom"; // Pro přesměrování
import { GetUseUser } from "../../Fetch/GetUseUser"; // Funkce pro získání uživatelských dat

const Profile = () => {
    const navigate = useNavigate(); // Hook pro přesměrování
    const { user } = GetUseUser();

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
