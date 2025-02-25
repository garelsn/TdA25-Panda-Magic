from app.db import get_db 

def get_user_by_uuid(uuid):
    sqlDB = get_db()  # Získání existujícího spojení, které Flask spravuje
    cursor = sqlDB.cursor()
    cursor.execute("SELECT username FROM users WHERE uuid=?", (uuid,))
    user = cursor.fetchone()  # Načtení výsledku

    if user is None:
        return None  # Uživatel neexistuje
    
    return user[0]  # Vracíme jen username