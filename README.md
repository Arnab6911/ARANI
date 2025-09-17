# Project ARAÑI - AI-Powered Grievance Redressal System

**ARAÑI** is a smart, AI-powered central nervous system for citizen grievance redressal. It uses Google's Gemini API to intelligently understand, categorize, and route complaints to multiple relevant government departments, ensuring faster and more efficient resolution.

---

## Key Features

-   **Multi-Department Routing:** A single complex complaint (e.g., water leak causing a power short circuit and a traffic jam) is intelligently assigned to all relevant departments (Water, Electricity, Traffic).
-   **AI-Powered Analysis:** Leverages the **Google Gemini API** to analyze each complaint for urgency, a concise summary, and department classification.
-   **Real-time Tracking:** Citizens can track the live status of their submitted grievances.
-   **Live Analytics Dashboard:** A high-level view for administrators with KPIs, charts, and systemic issue alerts to enable data-driven governance.

## Tech Stack

-   **Backend:** Python, FastAPI
-   **Database:** Google Firestore (NoSQL)
-   **AI Engine:** Google Gemini API (`gemini-1.5-flash`)
-   **Frontend:** HTML, CSS, Vanilla JavaScript

## How to Run Locally

1.  **Clone the repository.**

2.  **Setup Backend:**
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    # Create a .env file and add your Firebase and Google API keys
    uvicorn app.main:app --reload
    ```
3.  **Run Frontend:**
    -   Requires the **Live Server** extension in VS Code.
    -   Right-click on `frontend/public.html` and select "Open with Live Server".