@echo off
echo ========================================
echo   Building C++ Backend
echo ========================================
echo.

REM Check if build directory exists
if not exist build (
    echo Creating build directory...
    mkdir build
)

cd build

echo Running CMake...
cmake .. -DCMAKE_BUILD_TYPE=Release

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] CMake configuration failed!
    echo.
    echo Make sure you have:
    echo   - CMake installed
    echo   - C++ compiler (MSVC, MinGW, or Clang)
    echo   - libcurl installed
    echo   - Boost installed
    echo.
    echo For Windows, we recommend using vcpkg:
    echo   vcpkg install curl:x64-windows boost-asio:x64-windows
    echo.
    pause
    exit /b 1
)

echo.
echo Building project...
cmake --build . --config Release

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build Successful!
echo ========================================
echo.
echo Executable: build\Release\proxy_checker.exe
echo or: build\proxy_checker.exe
echo.
echo To run: cd build ^&^& proxy_checker.exe
echo.
pause
