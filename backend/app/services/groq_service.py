import os
import json
import re
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def ask_groq(prompt: str):
    try:

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3
        )

        text = response.choices[0].message.content.strip()

        text = text.replace("```json", "")
        text = text.replace("```", "").strip()

        try:
            return json.loads(text)
        except:
            pass

        match = re.search(r"\{.*\}", text, re.DOTALL)

        if match:
            return json.loads(match.group())

        return {"response": text}

    except Exception as e:
        print("Groq Error:", e)

        return {
            "situation": {
                "incident_type": "Unavailable",
                "severity": "Unknown",
                "location": "-",
                "summary": "Groq service unavailable."
            },
            "rescue": {
                "resources": [],
                "rescue_plan": []
            },
            "hospital": {
                "hospital_type": "-",
                "ambulances": "-",
                "icu_required": "-",
                "medical_team": "-"
            },
            "traffic": {
                "road_closure": "-",
                "green_corridor": "-",
                "traffic_units": "-"
            },
            "alert": {
                "response": "Groq unavailable."
            }
        }