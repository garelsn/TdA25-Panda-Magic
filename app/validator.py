def validator(board):
    # Kontrola počtu řádků
    if len(board) != 15:
        return False, "Špatný počet řádků, očekává se 15."

    for row in board:
        # Kontrola počtu sloupců v každém řádku
        if len(row) != 15:
            return False, "Špatný počet sloupců, očekává se 15 v každém řádku."
        
        # Kontrola obsahu každého pole
        for cell in row:
            if cell not in ["", "X", "O"]:
                return False, f"Neplatný obsah '{cell}', povolené hodnoty jsou '', 'X', nebo 'O'."
    
    # Pokud prošly všechny kontroly, vrací True
    return True, "Board je platný."