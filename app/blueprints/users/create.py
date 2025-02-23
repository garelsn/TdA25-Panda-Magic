from flask import request, jsonify
from .users import users_bp
from ... import db
import uuid
from datetime import datetime 
import bcrypt

@users_bp.route("/", methods=["POST"])
def createPlayer():
    data = request.get_json()

    # Kontrola povinných parametrů
    required_fields = ["username", "email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"code": 400, "message": "Bad request: Missing required parameters"}), 400

    sqlDB = db.get_db()
    cursor = sqlDB.cursor()

    # Kontrola existence emailu
    cursor.execute("SELECT COUNT(*) FROM users WHERE email=?", (data["email"],))
    if cursor.fetchone()[0] > 0:
        return jsonify({"code": 409, "message": "Bad request: Email already exists"}), 409
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE username=?", (data["username"],))
    if cursor.fetchone()[0] > 0:
        return jsonify({"code": 409, "message": "Bad request: Username already exists"}), 409
    
    # Hashování hesla
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

    # Generování UUID a času
    unique_id = str(uuid.uuid4())
    current_time = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"

    # Volitelné parametry s výchozími hodnotami
    additional_values = {
        "elo": data.get("elo", 0),
        "wins": data.get("wins", 0),
        "draws": data.get("draws", 0),
        "losses": data.get("losses", 0),
        "profileImage": data.get("profileImage", 'default.webp'),
        "ban": data.get("ban", False),
        "admin": data.get("admin", False),
        "games": data.get("games", '[]')
    }

    # Vložení dat do databáze
    sqlDB.execute(
        'INSERT INTO users (uuid, createdAt, loginAt, username, email, password, elo, wins, draws, losses, profileImage, ban, admin, games) '
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        (unique_id, current_time, current_time, data["username"], data["email"], hashed_password,
         additional_values["elo"], additional_values["wins"], additional_values["draws"],
         additional_values["losses"], additional_values["profileImage"], additional_values["ban"],
         additional_values["admin"], additional_values["games"])
    )
    sqlDB.commit()

    # Získání nově vytvořeného uživatele
    cursor.execute("SELECT * FROM users WHERE uuid=?", (unique_id,))
    DBItem = cursor.fetchone()
    column_names = [desc[0] for desc in cursor.description]

    # Převod bytes na string a vytvoření odpovědi
    response = {col: (val.decode('utf-8') if isinstance(val, bytes) else val) for col, val in zip(column_names, DBItem)}

    sqlDB.close()
    return jsonify(response), 201