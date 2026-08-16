import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def train_triage_model():
    dataset_path = "datasets/symptom_disease_dataset.csv"
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"{dataset_path} not found. Run dataset_generator.py first.")

    df = pd.read_csv(dataset_path)
    
    # Non-feature columns
    non_feature_cols = ["disease", "urgency", "symptoms_str"]
    feature_cols = [col for col in df.columns if col not in non_feature_cols]
    
    X = df[feature_cols].values
    y = df["disease"].values

    classes = sorted(list(set(y)))
    print(f"Features: {len(feature_cols)}, Classes: {len(classes)}, Total Samples: {len(X)}")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, max_depth=20, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    # Compute evaluation metrics
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
    rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

    cm = confusion_matrix(y_test, y_pred, labels=classes)

    print(f"Model Evaluation Metrics:")
    print(f"  Accuracy:  {acc * 100:.2f}%")
    print(f"  Precision: {prec * 100:.2f}%")
    print(f"  Recall:    {rec * 100:.2f}%")
    print(f"  F1 Score:  {f1 * 100:.2f}%")

    # Format confusion matrix for UI display (top 10 most common classes for clean heatmap display + full matrix)
    top_classes = classes[:12]
    cm_top = confusion_matrix(y_test, y_pred, labels=top_classes)

    metrics_data = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "num_features": len(feature_cols),
        "num_classes": len(classes),
        "confusion_matrix": {
            "labels": top_classes,
            "matrix": cm_top.tolist()
        },
        "algorithm": "Random Forest Classifier (100 estimators)"
    }

    # Save model and metadata
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/triage_model.pkl")
    
    with open("models/symptom_features.json", "w") as f:
        json.dump(feature_cols, f, indent=2)

    with open("models/metrics.json", "w") as f:
        json.dump(metrics_data, f, indent=2)

    print("Model, features list, and metrics JSON successfully exported to models/")

if __name__ == "__main__":
    train_triage_model()
