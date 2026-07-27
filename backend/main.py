from fastapi import FastAPI, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
from agent import agent_app

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pypdf import PdfReader
import io

@app.post("/api/ai/process")
async def process_text(
    text: str = Form(""), 
    file: UploadFile = File(None), 
    current_state: str = Form("{}")
):
    import json
    state_dict = json.loads(current_state)
    
    # Extract text if a PDF file is uploaded
    extracted_text = ""
    if file:
        if file.filename.endswith('.pdf'):
            file_bytes = await file.read()
            pdf_reader = PdfReader(io.BytesIO(file_bytes))
            for page in pdf_reader.pages:
                extracted_text += page.extract_text() + "\n"
        else:
            # Fallback for plain text files
            extracted_text = (await file.read()).decode("utf-8")
            
    # Combine user chat text and document content
    final_input = f"{text}\n\nDocument Content:\n{extracted_text}".strip()
    
    inputs = {
        "input_text": final_input,
        "extracted_data": state_dict
    }
    
    result = agent_app.invoke(inputs)
    return {"data": result["extracted_data"]}

@app.post("/api/complaints")
async def commit_complaint(complaint_data: dict, db: Session = Depends(get_db)):
    db_complaint = models.Complaint(**complaint_data)
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return {"status": "success", "id": db_complaint.id}