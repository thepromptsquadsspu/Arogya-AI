import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_predict_emergency_symptom():
    payload = {"symptoms": ["chest_pain", "shortness_of_breath", "cold_sweats"]}
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["primary_urgency"] == "Emergency"
    assert data["urgency_level"] == "🔴 Emergency"
    assert len(data["top_predictions"]) > 0

def test_predict_selfcare_symptom():
    payload = {"symptoms": ["runny_nose", "sneezing", "mild_sore_throat"]}
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["primary_urgency"] in ["Self Care", "Consult GP"]
    assert len(data["top_predictions"]) > 0

def test_dynamic_triage_questions():
    payload = {"current_symptoms": ["fever"], "answered_symptoms": []}
    response = client.post("/api/triage", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "follow_up_questions" in data
    assert len(data["follow_up_questions"]) > 0

def test_analytics_endpoint():
    response = client.get("/api/analytics")
    assert response.status_code == 200
    data = response.json()
    assert "total_triages" in data
    assert "urgency_counts" in data
    assert "ml_metrics" in data

def test_history_endpoint():
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
