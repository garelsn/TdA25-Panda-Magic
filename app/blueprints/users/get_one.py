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

    # Iterace přes položky slovníku result
    for key, value in result.items():
        if isinstance(value, bytes):
            result[key] = value.decode("utf-8")  # Převede bytes na string

    # Kontrola a parsování pole "games"
    if "games" in result and isinstance(result["games"], str):
        try:
            result["games"] = literal_eval(result["games"])
        except Exception:
            pass  # Pokud parsování selže, hodnota zůstane nezměněná

    return jsonify(result), 200