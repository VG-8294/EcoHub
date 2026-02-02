#!/usr/bin/env pwsh

# EcoHub - Setup Script for Windows PowerShell
# This script configures environment variables and dependencies

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "           EcoHub - Environment Setup" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Function to set environment variable
function Set-EnvironmentVariable {
    param(
        [string]$Name,
        [string]$Value,
        [ValidateSet('User', 'Machine', 'Process')]
        [string]$Scope = 'User'
    )
    
    [Environment]::SetEnvironmentVariable($Name, $Value, $Scope)
    Set-Item -Path "env:$Name" -Value $Value
    Write-Host "[SUCCESS] $Name set to: $Value" -ForegroundColor Green
}

# Check and set JAVA_HOME
Write-Host "[INFO] Checking Java installation..." -ForegroundColor Cyan

$javaPath = $null
$javaPaths = @(
    'C:\Program Files\Java\jdk-21',
    'C:\Program Files\Java\jdk-20',
    'C:\Program Files\Java\jdk-19',
    'C:\Program Files\Java\jdk-18',
    'C:\Program Files\Java\jdk-17',
    'C:\Program Files (x86)\Java\jdk-21'
)

foreach ($path in $javaPaths) {
    if (Test-Path $path) {
        $javaPath = $path
        break
    }
}

if ($null -eq $javaPath) {
    Write-Host "[ERROR] Java not found in default locations" -ForegroundColor Red
    Write-Host "[ERROR] Please install Java JDK 17 or higher from https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-EnvironmentVariable -Name "JAVA_HOME" -Value $javaPath -Scope User

# Add Java to PATH if not already there
Write-Host "[INFO] Adding Java to system PATH..." -ForegroundColor Cyan

$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*jdk*") {
    $newPath = "$currentPath;$javaPath\bin"
    Set-EnvironmentVariable -Name "PATH" -Value $newPath -Scope User
} else {
    Write-Host "[SUCCESS] Java already in PATH" -ForegroundColor Green
}

# Verify Java installation
Write-Host ""
Write-Host "[INFO] Verifying Java installation..." -ForegroundColor Cyan
java -version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java verification failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check for Node.js
Write-Host ""
Write-Host "[INFO] Checking Node.js installation..." -ForegroundColor Cyan
node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check for npm
Write-Host "[INFO] Checking npm installation..." -ForegroundColor Cyan
npm --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check for Docker
Write-Host ""
Write-Host "[INFO] Checking Docker installation..." -ForegroundColor Cyan
$dockerCheck = docker --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARNING] Docker not found. Some services may not start." -ForegroundColor Yellow
    Write-Host "[INFO] Install Docker from https://www.docker.com/" -ForegroundColor Cyan
} else {
    Write-Host "[SUCCESS] Docker found" -ForegroundColor Green
}

# Install dependencies
Write-Host ""
Write-Host "[INFO] Installing project dependencies..." -ForegroundColor Cyan

if (Test-Path "Frontend\package.json") {
    Write-Host "[INFO] Installing Frontend dependencies..." -ForegroundColor Cyan
    Push-Location Frontend
    npm install
    Pop-Location
}

if (Test-Path "Backend\services\auth-service\package.json") {
    Write-Host "[INFO] Installing Auth Service dependencies..." -ForegroundColor Cyan
    Push-Location Backend\services\auth-service
    npm install
    Pop-Location
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "           Setup Complete!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Environment variables have been set. Please restart"
Write-Host "your terminal or VS Code for changes to take effect."
Write-Host ""
Write-Host "To start all services, run:"
Write-Host "  npm start" -ForegroundColor Yellow
Write-Host "or"
Write-Host "  node all-services.js" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"
