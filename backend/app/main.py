from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agents.coordinator import coordinator
from app.services.groq_service import ask_groq


app = FastAPI(title="SentinelAI")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmergencyRequest(BaseModel):
    incident: str


@app.get("/")
def home():
    return {
        "message": "Welcome to SentinelAI"
    }


@app.post("/analyze")
def analyze(data: EmergencyRequest):

    result = coordinator(data.incident)

    return result


@app.post("/chat")
def chat(data: EmergencyRequest):

    prompt = f"""
You are SentinelAI Emergency Assistant.

Answer the user's emergency question.

Question:
{data.incident}

Rules:

1. Answer in simple English.
2. Maximum 5 lines.
3. Give emergency guidance only.
4. Never use markdown.
5. This system is for India.
6. Use Indian emergency number 112, not 911.
7. Mention emergency number 112 when emergency services are required.
"""

    reply = ask_groq(prompt)

    return {
        "reply": reply
    }