from flask import request, jsonify
from .users import users_bp
from ... import db
import uuid
from datetime import datetime 


@users_bp.route("/", methods=["POST"])
def createPlayer():
    data = request.get_json()

    userName, email = data.get("username"), data.get("email")
    password = data.get("password")

    if None in (userName, email, password):
        return jsonify(
            {
                "code": 400,
                "message": "Bad request: Missing required parameters"
            }
        ), 400

    sqlDB = db.get_db()

    cursor = sqlDB.cursor()
    cursor.execute("SELECT email FROM users")
    emails = cursor.fetchall()

    emails = [email[0] for email in emails]

    if email in emails:
        return jsonify(
            {
                "code": 409,
                "message": "Bad request: Email already exists"
            }
        ), 400

    # Generování soli a hashování hesla pomocí bcrypt
    salt = bcrypt.gensalt()  # Generuje náhodnou sůl
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)  # Hashuje heslo

    unique_id = str(uuid.uuid4())
    current_time = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"

    additionalValues = {
        "elo": data.get("elo") if data.get("elo") is not None else 0,
        "wins": data.get("wins") if data.get("wins") is not None else 0,
        "draws": data.get("draws") if data.get("draws") is not None else 0,
        "losses": data.get("losses") if data.get("losses") is not None else 0,
        "profileImage": data.get("profileImage") if data.get("profileImage") is not None else 'default.webp',
        "ban": data.get("ban") if data.get("ban") is not None else False,
        "admin": data.get("admin") if data.get("admin") is not None else False,
        "games": data.get("games") if data.get("games") is not None else '[]'
    }
    
    sqlDB.execute(
        'INSERT INTO users (uuid, createdAt, loginAt, username, email, password, elo, wins, draws, losses, profileImage, ban, admin, games) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        (unique_id, current_time, current_time, userName, email, hashed_password, additionalValues["elo"], additionalValues["wins"], additionalValues["draws"], additionalValues["losses"], additionalValues["profileImage"], additionalValues["ban"], additionalValues["admin"], additionalValues["games"])
    )

    sqlDB.commit()

    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM users WHERE uuid=?", (unique_id,))
    DBItem = cursor.fetchone()

    column_names = [description[0] for description in cursor.description]
    # Převod hashovaného hesla z bytes na řetězec
    response = {column_names[i]: DBItem[i].decode('utf-8') if isinstance(DBItem[i], bytes) else DBItem[i] for i in range(len(column_names))}

    sqlDB.close()

    return jsonify(response), 201