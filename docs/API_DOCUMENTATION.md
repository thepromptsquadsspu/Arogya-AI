# API Documentation

Base URL: `http://localhost:8000/api`

## Endpoints

### 1. `POST /api/predict`
Evaluates user reported symptoms, computes disease confidence scores, assigns urgency level, and logs anonymized audit entry.

#### Request Body
```json
{
  "symptoms": ["chest_pain", "shortness_of_breath", "cold_sweats"]
}
```

#### Response (200 OK)
```json
{
  "triage_id": 1,
  "primary_urgency": "Emergency",
  "urgency_level": "🔴 Emergency",
  "top_predictions": [
    {
      "name": "Heart Attack (Myocardial Infarction)",
      "confidence": 92.5,
      "urgency": "Emergency",
      "urgency_level": "🔴 Emergency",
      "description": "A serious medical emergency where blood flow to the heart muscle is severely reduced.",
      "recommendation": "Call 911 or visit the nearest Emergency Room IMMEDIATELY.",
      "matched_symptoms": ["Chest Pain", "Shortness Of Breath", "Cold Sweats"],
      "missing_symptoms": ["Pain Radiating To Left Arm"],
      "explanation": "Your symptoms match Myocardial Infarction with 92.5% confidence."
    }
  ],
  "summary_recommendation": "🔴 IMMEDIATE ACTION REQUIRED...",
  "matched_symptoms_count": 3,
  "total_reported_symptoms": 3,
  "medical_disclaimer": "This application is an educational triage assistant..."
}
```

---

### 2. `POST /api/triage`
Generates intelligent dynamic follow-up questions.

#### Request Body
```json
{
  "current_symptoms": ["high_fever"],
  "answered_symptoms": []
}
```

#### Response (200 OK)
```json
{
  "follow_up_questions": [
    {
      "symptom_key": "chills",
      "question_text": "Are you experiencing severe chills or uncontrollable shivering?",
      "category": "general",
      "relevance_score": 14 shadow
    }
  ],
  "candidate_diseases_count": 12,
  "has_emergency_red_flag": false,
  "red_flag_warning": null
}
```

---

### 3. `GET /api/analytics`
Fetches system analytics, top symptoms, urgency distribution, and ML model evaluation metrics.

---

### 4. `GET /api/history`
Returns anonymized past triage logs.

---

### 5. `POST /api/feedback`
Submits star ratings and user feedback.

---

### 6. `GET /api/health`
Health check endpoint.
