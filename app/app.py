import os

from flask import Flask, request, jsonify, send_from_directory

from . import db

import uuid

from datetime import datetime

from .validator import validator

from .gameLogic import game_status

from ast import literal_eval

# from flask_cors import CORS

app = Flask(__name__, static_folder='static/react', template_folder='templates')

# CORS(app)


app.config.from_mapping(
    DATABASE=os.path.join(app.instance_path, 'tourdeflask.sqlite'),
)

# ensure the instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

db.init_app(app)


@app.route('/')
def hello_world():  # put application's code here
     return send_from_directory(app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@app.route('/game')
def gammme():  # put application's code here
    return send_from_directory(app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "


@app.route('/search')
def gameSearch():  # put application's code here
     return send_from_directory(app.static_folder, 'index.html')  # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@app.route('/game/edit/<string:uuid>')
def gameEditUUID(uuid):  # put application's code here
     return send_from_directory(app.static_folder, 'index.html')  # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@app.route('/game/<string:uuid>')
def gameUUID(uuid):  # put application's code here
     return send_from_directory(app.static_folder, 'index.html')  # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)


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

@app.route("/api/v1/users/", methods=["POST"])
def createPlayer():

    data = request.get_json()

    userName, email, password, elo = (data.get("username"), data.get("email"), data.get("password"), data.get("elo"))

    if None in (userName, email, password, elo):
        return jsonify(
            {
                "code": 400,
                "message": "Bad request: Missing required parameters"
            }
        ), 400
    
    sqlDB = db.get_db()
    unique_id = str(uuid.uuid4())
    current_time = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    
    responce = {
        "uuid": unique_id,
        "createdAt": current_time,
        "username": userName,
        "email": email,
        "elo": elo,
        "wins": 0,
        "draws": 0,
        "losses": 0
    }

    sqlDB.execute(
        'INSERT INTO users (uuid, createdAt, loginAt, username, email, password, elo, wins, draws, losses) VALUES (?, ?,?,?,?,?,?,?,?, ?)',
        (responce["uuid"], responce["createdAt"], responce["createdAt"], responce["username"], responce["email"], password, responce["elo"], responce["wins"], responce["draws"], responce["losses"])
    )
    # Nejsem si 100% ale předpokládám, že když je loginAt Not Null, tak je to CreatedAt při vytváření.

    return jsonify(responce), 201

if __name__ == '__main__':
    app.run(debug=True)




