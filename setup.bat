@echo off
REM EcoHub - Setup Script for Windows
REM This script configures environment variables and dependencies

echo.
echo ========================================================
echo           EcoHub - Environment Setup
echo ========================================================
echo.

REM Check and set JAVA_HOME
echo [INFO] Checking Java installation...
if exist "C:\Program Files\Java\jdk-21" (
    setx JAVA_HOME "C:\Program Files\Java\jdk-21"
    echo [SUCCESS] JAVA_HOME set to: C:\Program Files\Java\jdk-21
) else if exist "C:\Program Files\Java\jdk-20" (
    setx JAVA_HOME "C:\Program Files\Java\jdk-20"
    echo [SUCCESS] JAVA_HOME set to: C:\Program Files\Java\jdk-20
) else if exist "C:\Program Files\Java\jdk-17" (
    setx JAVA_HOME "C:\Program Files\Java\jdk-17"
    echo [SUCCESS] JAVA_HOME set to: C:\Program Files\Java\jdk-17
) else (
    echo [ERROR] Java not found in default locations
    echo [ERROR] Please install Java JDK 17 or higher from https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

REM Add Java to PATH if not already there
echo [INFO] Adding Java to system PATH...
for /f "tokens=*" %%i in ('reg query "HKCU\Environment" /v PATH 2^>nul ^| findstr /i path') do (
    set "currentPath=%%i"
)

REM Check if Java bin is in PATH
echo %currentPath% | find /i "jdk" >nul
if errorlevel 1 (
    setx PATH "%PATH%;C:\Program Files\Java\jdk-21\bin"
    echo [SUCCESS] Java added to PATH
) else (
    echo [SUCCESS] Java already in PATH
)

REM Verify Java installation
echo.
echo [INFO] Verifying Java installation...
java -version 2>&1
if errorlevel 1 (
    echo [ERROR] Java verification failed
    pause
    exit /b 1
)

REM Check for Node.js
echo.
echo [INFO] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check for npm
echo [INFO] Checking npm installation...
npm --version
if errorlevel 1 (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

REM Check for Docker
echo.
echo [INFO] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Docker not found. Some services may not start.
    echo [INFO] Install Docker from https://www.docker.com/
) else (
    echo [SUCCESS] Docker found
)

REM Install dependencies
echo.
echo [INFO] Installing project dependencies...

if exist "Frontend\package.json" (
    echo [INFO] Installing Frontend dependencies...
    cd Frontend
    call npm install
    cd ..
)

if exist "Backend\services\auth-service\package.json" (
    echo [INFO] Installing Auth Service dependencies...
    cd Backend\services\auth-service
    call npm install
    cd ..\..\..
)

echo.
echo ========================================================
echo           Setup Complete!
echo ========================================================
echo.
echo Environment variables have been set. Please restart 
echo your terminal or VS Code for changes to take effect.
echo.
echo To start all services, run:
echo   npm start
echo or
echo   node all-services.js
echo.
pause
