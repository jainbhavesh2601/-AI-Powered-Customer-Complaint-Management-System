import os
import json
from typing import TypedDict
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph import StateGraph, START, END

load_dotenv()

class ComplaintState(TypedDict):
    input_text: str
    extracted_data: dict

llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0)

def extract_complaint_data(state: ComplaintState):
    parser = JsonOutputParser()
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert QMS extraction AI assistant for pharmaceutical manufacturing. 
        Extract pharmaceutical complaint details into JSON format based on the user's input.
        
        CRITICAL INSTRUCTIONS:
        1. Extract these factual fields if present: complaint_source, customer_name, product_name, product_strength, batch_number, affected_quantity, manufacturing_date, expiry_date, originating_block, npm, complaint_category, complaint_description.
        2. YOU MUST GENERATE RISK ASSESSMENT DATA. The user will not provide this. Based on the defect described, you must evaluate and populate:
           - "severity": Must be "Minor", "Major", or "Critical".
           - "suggested_next_action": e.g., "Route to QA Investigation & Issue Replacement".
           - "initial_risk_assessment": Write 1-2 sentences explaining the potential patient/safety impact.
        3. If the user is providing a correction (e.g., "update the batch number to 123"), ONLY output the fields they are correcting. Do not output empty strings for the rest.
        
        Output ONLY valid JSON."""),
        ("user", "{input}")
    ])
    
    chain = prompt | llm | parser
    result = chain.invoke({"input": state["input_text"]})
    
    # Merge existing data with new extracted data (handles corrections)
    current_data = state.get("extracted_data", {})
    updated_data = {**current_data, **result}
    
    return {"extracted_data": updated_data}

# Build LangGraph
workflow = StateGraph(ComplaintState)
workflow.add_node("extract", extract_complaint_data)
workflow.add_edge(START, "extract")
workflow.add_edge("extract", END)
agent_app = workflow.compile()