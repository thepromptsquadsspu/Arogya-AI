from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    symptoms: List[str] = Field(..., description="List of user selected/reported symptoms")

class DiseasePrediction(BaseModel):
    name: str
    confidence: float
    urgency: str
    urgency_level: str
    description: str
    recommendation: str
    matched_symptoms: List[str]
    missing_symptoms: List[str]
    explanation: str

class PredictResponse(BaseModel):
    triage_id: int
    primary_urgency: str
    urgency_level: str
    top_predictions: List[DiseasePrediction]
    summary_recommendation: str
    matched_symptoms_count: int
    total_reported_symptoms: int
    medical_disclaimer: str

class TriageQuestionRequest(BaseModel):
    current_symptoms: List[str]
    answered_symptoms: Optional[List[str]] = []

class FollowUpQuestion(BaseModel):
    symptom_key: str
    question_text: str
    category: str
    relevance_score: float

class TriageQuestionResponse(BaseModel):
    follow_up_questions: List[FollowUpQuestion]
    candidate_diseases_count: int
    has_emergency_red_flag: bool
    red_flag_warning: Optional[str] = None

class FeedbackRequest(BaseModel):
    triage_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comments: Optional[str] = None

class HistoryItem(BaseModel):
    id: int
    timestamp: str
    symptoms: List[str]
    primary_urgency: str
    top_disease: str
    top_confidence: float

class AnalyticsResponse(BaseModel):
    total_triages: int
    urgency_counts: Dict[str, int]
    top_symptoms: List[Dict[str, Any]]
    top_diseases: List[Dict[str, Any]]
    daily_usage: List[Dict[str, Any]]
    ml_metrics: Dict[str, Any]
