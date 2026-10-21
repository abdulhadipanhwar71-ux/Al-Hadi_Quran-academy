@echo off
title Al-Hadi Online Quran Academy - Automated Test Suite
echo ============================================================
echo Running Al-Hadi Online Quran Academy Pytest Suite
echo ============================================================
python -m pytest backend/tests -v
pause
