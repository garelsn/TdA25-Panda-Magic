import click
from flask import current_app, g
from flask.cli import with_appcontext
import bcrypt
import sqlite3
import uuid
import json
from datetime import datetime

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    """
    Inicializuje databázi dle schema.sql
    """
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


def create_default_admin():
    """
    Vytvoří výchozího administrátora, pokud neexistuje
    """
    db = get_db()
    cursor = db.cursor()

    # Zkontrolujeme, zda už admin existuje
    cursor.execute("SELECT 1 FROM users WHERE admin = 1")  # SQLite používá 1 místo TRUE
    if cursor.fetchone() is None:
        admin_id = str(uuid.uuid4())
        created_at = login_at = datetime.utcnow().isoformat()
        hashed_password = bcrypt.hashpw("StudentCyberGames25!".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        cursor.execute(
            """
            INSERT INTO users (uuid, createdAt, loginAt, username, email, password, 
                               elo, wins, draws, losses, profileImage, ban, admin, games)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (admin_id, created_at, login_at, "TdA", "tda@scg.cz", hashed_password,
             0.0, 0, 0, 0, "default.webp", 0, 1, json.dumps([]))  
        )
        db.commit()  # ❗ Uložit změny ❗
        print("Admin uživatel byl vytvořen.")
    else:
        print("Admin už existuje.")




@click.command('init-db')
@with_appcontext
def init_db_command():
    """
    Inicializuje databázi a poté vytvoří výchozího admina
    """
    init_db()
    click.echo('Initialized the database.')

    # Po inicializaci databáze vytvoříme admina
    create_default_admin()


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)