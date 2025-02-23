from flask import jsonify
from .games import games_bp
from ... import db


from ast import literal_eval

@games_bp.route("/", methods=["GET"])
def returnAllGames():
    sqlDB = db.get_db()
    cursor = sqlDB.cursor()
    cursor.execute("SELECT * FROM games")
    DBItems = cursor.fetchall()

    sqlDB.close()

    column_names = [desc[0] for desc in cursor.description]
    result = [{column_names[i]: row[i] for i in range(len(column_names))} for row in DBItems]

    for game in result:
        if "board" in game:
            game["board"] = literal_eval(game["board"])

    return jsonify(result), 200
