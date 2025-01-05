

def game_status(board):
    if checkWin(board):
        return "endgame"
    """
    Určuje stav hry na základě počtu tahů.
    """
    moves = count_moves(board)
    if moves <= 5:
        return "opening"
    else:
        return "midgame"

def count_moves(board):
    """
    Spočítá počet tahů na hracím plánu.
    """
    total_moves = sum(cell in ["X", "O"] for row in board for cell in row)
    return total_moves



def checkWin(board):
    if HorizontalWin(board) or VerticalWin(board) or DiagonalWinLeftToRight(board) or DiagonalWinRightToLeft(board):
        return True
    
    return False


def HorizontalWin(board):
    rows, cols = len(board), len(board[0])
    for row in range(rows):
        for col in range(cols - 3):
            # Zkontroluj, jestli jsou 4 za sebou stejné
            if board[row][col] == board[row][col + 1] == board[row][col + 2] == board[row][col + 3]:
                if board[row][col] in {"X", "O"}:
                    # Zkontroluj předchozí a následující pozici
                    # if (col > 0 and board[row][col - 1] in {"", " "}) or (col + 4 < cols and board[row][col + 4] in {"", " "}):
                    #     return True
                    # Kontrola levé a pravé strany
                    left_blocked = (col == 0 or board[row][col - 1] not in {"", " "})  # Levá strana blokovaná
                    right_blocked = (col + 4 == cols or board[row][col + 4] not in {"", " "})  # Pravá strana blokovaná
                    
                    # Pokud není blokovaná z obou stran, vrátíme True
                    if not (left_blocked and right_blocked):  
                        return True
    return False   
 
def VerticalWin(board):
    rows, cols = len(board), len(board[0])
    for col in range(cols):
        for row in range(rows - 3):
            # Zkontroluj, jestli jsou 4 za sebou stejné
            if board[row][col] == board[row + 1][col] == board[row + 2][col] == board[row + 3][col]:
                if board[row][col] in {"X", "O"}:
                    # Zkontroluj horní a dolní pozici
                    # if (row > 0 and board[row - 1][col] in {"", " "}) or (row + 4 < rows and board[row + 4][col] in {"", " "}):
                    #     return True
                     # Kontrola horní a dolní strany
                    top_blocked = (row == 0 or board[row - 1][col] not in {"", " "})  # Horní strana blokovaná
                    bottom_blocked = (row + 4 == rows or board[row + 4][col] not in {"", " "})  # Dolní strana blokovaná
                    
                    # Pokud není blokovaná z obou stran, vrátíme True
                    if not (top_blocked and bottom_blocked):  
                        return True
    return False

def DiagonalWinLeftToRight(board):
    rows, cols = len(board), len(board[0])
    for row in range(rows - 3):
        for col in range(cols - 3):
            # Zkontroluj, jestli jsou 4 za sebou stejné diagonálně zleva doprava
            if board[row][col] == board[row + 1][col + 1] == board[row + 2][col + 2] == board[row + 3][col + 3]:
                if board[row][col] in {"X", "O"}:
                    # Zkontroluj předchozí a následující pozici
                     # Kontrola horní-levé a dolní-pravé strany
                    top_left_blocked = (row == 0 or col == 0 or board[row - 1][col - 1] not in {"", " "})  # Horní-levá blokovaná
                    bottom_right_blocked = (row + 4 == rows or col + 4 == cols or board[row + 4][col + 4] not in {"", " "})  # Dolní-pravá blokovaná
                    
                    # Pokud není blokovaná z obou stran, vrátíme True
                    if not (top_left_blocked and bottom_right_blocked):  
                        return True
                    # if (row > 0 and col > 0 and board[row - 1][col - 1] in {"", " "}) and (row + 4 < rows and col + 4 < cols and board[row + 4][col + 4] in {"", " "}):
                    #     return True
                    # before = row > 0 and col > 0 and board[row - 1][col - 1] in {"", " "}
                    # after = row + 4 < rows and col + 4 < cols and board[row + 4][col + 4] in {"", " "}
                    # if before or after:
                    #     return True
    return False


def DiagonalWinRightToLeft(board):
    rows, cols = len(board), len(board[0])
    for row in range(rows - 3):
        for col in range(3, cols):
            # Zkontroluj, jestli jsou 4 za sebou stejné diagonálně zprava doleva
            if board[row][col] == board[row + 1][col - 1] == board[row + 2][col - 2] == board[row + 3][col - 3]:
                if board[row][col] in {"X", "O"}:
                    # Zkontroluj předchozí a následující pozici
                     # Check the top-right and bottom-left sides
                    top_right_blocked = (row == 0 or col == cols - 1 or board[row - 1][col + 1] not in {"", " "})  # Top-right blocked
                    bottom_left_blocked = (row + 4 == rows or col - 4 < 0 or board[row + 4][col - 4] not in {"", " "})  # Bottom-left blocked
                    
                    # If it's not blocked on both sides, return True
                    if not (top_right_blocked and bottom_left_blocked):
                        return True
                    #  if (row > 0 and col < cols - 1 and board[row - 1][col + 1] in {"", " "}) and (row + 4 < rows and col - 4 >= 0 and board[row + 4][col - 4] in {"", " "}):
                    #     return True
                    # before = row > 0 and col < cols - 1 and board[row - 1][col + 1] in {"", " "}
                    # after = row + 4 < rows and col - 4 >= 0 and board[row + 4][col - 4] in {"", " "}
                    # if before or after:
                    #     return True
    return False
