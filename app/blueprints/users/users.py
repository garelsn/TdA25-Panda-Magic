from flask import Blueprint

# Vytvoření blueprintu
users_bp = Blueprint("users", __name__, url_prefix="/users")

# Import jednotlivých rout (musí být po vytvoření Blueprintu)
from app.blueprints.users import get_all, get_one, create, update, delete
