function EmergencyDashboard({ result }) {
  if (!result) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "15px",
        marginBottom: "20px",
      }}
    >
      <div className="dashboard-card">
        <h3>🚨 Severity</h3>
        <h2>{result.situation?.severity}</h2>
      </div>

      <div className="dashboard-card">
        <h3>👥 Victims</h3>
        <h2>15</h2>
      </div>

      <div className="dashboard-card">
        <h3>🚑 Responders</h3>
        <h2>3</h2>
      </div>

      <div className="dashboard-card">
        <h3>🤖 AI Confidence</h3>
        <h2>98%</h2>
      </div>
    </div>
  );
}

export default EmergencyDashboard;
