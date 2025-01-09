import ButtonLink from "./ButtonLink";

function Home() {
  return (
    <div className="h-screen">
      <div className="h-3/5 bg-[#1A1A1A] flex items-center justify-center">
        {/* Bílý text s obrázkem místo písmene "O" */}
        <h1 className="text-white text-8xl font-bold flex items-center">
          Piškv
          <img
            src="/O_modre.png"
            alt="Modré kolečko"
            className="w-16 h-16 inline-block mx-1"
          />
          rky
        </h1>
      </div>
      <div
        className="h-2/5"
        style={{
          background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
        }}
      >
        <ButtonLink link="game" name="Nová hra" /> <br></br>
        <ButtonLink link="search" name="Seznam her" />
      </div>
    </div>
  );
}

export default Home;
