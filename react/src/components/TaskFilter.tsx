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
            <div className="grid md:grid-cols-3 gap-4 md:justify-items-center w-full mb-12">
                 {/* Vyhledávání podle názvu */}
                 <input
                    type="text"
                    placeholder="Hledat podle názvu..."
                    className="p-2 border rounded w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filtr podle obtížnosti */}
                <select
                    className="p-2 border rounded w-2/3"
                    value={difficulty || ""}
                    onChange={(e) => setDifficulty(e.target.value || null)}
                >
                    <option value="">Všechny obtížnosti</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

    

                {/* Filtr podle data */}
                <select
                    className="p-2 border rounded w-2/3"
                    value={dateFilter || ""}
                    onChange={(e) => setDateFilter(e.target.value || null)}
                >
                    <option value="">Všechny datumy</option>
                    <option value="24h">Posledních 24 hodin</option>
                    <option value="7d">Posledních 7 dní</option>
                    <option value="1m">Poslední měsíc</option>
                    <option value="3m">Poslední 3 měsíce</option>
                </select>
            </div>

        {/* Výsledky */}
            <div className="mt-4">
                {filteredTasks.length ? (
                    <ul className="grid md:grid-cols-2  gap-6 justify-items-stretch"> 
                        {filteredTasks.map((task) => (
                            <li key={task.uuid} className="p-2 border rounded bg-[#F6F6F6] w-full shadow-lg">
                                <div>Název: {task.name}</div>
                                <div>Obtížnost: {task.difficulty}</div>
                                <div>Poslední úprava: {new Date(task.updatedAt).toLocaleDateString()}</div>
                                <Link to={`../game/${task.uuid}`} className="bg-green-600">Načíst hru</Link>
                            </li>
                        ))}
                    </ul>

                ) : (
                    <p>Žádné úlohy neodpovídají zadaným filtrům.</p>
                )}
            </div>
        </div>
        
    );
};

export default TaskFilter;
