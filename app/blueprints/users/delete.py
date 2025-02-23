from flask import jsonify
from .users import users_bp
from ... import db

@users_bp.route("/<uuid>", methods=["DELETE"])
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
