import sqlite3
from faker import Faker
import random
from datetime import date, timedelta, datetime

# Δημιουργία βάσης και πίνακα
conn = sqlite3.connect("shifts.db")
c = conn.cursor()
c.execute("""
CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mitroo INTEGER,
    fullname TEXT,
    the_date DATE,
    status_name TEXT,
    the_start_time TIME,
    the_end_time TIME,
    team_name TEXT,
    company_name TEXT
)""")

fake = Faker('el_GR')
teams = ["POSTPAID", "INBOUND", "SUPPORT"]
company = "COSMOTE"

mitroo_list = [str(random.randint(10000, 20000)) for _ in range(10)]
for mitroo in mitroo_list:
    fullname = fake.name()
    team = random.choice(teams)  # Σταθερό για τον υπάλληλο
    start_day = date(2025, 8, 4)  # Δευτέρα
    # Διάλεξε 2 διαφορετικές μέρες για ρεπό (0=Δευτέρα ... 6=Κυριακή)
    daysoff = sorted(random.sample(range(7), 2))
    for i in range(7):  # μια εβδομάδα
        curr_date = start_day + timedelta(days=i)
        curr_date_iso = curr_date.strftime("%Y-%m-%d")  # <-- Μορφοποίηση ISO
        if i in daysoff:
            status = "ΡΕΠΟ"
            start_time = end_time = None
        else:
            status = "ΕΡΓΑΣΙΑ"
            possible_starts = ["08:00:00", "09:00:00", "11:00:00", "15:00:00"]
            start_time = random.choice(possible_starts)
            # Υπολογισμός end_time = start_time + 8 ώρες
            start_dt = datetime.strptime(start_time, "%H:%M:%S")
            end_dt = (start_dt + timedelta(hours=8)).time()
            end_time = end_dt.strftime("%H:%M:%S")
        c.execute(
            "INSERT INTO shifts (mitroo, fullname, the_date, status_name, the_start_time, the_end_time, team_name, company_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (mitroo, fullname, curr_date_iso, status, start_time, end_time, team, company)
        )
conn.commit()
conn.close()
print("Dummy δεδομένα εισήχθησαν με σταθερό team/εργαζόμενο και μόνο COSMOTE ως εταιρεία.")

conn = sqlite3.connect("shifts.db")
c = conn.cursor()

print("Δείγμα 10 πρώτων εγγραφών:\n")
for row in c.execute("SELECT * FROM shifts ORDER BY id LIMIT 10"):
    print(row)

conn.close()
