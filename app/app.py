import os
from flask import Flask, request, jsonify, send_from_directory
from . import db
from flask_cors import CORS
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
import json
from .function.get_user_by_uuid import get_user_by_uuid
from .function.Elo import think_different_elo

app = Flask(__name__, static_folder='static/react', template_folder='templates')
socketio = SocketIO(app, cors_allowed_origins="*" )

CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app, 
    cors_allowed_origins="*",
    async_mode="threading",
    logger=True,  # Enable logging
    engineio_logger=True  # Enable engine.io logging
)

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

active_games = {}  # Uložíme informace o hráčích v dané hře
game_timers = {}   # Slovník pro sledování časovačů her

# Konstanta pro standardní herní čas v sekundách (60 sekund = 1 minuta)
DEFAULT_GAME_TIME = 480

@socketio.on("join_queue")
def handle_join_queue(data):
    user_uuid = data["uuid"]
    
    with queue_lock:
        queue.append({"sid": request.sid, "uuid": user_uuid})  # Uložíme sid + uuid

        if len(queue) >= 2:
            player1 = queue.pop(0)
            player2 = queue.pop(0)
            
            game_id = generate_game_id()
            join_room(game_id, sid=player1["sid"])
            join_room(game_id, sid=player2["sid"])

            username1 = get_user_by_uuid(player1["uuid"]) or "Unknown"
            username2 = get_user_by_uuid(player2["uuid"]) or "Unknown"

            # Uložíme informace o hráčích do slovníku aktivních her
            active_games[game_id] = {
                "X": {"sid": player1["sid"], "uuid": player1["uuid"], "username": username1},
                "O": {"sid": player2["sid"], "uuid": player2["uuid"], "username": username2},
                "processed": False,  # Přidáno nové pole pro sledování stavu hry
                "current_turn": "X",  # X vždy začíná
                "last_activity": time.time()  # Pro sledování aktivity ve hře
            }
            
            # Inicializujeme časovače pro hru
            game_timers[game_id] = {
                "X": DEFAULT_GAME_TIME,
                "O": DEFAULT_GAME_TIME,
                "timer_active": True,
                "last_tick": time.time()
            }
            
            # Spustíme časovač pro tuto hru
            timer_thread = threading.Thread(target=game_timer_thread, args=(game_id,), daemon=True)
            timer_thread.start()
            
            # Posíláme obě UUID správným hráčům
            socketio.emit("game_started", {
                "game_id": game_id, 
                "player": "X",
                "user_uuid": player1["uuid"],  # Každý hráč dostane své vlastní uuid
                "username": username1,
                "time_limit": DEFAULT_GAME_TIME
            }, room=player1["sid"])
            
            socketio.emit("game_started", {
                "game_id": game_id, 
                "player": "O",
                "user_uuid": player2["uuid"],
                "username": username2,
                "time_limit": DEFAULT_GAME_TIME
            }, room=player2["sid"])

def game_timer_thread(game_id):
    """Vlákno pro odpočítávání času ve hře"""
    while game_id in game_timers and game_id in active_games:
        if not game_timers[game_id]["timer_active"]:
            time.sleep(0.1)  # Krátká pauza, pokud je časovač pozastaven
            continue
            
        current_time = time.time()
        elapsed = current_time - game_timers[game_id]["last_tick"]
        game_timers[game_id]["last_tick"] = current_time
        
        # Aktuální hráč na tahu
        current_player = active_games[game_id]["current_turn"]
        
        # Odečteme čas jen aktuálnímu hráči
        if game_timers[game_id][current_player] > 0:
            game_timers[game_id][current_player] -= elapsed
            
            # Pokud čas klesne pod 0, nastavíme na 0
            if game_timers[game_id][current_player] < 0:
                game_timers[game_id][current_player] = 0
            
            # Emitujeme aktualizaci časovače pravidelně pro všechny (každou sekundu)
            if int(current_time) != int(current_time - elapsed):
                socketio.emit("timer_update", {
                    "X_time": round(game_timers[game_id]["X"]),
                    "O_time": round(game_timers[game_id]["O"]),
                    "current_turn": current_player
                }, room=game_id)
            
            # Pokud vypršel čas aktuálnímu hráči
            if game_timers[game_id][current_player] <= 0 and not active_games[game_id].get("processed", False):
                game_timers[game_id]["timer_active"] = False
                winner = "O" if current_player == "X" else "X"
                
                socketio.emit("time_out", {
                    "player": current_player,
                    "winner": winner
                }, room=game_id)
                
                # Zpracujeme konec hry z důvodu vypršení času
                handle_game_over({
                    "game_id": game_id,
                    "winner": winner,
                    "reason": "timeout"
                })
                
                break  # Ukončíme časovač pro tuto hru
        
        time.sleep(0.1)  # Krátká pauza, abychom nezatěžovali CPU

