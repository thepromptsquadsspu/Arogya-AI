import os
import json
import joblib
import numpy as np
from typing import List, Dict, Any, Tuple

DISCLAIMER_TEXT = "This application is an educational triage assistant and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider."

# Human readable symptom labels and questions map
SYMPTOM_QUESTION_MAP = {
    "chest_pain": "Are you experiencing any chest pain, pressure, or tightness?",
    "shortness_of_breath": "Are you having difficulty breathing or shortness of breath?",
    "pain_radiating_to_left_arm": "Does pain radiate to your left arm, neck, or jaw?",
    "facial_droop": "Is there any noticeable drooping on one side of your face?",
    "arm_weakness": "Are you experiencing sudden weakness or numbness in one arm or leg?",
    "slurred_speech": "Is your speech slurred or are you having trouble finding words?",
    "high_fever": "Do you have a high fever (above 101°F or 38.3°C)?",
    "chills": "Are you experiencing severe chills or uncontrollable shivering?",
    "body_aches": "Do you have widespread muscle pain or body aches?",
    "productive_cough": "Is your cough producing phlegm or mucus?",
    "dry_cough": "Is it a dry, hacking cough?",
    "stiff_neck": "Do you have a stiff neck that makes it painful to touch your chin to your chest?",
    "sensitivity_to_light": "Are your eyes unusually sensitive to bright light (photophobia)?",
    "loss_of_taste_smell": "Have you experienced a sudden loss of taste or smell?",
    "throbbing_headache": "Is your headache throbbing or pulsating, especially on one side?",
    "burning_urination": "Do you feel a burning or painful sensation when urinating?",
    "frequent_urination": "Are you needing to urinate much more frequently than normal?",
    "right_lower_quadrant_pain": "Is the abdominal pain concentrated in the lower right side?",
    "severe_sudden_headache": "Did your headache start extremely suddenly like a sudden 'thunderclap'?",
    "fruity_breath": "Does your breath smell unusually sweet or fruity?",
    "excessive_thirst": "Are you feeling unquenchably thirsty?",
    "bluish_lips": "Are your lips or skin turning bluish or pale?",
    "confusion": "Are you experiencing sudden confusion or disorientation?",
    "nausea": "Are you feeling nauseous or sick to your stomach?",
    "vomiting": "Have you been vomiting?",
    "runny_nose": "Do you have a runny or congested nose?",
    "sneezing": "Are you sneezing frequently?",
    "sore_throat": "Do you have a painful or scratchy throat?",
    "fatigue": "Are you feeling unusually tired or exhausted?",
    "dizziness": "Do you feel lightheaded or dizzy?",
    "sweating": "Are you breaking out in cold sweats?",
    "wheezing": "Are you hearing a whistling or wheezing sound when breathing?"
}

EMERGENCY_RED_FLAGS = {
    "chest_pain", "pain_radiating_to_left_arm", "facial_droop", "arm_weakness",
    "slurred_speech", "severe_sudden_headache", "bluish_lips", "fruity_breath",
    "stiff_neck", "sudden_worst_headache_of_life", "coughing_up_blood"
}

