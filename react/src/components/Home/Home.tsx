import ButtonLink from "../GlobalComponents/ButtonLink";

import { Link } from "react-router-dom";


function Home() {
  return (
    <div className="h-screen">
      <div className="h-[50%] md:h-3/5 bg-[#1A1A1A] relative">
        <Link to="/" className="top-0 left-0 m-4">
          <img
            src="./Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-1/2 md:w-[50%] m-6 lg:w-[20%]"
          />
        </Link>
        <h1 className="text-white md:text-7xl lg:text-8xl font-bold flex items-center justify-center text-6xl md:mt-28">
          Piškv
          <img
            src="/O_modre.svg"
            alt="Modré kolečko"
            className="w-11 h-11 mx-1 mt-4 md:w-15 md:h-15 md:mx-1 md:mt-9 lg:w-16 lg:h-16 lg:mx-1 lg:mt-7 inline-block "
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

        <div className="w-screen mt-14 lg:mt-0 md:pl-[25%] xl:pl-[5%]">
          <div className="flex md:w-[70%] lg:w-[60%] justify-center mb-4">
            <img src="./zarivka_playing_bile.svg" alt="" className=" w-20 md:w-36 lg:w-[12%]" />
            <ButtonLink link="game" name="Nová hra" />
          </div>
          <div className="flex md:w-[70%] lg:w-[60%] justify-center mb-4">
            <img src="./zarivka_idea_bile.svg" alt="" className=" w-16 mr-3 md:w-32 lg:w-[10%] lg:ml-3 lg:mr-4" />
            <ButtonLink link="search" name="Seznam her"/>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Home;
