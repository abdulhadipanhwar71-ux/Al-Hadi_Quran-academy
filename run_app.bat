@echo off
title Al-Hadi Online Quran Academy - Integrated Production Server
echo ============================================================
echo Starting Al-Hadi Online Quran Academy Full-Stack Server
echo Website: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/api/docs
echo Admin Portal: http://127.0.0.1:8000/admin/login
echo ============================================================
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
pause
