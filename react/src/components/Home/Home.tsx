import { useState } from "react";
import { Link } from "react-router-dom";
import RainEffect from "./RainEffect";
import ButtonLink from "../GlobalComponents/ButtonLink";
import LoginModal from "../Login/components/LoginModal";
import NewGameModal from "../GameQueue/components/NewGameModal";

function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNewGameOpen, setIsNewGameOpen] = useState(false); // Nový stav pro modal "Nová hra"
  const token = localStorage.getItem("token");

  return (
    <div className="h-screen">
      <div className="h-[50%] md:h-3/5 bg-[#1A1A1A] relative overflow-hidden">
        {/* Logo */}
        <Link to="/" className="top-0 left-0 m-4 z-50">
          <img
            src="./Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-1/2 md:w-[50%] lg:w-[20%] absolute top-3 left-5 m-4 z-20"
          />
        </Link>
        {token ? 
          // Když je token (uživatel je přihlášený), zobraz odkaz na profil
          <div className="absolute top-3 right-5 m-4 z-50 flex items-center">
            <ButtonLink link="/profile" name="Profil" onClick={false} />
            <img
              src="./profile.svg"
              alt="Profil"
              className="w-16 ml-3 hidden md:block"
            />
          </div>
        : 
          // Když není token (uživatel není přihlášený), zobraz tlačítko přihlášení
          <div className="absolute top-3 right-5 m-4 z-50 flex items-center">
            <div
              onClick={(e) => {
                e.preventDefault();
                setIsLoginOpen(true);
              }}
            >
              <ButtonLink link="#" name="Přihlášení" onClick={false} />
            </div>
            <img
              src="./profile.svg"
              alt="Přihlášení"
              className="w-16 ml-3 hidden md:block"
            />
          </div>
        }
        {/* Titulek */}
        <h1 className="text-white md:text-7xl lg:text-8xl font-bold flex items-center justify-center text-6xl md:mt-36 z-20 relative mt-56">
          Piškv
          <img
            src="/O_modre.svg"
            alt="Modré kolečko"
            className="w-11 h-11 mx-1 mt-4 md:w-15 md:h-15 md:mx-1 md:mt-9 lg:w-16 lg:h-16 lg:mx-1 lg:mt-7 inline-block"
          />
          rky
        </h1>
        {/* Animace */}
        <RainEffect />
      </div>

      <div
        className="h-[50vh] md:h-2/5 flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
        }}
      >
        <div className="z-50">
          {/* Herní tlačítka */}
          <div className="hidden lg:z-10 lg:block lg:absolute lg:top-0 lg:right-0 lg:mt-96 lg:mr-[1rem]">
            <img
              src="/game_array_play.svg"
              alt="Herní pole"
              className="lg:w-[70%] lg:h-[70%]"
            />
          </div>
          <div className="w-screen lg:mt-0 md:pl-[25%] xl:pl-[5%]">
            <div className="flex md:w-[70%] lg:w-[60%] justify-center mb-4">
              <img
                src="./zarivka_playing_bile.svg"
                alt="Nová hra"
                className="w-20 md:w-36 lg:w-[12%]"
              />
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setIsNewGameOpen(true); // Otevře modal "Nová hra" místo navigace
                }}
              >
                <ButtonLink link="#" name="Nová hra" onClick={false} />
              </div>
            </div>
            <div className="flex md:w-[70%] lg:w-[60%] justify-center mb-4">
              <img
                src="/images/extreme.svg"
                alt="Top hráči"
                className="w-16 mr-3 md:w-32 lg:w-[10%] lg:ml-3 lg:mr-4"
              />
              <ButtonLink link="/top" name="Top hráči" />
            </div>
          </div>
        </div>
      </div>
      {/* Modal s přihlášením */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {/* Nový modal pro "Nová hra" */}
      <NewGameModal isOpen={isNewGameOpen} onClose={() => setIsNewGameOpen(false)} />
    </div>
  );
}

export default Home;