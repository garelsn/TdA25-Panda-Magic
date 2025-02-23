from flask import jsonify
from .users import users_bp
from app.db import get_db 
from ast import literal_eval

@users_bp.route("/<uuid>", methods=["GET"])
def returnUserById(uuid):
    sqlDB = get_db()
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM users WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify(
            {
                "code": 404,
                "message": "Resource not found"
            }
        ), 404

    sqlDB.close()

    column_names = [desc[0] for desc in cursor.description]
    result = {column_names[i]: DBItem[i] for i in range(len(column_names))}
    for user in result:
        for key, value in result.items():
            if isinstance(value, bytes):
                user[key] = value.decode("utf-8")  # Převede bytes na string

        if "games" in user and isinstance(user["games"], str):
            try:
                user["games"] = literal_eval(user["games"])
            except Exception:
                pass  # Když se nepovede, nevadí

    return jsonify(result), 200