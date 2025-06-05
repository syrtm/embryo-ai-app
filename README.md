# Embryo AI Analysis Platform

## Overview

The Embryo AI Analysis Platform is a sophisticated web application designed to support embryologists, doctors, and patients throughout the IVF process. It leverages AI-driven insights to provide detailed embryo assessments, facilitates efficient patient and appointment management, and enhances communication between healthcare providers and patients. The platform aims to bring clarity, accuracy, and a better user experience to the complex field of assisted reproductive technology.

## Key Features

*   **Advanced Embryo Analysis:**
    *   AI-powered grading of embryos (e.g., Class A, B, C, D, Morula, Early Blastocyst, Arrested).
    *   Detailed star ratings for crucial morphological parameters: fragmentation, symmetry, and overall quality. These ratings are dynamically sourced from backend logic (`embryo_classes.py`) or intelligently defaulted based on embryo class.
    *   Confidence scores for AI predictions.
    *   Visual display of embryo images (intended feature).
    *   Comprehensive display of past analysis results with clear visual cues and detailed information cards.

*   **Doctor Portal:**
    *   Secure login and role-based access.
    *   Patient list management with search and filtering capabilities.
    *   In-depth view of individual patient profiles and their complete embryo analysis history.
    *   Color-coded analysis results for rapid visual assessment.
    *   Ability to record and review analyses, including the performing doctor's details.

*   **Patient Portal:**
    *   Secure login for patients to access their personal data.
    *   Clear and understandable presentation of their embryo analysis results, including quality scores and star ratings.
    *   Dashboard for viewing upcoming and past appointments.

*   **Appointment Management:**
    *   Functionality for scheduling, viewing, and managing appointments.
    *   Details include doctor name, date, time, and appointment type.

*   **Intelligent Notification System:**
    *   Real-time notifications for new embryo analyses and upcoming appointments.
    *   Role-specific notifications: doctors receive updates for their assigned patients, while patients receive their personal notifications.
    *   Optimized notification delivery to prevent alert fatigue, with checks on app launch, periodically, and on page focus.

*   **User Authentication and Profile Management:**
    *   Robust login system.
    *   Dynamic display of user's full name and role-specific information within the dashboard.

*   **Enhanced User Interface (UI) and User Experience (UX):**
    *   Modern, intuitive, and visually rich interface.
    *   Detailed information cards for analyses, providing a comprehensive view at a glance.
    *   Improved data handling for robust performance, including graceful management of mock data and API responses.

## Technology Stack (Inferred)

*   **Frontend:** React.js (JavaScript)
    *   Components: `DoctorAnalysis.js`, `PatientDashboard.js`, `Login.js`, `App.js`, etc.
    *   State Management (e.g., Context API, Redux - specific not mentioned but typical)
    *   Routing (e.g., React Router)
*   **Backend:** Python
    *   API Framework (e.g., Flask, Django - specific not mentioned)
    *   Business Logic: `embryo_classes.py` for embryo grading rules.
*   **API:** RESTful API for communication between frontend and backend.
*   **Database:** (Specific type not mentioned, but a relational or NoSQL database is expected for storing user, patient, analysis, and appointment data).

## Setup and Installation

### Quick Start

For a quick start, simply run the `start.bat` file in the project root. This will automatically start both the backend and frontend servers.

```bash
start.bat
```

### Prerequisites
*   Node.js and npm (or yarn) for the frontend.
*   Python and pip for the backend.
*   Git for version control.

### Backend Setup
1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd embryo-ai-app/backend # Or your backend directory
    ```
2.  Create and activate a Python virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure environment variables (e.g., database connection strings, API keys). You may need to create a `.env` file based on an example like `.env.example`.
5.  Run database migrations (if applicable for your backend framework).
6.  Start the backend server:
    ```bash
    python app.py # Or the command specific to your backend framework
    ```

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd embryo-ai-app/frontend # Or your frontend directory
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  Configure environment variables, especially the backend API endpoint. You may need to create a `.env` file.
4.  Start the frontend development server:
    ```bash
    npm start
    # or
    # yarn start
    ```
    The application should typically be accessible at `http://localhost:3000`.

## Usage

1.  **Login:** Users can log in with their credentials. The system differentiates between doctor and patient roles.
2.  **Doctors:** Can access their dashboard to view patient lists, select a patient to review their history, view detailed past embryo analyses, and manage appointments.
3.  **Patients:** Can access their dashboard to view their personal embryo analysis results and track their appointments.

## Screenshots

### Login Page
![Login Page](/screenshots/login.png)
*Secure login interface for doctors and patients*

### Doctor Dashboard
![Doctor Dashboard](/screenshots/doctor-dashboard.png)
*Overview of patient list and analysis history for doctors*

### Patient Analysis View
![Patient Analysis](/screenshots/patient-analysis.png)
*Detailed embryo analysis with star ratings and quality metrics*

### Appointment Management
![Appointments](/screenshots/appointments.png)
*Schedule and manage patient appointments*

### Analysis Results
![Analysis Results](/screenshots/analysis-results.png)
*Comprehensive view of embryo analysis results*

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where appropriate.

---

This README provides a general overview. Specific details about API endpoints, data models, and advanced configuration should be documented further as the project evolves.
