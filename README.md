# Bank Credit Prediction System

A full-stack web application for predicting bank credit risk using machine learning. This system uses a Decision Tree classifier to evaluate credit applications and provides detailed explanations for each prediction.

![Python](https://img.shields.io/badge/Python-3.x-blue)
![Flask](https://img.shields.io/badge/Flask-2.x-green)
![React](https://img.shields.io/badge/React-19.x-cyan)
![Vite](https://img.shields.io/badge/Vite-7.x-purple)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Model Details](#model-details)
- [Screenshots](#screenshots)

---

## Project Overview

This application predicts whether a bank credit application will be classified as "good" (approved) or "bad" (rejected) based on various customer attributes. The system provides:

- Real-time credit risk prediction
- Visual analytics dashboard
- Prediction history tracking
- Explainable AI with feature importance

---

## Features

### Backend Features
- **Credit Risk Prediction**: Predicts if a credit application is "good" or "bad"
- **Probability Scoring**: Provides confidence scores for each prediction
- **Explainable Predictions**: Generates feature-based explanations using decision tree paths
- **Prediction History**: Stores and retrieves past predictions
- **Statistics Dashboard**: Aggregates prediction data for analytics
- **RESTful API**: Full CRUD operations for predictions

### Frontend Features
- **Interactive Dashboard**: Visual analytics with multiple chart types
- **Live Score Prediction**: Real-time credit risk scoring as users fill the form
- **Prediction Form**: Comprehensive form for credit application data
- **History View**: Browse and filter past predictions
- **Risk Distribution Charts**: Pie charts showing risk distribution
- **Amount & Duration Analysis**: Distribution charts for credit parameters
- **Radar Charts**: Visual comparison of applicant attributes

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Dashboard│  │  Form    │  │ Charts   │  │ History  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/JSON
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Flask API)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Prediction  │  │   History    │  │   Stats      │       │
│  │   Endpoint   │  │   Endpoint   │  │   Endpoint   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   ML Model (Decision Tree)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Model     │  │   Label      │  │  Feature     │       │
│  │   (.pkl)     │  │  Encoders    │  │  Processing  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
- **Python 3.x**: Programming language
- **Flask**: Web framework
- **Flask-CORS**: Cross-origin resource sharing
- **Scikit-learn**: Machine learning library
- **Joblib**: Model serialization
- **Pandas**: Data manipulation
- **NumPy**: Numerical computations

### Frontend
- **React 19**: UI framework
- **Vite 7**: Build tool
- **ESLint**: Code linting

---

## Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```
bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```
bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```
bash
pip install flask flask-cors scikit-learn joblib pandas numpy
```

4. Start the Flask server:
```
bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```
bash
cd front/BankPrediction
```

2. Install dependencies:
```
bash
npm install
```

3. Start the development server:
```
bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Environment Variables (Optional)

Create a `.env` file in the frontend directory:
```
env
VITE_API_URL=http://localhost:5000
```

---

## Usage

1. Start the backend server:
```
bash
cd backend && python app.py
```

2. Start the frontend development server:
```
bash
cd front/BankPrediction && npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

4. Fill in the credit application form with:
   - Age
   - Sex
   - Job
   - Housing
   - Saving accounts
   - Checking account
   - Credit amount
   - Duration

5. Click "Analyser" to get the prediction

---

## API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```
http
GET /health
```
**Response:**
```
json
{
  "status": "healthy"
}
```

#### 2. Make a Prediction
```
http
POST /predict
```

**Request Body:**
```
json
{
  "age": 35,
  "sex": "male",
  "job": 2,
  "housing": "own",
  "saving_accounts": "little",
  "checking_account": "little",
  "credit_amount": 5000,
  "duration": 24
}
```

**Response:**
```json
{
  "success": true,
  "prediction": "good",
  "probability": 0.85,
  "risk_score": 0.15,
  "explanation": [
    {
      "feature": "Duration",
      "rule": "Duration <= 22.50",
      "value": 24,
      "impact": 0.45,
      "signed_impact": -0.45,
      "direction": "decreases_risk"
    }
  ]
}
```

#### 3. Get Prediction History
```
http
GET /history
```

**Response:**
```
json
{
  "success": true,
  "predictions": [...],
  "total": 100
}
```

#### 4. Get Statistics
```
http
GET /history/stats
```

**Response:**
```
json
{
  "success": true,
  "stats": {
    "total": 100,
    "good": 70,
    "bad": 30,
    "good_percentage": 70.0,
    "average_confidence": 82.5
  }
}
```

#### 5. Clear History
```
http
DELETE /history/clear
```

**Response:**
```
json
{
  "success": true,
  "message": "Historique efface"
}
```

#### 6. Get Single Prediction
```
http
GET /history/{id}
```

---

## Project Structure

```
.
├── backend/
│   ├── app.py                      # Flask API application
│   ├── best_decision_tree_model.pkl    # Trained model
│   ├── * _label_encoder.pkl        # Label encoders for categorical features
│   ├── predictions_history.json    # Prediction storage
│   └── test.py                    # Backend tests
│
├── front/
│   ├── BankPrediction/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── StatsCards.jsx
│   │   │   │   ├── MainChart.jsx
│   │   │   │   ├── RiskDistributionChart.jsx
│   │   │   │   ├── AmountDistributionChart.jsx
│   │   │   │   ├── RadarChart.jsx
│   │   │   │   ├── PredictionForm.jsx
│   │   │   │   ├── PredictionResult.jsx
│   │   │   │   ├── LiveScore.jsx
│   │   │   │   ├── History.jsx
│   │   │   │   └── index.js
│   │   │   ├── App.jsx
│   │   │   ├── App.css
│   │   │   ├── main.jsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── index.html
│   │
│   ├── index.html                  # Vanilla JS version (deprecated)
│   └── script.js                  # Vanilla JS version (deprecated)
│
├── analysis_model.ipynb           # Jupyter notebook for model analysis
├── fix_model.py                   # Model training/fixing script
├── test.py                        # Integration tests
├── german_credit_data.csv         # Dataset
└── README.md                       # This file
```

---

## Model Details

### Dataset
- **Source**: German Credit Data
- **Samples**: 1000 credit applications
- **Features**: 8 input features + 1 target variable

### Input Features

| Feature | Type | Description |
|---------|------|-------------|
| Age | Numeric | Customer age (18-100) |
| Sex | Categorical | male/female |
| Job | Numeric | Job type (0-3) |
| Housing | Categorical | own/rent/free |
| Saving accounts | Categorical | little/moderate/quite rich/rich |
| Checking account | Categorical | little/moderate/rich |
| Credit amount | Numeric | Loan amount in DM |
| Duration | Numeric | Loan duration in months |

### Target Variable
- **good**: Credit approved
- **bad**: Credit rejected

### Model Performance
The Decision Tree model is trained and serialized using joblib. Model performance metrics are available in the `analysis_model.ipynb` notebook.

---

## Screenshots

The application features a modern dark-themed dashboard with:

- **Stats Cards**: Quick metrics overview
- **Charts**: Interactive line/bar charts for data visualization
- **Prediction Form**: Clean form for entering credit data
- **Result Display**: Clear prediction with probability and explanation
- **History**: Searchable prediction history

---

## License

This project is for educational purposes.

---

## Author

Created as a credit risk prediction demonstration using machine learning.
