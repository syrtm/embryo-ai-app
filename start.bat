@echo off
echo Starting Embryo AI Application...

:: Backend'i başlat
start cmd /k "cd backend && python app.py"

:: Frontend'i başlat
start cmd /k "cd frontend && npm start"

echo Application started!
echo Backend running at: http://localhost:5000
echo Frontend running at: http://localhost:3000