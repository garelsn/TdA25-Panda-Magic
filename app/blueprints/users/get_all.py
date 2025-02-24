from flask import jsonify
from .users import users_bp
from app.db import get_db  # Import opraven podle tvé struktury
import ast

@users_bp.route("", methods=["GET"])
def returnAllUsers():
    sqlDB = get_db()
    cursor = sqlDB.cursor()

    cursor.execute("SELECT * FROM users")
    DBItems = cursor.fetchall()
    
    column_names = [desc[0] for desc in cursor.description]
    result = [{column_names[i]: row[i] for i in range(len(column_names))} for row in DBItems]

    cursor.close()
    sqlDB.close()

    # Oprava bytes -> string
    for user in result:
        for key, value in user.items():
            if isinstance(value, bytes):
                user[key] = value.decode("utf-8")  # Převede bytes na string

        # Pokud je potřeba parsovat JSON pole v tabulce
        if "games" in user and isinstance(user["games"], str):
            try:
                user["games"] = ast.literal_eval(user["games"])
            except Exception:
                pass  # Když se nepovede, nevadí

    return jsonify(result), 200
