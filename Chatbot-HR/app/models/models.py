
from sqlalchemy import Column, Integer, String, Date, Time
from app.database.db import Base 

class Shift(Base):
    __tablename__ = "shifts"
    id = Column(Integer, primary_key=True, autoincrement=True)
    mitroo = Column(Integer)
    fullname = Column(String)
    the_date = Column(Date)
    status_name = Column(String)
    the_start_time = Column(Time)
    the_end_time = Column(Time)
    team_name = Column(String)
    company_name = Column(String)
