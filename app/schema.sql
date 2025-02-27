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

drop table if EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    uuid TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    loginAt TEXT NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    elo REAL NOT NULL DEFAULT 0.0,
    wins INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    profileImage TEXT NOT NULL DEFAULT 'default.webp',
    ban BOOLEAN NOT NULL DEFAULT FALSE,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    games TEXT NOT NULL DEFAULT '[]'
);