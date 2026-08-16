# AegisMed - Interactive Medical Symptom Triage Advisor 🩺⚡

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5.0-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

An intelligent, production-ready web application that analyzes user-reported symptoms, predicts potential conditions using calibrated multi-label Machine Learning, and categorizes medical urgency into **Self Care 🟢**, **Consult GP 🟡**, or **Emergency 🔴** with actionable recommendations and anonymous audit logging.

> **Medical Disclaimer**: *AegisMed is an educational decision-support triage assistant and is NOT a substitute for professional medical advice, formal diagnosis, or emergency care.*

---

## 🌟 Key Features

### 1. 🤖 Interactive Chatbot Symptom Checker
- **Information Entropy Questioning**: Dynamically generates follow-up diagnostic questions tailored to the user's initial symptoms.
- **Voice Speech Recognition**: Web Speech API integration allowing hands-free voice input.
- **Progress Indicator & Typing Animation**: Smooth conversational UI experience.
- **Searchable Symptom Palette**: Categorized quick-add library of 100+ medical symptoms.

### 2. 🧠 Multi-Label Machine Learning Prediction
- **Scikit-learn Random Forest Classifier**: Evaluates multi-symptom co-occurrence vectors across 45+ diseases.
- **Confidence Scores**: Filters predictions above confidence thresholds with progress score bars.
- **Emergency Safety Net Override**: High-risk red-flag symptoms (e.g. chest pain with arm radiation, facial droop, stiff neck + fever) automatically elevate overall urgency to **Emergency 🔴**.

### 3. 🚦 3-Tier Risk Urgency Categorization
- 🟢 **Self Care**: Mild self-limiting conditions (Common Cold, Seasonal Allergies, Tension Headache).
- 🟡 **Consult GP**: Non-emergency conditions requiring medical appointment within 24-48h (Flu, Migraine, Gastritis, UTI, Strep Throat).
- 🔴 **Emergency**: High-risk conditions requiring immediate ER or 911 dispatch (Heart Attack, Stroke, Sepsis, Severe Pneumonia, Appendicitis).

### 4. 💡 Natural Language Explanation Engine
- **Why Predicted**: Detailed clinical rationale explaining why specific conditions matched.
- **Matched vs Missing Symptoms**: Side-by-side comparison of user-reported vs key condition indicators.

### 5. 📄 Export & Sharing Tools
- **Download PDF Report**: Client-side single-click PDF summary generator built with `jsPDF`.
- **Share Summary**: Instant clipboard export.

### 6. 🔒 100% Anonymous Data Audit Logs
- Strictly logs timestamp, reported symptoms, predicted conditions, and urgency category.
- **Zero PII**: Never collects or stores names, emails, phone numbers, or personal identity.

### 7. 📊 Admin & Machine Learning Performance Dashboard
- Real-time KPI stats & urgency distribution pie charts.
- Top reported symptoms and top predicted diseases bar charts.
- Daily usage timeline graph.
- **Live Confusion Matrix & ML Evaluation Hub**: Displays Accuracy, Precision, Recall, and F1 Score metrics alongside an interactive confusion matrix heatmap.

---

## 🏗️ System Architecture

```
                                  +-----------------------+
                                  |   React / Vite UI     |
                                  | Glassmorphism Theme   |
                                  +-----------+-----------+
                                              | REST API
                                              v
                                  +-----------------------+
                                  |    FastAPI Backend    |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
        +-------------------------+                       +-------------------------+
        |   Scikit-Learn Model    |                       |   SQLite Audit Database |
        | Random Forest Inference |                       |   Anonymized Log Store  |
        +-------------------------+                       +-------------------------+
```

---

## 📁 Repository Directory Structure

