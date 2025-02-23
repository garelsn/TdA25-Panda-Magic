import os
from flask import Flask, request, jsonify, send_from_directory
from . import db
from flask_cors import CORS
import datetime
from .blueprints.routes.routes import routes_bp
from .blueprints.auth.auth import auth_bp
from .blueprints.games.games import games_bp
from .blueprints.users.users import users_bp

app = Flask(__name__, static_folder='static/react', template_folder='templates')

CORS(app)


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
if __name__ == '__main__':
    app.run(debug=True)