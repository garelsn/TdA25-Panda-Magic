import os

from flask import Flask, request, jsonify
from . import db

import uuid

from datetime import datetime

from .validator import validator


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
    
    unique_id = str(uuid.uuid4())
    current_time = datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    # Přidáme unique_id do odpovědi
    response = {
        "uuid": unique_id,
        "createdAt":current_time,
        "updatedAt":current_time,
        "name": data.get("name"),
        "difficulty": data.get("difficulty"),
        "gameState":"midgame",
        "board":data.get("board")
    }

    return jsonify(response), 201


if __name__ == '__main__':
    app.run(debug=True)




