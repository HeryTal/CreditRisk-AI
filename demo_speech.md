# Demo Speech - Bank Credit Prediction System

---

## Opening

"Good morning/afternoon everyone. Today, I will demonstrate our Bank Credit Prediction System - a full-stack machine learning application that predicts credit risk in real-time."

---

## Demo Outline

"Here's what I'll show you today:

1. **The Dashboard** - Our interactive analytics overview
2. **The Prediction Form** - How users input credit applications
3. **Live Scoring** - Real-time risk assessment as users type
4. **Prediction Results** - Detailed explanations from the AI
5. **History & Statistics** - Tracking past predictions"

---

## Demo Script

### 1. Introduction

"Let me start by showing you the main interface. Our application is built with React on the frontend and Flask on the backend. The model was trained on the German Credit Dataset using a Decision Tree Classifier."

### 2. Dashboard

"On the dashboard, you can see:
- **Stats Cards**: Total predictions, success rate, and average risk score
- **Risk Distribution Chart**: Pie chart showing good vs bad predictions
- **Amount Distribution**: Analysis of credit amounts requested
- **Duration Analysis**: Loan duration patterns
- **Radar Chart**: Comparison of applicant attributes"

### 3. Prediction Form

"Now, let's make a prediction. I'll fill in a sample credit application:

- Age: 35 years old
- Sex: Male
- Job: Skilled employee
- Housing: Own
- Saving Accounts: Little
- Checking Account: Moderate
- Credit Amount: 5000 DM
- Duration: 24 months

Click 'Analyse' to submit."

### 4. Live Score Feature

"Notice something interesting? As I'm filling out the form, you can see the Live Score updating in real-time! This shows the AI is continuously evaluating the risk even before submission."

### 5. Results & Explanation

"Here are the results:

**Prediction: GOOD** (Credit Approved)
**Confidence: 85%**

But what I find most fascinating is the **Explainable AI** section. The system shows exactly which factors influenced this decision:

- Duration <= 22.5 months: This DECREASES risk by 45%
- Credit amount factors: Affecting the final decision

This transparency is crucial for financial institutions to understand why a credit was approved or rejected."

### 6. History

"All predictions are stored in history. We can:
- View past predictions
- Filter by result (good/bad)
- See statistics over time"

---

## Key Features to Highlight

"Key features of our demo:

✅ **Real-time Prediction**: Instant credit risk assessment
✅ **Explainable AI**: Clear explanations for each decision
✅ **Live Scoring**: Risk updates as users fill the form
✅ **Visual Analytics**: Beautiful charts and dashboards
✅ **Full History**: Track and analyze past predictions
✅ **RESTful API**: Easy integration with other systems"

---

## Technical Details

"For those interested in the technical side:

- **Model**: Decision Tree Classifier (scikit-learn)
- **Backend**: Flask REST API with CORS support
- **Frontend**: React 19 with Vite 7
- **Deployment**: Vercel (Frontend) + Render (Backend)
- **Dataset**: German Credit Data (1000 samples)"

---

## Closing

"That's our demo! The system successfully predicts credit risk with clear explanations. Thank you for your attention. 

Are there any questions?"

---

## Vocabulary Notes

- **Credit Risk** = Risque de crédit
- **Decision Tree** = Arbre de décision
- **Dashboard** = Tableau de bord
- **Prediction** = Prédiction
- **Good/Bad** = Bon/Mauvais (apprové/rejeté)
- **Confidence** = Confiance/Niveau de confiance
- **Feature Importance** = Importance des caractéristiques
- **Explainable AI** = IA explicable

---

## Phrases Utiles pour l'Exposé

1. "Let me show you..." = Laissez-moi vous montrer...
2. "As you can see here..." = Comme vous pouvez le voir ici...
3. "The interesting part is..." = La partie intéressante est...
4. "This demonstrates..." = Cela démontre...
5. "Notice that..." = Remarquez que...
6. "I'll now move on to..." = Je vais maintenant passer à...
7. "This is particularly important because..." = C'est particulièrement important car...
8. "Let me walk you through..." = Laissez-moi vous guider à travers...

