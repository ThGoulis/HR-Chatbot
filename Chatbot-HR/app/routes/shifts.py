# app/routes/shifts.py (ή main.py, αν δεν έχεις routes)

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.models import Shift
from app.models.schemas import ShiftSchema
from typing import List
from datetime import timedelta
from app.utils.dates import parse_user_date

router = APIRouter(prefix="/shifts", tags=["Shifts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{mitroo}", response_model=List[ShiftSchema])
def get_employee_shifts(mitroo: int, db: Session = Depends(get_db)):
    return db.query(Shift).filter(Shift.mitroo == mitroo).all()

@router.get("/{mitroo}/week")
def get_week_schedule(
    mitroo: int,
    date_str: str = Query(..., description="DD-MM-YYYY ή YYYY-MM-DD"),
    db: Session = Depends(get_db)
 ):
    try:
        target_date = parse_user_date(date_str)
    except ValueError as exc:
       raise HTTPException(status_code=400, detail=str(exc))

    monday = target_date - timedelta(days=target_date.weekday())
    sunday = monday + timedelta(days=6)

    shifts = (
        db.query(Shift)
        .filter(
            Shift.mitroo == mitroo,
            Shift.the_date.between(monday, sunday)
        )
        .all()
    )
    if not shifts:
         raise HTTPException(404, "Δεν βρέθηκε πρόγραμμα για την εβδομάδα.")
    return shifts