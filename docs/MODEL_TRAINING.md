# Machine Learning Model & Training Guide

## Model Overview
- **Algorithm**: Random Forest Multi-label Classifier (100 estimators, max depth 20)
- **Features**: 120+ binary one-hot encoded symptom vectors
- **Target Classes**: 45+ medical conditions categorized by urgency (Self Care, Consult GP, Emergency)
- **Evaluation Metrics**: Accuracy, Weighted Precision, Weighted Recall, Weighted F1 Score, Confusion Matrix

## Training Procedure
1. Execute `dataset_generator.py` to compile synthetic patient profiles spanning primary, secondary, and noise symptoms.
2. Run `train_model.py` to fit the classifier and generate performance metrics saved to `models/metrics.json`.
3. Artifacts (`triage_model.pkl`, `symptom_features.json`, `disease_db.json`) are automatically picked up by FastAPI `triage_service`.
