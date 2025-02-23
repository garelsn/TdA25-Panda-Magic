import os
from flask import Flask, request, jsonify, send_from_directory
from . import db
# from flask_cors import CORS
import datetime
from .blueprints.routes.routes import routes_bp
from .blueprints.auth.auth import auth_bp
from .blueprints.games.games import games_bp
from .blueprints.users.users import users_bp

from flask_socketio import SocketIO, join_room
from threading import Lock
import threading
import time
import uuid

app = Flask(__name__, static_folder='static/react', template_folder='templates')
socketio = SocketIO(app, cors_allowed_origins="*")

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

app.register_blueprint(routes_bp, url_prefix='/')
app.register_blueprint(auth_bp, url_prefix='/')
app.register_blueprint(games_bp)
app.register_blueprint(users_bp)

@app.route('/api', methods=['GET'])
def api(): 
    return jsonify({"organization": "Student Cyber Games"})



queue = []
queue_lock = threading.Lock()

def generate_game_id():
    return "game_" + str(uuid.uuid4())[:8]

@socketio.on("join_queue")
def handle_join_queue():
    with queue_lock:
        queue.append(request.sid)
        if len(queue) >= 2:
            player1 = queue.pop(0)
            player2 = queue.pop(0)
            game_id = generate_game_id()
            join_room(game_id, sid=player1)
            join_room(game_id, sid=player2)
            socketio.emit("game_started", {"game_id": game_id, "player": "X"}, room=player1)
            socketio.emit("game_started", {"game_id": game_id, "player": "O"}, room=player2)


@socketio.on("make_move")
def handle_make_move(data):
    game_id = data["game_id"]
    row = data["row"]
    col = data["col"]
    player = data["player"]
    # Ověření tahu by tu mělo být (např. zda je políčko volné), ale pro jednoduchost...
    socketio.emit("move_made", {"row": row, "col": col, "player": player}, room=game_id)
    
if __name__ == '__main__':
    app.run(debug=False)
    