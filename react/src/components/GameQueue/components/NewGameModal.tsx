import { useState } from "react";
import ButtonLink from "../../GlobalComponents/ButtonLink"; // Import ButtonLink (uprav cestu podle potřeby)
import GameQueueModal from "./GameQueueModal"; // Import existujícího GameQueueModal

const NewGameModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isQueueOpen, setIsQueueOpen] = useState(false); // Stav pro otevření GameQueueModal

  if (!isOpen) return null;

  const handleSearchPlayer = () => {
    setIsQueueOpen(true); // Otevře GameQueueModal při kliknutí na "Vyhledat hráče"
  };

  const handleInvitePlayer = () => {
    onClose(); // Zatím jen zavře modal, můžeš přidat další logiku pro "Pozvat hráče"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="p-6 rounded-lg shadow-lg w-[480px] h-[480px] relative" style={{ background: "#375694" }}>
        <button 
          className="absolute top-2 right-2 text-3xl text-white font-bold" 
          onClick={onClose}
        >
          X
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div onClick={handleSearchPlayer}>
            <ButtonLink link="#" name="VYHLEDAT HRÁČE" />
          </div>
          <div onClick={handleInvitePlayer}>
            <ButtonLink link="#" name="POZVAT HRÁČE" />
          </div>
        </div>
      </div>
      {/* Otevření GameQueueModal, pokud je isQueueOpen true */}
      <GameQueueModal isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
    </div>
  );
};

export default NewGameModal;