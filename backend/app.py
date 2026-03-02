from datetime import datetime
import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)

PREDICTIONS_FILE = os.path.join(BASE_DIR, "predictions_history.json")
MAX_HISTORY_ITEMS = 500

# Load model and encoders from the same directory as the script
model = joblib.load(os.path.join(BASE_DIR, "best_decision_tree_model.pkl"))
le_sex = joblib.load(os.path.join(BASE_DIR, "Sex_label_encoder.pkl"))
le_housing = joblib.load(os.path.join(BASE_DIR, "Housing_label_encoder.pkl"))
le_saving = joblib.load(os.path.join(BASE_DIR, "Saving accounts_label_encoder.pkl"))
le_checking = joblib.load(os.path.join(BASE_DIR, "Checking account_label_encoder.pkl"))
le_target = joblib.load(os.path.join(BASE_DIR, "target_label_encoder.pkl"))

categorical_cols = ["Sex", "Housing", "Saving accounts", "Checking account"]
numerical_cols = ["Age", "Job", "Credit amount", "Duration"]


def build_feature_metadata():
    labels = ["Age", "Job", "Credit amount", "Duration"]
    category_offsets = {}
    offset = len(labels)

    categorical_encoders = [
        ("Sex", le_sex),
        ("Housing", le_housing),
        ("Saving accounts", le_saving),
        ("Checking account", le_checking),
    ]

    for category_name, encoder in categorical_encoders:
        category_offsets[category_name] = offset
        labels.extend([f"{category_name}={value}" for value in encoder.classes_])
        offset += len(encoder.classes_)

    return labels, category_offsets, offset


feature_labels, category_offsets, feature_count = build_feature_metadata()


def get_model_class_index_for_encoded(encoded_label):
    matches = np.where(model.classes_ == encoded_label)[0]
    if matches.size == 0:
        return None
    return int(matches[0])


def get_model_class_index_for_target(target_label):
    try:
        encoded_target = int(le_target.transform([target_label])[0])
    except ValueError:
        return None
    return get_model_class_index_for_encoded(encoded_target)


bad_class_index = get_model_class_index_for_target("bad")
if bad_class_index is None:
    bad_class_index = 1 if len(model.classes_) > 1 else 0


