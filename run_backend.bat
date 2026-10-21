@echo off
title Al-Hadi Online Quran Academy - Backend Server
echo ============================================================
echo Starting Al-Hadi Online Quran Academy Backend (FastAPI)
echo http://127.0.0.1:8000/api/docs
echo ============================================================
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
pause
