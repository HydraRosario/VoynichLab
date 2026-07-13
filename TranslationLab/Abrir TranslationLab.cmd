@echo off
cd /d "%~dp0"
title VoynichLab - TranslationLab
echo Iniciando TranslationLab...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174" ^| findstr "LISTENING"') do (
  echo Cerrando servidor viejo en puerto 5174 ^(PID %%a^)...
  taskkill /PID %%a /F >nul 2>nul
)

start "" "http://localhost:5174"
node scripts\server.js

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174" ^| findstr "LISTENING"') do (
  taskkill /PID %%a /F >nul 2>nul
)

echo.
echo TranslationLab se cerro o hubo un error.
pause
