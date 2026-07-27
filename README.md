AIVOA - AI-Powered Customer Complaint Management System
An end-to-end AI-agentic application built for pharmaceutical manufacturing (API & FDF) Quality Management Systems (QMS). This project automates the ingestion, extraction, and triage of customer complaints using an AI Copilot, eliminating manual data entry and accelerating critical quality assurance workflows.

🚀 Features
Automated Data Extraction: Leverages LangGraph and the Groq LLM API to instantly parse unstructured complaint text, emails, and PDFs into structured QMS fields.

AI Risk Assessment: Automatically evaluates complaint severity (Minor/Major/Critical) and suggests the next QA actions based on pharmaceutical manufacturing context.

Conversational UI (AIVOA Copilot): A chat interface that allows users to seamlessly upload documents or input natural language corrections to patch specific form fields without losing existing data.

Zero Human Entry: The QMS ledger form is entirely read-only and driven exclusively by the AI state manager, ensuring data integrity.

PDF Parsing: Built-in backend document processing to handle official customer complaint PDFs.

🛠️ Technology Stack
Frontend: React, Redux Toolkit, Tailwind CSS (v3), Google Inter Font.

Backend: Python, FastAPI, SQLAlchemy, PyPDF.

AI & Agent Framework: LangGraph, LangChain, Groq API (llama-3.3-70b-versatile).

Database: PostgreSQL.

🏗️ Architecture & Data Flow (How It Works)
The system is designed as a seamless loop between the user interface, the AI processing engine, and the secure database ledger. Here is exactly how the components connect and operate:

1. Data Ingestion (Frontend -> Backend)

When a user pastes text or uploads a PDF in the React CopilotChat component, the frontend bundles this input along with the current state of the QMS form.

This payload is sent via Axios to the FastAPI backend route (/api/ai/process).

If a PDF is detected, the backend uses PyPDF to extract all raw text from the document before passing it to the AI.

2. AI Extraction & Triage (Backend -> LangGraph -> Groq LLM)

The FastAPI backend passes the combined text and current form state to the LangGraph Agent.

LangGraph acts as the state manager, passing the data to LangChain, which constructs a strict prompt with instructions specific to pharmaceutical QA.

The Groq LLM (llama-3.3-70b-versatile) processes the prompt. It performs two main tasks:

Extraction: Plucks factual data (Batch numbers, Dates, Product names) from the text.

Generation: Analyzes the defect narrative to generate a missing Severity rating, Suggested Next Action, and an Initial Risk Assessment.

The LLM returns a strictly formatted JSON object.

3. State Update & UI Rendering (Backend -> Frontend)

FastAPI sends the structured JSON back to the React frontend.

Redux Toolkit intercepts this payload and updates the global complaintSlice state.

The ComplaintForm (Left Panel) is directly bound to this Redux state. Because the form fields are set to readOnly, they instantly populate with the AI's data without allowing manual human tampering, preserving data integrity.

4. Conversational Patching (The AI Loop)

If the AI misses a field or makes an error, the user types a correction in the chat (e.g., "Change the batch number to 123").

The frontend sends this new message alongside the current filled form state back to the backend. The AI understands the context, updates only the specific field, and returns the patched JSON, which updates the UI again.

5. Committing to the Ledger (Frontend -> Database)

Once the form is complete and the status reads "Ready to Commit", the user clicks the "Commit to QMS Ledger" button.

React sends a final POST request to the /api/complaints backend endpoint.

SQLAlchemy (the ORM) validates the data and executes an INSERT command to securely save the record into the PostgreSQL aivoa_qms database, acting as the final, immutable QMS ledger.

⚙️ Local Setup & Installation
1. Database Configuration
Ensure PostgreSQL is installed and running locally.

Open pgAdmin or your PostgreSQL terminal.

Create a new database for the project:
CREATE DATABASE aivoa_qms;
(Note: Ensure your PostgreSQL user has privileges to create tables in the public schema).

2. Backend Setup
Navigate to the backend directory:
cd backend

Create and activate a Python virtual environment:
python -m venv venv

On Windows:
.\venv\Scripts\activate

On Mac/Linux:
source venv/bin/activate

Install the dependencies:
pip install -r requirements.txt

Create a .env file in the backend folder and add your credentials:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/aivoa_qms
GROQ_API_KEY=your_groq_api_key_here
(If your password contains special characters like @, replace them with URL-encoded values like %40).

Start the FastAPI server:
uvicorn main:app --reload --port 8000

3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
cd frontend

Install the necessary Node packages (configured for Tailwind v3 compatibility):
npm install
npm install tailwindcss@3 postcss autoprefixer

Start the React development server:
npm start

The application will be accessible at http://localhost:3000.

🧪 Usage & Testing
Initial Triage: Paste a raw complaint (e.g., "Apollo Pharmacy reported 12 discolored capsules in Amoxicillin 500mg, batch BMX240602") into the AIVOA Copilot chat.

Review Form: Watch the LangGraph agent populate the left panel and generate a Severity and Risk Assessment.

Conversational Edits: Type a correction like "Update the affected quantity to 48" and see the specific field update seamlessly.

PDF Upload: Click the attachment icon in the chat bar to upload a sample pharmaceutical complaint PDF.

Commit: Once the status badge reads "Ready to Commit", click "Commit to QMS Ledger" to save the verified payload to the PostgreSQL database.