from flask import jsonify
from .games import games_bp
from ... import db

@games_bp.route("/<uuid>", methods=["DELETE"])
def deleteGameById(uuid):
    sqlDB = db.get_db()
    cursor = sqlDB.cursor()

    cursor.execute("SELECT * FROM games WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify({"code": 404, "message": "Resource not found"}), 404

    cursor.execute("DELETE FROM games WHERE uuid=?", (uuid,))
    sqlDB.commit()
    sqlDB.close()

    return jsonify({"code": 204, "message": f"Game with UUID {uuid} deleted"}), 204
