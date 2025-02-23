from flask import Blueprint

# Vytvoření blueprintu
games_bp = Blueprint("games", __name__, url_prefix="/api/v1/games")

# Import jednotlivých rout (musí být po vytvoření Blueprintu)
from app.blueprints.games import get_all, get_one, create, update, delete
