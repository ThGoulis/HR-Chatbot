from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class ShiftSchema(BaseModel):
    id: Optional[int] = None
    mitroo: int
    fullname: str
    the_date: date
    status_name: str
    the_start_time: Optional[time]
    the_end_time: Optional[time]
    team_name: str
    company_name: str

    class Config:
        orm_mode = True
