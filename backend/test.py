# test_backend.py
try:
    from flask import Flask
    from flask_cors import CORS
    import pandas as pd
    import numpy as np
    import joblib
    
    print("✅ Tous les modules sont importés correctement !")
    
    # Version de Flask (méthode correcte)
    import flask
    print(f"   Flask version: {flask.__version__}")
    
    # Version de Pandas
    print(f"   Pandas version: {pd.__version__}")
    
    # Version de NumPy
    print(f"   NumPy version: {np.__version__}")
    
    # Version de joblib
    print(f"   joblib version: {joblib.__version__}")
    
    # Test rapide de création d'application
    app = Flask(__name__)
    CORS(app)
    print("✅ Flask et CORS fonctionnent parfaitement !")
    
    # Test de chargement de modèle (sans fichier)
    print("✅ Environnement prêt pour le chargement des modèles")
    
except Exception as e:
    print(f"❌ Erreur: {e}")