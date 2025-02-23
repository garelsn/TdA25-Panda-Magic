from flask import request, jsonify
from .games import games_bp
from ... import db
from datetime import datetime
from ...validator import validator
from ...gameLogic import game_status


@games_bp.route("/<uuid>", methods=["PUT"])
def updateGameById(uuid):
    data = request.get_json()

    if not all(k in data for k in ["name", "difficulty", "board"]):
        return jsonify({"code": 400, "message": "Bad request: Missing"}), 400

    valid, message = validator(data["board"])
    if not valid:
        return jsonify({"code": 422, "message": f"Semantic error: {message}"}), 422

    sqlDB = db.get_db()
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM games WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify({"code": 404, "message": "Resource not found"}), 404

    current_time = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    status = game_status(data["board"])

    sqlDB.execute(
        "UPDATE games SET name=?, difficulty=?, gameState=?, board=?, updatedAt=? WHERE uuid=?",
        (data["name"], data["difficulty"], status, str(data["board"]), current_time, uuid)
    )

    sqlDB.commit()
    return jsonify({"uuid": uuid, "updatedAt": current_time, "message": "Game updated"}), 200
