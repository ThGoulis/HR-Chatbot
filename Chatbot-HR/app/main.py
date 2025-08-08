from fastapi import FastAPI
from app.routes.chatbot import router as chatbot_router
from app.routes.leave import router as leave_router
from app.routes.shifts import router as shifts_router
# from app.database.db import SessionLocal
from app.database.db import Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="HR Chatbot Backend",
    description="Modular HR Chatbot Microservice",
    version="0.1.0"
)
def init_db() -> None:
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Σε παραγωγή βάζεις μόνο τα domain σου!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(shifts_router, prefix="/api") 
app.include_router(chatbot_router, prefix="/api/chatbot")
app.include_router(leave_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
