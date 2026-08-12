import { useEffect, useState } from "react";

function IncidentHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("history")) || [];

    setHistory(data);
  }, []);
    return (
    <div
      className="dashboard-card"
      style={{ marginBottom: "20px" }}
    >
      <h2>📜 Incident History</h2>

      {history.length === 0 && (
        <p>No incidents yet.</p>
      )}

      {history.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "10px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <b>{item.incident}</b>

          <br />

          📍 {item.location}

          <br />

          🔥 {item.severity}

          <br />

          🕒 {item.time}
        </div>
      ))}
    </div>
  );
}

export default IncidentHistory;
