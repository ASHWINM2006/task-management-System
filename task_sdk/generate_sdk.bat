@echo off
echo ============================================================
echo   Python SDK Generation via OpenAPI Generator CLI
echo ============================================================
echo.
echo PREREQUISITES:
echo   1. Backend running at http://localhost:8000 (run runapplication.bat)
echo   2. Java 11+ installed  (https://adoptium.net/)
echo   3. openapi-generator-cli.jar in this folder (task_sdk\)
echo.
echo Download the JAR (run from task_sdk\ folder):
echo   curl -L -o openapi-generator-cli.jar ^
echo     https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.5.0/openapi-generator-cli-7.5.0.jar
echo.

set "DIR=%~dp0"
set "JAR=%DIR%openapi-generator-cli.jar"
set "OUT=%DIR%generated\task_management_client"

if not exist "%JAR%" (
    echo [ERROR] JAR not found: %JAR%
    pause & exit /b 1
)
java --version >nul 2>&1
if errorlevel 1 ( echo [ERROR] Java not found. & pause & exit /b 1 )

echo [1/3] Fetching schema...
curl -s -o "%DIR%schema.json" "http://localhost:8000/openapi.json"
if errorlevel 1 ( echo [ERROR] Cannot reach backend. & pause & exit /b 1 )
echo [OK] schema.json saved.

echo [2/3] Generating SDK...
java -jar "%JAR%" generate -i "%DIR%schema.json" -g python -o "%OUT%" ^
  --package-name task_management_client ^
  --additional-properties=projectName=task-management-client,packageVersion=1.0.0
if errorlevel 1 ( echo [ERROR] Generation failed. & pause & exit /b 1 )
echo [OK] SDK at: task_sdk\generated\task_management_client\

echo [3/3] Installing SDK...
cd /d "%OUT%"
pip install -e . --quiet
echo [OK] SDK installed.

echo.
echo Run the example:  python task_sdk\sdk_example.py
pause
