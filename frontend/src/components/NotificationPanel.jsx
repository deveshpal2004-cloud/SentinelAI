import { useEffect, useState } from "react";

function NotificationPanel() {
  const messages = [
    "🚁 Drone Activated",
    "🚑 Ambulance Dispatched",
    "👮 Police Vehicle Moving",
    "🚒 Fire Truck Dispatched",
    "🏥 Hospital Alert Sent",
    "🩺 Victims Being Evacuated",
    "✅ Rescue Completed",
  ];

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (index >= messages.length) {
        clearInterval(interval);
        return;
      }

      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setNotifications((prev) => [
        ...prev,
        {
          time,
          text: messages[index],
        },
      ]);

      index++;
    }, 3000);

    return () => clearInterval(interval);
  }, []);
    return (
    <div
      className="dashboard-card"
      style={{
        marginBottom: "20px",
        maxHeight: "280px",
        overflowY: "auto",
      }}
    >
      <h2>🟢 Live Emergency Updates</h2>

      {notifications.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid #ddd",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            {item.time}
          </span>

          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

export default NotificationPanel;