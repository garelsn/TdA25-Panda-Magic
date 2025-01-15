import React, { useState } from "react";
import { Link } from "react-router-dom";
type Task = {
    board: string[][];
    createdAt: string;
    difficulty: "easy" | "medium" | "hard";
    gameState: string;
    name: string;
    updatedAt: string;
    uuid: string;
};

const TaskFilter: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState<string | null>(null);

    const filterTasks = () => {
        return tasks.filter((task) => {
            // Filtr podle obtížnosti
            const matchesDifficulty = difficulty ? task.difficulty === difficulty : true;

            // Filtr podle názvu
            const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase());

            // Filtr podle data
            const now = new Date();
            const taskDate = new Date(task.updatedAt);
            const matchesDate =
                dateFilter === "24h"
                    ? now.getTime() - taskDate.getTime() <= 24 * 60 * 60 * 1000
                    : dateFilter === "7d"
                    ? now.getTime() - taskDate.getTime() <= 7 * 24 * 60 * 60 * 1000
                    : dateFilter === "1m"
                    ? now.getTime() - taskDate.getTime() <= 30 * 24 * 60 * 60 * 1000
                    : dateFilter === "3m"
                    ? now.getTime() - taskDate.getTime() <= 90 * 24 * 60 * 60 * 1000
                    : true;

            // Průnik všech podmínek
            return matchesDifficulty && matchesSearch && matchesDate;
        });
    };

    const filteredTasks = filterTasks();

    return (
        <div className="p-4">
            <div className="grid md:grid-cols-3 gap-4 md:justify-items-center w-full mb-12 px-7">
                 {/* Vyhledávání podle názvu */}
                 <input
                    type="text"
                    placeholder="Hledat podle názvu..."
                    className="p-2 border rounded-full w-full bg-[#D9D9D9]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filtr podle obtížnosti */}
                <select
                    className="p-2 border rounded-full w-full bg-[#D9D9D9] text-center"
                    value={difficulty || ""}
                    onChange={(e) => setDifficulty(e.target.value || null)}
                >
                    <option value="">Všechny obtížnosti</option>
                    <option value="začátečník">Začátečník</option>
                    <option value="jednoduchá">Jednoduchá</option>
                    <option value="pokročilá">Pokročilá</option>
                    <option value="těžká">Těžká</option>
                    <option value="nejtěžší">Nejtěžší</option>
                </select>

    

                {/* Filtr podle data */}
                <select
                    className="p-2 border rounded-full w-full bg-[#D9D9D9] text-center"
                    value={dateFilter || ""}
                    onChange={(e) => setDateFilter(e.target.value || null)}
                >
                    <option value="">Všechny data</option>
                    <option value="24h">Posledních 24 hodin</option>
                    <option value="7d">Posledních 7 dní</option>
                    <option value="1m">Poslední měsíc</option>
                    <option value="3m">Poslední 3 měsíce</option>
                </select>
            </div>

        {/* Výsledky */}
            <div className="mt-4">
                {filteredTasks.length ? (
                    <ul className="grid md:grid-cols-2 gap-6 justify-items-stretch">
                        {filteredTasks.map((task) => (
                            <li key={task.uuid} className="p-2 border rounded-xl bg-[#D9D9D9] w-full shadow-lg flex justify-between items-center">
                                <div>
                                <div className="font-bold text-lg p-3"> Název: <span className="font-normal">{task.name}</span> </div>
                                <div className="font-bold text-lg p-3"> Obtížnost: <span className="font-normal">{task.difficulty}</span> </div>
                                    {/* <div>Poslední úprava: {new Date(task.updatedAt).toLocaleDateString()}</div> */}
                                </div>
                                <div className="flex flex-col items-end space-y-2 p-3">
                                    <Link to={`../game/${task.uuid}`} className="bg-[#AB2F58] p-2 rounded text-white w-24 text-center">
                                        Hrát hru
                                    </Link>
                                    <Link to={`../game/edit/${task.uuid}`} className="bg-[#724479] p-2 rounded text-white w-24 text-center">
                                        Upravit hru
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-20">
                        <div className="text-white flex justify-center text-center font-bold text-6xl p-3">
                            <p>Žádné úlohy neodpovídají zadaným filtrům.</p>
                        </div>
                            <img src="./duck.svg" alt="Kačenka" className="w-1/6 mx-auto mt-4"/>
                    </div>
                )}
            </div>

        </div>
        
    );
};

export default TaskFilter;
