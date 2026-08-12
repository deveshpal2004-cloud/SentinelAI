import WeatherCard from "./WeatherCard";
import NotificationPanel from "./NotificationPanel";
import RescueProgress from "./RescueProgress";
import { useState } from "react";
import ETAPanel from "./ETAPanel";
import api from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ResultCard from "./ResultCard";
import EmergencyMap from "./EmergencyMap";
import { downloadReport } from "../utils/pdfGenerator";
import IncidentHistory from "./IncidentHistory";
import EmergencyDashboard from "./EmergencyDashboard";
function speakResponse(text) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}
function EmergencyForm() {
  const [incident, setIncident] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🎤 Voice Input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIncident(transcript);
    };

    recognition.onerror = () => {
      alert("Voice recognition failed.");
    };

    recognition.start();
  };

  // 🤖 Analyze
  const analyzeIncident = async () => {
    if (!incident.trim()) {
      alert("Please describe the emergency.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/analyze", {
        incident,
      });

      setResult(response.data);
      const history =
  JSON.parse(localStorage.getItem("history")) || [];

history.unshift({
  incident: response.data.situation?.incident_type,
  location: response.data.situation?.location,
  severity: response.data.situation?.severity,
  time: new Date().toLocaleString(),
});

localStorage.setItem(
  "history",
  JSON.stringify(history)
);
      const data = response.data;

const message = `
${data.situation?.severity} emergency detected.
${data.situation?.incident_type} at
${data.situation?.location}.
Ambulance,
Police and
Fire team have been dispatched.
`;

speakResponse(message);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze incident.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <textarea
        className="textbox"
        rows={6}
        placeholder="Describe Emergency..."
        value={incident}
        onChange={(e) => setIncident(e.target.value)}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        <button className="btn" onClick={startListening}>
          🎤 Speak Emergency
        </button>

        <button className="btn" onClick={analyzeIncident}>
          Analyze Emergency
        </button>
      </div>

      {loading && <LoadingSpinner />}

      {result && (
        <>
        <EmergencyDashboard result={result} />
        <RescueProgress />
        <NotificationPanel />
        <ETAPanel />
        <IncidentHistory />
          <EmergencyMap
            location={result.situation?.location}
          />

          <WeatherCard
            location={result.situation?.location}
          />
        </>
      )}

      {result && (
        <div className="results">

          <button
            className="btn"
            onClick={() => downloadReport(result)}
            style={{ marginBottom: "20px" }}
          >
            📄 Download Report
          </button>

          <ResultCard title="🔥 Situation">

            <p>
              <b>Incident:</b> {result.situation?.incident_type}
            </p>

            <p>
              <b>Severity:</b>

              <span
                style={{
                  marginLeft: "10px",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  color: "white",
                  fontWeight: "bold",
                  background:
                    result.situation?.severity === "Critical"
                      ? "#d32f2f"
                      : result.situation?.severity === "High"
                      ? "#ff9800"
                      : result.situation?.severity === "Medium"
                      ? "#fbc02d"
                      : "#43a047",
                }}
              >
                {result.situation?.severity}
              </span>
            </p>

            <br />

            <p>
              <b>Location:</b> {result.situation?.location}
            </p>

            <br />

            <p>{result.situation?.summary}</p>

          </ResultCard>
                    {/* 🚒 Rescue */}

          <ResultCard title="🚒 Rescue">

            <ul>
              {result.rescue?.resources?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <h4>Rescue Plan</h4>

            <ol>
              {result.rescue?.rescue_plan?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ol>

          </ResultCard>

          {/* 🏥 Hospital */}

          <ResultCard title="🏥 Hospital">

            <p>
              <b>Hospital Type:</b>
              <br />
              {result.hospital?.hospital_type}
            </p>

            <br />

            <p>
              <b>⭐ Recommended Hospital:</b>
              <br />
              {result.hospital?.recommended_hospital || "Not Available"}
            </p>

            <br />

            <p>
              <b>🚑 Ambulances:</b>
              <br />
              {result.hospital?.ambulances}
            </p>

            <br />

            <p>
              <b>🛏 ICU Required:</b>
              <br />
              {result.hospital?.icu_required}
            </p>

            <br />

            <p>
              <b>👨‍⚕ Medical Team:</b>
              <br />
              {result.hospital?.medical_team}
            </p>

            <br />

            <p>
              <b>⏱ Estimated Arrival:</b>
              <br />
              {result.hospital?.estimated_arrival || "Not Available"}
            </p>

            <br />

            <p>
              <b>☎ Emergency Contact:</b>
              <br />
              {result.hospital?.emergency_contact || "112"}
            </p>

          </ResultCard>

          {/* 🚦 Traffic */}

          <ResultCard title="🚦 Traffic">

            <p>
              <b>Road Closure:</b>
            </p>

            <p>{result.traffic?.road_closure}</p>

            <br />

            <p>
              <b>Green Corridor:</b>
            </p>

            <p>{result.traffic?.green_corridor}</p>

            <br />

            <p>
              <b>Traffic Units:</b>
            </p>

            <p>{result.traffic?.traffic_units}</p>

          </ResultCard>

          {/* 👮 Police */}

          <ResultCard title="👮 Police">

            <p>
              <b>Nearest Station:</b>
              <br />
              {result.police?.nearest_station || "Not Available"}
            </p>

            <br />

            <p>
              <b>☎ Contact:</b>
              <br />
              {result.police?.contact || "112"}
            </p>

            <br />

            <p>
              <b>⏱ ETA:</b>
              <br />
              {result.police?.eta || "Not Available"}
            </p>

          </ResultCard>
                    {/* 🚒 Fire Station */}

          <ResultCard title="🚒 Fire Station">

            <p>
              <b>Nearest Station:</b>
              <br />
              {result.fire?.nearest_station || "Not Available"}
            </p>

            <br />

            <p>
              <b>🚒 Fire Engines:</b>
              <br />
              {result.fire?.fire_engines || "Not Available"}
            </p>

            <br />

            <p>
              <b>⏱ ETA:</b>
              <br />
              {result.fire?.eta || "Not Available"}
            </p>

          </ResultCard>

          {/* 📢 Public Alert */}

          <ResultCard title="📢 Public Alert">

            <p>
              {result.alert?.response ||
                result.alert?.alert ||
                "No alert generated."}
            </p>

          </ResultCard>

        </div>
      )}

    </div>
  );
}

export default EmergencyForm;