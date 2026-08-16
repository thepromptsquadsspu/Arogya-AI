# Installation & Setup Guide

This guide provides step-by-step instructions for running the Interactive Medical Symptom Triage Advisor locally.

## Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18.0 or higher
- **npm** or **yarn**

---

## 1. Backend Setup

```bash
# Navigate to project root
cd "Medical prototpye 1"

# Create Python virtual environment (optional)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Generate Dataset & Train ML Model
python3 ml/dataset_generator.py
python3 ml/train_model.py

# Start FastAPI Backend Server
python3 backend/main.py
```
The FastAPI backend will start at `http://localhost:8000`. API docs available at `http://localhost:8000/docs`.

---

## 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite React Development Server
npm run dev
```
The React frontend will start at `http://localhost:3000`.

---

## 3. Running Automated Tests

```bash
# Run backend and ML unit tests
pytest tests/
```
