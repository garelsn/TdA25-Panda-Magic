import os

from flask import Flask, request, jsonify, send_from_directory

from . import db

import uuid

from datetime import datetime

from .validator import validator

from .gameLogic import game_status

from ast import literal_eval

from flask_cors import CORS

import bcrypt
import jwt


import datetime

from .blueprints.routes import bp

app = Flask(__name__, static_folder='static/react', template_folder='templates')

CORS(app)


app.config.from_mapping(
    DATABASE=os.path.join(app.instance_path, 'tourdeflask.sqlite'),
)

# ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

db.init_app(app)


app.register_blueprint(bp, url_prefix='/')


@app.route('/api', methods=['GET'])
def api(): 
    return jsonify({"organization": "Student Cyber Games"})


@app.route('/api/v1/games', methods=['POST'])
def initNewGame():

    data = request.get_json()
    if(data.get("name")== None or data.get("difficulty")== None or data.get("board")== None):
        return jsonify(
            {
                "code": 400,
                "message": "Bad request: Missing"
            }
            ), 400

    valid, message = validator(data.get("board"))
    if not valid:
        return jsonify(
            {
                "code": 422,
                "message": f"Semantic error: {message}"
            }
            ), 422

    status = game_status(list(data.get("board")))

    sqlDB = db.get_db()
    unique_id = str(uuid.uuid4())
    current_time = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    # Add unique_id to the response
    response = {
        "uuid": unique_id,
        "createdAt":current_time,
        "updatedAt":current_time,
        "name": data.get("name"),
        "difficulty": data.get("difficulty"),
        "gameState":status,
        "board": list(data.get("board"))
    }
    sqlDB.execute(
        'INSERT INTO games (uuid, name, difficulty, gameState, board, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (response["uuid"], response["name"], response["difficulty"],response["gameState"], str(response["board"]), response["createdAt"], response["updatedAt"] )
    )
    sqlDB.commit()

    return jsonify(response), 201

@app.route("/api/v1/games", methods=["GET"])
def returnAllGames():

    sqlDB = db.get_db()
    
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM games")
    DBItems = cursor.fetchall()

    sqlDB.close()

    column_names = [ description[0] for description in cursor.description ]
    result = [ { column_names[i]: row[i] for i in range(len(column_names)) } for row in DBItems]

    for game in result:
        for row in game:
            if row == "board":
                game[row] = literal_eval(game[row])

    return jsonify(result), 200

@app.route("/api/v1/games/<uuid>", methods=["GET"])
def returnGameById(uuid):
    sqlDB = db.get_db()
    
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM games WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify(
            {
                "code": 404,
                "message": "Resource not found"
            }
        ), 404

    sqlDB.close()

    column_names = [ description[0] for description in cursor.description ]
    result = { column_names[i]: DBItem[i] for i in range(len(column_names)) }

    result["board"] = literal_eval(result["board"])

    return jsonify(result), 200

@app.route("/api/v1/games/<uuid>", methods=["PUT"])
def updateGameById(uuid):
    data = request.get_json()
    if(data.get("name")== None or data.get("difficulty")== None or data.get("board")== None):
        return jsonify(
            {
                "code": 400,
                "message": "Bad request: Missing"
            }
        ), 400
    valid, message = validator(data.get("board"))
    if not valid:
        return jsonify(
            {
                "code": 422,
                "message": f"Semantic error: {message}"
            }
        ), 422
    
    sqlDB = db.get_db()
    
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM games WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify(
            {
                "code": 404,
                "message": "Resource not found"
            }
        ), 404
    
    current_time = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    status = game_status(list(data.get("board")))
    response = {
        "uuid": uuid,
        "createdAt": DBItem["createdAt"],
        "updatedAt": current_time,
        "name": data["name"],
        "difficulty": data["difficulty"],
        "gameState": status,
        "board":data["board"]
    }

    sqlDB.execute(
        'UPDATE games SET name=?, difficulty=?, gameState=?, board=?, updatedAt=? WHERE uuid=?',
        (response["name"], response["difficulty"], response["gameState"], str(response["board"]), current_time, uuid)
    )

    sqlDB.commit()

    return jsonify(response), 200

@app.route("/api/v1/games/<uuid>", methods=["DELETE"])
def deleteGameById(uuid):
    sqlDB = db.get_db()
    cursor = sqlDB.cursor()
    
    # Najdi položku podle UUID
    cursor.execute("SELECT * FROM games WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()
    
    if DBItem is None:
        return jsonify(
            {
                "code": 404,
                "message": "Resource not found"
            }
        ), 404

    # Odstraň položku podle UUID
    cursor.execute("DELETE FROM games WHERE uuid=?", (uuid,))
    sqlDB.commit()  # Potvrď změny v databázi
    sqlDB.close()

    # Vrácení odpovědi po úspěšném smazání
    return jsonify(
        {
            "code": 204,
            "message": f"Game with UUID {uuid} successfully deleted"
        }
    ), 204





@app.route("/api/v1/users", methods=["POST"])
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

@app.route("/api/v1/users", methods=["GET"])
def returnAllUsers():

    sqlDB = db.get_db()
    
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM users")
    DBItems = cursor.fetchall()

    sqlDB.close()

    column_names = [ description[0] for description in cursor.description ]
    result = [ { column_names[i]: row[i] for i in range(len(column_names)) } for row in DBItems]

    return jsonify(result), 200

@app.route("/api/v1/users/<uuid>", methods=["GET"])
def returnUserById(uuid):

    sqlDB = db.get_db()
    
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

    column_names = [ description[0] for description in cursor.description ]
    result = { column_names[i]: DBItem[i] for i in range(len(column_names)) }

    return jsonify(result), 200

@app.route("/api/v1/users/<uuid>", methods=["PUT"])
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

@app.route("/api/v1/users/<uuid>", methods=["DELETE"])
def deleteUserById(uuid):
    sqlDB = db.get_db()
    cursor = sqlDB.cursor()
    
    # Najdi položku podle UUID
    cursor.execute("SELECT * FROM users WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()
    
    if DBItem is None:
        return jsonify(
            {
                "code": 404,
                "message": "Resource not found"
            }
        ), 404

    cursor.execute("DELETE FROM users WHERE uuid=?", (uuid,))
    sqlDB.commit()
    sqlDB.close()

    return jsonify(
        {
            "code": 204,
            "message": f"Game with UUID {uuid} successfully deleted"
        }
    ), 204

if __name__ == '__main__':
    app.run(debug=True)




@app.route("/api/v1/profile", methods=["GET"])
def profile():
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"message": "Token is missing!"}), 401

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token!"}), 401

    sqlDB = db.get_db()
    cursor = sqlDB.cursor()
    cursor.execute("SELECT username, email, profileImage FROM users WHERE uuid=?", (user_id,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "User not found"}), 404

   
    return jsonify({"username": user[0], "email": user[1], "profileImage": user[2]}), 200


SECRET_KEY = "tajne_heslo"

@app.route("/api/v1/login", methods=["POST"])
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
