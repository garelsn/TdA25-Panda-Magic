from flask import jsonify
from .games import games_bp
from ... import db
from ast import literal_eval

@games_bp.route("/<uuid>", methods=["GET"])
def returnGameById(uuid):
    sqlDB = db.get_db()
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM games WHERE uuid=?", (uuid,))
    DBItem = cursor.fetchone()

    if DBItem is None:
        return jsonify({"code": 404, "message": "Resource not found"}), 404

    sqlDB.close()

    column_names = [desc[0] for desc in cursor.description]
    result = {column_names[i]: DBItem[i] for i in range(len(column_names))}
    result["board"] = literal_eval(result["board"])

    return jsonify(result), 200
