"""Render/Gunicorn entrypoint.

This module lets `gunicorn app:app` work from the repository root.
The real Flask application lives in `backend/app.py`.
"""

from backend.app import app

