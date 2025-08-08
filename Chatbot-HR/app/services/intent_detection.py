import re
import unicodedata
from rapidfuzz import fuzz
from app.utils.text_normalization import greeklish_to_greek

def normalize_text(text):
    """
    Greeklish to Greek, remove tonos, lowercased.
    """
    txt = greeklish_to_greek(text.lower())
    # Remove tonos/diacritics
    txt = ''.join(c for c in unicodedata.normalize('NFD', txt) if unicodedata.category(c) != 'Mn')
    return txt

def smart_detect_intent(user_message: str) -> str:
    text = normalize_text(user_message)

    patterns = {
        "change_shift": [
            r"αλλαγ[ηή] [ββ]αρδ[ιί]α[ςσ]?", r"θέλω να αλλάξω βάρδια", r"βάρδια", r"βάρδιες",
            r"αλλάξω βάρδια", r"shift", r"change shift", r"ωράριο", r"ωραριο"
        ],
        "weekly_shift_change": [
            r"(εβδομ|week|weekly)", r"πρόγραμμα εβδομάδας", r"αλλαγ[ηή] προγράμματος", r"βαρδιες εβδομαδας",
            r"week shift", r"αλλαγ[ηή] ρεπ[οό]", r"ολο το προγραμμα"
        ],
        "leave_request": [
            r"άδεια", r"αδεια", r"adeia", r"adia", r"αναρρωτικ[ηή]", r"θα λείψω", r"θέλω άδεια",
            r"day off", r"leave", r"kanoniki adeia", r"κανονικη αδεια", r"απουσία", r"off"
        ]
    }

    # Πρώτα regex match
    for intent, regs in patterns.items():
        for reg in regs:
            if re.search(reg, text):
                return intent
    # Fuzzy fallback (περιλαμβάνει και όλα τα παραπάνω keywords)
    fuzzy_keywords = {
        "change_shift": [
            "βάρδια", "vardia", "bardia", "shift", "ανταλλαγή βάρδιας", "αλλαγη βαρδιας", "allagi vardias", "allagi bardias", "allagh vardias",
            "allagh bardias", "αλλάξω βάρδια", "ωράριο", "ωραριο"
        ],
        "weekly_shift_change": [
            "εβδομα", "week", "weekly", "πρόγραμμα εβδομάδας", "βάρδιες εβδομάδας", "week shift", "αλλαγή προγράμματος", "αλλαγή ρεπό"
        ],
        "leave_request": [
            "άδεια", "αδεια", "adeia", "adia", "θα λείψω", "αναρρωτική", "anarrwtikh", "κανονικη αδεια", "kanoniki adeia", "day off", "leave", "off"
        ]
    }
    for intent, keywords in fuzzy_keywords.items():
        for kw in keywords:
            if fuzz.partial_ratio(kw, text) > 80:
                return intent
    return "feedback"
