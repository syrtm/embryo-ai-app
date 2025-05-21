@echo off
echo Starting Embryo AI Application...

:: Install backend requirements
echo Installing backend requirements...
pip install -r backend\requirements.txt

:: Backend'i başlat
start cmd /k "cd backend && python app.py"

:: Frontend'i başlat
start cmd /k "cd frontend && npm start"

echo Application started!
echo Backend running at: http://localhost:5000
echo Frontend running at: http://localhost:3000