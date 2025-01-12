import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DefaultButton from "../../GlobalComponents/DefaultButton";
const DelateButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL ||""
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
                alert("Hra byla úspěšně smazána!");
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
            <DefaultButton onClick={togglePopup} text="Smazat hru"/>

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
                        
                        <h2>Opravdu si přejete smazat hru?</h2>
                        <div style={{ marginBottom: "15px" }}>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                            <button  onClick={deleteGame} style={{ padding: "10px 20px" }}>
                                        Smazat hru
                            </button>
                            </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DelateButton;
