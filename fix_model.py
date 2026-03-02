"""
Fix script for the German Credit Data model training error.
This script fixes the ValueError: could not convert string to float: 'male'
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score
import joblib
import os

# Load the data
df = pd.read_csv("german_credit_data.csv")

# Drop rows with missing values
df = df.dropna().reset_index(drop=True)

# Define features and target
features = ["Age", "Sex", "Job", "Housing", "Saving accounts", "Checking account", "Credit amount", "Duration"]
target = "Risk"

df_model = df[features + [target]]

# Encode categorical columns
categorical_cols = ["Sex", "Job", "Housing", "Saving accounts", "Checking account", "Purpose"]
cat_cols = df_model.select_dtypes(include="object").columns.drop("Risk")

le_dict = {}
for col in cat_cols:
    le = LabelEncoder()
    df_model[col] = le.fit_transform(df_model[col])
    le_dict[col] = le
    # Save the encoder
    joblib.dump(le, f"{col}_label_encoder.pkl")

# Encode target variable
le_target = LabelEncoder()
df_model[target] = le_target.fit_transform(df_model[target])
joblib.dump(le_target, "target_label_encoder.pkl")

# Split data
X = df_model.drop(target, axis=1)
y = df_model[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

# Define Decision Tree parameter grid
dt_param_grid = {
    "max_depth": [3, 5, 7, 10, None],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
    "criterion": ["gini", "entropy"]
}

# Create model
dt = DecisionTreeClassifier(random_state=1, class_weight="balanced")

# Train model
def train_model(model, param_grid, X_train, y_train, X_test, y_test):
    grid = GridSearchCV(model, param_grid, cv=5, scoring="accuracy", n_jobs=-1)
    grid.fit(X_train, y_train)
    
    best_model = grid.best_estimator_
    y_pred = best_model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    
    return best_model, acc, grid.best_params_

print("Training Decision Tree model...")
best_dt, acc_dt, params_dt = train_model(dt, dt_param_grid, X_train, y_train, X_test, y_test)

print(f"Best Decision Tree Accuracy: {acc_dt:.4f}")
print(f"Best Parameters: {params_dt}")

# Save the model
joblib.dump(best_dt, "best_decision_tree_model.pkl")
print("Model saved successfully!")
