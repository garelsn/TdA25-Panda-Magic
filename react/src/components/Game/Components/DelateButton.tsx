import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DefaultButton from "../../GlobalComponents/DefaultButton";

const DeleteButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL || "";
    const { uuid } = useParams<{ uuid: string }>();

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const deleteGame = async () => {
        if (!uuid) {
            alert("UUID nebylo nalezeno!");
            return;
        }
        try {
            const response = await fetch(`${baseUrl}/api/v1/games/${uuid}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                setIsOpen(false); // Zavření po úspěšném smazání
                navigate("/"); // Přesměrování na seznam her (nebo jinou stránku)
            } else {
                console.error("Chyba při mazání hry.");
            }
        } catch (error) {
            console.error("Došlo k chybě při mazání hry:", error);
        }
    };

    return (
        <div>
            {/* Tlačítko pro otevření pop-upu */}
            <DefaultButton onClick={togglePopup} text="Smazat hru" />

            {/* Pop-up formulář */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
                        <h2 className="text-lg font-semibold mb-4">Opravdu si přejete smazat hru?</h2>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={togglePopup}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Zavřít
                            </button>
                            <button
                                onClick={deleteGame}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Smazat hru
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteButton;
