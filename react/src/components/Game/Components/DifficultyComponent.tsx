import React from "react";

interface DifficultyComponentProps {
  difficulty: string;
}

const DifficultyComponent: React.FC<DifficultyComponentProps> = ({ difficulty }) => {
  
  const getImageSrc = (difficulty: string) => {
    switch (difficulty) {
      case "začátečník":
        return "/images/beginner.svg";
      case "jednoduchá":
        return "/images/easy.svg";
      case "pokročilá":
        return "/images/medium.svg";
      case "těžká":
        return "/images/hard.svg";
      case "nejtěžší":
        return "/images/extreme.svg";
      default:
        return "/images/duck.svg";
    }
  };

  return (
    <div>
      <div className="mt-6 grid-cols-2 items-center bg-slate-100 w-full lg:min-w-[50%] lg:w-[120%] p-4 rounded-xl hidden lg:grid">
        <img
          src={getImageSrc(difficulty)}
          alt="Dynamický obrázek"
          className="w-20 h-20 mb-2 bg-[#1A1A1A] rounded-lg"
        />
            <div className="flex items-center font-bold">obtížnost: {difficulty}
            </div>
      </div>
    </div>
  );
};

export default DifficultyComponent;
