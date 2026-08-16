import sys
import os
import json
import joblib
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
from services.triage_service import triage_service

def test_ml_artifacts_exist():
    assert os.path.exists("models/disease_db.json")
    assert os.path.exists("models/symptom_features.json")
    assert os.path.exists("models/metrics.json")

def test_disease_database_structure():
    with open("models/disease_db.json", "r") as f:
        db = json.load(f)
    assert len(db) >= 40
    for name, info in db.items():
        assert "urgency" in info
        assert "symptoms" in info
        assert "recommendation" in info

def test_triage_service_inference():
    res = triage_service.predict(["chest_pain", "shortness_of_breath"])
    assert res["primary_urgency"] == "Emergency"
    assert len(res["top_predictions"]) > 0
    top = res["top_predictions"][0]
    assert top["confidence"] >= 20.0
    assert len(top["matched_symptoms"]) > 0

def test_dynamic_question_generation():
    res = triage_service.generate_follow_up_questions(current_symptoms=["high_fever"])
    assert len(res["follow_up_questions"]) > 0
    q = res["follow_up_questions"][0]
    assert "question_text" in q
    assert "symptom_key" in q
