from flask import request, jsonify
from .users import users_bp
from ... import db
from datetime import datetime
import bcrypt

@users_bp.route("/<uuid>", methods=["PUT"])
def UpdateUserById(uuid):
    data = request.get_json()

    sqlDB = db.get_db()
    cursor = sqlDB.cursor()

    # Získání existujícího uživatele
    cursor.execute("SELECT * FROM users WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify({"code": 404, "message": "Resource not found"}), 404

    column_names = [desc[0] for desc in cursor.description]
    existing_user = {column_names[i]: DBItem[i] for i in range(len(column_names))}

    # Kontrola unikátnosti emailu, pokud je změněn
    new_email = data.get("email", existing_user["email"])
    if new_email != existing_user["email"]:
        cursor.execute("SELECT COUNT(*) FROM users WHERE email=?", (new_email,))
        if cursor.fetchone()[0] > 0:
            return jsonify({"code": 409, "message": "Bad request: Email already exists"}), 409

    # Kontrola unikátnosti username, pokud je změněn
    new_username = data.get("username", existing_user["username"])
    if new_username != existing_user["username"]:
        cursor.execute("SELECT COUNT(*) FROM users WHERE username=?", (new_username,))
        if cursor.fetchone()[0] > 0:
            return jsonify({"code": 409, "message": "Bad request: Username already exists"}), 409

    # Hashování nového hesla, pokud je předáno
    if "password" in data:
        hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())
    else:
        hashed_password = existing_user["password"]

    # Aktualizace dat
    updated_values = {
        "username": new_username,
        "email": new_email,
        "password": hashed_password,
        "elo": data.get("elo", existing_user["elo"]),
        "wins": data.get("wins", existing_user["wins"]),
        "draws": data.get("draws", existing_user["draws"]),
        "losses": data.get("losses", existing_user["losses"]),
        "profileImage": data.get("profileImage", existing_user["profileImage"]),
        "ban": data.get("ban", existing_user["ban"]),
        "admin": data.get("admin", existing_user["admin"]),
        "games": data.get("games", existing_user["games"]),
    }

    # Aktualizace v databázi
    sqlDB.execute(
        'UPDATE users SET username=?, email=?, password=?, elo=?, wins=?, draws=?, losses=?, profileImage=?, ban=?, admin=?, games=? WHERE uuid=?',
        (updated_values["username"], updated_values["email"], updated_values["password"],
         updated_values["elo"], updated_values["wins"], updated_values["draws"],
         updated_values["losses"], updated_values["profileImage"], updated_values["ban"],
         updated_values["admin"], updated_values["games"], uuid)
    )
    sqlDB.commit()
    sqlDB.close()

    # Vytvoření odpovědi
    response = existing_user.copy()
    response.update(updated_values)
    response = {col: (val.decode('utf-8') if isinstance(val, bytes) else val) for col, val in zip(column_names, DBItem)}
    return jsonify(response), 200