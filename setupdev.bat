@echo off
setlocal EnableDelayedExpansion
title TaskFlux - Setup

echo.
echo  =====================================================
echo    TaskFlux  -  Development Setup
echo  =====================================================
echo.

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"
set "VENV=%BACKEND%\venv"

:: ── Step 1: Python ────────────────────────────────────────
echo  [1/6] Checking Python...
py --version >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found.
    echo  Download from: https://python.org
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('py --version 2^>^&1') do echo  Found: %%v
echo.

:: ── Step 2: Virtual environment ───────────────────────────
echo  [2/6] Setting up virtual environment...
if exist "%VENV%\Scripts\activate.bat" (
    echo  [SKIP] venv already exists.
) else (
    py -m venv "%VENV%"
    if errorlevel 1 ( echo  [ERROR] Failed to create venv. & pause & exit /b 1 )
    echo  [OK] venv created.
)
echo.

:: ── Step 3: Backend dependencies ──────────────────────────
echo  [3/6] Installing backend dependencies...
call "%VENV%\Scripts\activate.bat"
pip install --no-cache-dir --upgrade pip --quiet
pip install --no-cache-dir -r "%BACKEND%\requirements.txt"
if errorlevel 1 ( echo  [ERROR] pip install failed. & pause & exit /b 1 )
echo  [OK] Backend dependencies installed.
echo.

:: ── Step 4: Database migrations ───────────────────────────
echo  [4/6] Running Alembic database migrations...
cd /d "%BACKEND%"
alembic upgrade head
if errorlevel 1 ( echo  [ERROR] Migration failed. & pause & exit /b 1 )
echo  [OK] Database ready.
echo.

:: ── Step 5: Seed data ──────────────────────────────────────
echo  [5/6] Loading sample data...
python seed_db.py
if errorlevel 1 (
    echo  [WARN] Seed skipped ^(database may already have data^).
) else (
    echo  [OK] Sample data loaded.
)
echo.

:: ── Step 6: Frontend ──────────────────────────────────────
echo  [6/6] Installing frontend dependencies...
cd /d "%FRONTEND%"
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found.
    echo  Download from: https://nodejs.org
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo  Node: %%v
for /f "tokens=*" %%v in ('npm --version')  do echo  npm:  %%v
npm install --legacy-peer-deps
if errorlevel 1 ( echo  [ERROR] npm install failed. & pause & exit /b 1 )
echo  [OK] Frontend dependencies installed.
echo.

echo  =====================================================
echo    Setup complete! Run runapplication.bat to start.
echo  =====================================================
echo.
echo    To run tests:
echo      cd backend
echo      venv\Scripts\activate
echo      pytest tests/ -v
echo.
pause
