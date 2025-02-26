import { useNavigate } from "react-router-dom";
type WinModalProps = {
    winner: "X" | "O";
    rematchRequested: boolean;
    opponentWantsRematch: boolean;
    requestRematch: () => void;
  };

  const WinModal: React.FC<WinModalProps> = ({ winner, rematchRequested, opponentWantsRematch, requestRematch }) => {
    const navigate = useNavigate();

    const goToHomePage = () => {
      navigate("/"); // Přesměrování na hlavní stránku
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white text-center p-8 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800">Vyhrál hráč</h2>
          <img src={winner === "X" ? "../../X_cervene.svg" : "../../O_modre.svg"} alt={`Hráč ${winner}`} className="w-12 h-12 mt-4" />
          {!rematchRequested && (
            <>
            <button onClick={requestRematch} className="mt-4 p-2 bg-blue-500 text-black rounded">
              Hrát znovu
            </button>
            <button onClick={goToHomePage} className="mt-4 p-2 bg-blue-500 text-black rounded">
              Zpět na hlavní stránku
            </button>
            </>

            
          )}
          {rematchRequested && !opponentWantsRematch && <p>Čekáme na soupeře...</p>}
          {rematchRequested && opponentWantsRematch && <p>Nová hra začíná!</p>}
        </div>
      </div>
    );
  };
  
  export default WinModal;
  