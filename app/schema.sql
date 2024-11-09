CREATE TABLE IF NOT EXISTS record (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS games (
    uuid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    gameState TEXT NOT NULL,
    board TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);