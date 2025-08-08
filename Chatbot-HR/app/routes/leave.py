from fastapi import APIRouter, status, HTTPException
from app.models.leave_request_model import LeaveRequest
from app.storage.file_storage import save_request

# router = APIRouter()
router = APIRouter(prefix="/leave", tags=["Leaves"])
@router.post(
    "/",
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
