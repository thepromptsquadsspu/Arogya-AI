import os
import json
import random
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import init_db, SessionLocal, AuditLog
from routers.triage import router as triage_router

app = FastAPI(
    title="Interactive Medical Symptom Triage Advisor API",
    description="Production-grade AI triage API providing multi-label disease prediction, risk categorization, and anonymized audit logging.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(triage_router)

# Absolute path to static directory for serverless environments
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "static"))
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/", include_in_schema=False)
def serve_index():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "AegisMed Triage Advisor API Running. Visit /docs for API documentation."}

@app.on_event("startup")
def on_startup():
    try:
        init_db()
        db = SessionLocal()
        count = db.query(AuditLog).count()
        if count == 0:
            print("Seeding demo audit records for analytics dashboard...")
            demo_data = [
                (["chest_pain", "shortness_of_breath", "cold_sweats"], ["Heart Attack (Myocardial Infarction)", "Pulmonary Embolism"], "Emergency", 1),
                (["high_fever", "chills", "body_aches", "dry_cough"], ["Influenza (Flu)", "COVID-19"], "Consult GP", 2),
                (["runny_nose", "sneezing", "mild_sore_throat"], ["Common Cold", "Seasonal Allergies"], "Self Care", 3),
                (["facial_droop", "slurred_speech", "arm_weakness"], ["Stroke (Cerebrovascular Accident)"], "Emergency", 4),
                (["throbbing_headache", "sensitivity_to_light", "nausea"], ["Migraine"], "Consult GP", 5),
            ]
            for syms, preds, urg, day_offset in demo_data:
                entry = AuditLog(
                    timestamp=datetime.utcnow() - timedelta(days=day_offset % 6, hours=random.randint(1, 12)),
                    symptoms=json.dumps(syms),
                    predictions=json.dumps(preds),
                    urgency=urg
                )
                db.add(entry)
            db.commit()
        db.close()
    except Exception as e:
        print(f"Startup warning: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
