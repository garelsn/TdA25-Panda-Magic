import React from "react";

type BoardProps = {
    board: string[][];
    onCellClick: (row: number, col: number) => void;
};

const Board: React.FC<BoardProps> = ({ board, onCellClick }) => {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`, // Počet sloupců odpovídá délce řádku
                gridGap: "2px", // Mezery mezi buňkami
                width: "100%",
            }}
        >
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "1px solid black",
                            cursor: "pointer",
                            backgroundColor:
                                cell === "X" ? "#f0f8ff" : cell === "O" ? "#ffe4e1" : "white",
                        }}
                    >
                        {cell}
                    </div>
                ))
            )}
        </div>
    );
};

export default Board;
