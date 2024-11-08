import os

from flask import Flask, jsonify
from . import db

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

# global variables ---------------------

uuid: int
board = []

DBValues = {
    ' ': None,
    'X': True,
    'O': False
}
LocalValues = { DBValues[key]:key for key in DBValues }

def parseBoardOut(board: list):
    return [ [ LocalValues[y] for y in x ] for x in board]

def parseBoardIn(board: list):
    return [ [ DBValues[y] for y in x ] for x in board]

def initBoard():
    for i in range(15):
        boardLayer = []
        for j in range(15):
            boardLayer.append(None)
        board.append(boardLayer)

@app.rounte('/games', methods=['POST'])
def initNewGame():
    board.clear() # later function that saves the board
    initBoard()

    return jsonify(parseBoardOut(board))


@app.route('/')
def hello_world():  # put application's code here
    return "Hello TdA 🐼 Magic "

@app.route('/api', methods=['GET'])
def api(): 
    return jsonify({"organization": "Student Cyber Games"})

if __name__ == '__main__':
    app.run()
