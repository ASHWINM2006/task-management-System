@echo off
setlocal EnableDelayedExpansion
title TaskFlux - Application Launcher

echo.
echo  =====================================================
echo    TaskFlux Task Management System
echo  =====================================================
echo.

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

:: ── Prerequisite checks ───────────────────────────────────
if not exist "%BACKEND%\venv\Scripts\activate.bat" (
    echo  [ERROR] Python virtual environment not found.
    echo  Please run setupdev.bat first.
    echo.
    pause
    exit /b 1
)

if not exist "%FRONTEND%\node_modules" (
    echo  [ERROR] Frontend node_modules not found.
    echo  Please run setupdev.bat first.
    echo.
    pause
    exit /b 1
)

:: ── Kill anything on port 8000 already ───────────────────
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8000 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: ── Start Backend ─────────────────────────────────────────
echo  [1/2] Starting FastAPI backend on port 8000...
start "TaskFlux Backend - FastAPI :8000" cmd /k ^
  "title TaskFlux Backend && ^
   cd /d "%BACKEND%" && ^
   call venv\Scripts\activate.bat && ^
   echo. && ^
   echo  Backend starting at http://localhost:8000 && ^
   echo  API Docs at http://localhost:8000/docs && ^
   echo  Press Ctrl+C to stop && ^
   echo. && ^
   uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: ── Wait for backend to be ready ─────────────────────────
echo  Waiting for backend to start...
timeout /t 4 /nobreak >nul

:: ── Start Frontend ────────────────────────────────────────
echo  [2/2] Starting React frontend on port 3000...
start "TaskFlux Frontend - React :3000" cmd /k ^
  "title TaskFlux Frontend && ^
   cd /d "%FRONTEND%" && ^
   echo. && ^
   echo  Frontend starting at http://localhost:3000 && ^
   echo  Press Ctrl+C to stop && ^
   echo. && ^
   npm start"

:: ── Summary ───────────────────────────────────────────────
echo.
echo  =====================================================
echo    Both servers are starting in separate windows.
echo  =====================================================
echo.
echo    Frontend  :  http://localhost:3000
echo    Backend   :  http://localhost:8000
echo    API Docs  :  http://localhost:8000/docs
echo    ReDoc     :  http://localhost:8000/redoc
echo    OpenAPI   :  http://localhost:8000/openapi.json
echo.
echo    Close the two terminal windows to stop servers.
echo  =====================================================
echo.

:: Open browser automatically after a short delay
timeout /t 6 /nobreak >nul
start "" "http://localhost:3000"

pause