def load_predictions():
    if not os.path.exists(PREDICTIONS_FILE):
        return []

    try:
        with open(PREDICTIONS_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except (json.JSONDecodeError, OSError):
        return []


def save_prediction(prediction_data):
    predictions = load_predictions()
    predictions.append(prediction_data)
    predictions = predictions[-MAX_HISTORY_ITEMS:]

    with open(PREDICTIONS_FILE, "w", encoding="utf-8") as file:
        json.dump(predictions, file, ensure_ascii=False, indent=2)


def get_next_prediction_id():
    predictions = load_predictions()
    if not predictions:
        return 1
    return max(int(pred.get("id", 0)) for pred in predictions) + 1


def parse_float(data, field_name):
    if field_name not in data:
        raise ValueError(f"Champ manquant: {field_name}")
    try:
        return float(data[field_name])
    except (TypeError, ValueError) as error:
        raise ValueError(f"Valeur numerique invalide pour {field_name}") from error


def parse_int(data, field_name):
    if field_name not in data:
        raise ValueError(f"Champ manquant: {field_name}")
    try:
        return int(data[field_name])
    except (TypeError, ValueError) as error:
        raise ValueError(f"Valeur entiere invalide pour {field_name}") from error


def encode_categorical(label_encoder, raw_value, field_name):
    if raw_value is None:
        raise ValueError(f"Champ manquant: {field_name}")

    value = str(raw_value)
    valid_values = set(label_encoder.classes_.tolist())
    if value not in valid_values:
        raise ValueError(f"Valeur invalide pour {field_name}: {value}")

    return int(label_encoder.transform([value])[0])


def prepare_input(data):
    if not isinstance(data, dict):
        raise ValueError("Le body JSON est invalide")

    input_df = pd.DataFrame(
        [
            {
                "Age": parse_float(data, "age"),
                "Sex": encode_categorical(le_sex, data.get("sex"), "sex"),
                "Job": parse_int(data, "job"),
                "Housing": encode_categorical(le_housing, data.get("housing"), "housing"),
                "Saving accounts": encode_categorical(
                    le_saving, data.get("saving_accounts"), "saving_accounts"
                ),
                "Checking account": encode_categorical(
                    le_checking, data.get("checking_account"), "checking_account"
                ),
                "Credit amount": parse_float(data, "credit_amount"),
                "Duration": parse_int(data, "duration"),
            }
        ]
    )

    return input_df[numerical_cols + categorical_cols]


def build_model_input(input_data):
    x_processed = np.zeros((1, feature_count), dtype=float)
    x_processed[0, 0:4] = input_data[numerical_cols].values[0]
    x_processed[0, category_offsets["Sex"] + int(input_data["Sex"].values[0])] = 1.0
    x_processed[0, category_offsets["Housing"] + int(input_data["Housing"].values[0])] = 1.0
    x_processed[
        0, category_offsets["Saving accounts"] + int(input_data["Saving accounts"].values[0])
    ] = 1.0
    x_processed[
        0, category_offsets["Checking account"] + int(input_data["Checking account"].values[0])
    ] = 1.0
    return x_processed


def class_probability_at_node(node_id, class_index):
    node_values = model.tree_.value[node_id][0]
    total = float(np.sum(node_values))
    if total == 0:
        return 0.0
    if class_index >= len(node_values):
        return 0.0
    return float(node_values[class_index] / total)


def explain_prediction(x_processed, score_class_index):
    tree = model.tree_
    path_nodes = model.decision_path(x_processed).indices.tolist()
    feature_effects = {}

    for idx in range(len(path_nodes) - 1):
        parent_node = path_nodes[idx]
        child_node = path_nodes[idx + 1]
        feature_index = int(tree.feature[parent_node])

        if feature_index < 0:
            continue

        parent_prob = class_probability_at_node(parent_node, score_class_index)
        child_prob = class_probability_at_node(child_node, score_class_index)
        delta = child_prob - parent_prob

        threshold = float(tree.threshold[parent_node])
        feature_value = float(x_processed[0, feature_index])
        went_left = int(child_node) == int(tree.children_left[parent_node])

        if feature_index not in feature_effects:
            feature_effects[feature_index] = {
                "total_delta": 0.0,
                "main_step_delta": float(delta),
                "threshold": threshold,
                "feature_value": feature_value,
                "went_left": went_left,
            }

        feature_effects[feature_index]["total_delta"] += float(delta)
        if abs(delta) > abs(feature_effects[feature_index]["main_step_delta"]):
            feature_effects[feature_index]["main_step_delta"] = float(delta)
            feature_effects[feature_index]["threshold"] = threshold
            feature_effects[feature_index]["feature_value"] = feature_value
            feature_effects[feature_index]["went_left"] = went_left

    ranked_effects = sorted(
        feature_effects.items(),
        key=lambda item: abs(item[1]["total_delta"]),
        reverse=True,
    )

    explanations = []
    for feature_index, effect in ranked_effects[:3]:
        label = (
            feature_labels[feature_index]
            if feature_index < len(feature_labels)
            else f"feature_{feature_index}"
        )
        operator = "<=" if effect["went_left"] else ">"
        rule = f"{label} {operator} {effect['threshold']:.2f}"

        explanations.append(
            {
                "feature": label,
                "rule": rule,
                "value": round(float(effect["feature_value"]), 4),
                "impact": round(abs(float(effect["total_delta"])), 4),
                "signed_impact": round(float(effect["total_delta"]), 4),
                "direction": (
                    "increases_risk"
                    if float(effect["total_delta"]) >= 0
                    else "decreases_risk"
                ),
            }
        )

    if explanations:
        return explanations

    global_importance = getattr(model, "feature_importances_", None)
    if global_importance is None:
        return []

    for feature_index in np.argsort(global_importance)[::-1]:
        importance = float(global_importance[feature_index])
        if importance <= 0:
            continue

        label = (
            feature_labels[feature_index]
            if feature_index < len(feature_labels)
            else f"feature_{feature_index}"
        )
        explanations.append(
            {
                "feature": label,
                "rule": "Global feature importance",
                "value": round(float(x_processed[0, feature_index]), 4),
                "impact": round(importance, 4),
                "signed_impact": round(importance, 4),
                "direction": "increases_risk",
            }
        )
        if len(explanations) == 3:
            break

    return explanations


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True) or {}
        input_data = prepare_input(data)
        x_processed = build_model_input(input_data)

        prediction_encoded = int(model.predict(x_processed)[0])
        probabilities = model.predict_proba(x_processed)[0]

        predicted_class_index = get_model_class_index_for_encoded(prediction_encoded)
        if predicted_class_index is None:
            predicted_class_index = int(np.argmax(probabilities))

        result = str(le_target.inverse_transform([prediction_encoded])[0])
        confidence = float(probabilities[predicted_class_index])
        risk_score = (
            float(probabilities[bad_class_index])
            if bad_class_index < len(probabilities)
            else confidence
        )
        explanation_class_index = (
            bad_class_index
            if bad_class_index < len(probabilities)
            else predicted_class_index
        )
        explanation = explain_prediction(x_processed, explanation_class_index)

        prediction_record = {
            "id": get_next_prediction_id(),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "input": data,
            "prediction": result,
            "probability": confidence,
            "risk_score": risk_score,
            "explanation": explanation,
        }
        save_prediction(prediction_record)

        return jsonify(
            {
                "success": True,
                "prediction": result,
                "probability": confidence,
                "risk_score": risk_score,
                "explanation": explanation,
            }
        )
    except Exception as error:
        return jsonify({"success": False, "error": str(error)})


