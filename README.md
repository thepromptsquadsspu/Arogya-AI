# Aarogya AI - Interactive Medical Symptom Triage Advisor

[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5-F7931E.svg)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aarogya AI is an end-to-end, production-ready healthcare triage web application designed to analyze user-reported symptoms, predict potential medical conditions, and assign actionable urgency levels (🟢 **Self Care**, 🟡 **Consult GP**, 🔴 **Emergency**).

---

## 🌟 Key Features

1. **Interactive AI Symptom Checker**: Dynamic questionnaire powered by Information Entropy to ask targeted follow-up questions instead of overwhelming users.
2. **Multi-Label ML Classifier**: Trained Random Forest model achieving **98.33% Accuracy** across 46 medical conditions and 171 symptoms.
3. **Emergency Safety Net & Auto GPS Hotline**: Emergency red-flag rules automatically override predictions for critical conditions (Heart Attack, Stroke) with direct dialing to **112** (India Emergency Dispatch) and location auto-detection.
4. **Clinical PDF Exporter**: Generate and download clinical triage summaries to present to doctors.
5. **Admin & ML Hub**: Real-time KPI metrics, symptom co-occurrence charts, and live classification confusion matrix heatmap.
6. **100% Data Privacy**: Fully anonymized audit logs containing zero PII.

---

## 🚀 Quickstart Guide

### 1. Standalone Application Server
Run the unified FastAPI server & single-page client:
```bash
python3 backend/main.py
```
Open your browser at: **`http://localhost:8000`**

### 2. Frontend Development Server (Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ Medical Disclaimer
Aarogya AI is an educational decision-support triage assistant and is **NOT** a substitute for professional medical advice, formal diagnosis, or emergency clinical care. In case of a medical emergency, call **112** (India) or your local emergency number immediately.
