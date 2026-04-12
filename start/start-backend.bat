@echo off
title MTProto Proxy Hub - Backend
color 0A
echo ========================================
echo   MTProto Proxy Hub - Backend Server
echo ========================================
echo.
echo Starting Python FastAPI server...
echo.

cd ..\backend
python -m uvicorn main:app --reload --port 8000

pause
