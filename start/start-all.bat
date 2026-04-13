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
echo [OK] Backend (Python) started on http://localhost:8000

REM Start C# Backend in background (hidden)
start /B "" cmd /c "cd ..\backend_csharp && dotnet run > backend_csharp.log 2>&1"
set BACKEND_CSHARP_STARTED=1
echo [OK] Backend (C#) started on http://localhost:8001

REM Start C++ Backend in background (hidden)
start /B "" cmd /c "cd ..\backend_cpp\build && proxy_checker.exe > ..\backend_cpp.log 2>&1"
set BACKEND_CPP_STARTED=1
echo [OK] Backend (C++) started on http://localhost:8002

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
echo Backend (Python):  RUNNING (http://localhost:8000)
echo Backend (C#):      RUNNING (http://localhost:8001)
echo Backend (C++):     RUNNING (http://localhost:8002)
echo Frontend:          RUNNING (http://localhost:3000)
echo.
echo Logs are saved to:
echo   backend/backend.log
echo   backend_csharp/backend_csharp.log
echo   backend_cpp/backend_cpp.log
echo   frontend/frontend.log
echo.
echo ========================================
echo   Available Commands
echo ========================================
echo stop-backend       - Stop Python Backend server
echo stop-backend-cs    - Stop C# Backend server
echo stop-backend-cpp   - Stop C++ Backend server
echo stop-frontend      - Stop Frontend server
echo stop               - Stop all servers
echo status             - Show servers status
echo restart            - Restart all servers
echo logs-backend       - Show Python backend logs
echo logs-backend-cs    - Show C# backend logs
echo logs-backend-cpp   - Show C++ backend logs
echo logs-frontend      - Show frontend logs
echo exit               - Stop all and exit
echo ========================================
echo.

:COMMAND_LOOP
set /p command="Enter command: "

if /i "%command%"=="stop-backend" goto STOP_BACKEND
if /i "%command%"=="stop-backend-cs" goto STOP_BACKEND_CS
if /i "%command%"=="stop-backend-cpp" goto STOP_BACKEND_CPP
if /i "%command%"=="stop-frontend" goto STOP_FRONTEND
if /i "%command%"=="stop" goto STOP_ALL
if /i "%command%"=="status" goto SHOW_STATUS
if /i "%command%"=="restart" goto RESTART_ALL
if /i "%command%"=="logs-backend" goto LOGS_BACKEND
if /i "%command%"=="logs-backend-cs" goto LOGS_BACKEND_CS
if /i "%command%"=="logs-backend-cpp" goto LOGS_BACKEND_CPP
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

:LOGS_BACKEND_CS
echo.
echo ========================================
echo   C# Backend Logs (last 20 lines)
echo ========================================
cd ..\backend_csharp
if exist backend_csharp.log (
    powershell -Command "Get-Content backend_csharp.log -Tail 20"
) else (
    echo No logs found
)
cd ..\start
echo.
echo ========================================
pause
goto COMMAND_LOOP

:LOGS_BACKEND_CPP
echo.
echo ========================================
echo   C++ Backend Logs (last 20 lines)
echo ========================================
cd ..\backend_cpp
if exist backend_cpp.log (
    powershell -Command "Get-Content backend_cpp.log -Tail 20"
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

:STOP_BACKEND_CS
echo.
echo Stopping C# Backend server...
taskkill /F /IM dotnet.exe /FI "COMMANDLINE eq *backend_csharp*" > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8001" ^| find "LISTENING"') do taskkill /F /PID %%a > nul 2>&1
set BACKEND_CSHARP_STARTED=0
echo [OK] C# Backend stopped
echo.
goto COMMAND_LOOP

:STOP_BACKEND_CPP
echo.
echo Stopping C++ Backend server...
taskkill /F /IM proxy_checker.exe > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8002" ^| find "LISTENING"') do taskkill /F /PID %%a > nul 2>&1
set BACKEND_CPP_STARTED=0
echo [OK] C++ Backend stopped
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
call :STOP_BACKEND_CS_SILENT
call :STOP_BACKEND_CPP_SILENT
call :STOP_FRONTEND_SILENT
echo [OK] All servers stopped
echo.
goto COMMAND_LOOP

:STOP_BACKEND_SILENT
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *uvicorn*" > nul 2>&1
taskkill /F /IM python.exe /FI "COMMANDLINE eq *uvicorn*" > nul 2>&1
set BACKEND_STARTED=0
goto :EOF

:STOP_BACKEND_CS_SILENT
taskkill /F /IM dotnet.exe /FI "COMMANDLINE eq *backend_csharp*" > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8001" ^| find "LISTENING"') do taskkill /F /PID %%a > nul 2>&1
set BACKEND_CSHARP_STARTED=0
goto :EOF

:STOP_BACKEND_CPP_SILENT
taskkill /F /IM proxy_checker.exe > nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8002" ^| find "LISTENING"') do taskkill /F /PID %%a > nul 2>&1
set BACKEND_CPP_STARTED=0
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
    echo Backend (Python):  RUNNING (http://localhost:8000)
) else (
    echo Backend (Python):  STOPPED
)
if %BACKEND_CSHARP_STARTED%==1 (
    echo Backend (C#):      RUNNING (http://localhost:8001)
) else (
    echo Backend (C#):      STOPPED
)
if %BACKEND_CPP_STARTED%==1 (
    echo Backend (C++):     RUNNING (http://localhost:8002)
) else (
    echo Backend (C++):     STOPPED
)
if %FRONTEND_STARTED%==1 (
    echo Frontend:          RUNNING (http://localhost:3000)
) else (
    echo Frontend:          STOPPED
)
echo ========================================
echo.
goto COMMAND_LOOP

:RESTART_ALL
echo.
echo Restarting all servers...
call :STOP_BACKEND_SILENT
call :STOP_BACKEND_CS_SILENT
call :STOP_BACKEND_CPP_SILENT
call :STOP_FRONTEND_SILENT
timeout /t 1 /nobreak > nul
goto MAIN_MENU

:EXIT_PROGRAM
echo.
echo Stopping all servers and exiting...
call :STOP_BACKEND_SILENT
call :STOP_BACKEND_CS_SILENT
call :STOP_BACKEND_CPP_SILENT
call :STOP_FRONTEND_SILENT
echo [OK] All servers stopped
echo.
echo Goodbye!
timeout /t 1 /nobreak > nul
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq MTProto Proxy Hub - Control Panel*" > nul 2>&1
