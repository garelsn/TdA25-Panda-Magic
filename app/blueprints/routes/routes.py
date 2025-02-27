from flask import Blueprint, send_from_directory, current_app

# Vytvoření blueprintu
routes_bp  = Blueprint('routes', __name__)

@routes_bp.route('/')
def hello_world():  # put application's code here
     return send_from_directory(current_app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@routes_bp.route('/game')
def gammme():  # put application's code here
    return send_from_directory(current_app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "
@routes_bp.route('/line')
def line():  # put application's code here
    return send_from_directory(current_app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "
@routes_bp.route('/login')
def login():  # put application's code here
    return send_from_directory(current_app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "
@routes_bp.route('/profile')
def profile():  # put application's code here
    return send_from_directory(current_app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "
@routes_bp.route('/top')
def top():  # put application's code here
    return send_from_directory(current_app.static_folder, 'index.html') # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "
    
@routes_bp.route('/search')
def gameSearch():  # put application's code here
     return send_from_directory(current_app.static_folder, 'index.html')  # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@routes_bp.route('/game/edit/<string:uuid>')
def gameEditUUID(uuid):  # put application's code here
     return send_from_directory(current_app.static_folder, 'index.html')  # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@routes_bp.route('/game/<string:uuid>')
def gameUUID(uuid):  # put application's code here
     return send_from_directory(current_app.static_folder, 'index.html')  # Vrátí HTML soubor z templates
    # return "Hello TdA 🐼 Magic "

@routes_bp.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(current_app.static_folder, path)