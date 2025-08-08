from sqlalchemy.orm import Session
from .models import Shift
from datetime import date


def get_weekly_shifts(db: Session, mitroo: int, from_date: date, to_date: date):
    return db.query(Shift).filter(
        Shift.mitroo == mitroo,
        Shift.the_date >= from_date,
        Shift.the_date <= to_date
    ).order_by(Shift.the_date).all()