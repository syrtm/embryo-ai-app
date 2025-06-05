# Embryo AI Analysis Platform

## Overview

The Embryo AI Analysis Platform is a sophisticated web application designed to support embryologists, doctors, and patients throughout the IVF process. It leverages AI-driven insights to provide detailed embryo assessments, facilitates efficient patient and appointment management, and enhances communication between healthcare providers and patients.

## Quick Start

1. Clone the repository
2. Run `start.bat` in the project root
3. The application will be available at `http://localhost:3000`

## Key Features

- **Advanced Embryo Analysis** with AI-powered grading
- **Doctor Portal** for managing patients and analyses
- **Patient Portal** for viewing personal analysis results
- **Appointment Management** system
- **Intelligent Notifications**

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Screenshots

### Login Page
![Login Page](/screenshots/login.png)

### Doctor Dashboard
![Doctor Dashboard](/screenshots/doctor-dashboard.png)

### Patient Analysis
![Patient Analysis](/screenshots/patient-analysis.png)

## Notes

- Place `best_resnet50_clean.pth` in the `backend/` directory
- Frontend runs on port 3000
- Backend API runs on port 8000
- Update `class_names` in the configuration if needed

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request
