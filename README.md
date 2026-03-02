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
- [Deployment](#deployment)
  - [Frontend on Vercel](#frontend-on-vercel)
  - [Backend on Render](#backend-on-render)
- [License](#license)

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
pip install flask flask-cors scikit-learn joblib pandas numpy gunicorn
```

4. Start the Flask server locally:
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

### Base URL (Local)
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```
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
```
json
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
GET /history
```

#### 4. Get Statistics
```
GET /history/stats
```

#### 5. Clear History
```
DELETE /history/clear
```

#### 6. Get Single Prediction
```
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
├── german_credit_data.csv         # Dataset
├── requirements.txt               # Python dependencies (root level)
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

---

## Deployment

### Frontend on Vercel

#### Method 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```
bash
npm install -g vercel
```

2. Navigate to the frontend directory:
```
bash
cd front/BankPrediction
```

3. Login to Vercel:
```
bash
vercel login
```

4. Deploy:
```
bash
vercel
```

5. Set up environment variable for the API URL:
```
bash
vercel env add VITE_API_URL
```
Enter your Render backend URL (e.g., `https://your-backend.onrender.com`)

#### Method 2: Deploy with GitHub

1. Push your code to a GitHub repository

2. Go to [vercel.com](https://vercel.com) and sign up

3. Click "New Project" and import your GitHub repository

4. Configure the project:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: Your Render backend URL (e.g., `https://bank-prediction-api.onrender.com`)

6. Click "Deploy"

#### Update Frontend for Production

Make sure to update the API URL in `front/BankPrediction/src/App.jsx`:

```
javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

---

### Backend on Render

#### Method 1: Deploy with GitHub

1. Create a `requirements.txt` file in the backend directory:
```
text
flask
flask-cors
scikit-learn
joblib
pandas
numpy
gunicorn
```

2. Create a `render.yaml` file in the backend directory (optional, for automatic configuration):
```
yaml
services:
  - type: web
    name: bank-prediction-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
```

3. Push your code to a GitHub repository

4. Go to [render.com](https://render.com) and sign up

5. Click "New" and select "Web Service"

6. Connect your GitHub repository

7. Configure the service:
   - Name: `bank-prediction-api`
   - Region: Choose closest to you
   - Branch: `main`
   - Runtime: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

8. Click "Deploy"

#### Method 2: Deploy with Render CLI

1. Install Render CLI:
```bash
pip install render
```

2. Login:
```
bash
render login
```

3. Navigate to backend directory:
```
bash
cd backend
```

4. Create the service:
```
bash
render create service --name bank-prediction-api --type web --buildCommand "pip install -r requirements.txt" --startCommand "gunicorn app:app"
```

---

### Configuration for Cross-Origin (CORS)

The backend is already configured with CORS support in `backend/app.py`:

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

For production, you may want to restrict CORS to only your Vercel domain:

```
python
CORS(app, origins=["https://your-vercel-project.vercel.app"])
```

---

### Environment Variables Summary

**Frontend (Vercel):**
| Variable | Value |
|----------|-------|
| VITE_API_URL | `https://your-backend.onrender.com` |

**Backend (Render):**
No special environment variables required (all config is in the code).

---

### Final URLs

After deployment:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://bank-prediction-api.onrender.com`

Make sure to update the `VITE_API_URL` in Vercel to point to your Render backend URL.

---

## License

This project is for educational purposes.

---

## Author

Created as a credit risk prediction demonstration using machine learning.
