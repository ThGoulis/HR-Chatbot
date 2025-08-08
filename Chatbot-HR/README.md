# Chatbot-HR

Πλήρως λειτουργική εφαρμογή **HR Chatbot** με:

- **Frontend** (φάκελος `web-app/`) – καθαρό JavaScript/HTML/CSS, χωρίς build‑tool· ανοίγει ή σερβίρεται απευθείας.
- **Backend** (φάκελος `app/`) – Python FastAPI + SQLAlchemy, API‑first αρχιτεκτονική.
- **SQLite DB** (`shifts.db`) – έτοιμη με demo δεδομένα για τοπική χρήση.

> 📂 Το αρχείο `dummy_db.py` προορίζεται **μόνο** για γέμισμα της βάσης με ψευδο‑δεδομένα κι **δεν συμπεριλαμβάνεται** σε παραγωγικό deployment.

---

## 1. Προαπαιτούμενα

| Λογισμικό | Έκδοση                                                                    |
| --------- | ------------------------------------------------------------------------- |
| Python    | 3.11 ή νεότερη                                                            |
| Node.js   | _προαιρετικό_ – μόνο αν θέλεις να σερβίρεις το UI με κάποιο static‑server |

---

## 2. Εγκατάσταση

```bash
# δημιουργία venv
python -m venv venv
source venv/bin/activate          # Windows: venv\Scriptsctivate

# εγκατάσταση βιβλιοθηκών
pip install -r requirements.txt
```

---

## 3. Εκκίνηση backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Τεκμηρίωση αυτόματα διαθέσιμη:
  - Swagger UI → http://localhost:8000/docs
  - ReDoc → http://localhost:8000/redoc

---

## 4. Εκκίνηση frontend

- **Γρήγορα:** άνοιξε το `web-app/index.html` με διπλό κλικ.
- **Με static server (π.χ. http-server):**
  ```bash
  npx http-server web-app -p 3000
  # ή οποιονδήποτε παρόμοιο static server
  ```

---

## 5. Δομή φακέλων

```
Chatbot-HR/
├── app/                 # FastAPI + business logic
│   ├── database/        # SQLAlchemy engine & session
│   ├── models/          # Pydantic & ORM models
│   ├── routes/          # API endpoints
│   ├── services/        # intent detection κ.ά.
│   └── utils/           # βοηθητικά helpers
├── web-app/             # stateless, vanilla‑JS UI
├── shifts.db            # demo SQLite database
└── requirements.txt
```

---

## 6. Περιβάλλον παραγωγής

1. **Μεταφορά DB:** Αντικατέστησε το `sqlite:///./shifts.db` με RDBMS της επιλογής σου, ορίζοντας το `DATABASE_URL`.
2. **CORS:** Περιορίζεις τα `allow_origins` στο `app/main.py`.
3. **Run server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 80 --workers 4
   ```
4. **Frontend:** Σέρβιρε τα αρχεία του `web-app/` από CDN ή reverse‑proxy (Nginx, Apache κ.λπ.).

---

## 7. Testing & Quality

- **Lint:** `ruff check .`
- **Type‑checking:** `mypy app`
- **Unit tests:** πρόσθεσε όσα χρειάζονται στο φάκελο `tests/` (pytest).

---

## 8. Άδεια

MIT License – δες το αρχείο `LICENSE` (εφόσον προστεθεί).