class TriageService:
    def __init__(self):
        self.model = None
        self.symptom_features = []
        self.disease_db = {}
        self.load_artifacts()

    def load_artifacts(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        model_path = os.path.join(base_dir, "models/triage_model.pkl")
        features_path = os.path.join(base_dir, "models/symptom_features.json")
        db_path = os.path.join(base_dir, "models/disease_db.json")

        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                print(f"Loaded ML model successfully from {model_path}.")
            except Exception as e:
                print(f"Serverless model load warning: {e}")

        if os.path.exists(features_path):
            try:
                with open(features_path, "r") as f:
                    self.symptom_features = json.load(f)
            except Exception as e:
                print(f"Features load warning: {e}")

        if os.path.exists(db_path):
            try:
                with open(db_path, "r") as f:
                    self.disease_db = json.load(f)
            except Exception as e:
                print(f"Disease DB load warning: {e}")

    def format_symptom_label(self, sym_key: str) -> str:
        return sym_key.replace("_", " ").title()

    def predict(self, reported_symptoms: List[str]) -> Dict[str, Any]:
        if not reported_symptoms:
            reported_symptoms = ["fatigue"]

        reported_set = set(reported_symptoms)
        has_emergency_flag = bool(reported_set.intersection(EMERGENCY_RED_FLAGS))

        predictions_list = []

        # If model loaded, use ML probabilities
        if self.model and hasattr(self.model, "predict_proba") and len(self.symptom_features) > 0:
            try:
                input_vector = [1 if sym in reported_set else 0 for sym in self.symptom_features]
                input_arr = np.array([input_vector])
                classes = self.model.classes_
                probs = self.model.predict_proba(input_arr)[0]
                class_prob_pairs = sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
                
                for disease_name, prob in class_prob_pairs:
                    if prob < 0.05 and len(predictions_list) >= 4:
                        continue
                    info = self.disease_db.get(disease_name, {})
                    disease_syms = set(info.get("symptoms", []))
                    matched = [self.format_symptom_label(s) for s in reported_symptoms if s in disease_syms]
                    missing = [self.format_symptom_label(s) for s in info.get("primary_symptoms", disease_syms) if s not in reported_set]
                    
                    confidence_pct = round(prob * 100, 1)
                    if confidence_pct > 0:
                        predictions_list.append({
                            "name": disease_name,
                            "confidence": confidence_pct,
                            "urgency": info.get("urgency", "Consult GP"),
                            "urgency_level": info.get("urgency_level", "🟡 Consult GP"),
                            "description": info.get("description", "Medical condition matching symptom profile."),
                            "recommendation": info.get("recommendation", "Consult a doctor for advice."),
                            "matched_symptoms": matched,
                            "missing_symptoms": missing[:4],
                            "explanation": f"Your symptoms match {disease_name} with {confidence_pct}% confidence."
                        })
            except Exception as e:
                print(f"Inference exception: {e}")

        # Fallback symptom overlap calculator (Guarantees zero downtime in serverless environments)
        if not predictions_list and self.disease_db:
            for disease_name, info in self.disease_db.items():
                disease_syms = set(info.get("symptoms", []))
                prim_syms = set(info.get("primary_symptoms", disease_syms))
                matched_set = disease_syms.intersection(reported_set)
                
                if matched_set:
                    matched_labels = [self.format_symptom_label(s) for s in reported_symptoms if s in disease_syms]
                    missing_labels = [self.format_symptom_label(s) for s in prim_syms if s not in reported_set]
                    
                    overlap_ratio = len(matched_set) / max(len(disease_syms), 1)
                    prim_overlap = len(prim_syms.intersection(reported_set)) / max(len(prim_syms), 1)
                    score = round(max(overlap_ratio, prim_overlap * 0.9) * 92, 1)

                    predictions_list.append({
                        "name": disease_name,
                        "confidence": min(score + 8.0, 96.0),
                        "urgency": info.get("urgency", "Consult GP"),
                        "urgency_level": info.get("urgency_level", "🟡 Consult GP"),
                        "description": info.get("description", "Medical condition matching symptom profile."),
                        "recommendation": info.get("recommendation", "Consult a doctor for advice."),
                        "matched_symptoms": matched_labels,
                        "missing_symptoms": missing_labels[:4],
                        "explanation": f"Your reported symptoms ({', '.join(matched_labels[:3])}) closely match clinical presentation of {disease_name}."
                    })

        # Sort predictions by confidence
        predictions_list = sorted(predictions_list, key=lambda x: x["confidence"], reverse=True)
        top_predictions = predictions_list[:5]

        # Determine overall primary urgency
        urgency_hierarchy = {"Emergency": 3, "Consult GP": 2, "Self Care": 1}
        max_urgency = "Self Care"
        
        for p in top_predictions:
            u = p["urgency"]
            if urgency_hierarchy.get(u, 1) > urgency_hierarchy.get(max_urgency, 1):
                max_urgency = u

        if has_emergency_flag:
            max_urgency = "Emergency"

        urgency_level_str = "🔴 Emergency" if max_urgency == "Emergency" else ("🟡 Consult GP" if max_urgency == "Consult GP" else "🟢 Self Care")

        # Summary recommendation
        if max_urgency == "Emergency":
            summary = "🔴 IMMEDIATE ACTION REQUIRED: Your symptoms indicate a potentially serious emergency. Seek immediate medical attention at an Emergency Department or call emergency services (911)."
        elif max_urgency == "Consult GP":
            summary = "🟡 MEDICAL EVALUATION RECOMMENDED: Your symptoms warrant evaluation by a General Practitioner (GP) within 24 to 48 hours."
        else:
            summary = "🟢 SUPPORTIVE SELF-CARE: Your symptoms appear mild and manageable with rest, hydration, and over-the-counter care. Seek medical advice if symptoms worsen."

        return {
            "primary_urgency": max_urgency,
            "urgency_level": urgency_level_str,
            "top_predictions": top_predictions,
            "summary_recommendation": summary,
            "matched_symptoms_count": len(reported_symptoms),
            "total_reported_symptoms": len(reported_symptoms),
            "medical_disclaimer": DISCLAIMER_TEXT
        }

    def generate_follow_up_questions(self, current_symptoms: List[str], answered_symptoms: List[str] = None) -> Dict[str, Any]:
        if answered_symptoms is None:
            answered_symptoms = []

        known_set = set(current_symptoms).union(set(answered_symptoms))
        has_red_flag = bool(set(current_symptoms).intersection(EMERGENCY_RED_FLAGS))

        candidate_diseases = []
        if self.disease_db:
            for name, info in self.disease_db.items():
                syms = set(info.get("symptoms", []))
                if syms.intersection(set(current_symptoms)):
                    candidate_diseases.append(info)

            if not candidate_diseases:
                candidate_diseases = list(self.disease_db.values())

        symptom_scores = {}
        for d in candidate_diseases:
            is_emergency = d.get("urgency") == "Emergency"
            weight = 2.0 if is_emergency else 1.0
            for s in d.get("symptoms", []):
                if s not in known_set:
                    symptom_scores[s] = symptom_scores.get(s, 0) + weight

        sorted_syms = sorted(symptom_scores.items(), key=lambda x: x[1], reverse=True)

        questions = []
        for sym_key, score in sorted_syms[:4]:
            q_text = SYMPTOM_QUESTION_MAP.get(
                sym_key, 
                f"Are you experiencing {sym_key.replace('_', ' ')}?"
            )
            questions.append({
                "symptom_key": sym_key,
                "question_text": q_text,
                "category": "emergency" if sym_key in EMERGENCY_RED_FLAGS else "general",
                "relevance_score": round(score, 2)
            })

        return {
            "follow_up_questions": questions,
            "candidate_diseases_count": len(candidate_diseases),
            "has_emergency_red_flag": has_red_flag,
            "red_flag_warning": "Red-flag symptom detected!" if has_red_flag else None
        }

triage_service = TriageService()
