@echo off
REM Smart Meter Monitor - Windows Setup Script

echo ================================
echo Smart Meter Monitor Setup
echo ================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed. Please install Node.js 18+.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node version: %NODE_VERSION%

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%

REM Install dependencies
echo.
echo [*] Installing npm dependencies...
call npm install

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python not found. Some features may not work.
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo [OK] %PYTHON_VERSION%
    echo [*] Installing Python dependencies...
    pip install requests
)

echo.
echo ================================
echo [OK] Setup complete!
echo ================================
echo.
echo Next steps:
echo 1. Configure .env.local with your settings
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo 4. Register a new account
echo 5. Run monitoring agent: python monitor-agent.py --token ^<TOKEN^> --device ^<NAME^>
echo.
pause
