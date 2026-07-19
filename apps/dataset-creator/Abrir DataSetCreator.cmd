@echo off
cd /d "%~dp0"
title VoynichLab - DataSetCreator
echo Iniciando DataSetCreator...
echo.
npm.cmd run tauri -- dev
echo.
echo DataSetCreator se cerro o hubo un error.
pause
