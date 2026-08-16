# Architecture & System Design

```
+-----------------------------------------------------------------------+
|                            React Frontend                             |
|          (Tailwind CSS, Framer Motion, Recharts, Lucide)              |
+-----------------------------------┬-----------------------------------+
                                    | REST API Calls (Fetch / Axios)
                                    v
+-----------------------------------------------------------------------+
|                            FastAPI Backend                            |
|             (Pydantic Validation, CORS, Rate Limiter)                 |
+-------------------┬-------------------------------+-------------------+
                    |                               |
                    v                               v
+---------------------------------------+ +-----------------------------+
|          Triage Service Engine        | |     SQLite Database         |
|  - Random Forest Multi-label Model    | |  (SQLAlchemy Audit Log)     |
|  - Emergency Safety Net Rules         | |  - Anonymous Audit Record   |
|  - Information Entropy Question Gen   | |  - User Feedback Store      |
+---------------------------------------+ +-----------------------------+
```

## Key Architectural Principles

1. **Safety First (Emergency Rules)**: High-risk red-flag symptoms (such as `chest_pain` radiating to arm, `facial_droop`, `slurred_speech`, `stiff_neck` with fever) trigger hard override rules to force 🔴 **Emergency** triage status.
2. **Dynamic Questioning**: Uses candidate disease entropy to calculate remaining unasked symptoms with highest discrimination power.
3. **Strict Privacy**: Zero PII (Name, Email, Phone, IP) stored in database. All audit logs record timestamp, reported symptoms, predicted disease names, and urgency level.