```
medical-triage/
├── backend/                  # FastAPI Application & Routers
│   ├── main.py               # Application entrypoint & CORS setup
│   ├── database.py           # SQLAlchemy SQLite database configuration
│   ├── schemas.py            # Pydantic validation schemas
│   ├── requirements.txt      # Backend Python dependencies
│   ├── routers/
│   │   └── triage.py         # Endpoints: /predict, /triage, /history, /analytics, /feedback, /health
│   └── services/
│       └── triage_service.py # ML loading, inference, entropy question generator & safety net
├── frontend/                 # React 18 + Vite Web Application
│   ├── package.json          # Frontend Node dependencies
│   ├── vite.config.js        # Vite configuration & API proxy
│   ├── tailwind.config.js    # Medical dark glassmorphism theme tokens
│   ├── index.html            # HTML shell with Google Inter font
│   └── src/
│       ├── App.jsx           # Master router & state manager
│       ├── index.css         # Tailwind & custom scrollbar styles
│       ├── components/
│       │   ├── Navbar.jsx    # Responsive navigation bar & emergency hotlines modal
│       │   └── DisclaimerBanner.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx         # Hero section & quick triage search
│       │   ├── SymptomCheckerPage.jsx  # Interactive chatbot questionnaire & voice input
│       │   ├── ResultsPage.jsx         # Urgency badge, confidence bars & PDF export
│       │   ├── AdminDashboardPage.jsx  # Charts & ML confusion matrix hub
│       │   ├── SearchHistoryPage.jsx   # Anonymized history viewer
│       │   ├── AboutPage.jsx           # Educational background & hotline directory
│       │   └── NotFoundPage.jsx       # 404 handler
│       └── utils/
│           └── pdfGenerator.js         # jsPDF report generation utility
├── ml/                       # Machine Learning Module
│   ├── dataset_generator.py  # Generates 3000-sample synthetic dataset (45+ diseases, 120+ symptoms)
│   └── train_model.py        # Model trainer, evaluator & metrics JSON exporter
├── datasets/                 # Symptom-Disease CSV datasets
├── models/                   # Serialized ML artifacts (.pkl, .json)
├── docs/                     # Detailed Documentation
│   ├── INSTALLATION.md       # Setup instructions
│   ├── ARCHITECTURE.md       # System design & flowcharts
│   ├── API_DOCUMENTATION.md  # OpenAPI endpoint specifications
│   ├── MODEL_TRAINING.md     # Feature engineering & evaluation guide
│   └── DEPLOYMENT.md         # Vercel, Render & Docker deployment guide
├── tests/                    # Test Suite
│   ├── test_api.py           # FastAPI integration tests
│   └── test_ml.py            # ML model & triage logic unit tests
├── docker/                   # Containerization
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
└── README.md                 # Master project documentation
```

---

## ⚡ Quickstart Guide

### 1. Backend & ML Model Setup

```bash
# Clone repository
git clone https://github.com/your-org/medical-triage.git
cd medical-triage

# Install Python requirements
pip install -r backend/requirements.txt

# Generate Dataset & Train ML Classifier
python3 ml/dataset_generator.py
python3 ml/train_model.py

# Launch FastAPI Server
python3 backend/main.py
```
FastAPI server starts at `http://localhost:8000`. Interactive API documentation available at `http://localhost:8000/docs`.

---

### 2. Frontend Web Application Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite React server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

### 3. Automated Test Execution

```bash
# Execute Pytest test suite
pytest tests/
```

---

## 🌐 API Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/predict` | Analyzes symptoms, predicts conditions, assigns urgency & logs audit entry |
| `POST` | `/api/triage` | Dynamically generates information-entropy follow-up questions |
| `GET` | `/api/analytics` | Fetches dashboard analytics, top symptoms & ML confusion matrix metrics |
| `GET` | `/api/history` | Retrieves recent anonymized audit logs |
| `POST` | `/api/feedback` | Submits user rating & feedback comments |
| `GET` | `/api/health` | Service health check and model loading status |

---

## 🐳 Docker Deployment

To launch the full containerized stack using Docker Compose:

```bash
cd docker
docker-compose up --build -d
```
- **Frontend App**: `http://localhost:3000`
- **FastAPI API**: `http://localhost:8000`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
