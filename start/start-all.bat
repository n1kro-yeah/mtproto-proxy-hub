@echo off
setlocal enabledelayedexpansion
title MTProto Proxy Hub - Control Panel
color 0E

:MAIN_MENU
cls
echo ========================================
echo   MTProto Proxy Hub - Control Panel
echo ========================================
echo.
echo Starting servers in background...
echo.

REM Start Backend in background (hidden)
start /B "" cmd /c "cd ..\backend && python -m uvicorn main:app --reload --port 8000 > backend.log 2>&1"
set BACKEND_STARTED=1
echo [OK] Backend started on http://localhost:8000

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend in background (hidden)
start /B "" cmd /c "cd ..\frontend && npm run dev > frontend.log 2>&1"
set FRONTEND_STARTED=1
echo [OK] Frontend started on http://localhost:3000

echo.
echo ========================================
echo   Servers Status
echo ========================================
echo Backend:  RUNNING (http://localhost:8000)
echo Frontend: RUNNING (http://localhost:3000)
echo.
echo Logs are saved to:
echo   backend/backend.log
echo   frontend/frontend.log
echo.
echo ========================================
echo   Available Commands
echo ========================================
echo stop-backend  - Stop Backend server
echo stop-frontend - Stop Frontend server
echo stop          - Stop all servers
echo status        - Show servers status
echo restart       - Restart all servers
echo logs-backend  - Show backend logs
echo logs-frontend - Show frontend logs
echo exit          - Stop all and exit
echo ========================================
echo.

:COMMAND_LOOP
set /p command="Enter command: "

if /i "%command%"=="stop-backend" goto STOP_BACKEND
if /i "%command%"=="stop-frontend" goto STOP_FRONTEND
if /i "%command%"=="stop" goto STOP_ALL
if /i "%command%"=="status" goto SHOW_STATUS
if /i "%command%"=="restart" goto RESTART_ALL
if /i "%command%"=="logs-backend" goto LOGS_BACKEND
if /i "%command%"=="logs-frontend" goto LOGS_FRONTEND
if /i "%command%"=="exit" goto EXIT_PROGRAM
if /i "%command%"=="" goto COMMAND_LOOP

echo [ERROR] Unknown command: %command%
echo.
goto COMMAND_LOOP

:LOGS_BACKEND
echo.
echo ========================================
echo   Backend Logs (last 20 lines)
echo ========================================
cd ..\backend
if exist backend.log (
    powershell -Command "Get-Content backend.log -Tail 20"
) else (
    echo No logs found
)
cd ..\start
echo.
echo ========================================
pause
goto COMMAND_LOOP

:LOGS_FRONTEND
echo.
echo ========================================
echo   Frontend Logs (last 20 lines)
echo ========================================
cd ..\frontend
if exist frontend.log (
    powershell -Command "Get-Content frontend.log -Tail 20"
) else (
    echo No logs found
)
cd ..\start
echo.
echo ========================================
pause
goto COMMAND_LOOP

:STOP_BACKEND
echo.
echo Stopping Backend server...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" > nul 2>&1
taskkill /F /IM python.exe /FI "COMMANDLINE eq *uvicorn*" > nul 2>&1
set BACKEND_STARTED=0
echo [OK] Backend stopped
echo.
goto COMMAND_LOOP

:STOP_FRONTEND
echo.
echo Stopping Frontend server...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *vite*" > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a > nul 2>&1
set FRONTEND_STARTED=0
echo [OK] Frontend stopped
echo.
goto COMMAND_LOOP

:STOP_ALL
echo.
echo Stopping all servers...
call :STOP_BACKEND_SILENT
call :STOP_FRONTEND_SILENT
echo [OK] All servers stopped
echo.
goto COMMAND_LOOP

:STOP_BACKEND_SILENT
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" > nul 2>&1
taskkill /F /IM python.exe /FI "COMMANDLINE eq *uvicorn*" > nul 2>&1
set BACKEND_STARTED=0
goto :EOF

:STOP_FRONTEND_SILENT
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *vite*" > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a > nul 2>&1
set FRONTEND_STARTED=0
goto :EOF

:SHOW_STATUS
echo.
echo ========================================
echo   Current Status
echo ========================================
if %BACKEND_STARTED%==1 (
    echo Backend:  RUNNING (http://localhost:8000)
) else (
    echo Backend:  STOPPED
)
if %FRONTEND_STARTED%==1 (
    echo Frontend: RUNNING (http://localhost:3000)
) else (
    echo Frontend: STOPPED
)
echo ========================================
echo.
goto COMMAND_LOOP

:RESTART_ALL
echo.
echo Restarting all servers...
call :STOP_BACKEND_SILENT
call :STOP_FRONTEND_SILENT
timeout /t 1 /nobreak > nul
goto MAIN_MENU

:EXIT_PROGRAM
echo.
echo Stopping all servers and exiting...
call :STOP_BACKEND_SILENT
call :STOP_FRONTEND_SILENT
echo [OK] All servers stopped
echo.
echo Goodbye!
timeout /t 2 /nobreak > nul
exit /b 0