@socketio.on("make_move")
def handle_make_move(data):
    game_id = data["game_id"]
    row = data["row"]
    col = data["col"]
    player = data["player"]
    
    # Přidejte kontrolu, zda je hra aktivní a není označena jako zpracovaná
    if game_id in active_games and not active_games[game_id].get("processed", False):
        # Aktualizujeme informaci o poslední aktivitě
        active_games[game_id]["last_activity"] = time.time()
        
        # Změníme aktuálního hráče na tahu
        active_games[game_id]["current_turn"] = "O" if player == "X" else "X"
        
        # Ověření tahu by tu mělo být (např. zda je políčko volné), ale pro jednoduchost...
        socketio.emit("move_made", {
            "row": row, 
            "col": col, 
            "player": player,
            "next_turn": active_games[game_id]["current_turn"]
        }, room=game_id)
    else:
        # Volitelně upozorněte hráče, že hra již skončila
        socketio.emit("game_error", {"message": "Tato hra již byla ukončena"}, room=request.sid)

game_locks = {}

@socketio.on("game_over")
def handle_game_over(data):
    game_id = data["game_id"]
    winner_symbol = data["winner"]

    if game_id not in active_games:
        print(f"Chyba: Game ID {game_id} nenalezeno v active_games")
        return

    # Použití zámku pro zabránění duplicitního zpracování
    if game_id not in game_locks:
        game_locks[game_id] = threading.Lock()

    with game_locks[game_id]:
        if active_games[game_id].get("processed", False):  # Kontrola, jestli už bylo zpracováno
            print(f"Hra {game_id} už byla zpracována.")
            return
        active_games[game_id]["processed"] = True  # Označíme hru jako zpracovanou
        
        # Zastavíme časovač pro tuto hru
        if game_id in game_timers:
            game_timers[game_id]["timer_active"] = False

        winner = active_games[game_id].get(winner_symbol, {})
        loser_symbol = "O" if winner_symbol == "X" else "X"
        loser = active_games[game_id].get(loser_symbol, {})

        winner_uuid = winner.get("uuid")
        loser_uuid = loser.get("uuid")
        winner_username = winner.get("username", "Unknown")
        loser_username = loser.get("username", "Unknown")

        if not winner_uuid or not loser_uuid:
            print("Chyba: UUID hráčů nebyly nalezeny")
            return

        sqlDB = db.get_db()
        cursor = sqlDB.cursor()

        cursor.execute("SELECT elo, wins, games FROM users WHERE uuid=?", (winner_uuid,))
        winner_data = cursor.fetchone()

        cursor.execute("SELECT elo, losses, games FROM users WHERE uuid=?", (loser_uuid,))
        loser_data = cursor.fetchone()

        if not winner_data or not loser_data:
            print("Chyba: Jeden z hráčů není v databázi")
            return

        winner_elo, winner_wins, winner_games_json = winner_data
        loser_elo, loser_losses, loser_games_json = loser_data

        try:
            winner_games = json.loads(winner_games_json) if winner_games_json else []
            loser_games = json.loads(loser_games_json) if loser_games_json else []
        except json.JSONDecodeError:
            winner_games, loser_games = [], []

        winner_games.append({"username": loser_username, "uuid": loser_uuid,"result":"win"})
        loser_games.append({"username": winner_username, "uuid": winner_uuid,"result":"lose"})

        winner_elo = think_different_elo(winner_elo, loser_elo, 1, winner_wins, 0, loser_losses)
        loser_elo = think_different_elo(loser_elo, winner_elo, 0, loser_losses, 0, winner_wins)

        winner_wins += 1
        loser_losses += 1

        cursor.execute("UPDATE users SET elo=?, wins=?, games=? WHERE uuid=?", 
                    (winner_elo, winner_wins, json.dumps(winner_games), winner_uuid))

        cursor.execute("UPDATE users SET elo=?, losses=?, games=? WHERE uuid=?", 
                    (loser_elo, loser_losses, json.dumps(loser_games), loser_uuid))

        sqlDB.commit()
        sqlDB.close()

        # Přidáme důvod výhry do odpovědi
        reason = data.get("reason", "normal")
        
        socketio.emit("game_over", {
            "winner": winner_username,
            "winner_uuid": winner_uuid,
            "loser": loser_username,
            "loser_uuid": loser_uuid,
            "winner_elo": winner_elo,
            "loser_elo": loser_elo,
            "reason": reason
        }, room=game_id)

