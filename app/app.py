import os

from flask import Flask, request, jsonify
from . import db

import uuid

from datetime import datetime

from .validator import validator

from ast import literal_eval


app = Flask(__name__)


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
    return "Hello TdA 🐼 Magic "

@app.route('/api', methods=['GET'])
def api(): 
    return jsonify({"organization": "Student Cyber Games"})


@app.route('/games', methods=['POST'])


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
        "gameState":"midgame",
        "board": list(data.get("board"))
    }
    sqlDB.execute(
        'INSERT INTO games (uuid, name, difficulty, gameState, board, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (response["uuid"], response["name"], response["difficulty"],response["gameState"], str(response["board"]), response["createdAt"], response["updatedAt"] )
    )
    sqlDB.commit()

    return jsonify(response), 201

@app.route("/games", methods=["GET"])
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

@app.route("/games/<uuid>", methods=["GET"])
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

@app.route("/games/<uuid>", methods=["PUT"])
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

    response = {
        "uuid": uuid,
        "createdAt": DBItem["createdAt"],
        "updatedAt": current_time,
        "name": data["name"],
        "difficulty": data["difficulty"],
        "gameState": DBItem["gameState"],
        "board":data["board"]
    }

    sqlDB.execute(
        'UPDATE games SET name=?, difficulty=?, board=?, updatedAt=? WHERE uuid=?',
        (response["name"], response["difficulty"], str(response["board"]), current_time, uuid)
    )

    sqlDB.commit()

    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)




