import ButtonLink from "../GlobalComponents/ButtonLink";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-screen">
      <div className="h-3/5 bg-[#1A1A1A] relative">
        <Link to="/" className="top-0 left-0 m-4">
          <img
            src="./Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-1/2 md:w-1/6 m-6"
          />
        </Link>
        <h1 className="text-white text-8xl font-bold flex items-center justify-center">
          Piškv
          <img
            src="/O_modre.svg"
            alt="Modré kolečko"
            className="w-16 h-16 inline-block mx-1 mt-7"
          />
          rky
        </h1>
      </div>
      <div
        className="h-2/5 flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
        }}
      >
        <div className="w-full">
          <div className="flex w-[60%] justify-center mb-4">
            <img src="./zarivka_playing_bile.svg" alt="" className="w-[12%]" />
            <ButtonLink link="game" name="Nová hra" />
          </div>
          <div className="flex w-[60%] justify-center mb-4">
            <img src="./zarivka_idea_bile.svg" alt="" className="w-[10%] ml-3 mr-4" />
            <ButtonLink link="search" name="Seznam her" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