rematch_requests = {}  # Uložíme žádosti o odvetu

@socketio.on("rematch_request")
def handle_rematch_request(data):
    game_id = data["game_id"]
    player = data["player"]

    if game_id not in active_games:
        return

    if game_id not in rematch_requests:
        rematch_requests[game_id] = set()

    rematch_requests[game_id].add(player)

    # Oznámíme soupeři, že druhý hráč chce hrát znovu
    socketio.emit("rematch_requested", room=game_id)

    # Pokud oba hráči souhlasili, začneme novou hru
    if len(rematch_requests[game_id]) == 2:
        # Vyčistíme žádosti
        del rematch_requests[game_id]
        
        # Při rematchi prohodíme role X a O
        player1_sid = active_games[game_id]["X"]["sid"]
        player2_sid = active_games[game_id]["O"]["sid"]
        player1_uuid = active_games[game_id]["X"]["uuid"]
        player2_uuid = active_games[game_id]["O"]["uuid"]
        player1_username = active_games[game_id]["X"]["username"]
        player2_username = active_games[game_id]["O"]["username"]
        
        active_games[game_id] = {
            "X": {"sid": player2_sid, "uuid": player2_uuid, "username": player2_username},
            "O": {"sid": player1_sid, "uuid": player1_uuid, "username": player1_username},
            "processed": False,
            "current_turn": "X",  # X vždy začíná
            "last_activity": time.time()
        }
        
        # Kompletně resetujeme časovače a nastavíme jako aktivní
        game_timers[game_id] = {
            "X": DEFAULT_GAME_TIME,
            "O": DEFAULT_GAME_TIME,
            "timer_active": True,
            "last_tick": time.time()
        }
        
        # Zastavíme případný běžící časovač a spustíme nový
        # (Pokud možné, je lepší ukončit starý časovač explicitně)
        timer_thread = threading.Thread(target=game_timer_thread, args=(game_id,), daemon=True)
        timer_thread.start()
        
        socketio.emit("game_started", {
            "game_id": game_id, 
            "player": "X",
            "user_uuid": player2_uuid,
            "username": player2_username,
            "time_limit": DEFAULT_GAME_TIME
        }, room=player2_sid)
        
        socketio.emit("game_started", {
            "game_id": game_id, 
            "player": "O",
            "user_uuid": player1_uuid,
            "username": player1_username,
            "time_limit": DEFAULT_GAME_TIME
        }, room=player1_sid)
        
        # Odešleme inicializační aktualizaci časovače všem hráčům
        socketio.emit("timer_update", {
            "X_time": DEFAULT_GAME_TIME,
            "O_time": DEFAULT_GAME_TIME,
            "current_turn": "X"  # X vždy začíná
        }, room=game_id)

# Funkce pro čištění starých dat
def cleanup_old_games():
    while True:
        time.sleep(3600)  # Každou hodinu
        current_time = time.time()
        
        # Vyčistit staré hry a zámky
        games_to_remove = []
        for game_id, game_data in active_games.items():
            if game_data.get("last_activity", 0) < current_time - 3600:  # Starší než 1 hodina
                games_to_remove.append(game_id)
        
        for game_id in games_to_remove:
            if game_id in active_games:
                del active_games[game_id]
            if game_id in game_locks:
                del game_locks[game_id]
            if game_id in game_timers:
                del game_timers[game_id]
            if game_id in rematch_requests:
                del rematch_requests[game_id]

# Spustíme čistící vlákno
cleanup_thread = threading.Thread(target=cleanup_old_games, daemon=True)
cleanup_thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)