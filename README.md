# Embryo AI Analysis Platform

## Overview

The Embryo AI Analysis Platform is a sophisticated web application designed to support embryologists, doctors, and patients throughout the IVF process. It leverages AI-driven insights to provide detailed embryo assessments, facilitates efficient patient and appointment management, and enhances communication between healthcare providers and patients.

## Quick Start

1. Clone the repository
2. Run `start.bat` in the project root
3. The application will be available at `http://localhost:3000`

## Key Features

### Advanced Embryo Analysis
- AI-powered grading of embryos
- Detailed star ratings for fragmentation, symmetry, and overall quality
- Confidence scores for AI predictions
- Visual display of embryo images
- Comprehensive analysis results with visual cues

### Doctor Portal
- Secure login and role-based access
- Patient list management with search and filtering
- In-depth patient profiles and analysis history
- Color-coded analysis results
- Analysis recording and review

### Patient Portal
- Secure access to personal data
- Clear presentation of embryo analysis results
- Appointment tracking

### Appointment Management
- Schedule, view, and manage appointments
- Track doctor availability
- Appointment notifications

### Intelligent Notifications

## Screenshots

### Login Page
![Login Page](/screenshots/login.png)
*Secure login interface for doctors and patients*

### Doctor Dashboard
![Doctor Dashboard](/screenshots/doctor-dashboard.png)
*Overview of patient list and analysis history*

### Patient Analysis View
![Patient Analysis](/screenshots/patient-analysis.png)
*Detailed embryo analysis with star ratings and quality metrics*

### Appointment Management
![Appointments](/screenshots/appointments.png)
*Schedule and manage patient appointments*

### Analysis Results
![Analysis Results](/screenshots/analysis-results.png)
*Comprehensive view of embryo analysis results*

## Setup and Installation

### Prerequisites
- Node.js and npm (or yarn) for the frontend
- Python and pip for the backend
- Git for version control

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Notes

- Place `best_resnet50_clean.pth` in the `backend/` directory
- Frontend runs on port 3000
- Backend API runs on port 8000
- Update `class_names` in the configuration if needed

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

