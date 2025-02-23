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
    cursor.execute("SELECT email FROM users")
    emails = cursor.fetchall()

    emails = [email[0] for email in emails]

    if (data.get("email") in emails):
        return jsonify(
            {
                "code": 409,
                "message": "Bad request: Email already exists"
            }
        ), 400
    
    cursor.execute("SELECT * FROM users WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify(
            {
                "code": 404,
                "message": "Resource not found"
            }
        ), 404

    column_names = [ description[0] for description in cursor.description ]
    response = { column_names[i]: DBItem[i] for i in range(len(column_names)) }
    
    additionalValues = {
        "elo": data.get("elo") if data.get("elo") is not None else response["elo"],
        "wins": data.get("wins") if data.get("wins") is not None else response["wins"],
        "draws": data.get("draws") if data.get("draws") is not None else response["draws"],
        "losses": data.get("losses") if data.get("losses") is not None else response["losses"],
        "profileImage": data.get("profileImage") if data.get("profileImage") is not None else response["profileImage"],
        "ban": data.get("ban") if data.get("ban") is not None else response["ban"],
        "admin": data.get("admin") if data.get("admin") is not None else response["admin"],
        "games": data.get("games") if data.get("games") is not None else response["games"],
        "password": data.get("password") if data.get("password") is not None else response["games"],
        "email": data.get("email") if data.get("email") is not None else response["email"],
        "username": data.get("username") if data.get("username") is not None else response["username"]
    }

    sqlDB.execute(
        'UPDATE users SET username=?, email=?, password=?, elo=?, wins=?, draws=?, losses=?, profileImage=?, ban=?, admin=?, games=? WHERE uuid=?',
        (additionalValues["username"], additionalValues["email"], additionalValues["password"], additionalValues["elo"], additionalValues["wins"], additionalValues["draws"], additionalValues["losses"], additionalValues["profileImage"], additionalValues["ban"], additionalValues["admin"], additionalValues["games"], uuid)
    )

    sqlDB.commit()
    sqlDB.close()

    response.update(additionalValues)

    return jsonify(response), 200