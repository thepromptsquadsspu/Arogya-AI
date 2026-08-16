# Deployment Guide

This guide details deployment options for Vercel (Frontend), Render/Railway (Backend), and Docker containerization.

## 1. Deploy Frontend to Vercel
1. Connect GitHub repository to Vercel.
2. Root Directory: `frontend`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_BASE_URL`: URL of deployed backend on Render (e.g. `https://medical-triage-backend.onrender.com`)

## 2. Deploy Backend to Render
1. Create new Web Service on Render.
2. Build Command: `pip install -r backend/requirements.txt && python ml/dataset_generator.py && python ml/train_model.py`
3. Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

## 3. Docker Deployment
Use the provided `docker/docker-compose.yml`:
```bash
cd docker
docker-compose up --build -d
```
Frontend will be accessible at `http://localhost:3000`, Backend at `http://localhost:8000`.
