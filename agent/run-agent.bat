@echo off
REM Smart Meter Monitor Agent Runner
REM Usage: run-agent.bat token_here "Device Name"

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo ============================================
    echo Smart Meter Monitor - Agent Runner
    echo ============================================
    echo.
    echo Usage: run-agent.bat TOKEN "DEVICE_NAME"
    echo.
    echo Steps:
    echo 1. Go to http://localhost:3001/dashboard
    echo 2. Open DevTools (F12)
    echo 3. In Console, run: localStorage.getItem('token')
    echo 4. Copy the token value
    echo 5. Run: run-agent.bat YOUR_TOKEN "My Device"
    echo.
    echo Example:
    echo run-agent.bat eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... "My Meter"
    echo.
    pause
    exit /b 1
)

set TOKEN=%1
set DEVICE=%2

if "%DEVICE%"=="" (
    set DEVICE=Device
)

echo.
echo Starting monitor agent...
echo Device: %DEVICE%
echo.

python monitor-agent.py --token "%TOKEN%" --device "%DEVICE%"

pause
