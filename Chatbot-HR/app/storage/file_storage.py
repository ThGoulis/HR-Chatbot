import os
import json
import tempfile
import shutil

DATA_FILE = os.path.abspath("data/requests.json")

def save_request(request_data: dict):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    data = []

    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            data = []

    data.append(request_data)

    # Γράψε πρώτα σε προσωρινό αρχείο και μετά κάνε rename για αποφυγή corruption
    with tempfile.NamedTemporaryFile("w", delete=False, encoding="utf-8", dir=os.path.dirname(DATA_FILE)) as tf:
        json.dump(data, tf, ensure_ascii=False, indent=2)
        tempname = tf.name
    shutil.move(tempname, DATA_FILE)
