@echo off
:: Navigate to your project folder
cd /d "D:\dev\vite-project"

:: Open your default browser to the local server
start "" "http://localhost:5173"

:: Start the development server
npm run dev

:: Keep the window open just in case
pause