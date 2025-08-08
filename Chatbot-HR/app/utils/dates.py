from datetime import datetime, date

def parse_user_date(date_str: str) -> date:
    """
    Δέχεται είτε DD-MM-YYYY είτε YYYY-MM-DD.
    Επιστρέφει datetime.date ή σηκώνει ValueError.
    """
    for fmt in ("%d-%m-%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    raise ValueError("Η ημερομηνία πρέπει να είναι DD-MM-YYYY ή YYYY-MM-DD")