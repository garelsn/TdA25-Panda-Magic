import React from "react";

type BoardProps = {
    board: string[][];
    onCellClick: (row: number, col: number) => void;
    x:string;
    o:string;
};

const Board: React.FC<BoardProps> = ({ board, onCellClick ,x,o}) => {
    return (
        <div
            className="grid grid-cols-15 gap-0.5 w-fit" // Zajišťuje správné rozložení do 15 sloupců a šířku podle obsahu
        >
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        onClick={() => onCellClick(rowIndex, colIndex)}
                        key={`${rowIndex}-${colIndex}`}
                        className="w-9 h-9 flex items-center justify-center cursor-pointer rounded-md bg-white"
                    >
                        {cell === "X" && (
                            <img src={x} alt="X" className="w-8 h-8" />
                        )}
                        {cell === "O" && (
                            <img src={o} alt="O" className="w-8 h-8" />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Board;
