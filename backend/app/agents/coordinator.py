from app.services.groq_service import ask_groq


def coordinator(incident: str):

    prompt = f"""
You are SentinelAI, an AI Emergency Response System.

Analyze the emergency below and generate a complete emergency response.

Emergency:
{incident}

Return ONLY valid JSON in the exact format below.

{{
  "situation": {{
    "incident_type": "",
    "severity": "",
    "location": "",
    "summary": ""
  }},

  "rescue": {{
    "resources": [],
    "rescue_plan": []
  }},

  "hospital": {{
    "hospital_type": "",
    "recommended_hospital": "",
    "estimated_arrival": "",
    "ambulances": "",
    "icu_required": "",
    "medical_team": "",
    "emergency_contact": ""
  }},

  "police": {{
    "nearest_station": "",
    "contact": "",
    "eta": ""
  }},

  "fire": {{
    "nearest_station": "",
    "fire_engines": "",
    "eta": ""
  }},

  "traffic": {{
    "road_closure": "",
    "green_corridor": "",
    "traffic_units": ""
  }},

  "alert": {{
    "response": ""
  }}
}}

Rules:

1. Never leave any field empty.
2. If exact information is unavailable, generate realistic recommendations.
3. resources must contain at least 3 items.
4. rescue_plan must contain at least 3 steps.
5. severity must be one of:
   Low
   Medium
   High
   Critical
6. Return ONLY JSON.
7. Do NOT return Markdown.
8. Do NOT return explanation.
9. Do NOT wrap the JSON inside ```.
10. recommended_hospital should be a realistic nearby hospital.
11. estimated_arrival should be in minutes.
12. emergency_contact should be a realistic emergency number.
13. nearest_station should be a realistic nearby police/fire station.
14. eta should be in minutes.
15. fire_engines should mention the number of fire engines to dispatch.

"""

    return ask_groq(prompt)