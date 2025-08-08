from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ChatbotRequest(BaseModel):
    employee_id: str = Field(..., example="100045")
    request_type: str = Field(..., example="change_shift")
    details: str = Field(..., example="Αλλαγή βάρδιας από πρωινή σε απογευματινή, 26/05")
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

    @validator('request_type')
    def validate_request_type(cls, v):
        allowed_types = [
            "change_shift", "leave_request", "certificate_request", "personal_info_update",
            "equipment_request", "training_request", "feedback", "incident_report",
            "transfer_request", "resignation"
        ]
        if v not in allowed_types:
            raise ValueError(f"request_type must be one of: {', '.join(allowed_types)}")
        return v