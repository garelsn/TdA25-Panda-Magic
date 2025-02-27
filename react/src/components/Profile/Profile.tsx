import { useNavigate, Link } from "react-router-dom";
import { GetUseUser } from "../../Fetch/GetUseUser";
import ButtonLink from "../GlobalComponents/ButtonLink";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading, error } = GetUseUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (isLoading) {
    return <p>Načítání...</p>;
  }

  if (error) {
    return <p>Chyba: {error}</p>;
  }

  if (!user) {
    return <p>Profil není k dispozici.</p>;
  }
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)" }}
    >
      {/* Horní lišta s logem a tlačítkem */}
      <div className="bg-[#1A1A1A] p-6 flex items-center justify-between">
        <Link to="/" className="top-0 left-0 m-4 z-50">
          <img
            src="./Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-1/3 md:w-[30%] lg:w-[20%] absolute top-3 left-5 m-4 z-20"
          />
        </Link>
        <h1 className="text-white text-4xl font-bold md:mt-0 mt-12 md:ml-0 ml-9">Můj profil</h1>
        <div className="flex items-center space-x-4">
          {/* Pro mobilní verzi tlačítko odhlášení 2x menší */}
          <div onClick={handleLogout} className="transform scale-75 md:scale-100">
            <ButtonLink link="#" name="ODHLÁSIT" />
          </div>
        </div>
      </div>

      {/* Mobilní rozložení */}
      <div className="md:hidden p-6 flex flex-col space-y-6">
        {/* Panel s profilovými informacemi */}
        <div className="bg-[#D9D9D9] p-4 rounded-lg shadow-md w-full h-[100px] text-center">
          <div className="flex items-center space-x-4 h-full">
            {/* Profilový obrázek */}
            <img className="w-20 h-20  object-cover  rounded-md" src={user.profileImage} alt="User profile" />
            {/* Jméno a datum registrace */}
            <div className="text-left flex flex-col justify-center">
              <p>
                <strong className="font-bold">Jméno:</strong> {user.username || "Není zadáno"}
              </p>
              <p>
                <strong className="font-bold">Datum registrace:</strong>{" "}
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Není zadáno"}
              </p>
            </div>
          </div>
        </div>

        {/* Panel se statistikami */}
        <div className="bg-[#D9D9D9] rounded-lg shadow-md w-full h-[180px] text-center flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4">Statistiky</h3>
          <p>
            <strong>Výhry:</strong> {user.wins || 0}
          </p>
          <p>
            <strong>Prohry:</strong> {user.losses || 0}
          </p>
          <p>
            <strong>Remízy:</strong> {user.draws || 0}
          </p>
        </div>

        {/* Panel s historií her */}
        <div className="bg-[#D9D9D9] p-4 rounded-lg shadow-md w-full text-center">
          <h3 className="text-lg font-bold">Historie her</h3>
          <div className="mt-2">
            {Array.isArray(user.gameHistory) && user.gameHistory.length > 0 ? (
              user.gameHistory.map((game, index) => (
                <div key={index} className="flex justify-between mb-2 bg-[#E8E8E8] p-2 rounded-md">
                  <p>Já vs {game.username || "Neznámý"}</p>
                  <p>{game.result || "Není k dispozici"}</p>
                </div>
              ))
            ) : (
              <p>Žádné hry v historii.</p>
            )}
          </div>
        </div>
      </div>

      {/* Desktopové rozložení */}
      <div className="hidden md:flex p-6 justify-center md:space-x-56">
        <div className="flex flex-col space-y-6">
          {/* Panel s profilovými informacemi */}
          <div className="bg-[#D9D9D9] p-4 rounded-lg shadow-md w-[480px] h-[150px] text-center text-xl">
            <div className="flex items-center space-x-4 h-full">
              {/* Profilový obrázek */}
              <img className="w-32 h-32  object-cover rounded-md" src={user.profileImage} alt="User profile" />
              {/* Jméno a datum registrace */}
              <div className="text-left flex flex-col justify-center">
                <p>
                  <strong className="font-bold">Jméno:</strong> {user.username || "Není zadáno"}
                </p>
                <p>
                  <strong className="font-bold">Datum registrace:</strong>{" "}
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Není zadáno"}
                </p>
              </div>
            </div>
          </div>

          {/* Panel s historií her */}
          <div className="bg-[#D9D9D9] p-4 rounded-lg shadow-md w-[480px] text-center">
            <h3 className="text-lg font-bold">Historie her</h3>
            <div className="mt-2">
              {Array.isArray(user.gameHistory) && user.gameHistory.length > 0 ? (
                user.gameHistory.map((game, index) => (
                  <div key={index} className="flex justify-between mb-2 bg-[#E8E8E8] p-2 rounded-md">
                    <p>Já vs {game.username || "Neznámý"}</p>
                    <p>{game.result || "Není k dispozici"}</p>
                  </div>
                ))
              ) : (
                <p>Žádné hry v historii.</p>
              )}
            </div>
          </div>
        </div>

        {/* Panel se statistikami */}
        <div className="bg-[#D9D9D9] rounded-lg shadow-md w-[350px] h-[350px] text-center flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-4">Statistiky</h3>
          <p className="text-2xl">
            <strong>Výhry:</strong> {user.wins || 0}
          </p>
          <p className="text-2xl">
            <strong>Prohry:</strong> {user.losses || 0}
          </p>
          <p className="text-2xl">
            <strong>Remízy:</strong> {user.draws || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
