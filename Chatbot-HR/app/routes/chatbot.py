import os
import json

from fastapi import APIRouter, status, HTTPException, Query, Body
from app.models.request_model import ChatbotRequest
from app.storage.file_storage import save_request
from app.services.intent_detection import smart_detect_intent
from pydantic import BaseModel
from app.database.db import SessionLocal
# from app.models.crud import get_shift_by_mitroo
from app.models.leave_request_model import LeaveRequest

router = APIRouter()

# router = APIRouter(prefix="/", tags=["chatbot"])

class MessageModel(BaseModel):
    message: str

DATA_FILE = os.path.abspath("data/requests.json")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post(
    "/message",
    status_code=status.HTTP_201_CREATED,
    summary="Υποβολή αιτήματος από chatbot"
)

def submit_request(request: ChatbotRequest):
    req_dict = request.dict()
    if req_dict.get("timestamp") and hasattr(req_dict["timestamp"], "isoformat"):
        req_dict["timestamp"] = req_dict["timestamp"].isoformat()
    try:
        save_request(req_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage error: {e}")
    return {"message": "Αίτημα καταχωρήθηκε", "data": req_dict}

@router.get(
    "/requests",
    status_code=status.HTTP_200_OK,
    summary="Λίστα όλων των αιτημάτων"
)
def list_requests(employee_id: str = Query(default=None, description="Φίλτρο με βάση τον employee_id")):
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Corrupted data file")
    else:
        data = []

    # Προαιρετικά φίλτρο με employee_id
    if employee_id:
        data = [req for req in data if req.get("employee_id") == employee_id]

    return {"requests": data}


WEEKLY_FILE = os.path.abspath("data/weekly_shift_changes.json")

@router.post(
    "/weekly_shift_change",
    status_code=status.HTTP_201_CREATED,
    summary="Υποβολή εβδομαδιαίων αλλαγών βαρδιών"
)
def weekly_shift_change(payload: dict = Body(...)):
    
    # Μπορείς να κάνεις validation, εδώ για παράδειγμα καταγράφουμε τα δεδομένα ως έχουν
    try:
        # Διάβασε υπάρχουσες εγγραφές (ή ξεκίνα νέο array)
        if os.path.exists(WEEKLY_FILE):
            with open(WEEKLY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        else:
            data = []

        # Πρόσθεσε το νέο request
        data.append(payload)
        # Γράψε πίσω το αρχείο
        with open(WEEKLY_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage error: {e}")

    return {"message": "Εβδομαδιαίες αλλαγές καταχωρήθηκαν επιτυχώς.", "data": payload}

@router.post(
    "/detect_intent",
    status_code=status.HTTP_200_OK,
    summary="Ανίχνευση intent από μήνυμα"
)
def detect_intent_endpoint(payload: MessageModel):
    intent = smart_detect_intent(payload.message)
    return {"intent": intent}


@router.post(
    "/leave",
    status_code=status.HTTP_201_CREATED,
    summary="Υποβολή αιτήματος άδειας"
)
def submit_leave_request(request: LeaveRequest):
    req_dict = request.dict()
    # Μετατροπή ημερομηνιών και timestamp σε string
    req_dict["start_date"] = req_dict["start_date"].isoformat()
    req_dict["end_date"] = req_dict["end_date"].isoformat()
    if req_dict.get("timestamp") and hasattr(req_dict["timestamp"], "isoformat"):
        req_dict["timestamp"] = req_dict["timestamp"].isoformat()
    req_dict["request_type"] = "leave_request"
    try:
        save_request(req_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage error: {e}")
    return {"message": "Αίτημα άδειας καταχωρήθηκε", "data": req_dict}


# Dependency για να περνάς το db session στα endpoints
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # @app.get("/shifts/{mitroo}")
# # def read_shift(mitroo: str, db: Session = Depends(get_db)):
# #     shift = get_shift_by_mitroo(db, mitroo)
# #     if not shift:
# #         return {"error": "Δεν βρέθηκε shift"}
# #     return shift