import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DefaultButton from "../../GlobalComponents/DefaultButton";
type BoardProps = {
    board: string[][];
};

const UpdateButton: React.FC<BoardProps> = ({ board }) => {
    const [isOpen, setIsOpen] = useState(false);
    const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL ||""
    const [formData, setFormData] = useState({ name: "", difficulty: "hard" })
    const { uuid } = useParams<{ uuid: string }>();
    
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        if (!uuid) {
            alert("UUID nebylo nalezeno!");
            return;
        }
        const gameData = { 
            name: formData.name,
            difficulty: formData.difficulty,
            board: board,
        };

        alert("Formulář odeslán!");
        setIsOpen(false); // Zavření po odeslání

        try {
            const response = await fetch(`${baseUrl}/api/v1/games/${uuid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(gameData),
            });

            if (response.ok) {
                alert("Hra byla úspěšně aktualizována!");
                window.location.reload(); // Obnovení stránky
                // navigate(0); // Alternativa: obnovení pomocí navigate
            } else {
                console.error("Chyba při ukládání hry.");
            }
        } catch (error) {
            console.error("Došlo k chybě:", error);
        }
    };

    return (
        <div>
            {/* Tlačítko pro otevření pop-upu */}
            <DefaultButton onClick={togglePopup} text="Uložit hru"/>

            {/* Pop-up formulář */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                            minWidth: "300px",
                        }}
                    >
                        <h2>Formulář</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="name">Jméno hry:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <select id="difficulty" name="difficulty" required value={formData.difficulty} onChange={handleChange}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <button type="submit" style={{ padding: "10px 20px" }}>
                                    Uložit hru
                                </button>
                                <button
                                    type="button"
                                    onClick={togglePopup}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Zavřít
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
