def validator(board):
    # Kontrola počtu řádků
    if len(board) != 15:
        return False, "Špatný počet řádků, očekává se 15."
    
    total_X = 0
    total_O = 0

    for row in board:
        # Kontrola počtu sloupců v každém řádku
        if len(row) != 15:
            return False, "Špatný počet sloupců, očekává se 15 v každém řádku."
        
        # Kontrola obsahu každého pole
        for cell in row:
            if cell not in ["", "X", "O"]:
                return False, f"Neplatný obsah '{cell}', povolené hodnoty jsou '', 'X', nebo 'O'."
             # Počítání X a O
            if cell == "X":
                total_X += 1
            elif cell == "O":
                total_O += 1
     # Kontrola pořadí hráčů (X vždy začíná, X má o jeden víc nebo stejný počet jako O)
    if not (total_X == total_O or total_X == total_O + 1):
        return False, "Neplatné pořadí tahů. Křížek (X) musí mít stejný počet tahů jako kolečko (O), nebo o jeden více."
    
    # Pokud prošly všechny kontroly, vrací True
    return True, "Board je platný."