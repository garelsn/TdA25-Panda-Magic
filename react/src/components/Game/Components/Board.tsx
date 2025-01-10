import React from "react";

type BoardProps = {
    board: string[][];
    onCellClick: (row: number, col: number) => void;
};

const Board: React.FC<BoardProps> = ({ board, onCellClick }) => {
    return (
        <div
            className="grid grid-cols-15 gap-0 w-fit" // Zajišťuje správné rozložení do 15 sloupců a šířku podle obsahu
        >
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                            w-8 h-8 flex items-center justify-center 
                            border border-black cursor-pointer 
                            ${cell === "X" ? "bg-blue-100" : cell === "O" ? "bg-red-100" : "bg-white"}
                        `}
                    >
                        {cell}
                    </div>
                ))
            )}
        </div>
    );
};

export default Board;
