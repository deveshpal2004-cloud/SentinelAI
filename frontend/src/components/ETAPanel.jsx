import { useEffect, useState } from "react";

function ETAPanel() {
  const [ambulance, setAmbulance] = useState(10);
  const [police, setPolice] = useState(6);
  const [fire, setFire] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulance((prev) => (prev > 1 ? prev - 1 : 1));
      setPolice((prev) => (prev > 1 ? prev - 1 : 1));
      setFire((prev) => (prev > 1 ? prev - 1 : 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
    return (
    <div
      className="dashboard-card"
      style={{
        marginBottom: "20px",
      }}
    >
      <h2>⏱ Live ETA</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <div>
          <h3>🚑 Ambulance</h3>
          <h2>{ambulance} min</h2>
        </div>

        <div>
          <h3>👮 Police</h3>
          <h2>{police} min</h2>
        </div>

        <div>
          <h3>🚒 Fire Truck</h3>
          <h2>{fire} min</h2>
        </div>
      </div>
    </div>
  );
}

export default ETAPanel;