@app.route("/history", methods=["GET"])
def get_history():
    try:
        predictions = load_predictions()
        return jsonify({"success": True, "predictions": predictions, "total": len(predictions)})
    except Exception as error:
        return jsonify({"success": False, "error": str(error)})


@app.route("/history/<int:prediction_id>", methods=["GET"])
def get_prediction(prediction_id):
    try:
        predictions = load_predictions()
        prediction = next(
            (pred for pred in predictions if int(pred.get("id", -1)) == prediction_id),
            None,
        )
        if prediction:
            return jsonify({"success": True, "prediction": prediction})
        return jsonify({"success": False, "error": "Prediction non trouvee"}), 404
    except Exception as error:
        return jsonify({"success": False, "error": str(error)})


@app.route("/history/stats", methods=["GET"])
def get_stats():
    try:
        predictions = load_predictions()
        if not predictions:
            return jsonify(
                {
                    "success": True,
                    "stats": {
                        "total": 0,
                        "good": 0,
                        "bad": 0,
                        "good_percentage": 0,
                        "average_confidence": 0,
                    },
                }
            )

        good_count = sum(1 for pred in predictions if pred.get("prediction") == "good")
        bad_count = sum(1 for pred in predictions if pred.get("prediction") == "bad")
        avg_confidence = sum(float(pred.get("probability", 0.0)) for pred in predictions) / len(
            predictions
        )

        return jsonify(
            {
                "success": True,
                "stats": {
                    "total": len(predictions),
                    "good": good_count,
                    "bad": bad_count,
                    "good_percentage": round((good_count / len(predictions)) * 100, 1),
                    "average_confidence": round(avg_confidence * 100, 1),
                },
            }
        )
    except Exception as error:
        return jsonify({"success": False, "error": str(error)})


@app.route("/history/clear", methods=["DELETE"])
def clear_history():
    try:
        with open(PREDICTIONS_FILE, "w", encoding="utf-8") as file:
            json.dump([], file)
        return jsonify({"success": True, "message": "Historique efface"})
    except Exception as error:
        return jsonify({"success": False, "error": str(error)})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
