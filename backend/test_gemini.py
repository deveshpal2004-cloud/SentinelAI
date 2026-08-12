from app.services.gemini_service import analyze_emergency

print("Testing Gemini...")

result = analyze_emergency(
    "Fire at ABES Engineering College. 20 students trapped."
)

print(result)

print("Done")