import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DefaultButton from "../../GlobalComponents/DefaultButton";
type BoardProps = {
    board: string[][];
};

const UpdateButton: React.FC<BoardProps> = ({ board }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL || "";
    const [formData, setFormData] = useState({ name: "", difficulty: "hard" });
    const { uuid } = useParams<{ uuid: string }>();

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setErrorMessage("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uuid) {
            setErrorMessage("UUID nebylo nalezeno!");
            return;
        }

        const hasPlayerPlayed = board.some(row => row.some(cell => cell !== ""));

        if (!hasPlayerPlayed) {
            setErrorMessage("Oba hráči musí odehrát alespoň jeden tah.");
            return;
        }

        const xCount = board.flat().filter(cell => cell.toLowerCase() === "x").length;
        const oCount = board.flat().filter(cell => cell.toLowerCase() === "o").length;

        if (xCount !== oCount) {
            setErrorMessage("Počet tahů hráčů X a O musí být stejný.");
            return;
        }

        const gameData = {
            name: formData.name,
            difficulty: formData.difficulty,
            board: board,
        };

        try {
            const response = await fetch(`${baseUrl}/api/v1/games/${uuid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(gameData),
            });

            if (response.ok) {
                window.location.reload(); // Obnovení stránky
                setIsOpen(false);
            } else {
                setErrorMessage("Chyba při ukládání hry. Zkuste to znovu.");
            }
        } catch (error) {
            setErrorMessage("Došlo k chybě při komunikaci se serverem. Zkuste to znovu.");
        }
    };

    return (
        <div>
            {/* Tlačítko pro otevření pop-upu */}
            <DefaultButton onClick={togglePopup} text="Uložit hru" />

            {/* Pop-up formulář */}
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-md min-w-[300px]">
                        <h2 className="font-bold text-center">Aktualizace hry</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block">Jméno hry:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <label htmlFor="difficulty" className="block">Obtížnost</label>
                            <div className="mb-4">
                                <select
                                    id="difficulty"
                                    name="difficulty"
                                    required
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="začátečník">Začátečník</option>
                                    <option value="jednoduchá">Jednoduchá</option>
                                    <option value="pokročilá">Pokročilá</option>
                                    <option value="těžká">Těžká</option>
                                    <option value="nejtěžší">Nejtěžší</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                {errorMessage && (
                                    <p className="text-red-500 font-bold">{errorMessage}</p>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={togglePopup}
                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Zavřít
                                </button>

                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                                    Uložit hru
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateButton;
