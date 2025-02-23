from flask import Blueprint, send_from_directory, current_app
import bcrypt
import jwt
import datetime
from flask import request, jsonify  
from app import db
# Vytvoření blueprintu
auth_bp  = Blueprint('auth', __name__)



SECRET_KEY = "tajne_heslo"

@auth_bp.route("/api/v1/login", methods=["POST"])
def login():
    data = request.get_json()
    user_input = data.get("username_or_email")
    password = data.get("password")

    if not user_input or not password:
        return jsonify({"message": "Missing username/email or password"}), 400

    sqlDB = db.get_db()
    cursor = sqlDB.cursor()

    # Najdi uživatele podle uživatelského jména nebo e-mailu
    cursor.execute("SELECT * FROM users WHERE username=? OR email=?", (user_input, user_input))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Získání názvů sloupců
    column_names = [description[0] for description in cursor.description]

    # Ověření hesla
    stored_password = user[column_names.index("password")]  # Získání hesla podle názvu sloupce
    if not bcrypt.checkpw(password.encode("utf-8"), stored_password):  
        return jsonify({"message": "Invalid credentials"}), 401

    # Generování JWT tokenu
    token = jwt.encode(
        {
            "user_id": user[column_names.index("uuid")],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)  # 1 den místo 1 hodiny
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    # Převod výsledků z databáze do JSON formátu
    user_data = {column_names[i]: (user[i].decode("utf-8") if isinstance(user[i], bytes) else user[i]) for i in range(len(user))}

    return jsonify({"token": token, "user": user_data}), 200


@auth_bp.route("/api/v1/profile", methods=["GET"])
def profile():
    auth_header = request.headers.get("Authorization")

    # Kontrola, zda hlavička existuje a má správný formát
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"message": "Token is missing or invalid!"}), 401

    # Odstranění "Bearer " a získání samotného tokenu
    token = auth_header.split(" ")[1]

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token!"}), 401

    sqlDB = db.get_db()
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM users WHERE uuid=?", (user_id,))
    user = cursor.fetchone()


    if not user:
        return jsonify({"message": "User not found"}), 404

    
    
    column_names = [desc[0] for desc in cursor.description]
    result = {column_names[i]: user[i] for i in range(len(column_names))}
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