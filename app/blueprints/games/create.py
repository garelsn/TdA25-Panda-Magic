from flask import request, jsonify
from .games import games_bp
from ... import db
import uuid
from datetime import datetime 
from ...validator import validator
from ...gameLogic import game_status

@games_bp.route("/", methods=["POST"])
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
