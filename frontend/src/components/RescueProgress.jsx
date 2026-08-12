import { useEffect, useState } from "react";

function RescueProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);
    let status = "🚑 Ambulance Dispatched";

  if (progress >= 25)
    status = "👮 Police Arrived";

  if (progress >= 50)
    status = "🚒 Fire Team En Route";

  if (progress >= 75)
    status = "🩺 Victims Being Evacuated";

  if (progress >= 100)
    status = "✅ Rescue Completed";

  return (
    <div
      className="dashboard-card"
      style={{
        marginBottom: "20px",
      }}
    >
      <h2>📈 Live Rescue Progress</h2>

      <div
        style={{
          width: "100%",
          background: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "15px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "18px",
            background:
              "linear-gradient(90deg,#4CAF50,#00E676)",
            transition: "0.5s",
          }}
        ></div>
      </div>

      <h3 style={{ marginTop: "15px" }}>
        {progress}%
      </h3>

      <p>{status}</p>
    </div>
  );
}

export default RescueProgress;