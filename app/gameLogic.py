

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
    else:
        return False



def HorizontalWin(board):
    rows, cols = len(board), len(board[0])
    for row in range(rows):
        for col in range(cols - 3):
            # Zkontroluj, jestli jsou 4 za sebou stejné
            if board[row][col] == board[row][col + 1] == board[row][col + 2] == board[row][col + 3]:
                if board[row][col] in {"X", "O"}:
                    # Zkontroluj vlevo a vpravo
                    left_open = col > 0 and board[row][col - 1] == ""
                    right_open = col + 4 < cols and board[row][col + 4] == ""

                    # Pokud jsou obě strany volné, vrať True
                    if left_open and right_open:
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
                    above_empty = row > 0 and board[row - 1][col] == ""
                    below_empty = row + 4 < rows and board[row + 4][col] == ""

                    # Pokud jsou obě strany volné, vrať True
                    if above_empty and below_empty:
                        return True
    return False

def DiagonalWinLeftToRight(board):
    rows, cols = len(board), len(board[0])
    for row in range(rows - 3):
        for col in range(cols - 3):
            # Zkontroluj, jestli jsou 4 za sebou stejné diagonálně zleva doprava
            if board[row][col] == board[row + 1][col + 1] == board[row + 2][col + 2] == board[row + 3][col + 3]:
                if board[row][col] in {"X", "O"}:
                    # Zkontroluj levý horní roh (před sekvencí)
                    left_open = row > 0 and col > 0 and board[row - 1][col - 1] == ""

                    # Zkontroluj pravý dolní roh (za sekvencí)
                    right_open = row + 4 < rows and col + 4 < cols and board[row + 4][col + 4] == ""

                    # Pokud jsou obě strany volné, vrať True
                    if left_open and right_open:
                        return True
    return False



def DiagonalWinRightToLeft(board):
    rows, cols = len(board), len(board[0])
    for row in range(rows - 3):
        for col in range(3, cols):
            # Zkontroluj, jestli jsou 4 za sebou stejné diagonálně zprava doleva
            if board[row][col] == board[row + 1][col - 1] == board[row + 2][col - 2] == board[row + 3][col - 3]:
                if board[row][col] in {"X", "O"}:
                    # Zkontroluj pravý horní roh (před sekvencí)
                    right_open = row > 0 and col < cols and board[row - 1][col + 1] == ""

                    # Zkontroluj levý dolní roh (za sekvencí)
                    left_open = row + 4 < rows and col - 4 >= 0 and board[row + 4][col - 4] == ""

                    # Pokud jsou obě strany volné, vrať True
                    if right_open and left_open:
                        return True
    return False

