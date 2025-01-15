import React, { useEffect, useState } from "react";

// Typ pro vlastnosti jednotlivých kapek
interface Raindrop {
  id: number;
  x: number; // Horizontální pozice (v %)
  delay: number; // Zpoždění animace (v s)
  size: number; // Velikost kapky (v px)
  speed: number; // Rychlost pádu (v s)
  opacity: number; // Průhlednost kapky
  rotation: number; // Rotace kapky
  svg: string; // Cesta k SVG souboru
}

const RainEffect: React.FC = () => {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  // Funkce pro vytvoření kapek
  const createRaindrops = (count: number): Raindrop[] => {
    const drops: Raindrop[] = [];
    for (let i = 0; i < count; i++) {
      drops.push({
        id: i,
        x: Math.random() * 100, // Náhodná horizontální pozice (v %)
        delay: Math.random() * 5, // Náhodné zpoždění (v s)
        size: Math.random() * 20 + 10, // Velikost mezi 10px a 30px
        speed: Math.random() * 3 + 4, // Rychlost padání
        opacity: Math.random() * 0.5 + 0.5, // Průhlednost mezi 0.5 a 1
        rotation: Math.random() * 360, // Náhodná rotace (0–360 stupňů)
        svg: Math.random() > 0.5 ? "/O_modre.svg" : "/X_cervene.svg", // Náhodný symbol
      });
    }
    return drops;
  };

  useEffect(() => {
    // Určuje počet kapek podle velikosti okna
    const updateRaindrops = () => {
      const screenArea = window.innerWidth * window.innerHeight;
      const count = Math.floor(screenArea / 15000); // Více kapek na větších obrazovkách
      setRaindrops(createRaindrops(count));
    };

    // Inicializace kapek a sledování změny velikosti okna
    updateRaindrops();
    window.addEventListener("resize", updateRaindrops);

    return () => {
      window.removeEventListener("resize", updateRaindrops);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {raindrops.map((drop) => (
        <img
          key={drop.id}
          src={drop.svg}
          alt="Symbol"
          className="absolute"
          style={{
            top: "-10%", // Začíná nad obrazovkou
            left: `${drop.x}%`,
            width: `${drop.size}px`,
            height: `${drop.size}px`,
            opacity: drop.opacity, // Průhlednost
            animation: `
              fall ${drop.speed}s linear ${drop.delay}s infinite,
              sway ${drop.speed * 1.2}s ease-in-out ${drop.delay}s infinite`,
            transform: `rotate(${drop.rotation}deg)`, // Rotace
            filter: "blur(3px)", // Motion blur efekt
          }}
        />
      ))}
    </div>
  );
};

export default RainEffect;
