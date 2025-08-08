from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date, datetime

class LeaveRequest(BaseModel):
    employee_id: str = Field(..., example="100045")
    leave_type: str = Field(..., example="annual")  # annual, sick, unpaid, parental
    start_date: date = Field(..., example="2024-06-15")
    end_date: date = Field(..., example="2024-06-20")
    reason: str = Field(..., example="Οικογενειακοί λόγοι")
    contact_info: Optional[str] = Field(None, example="6971234567")
    substitute_employee_id: Optional[str] = Field(None, example="100046")
    document_url: Optional[str] = Field(None, example="https://.../βεβαίωση.pdf")
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

    @validator('end_date')
    def check_dates(cls, v, values, **kwargs):
        start_date = values.get('start_date')
        if start_date and v < start_date:
            raise ValueError('end_date must be after start_date')
        return v

    @validator('leave_type')
    def check_leave_type(cls, v):
        allowed_types = ['annual', 'sick', 'unpaid', 'parental']
        if v not in allowed_types:
            raise ValueError(f"leave_type must be one of: {', '.join(allowed_types)}")
        return v
