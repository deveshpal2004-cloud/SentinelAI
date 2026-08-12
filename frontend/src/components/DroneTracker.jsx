import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const droneIcon = new L.Icon({
  iconUrl: "/icons/drone.png",

  iconSize: [42, 42],
  iconAnchor: [21, 21],
});
function DroneTracker({ center }) {
  const [position, setPosition] = useState(center);

  useEffect(() => {
    if (!center) return;

    let angle = 0;

    const radius = 0.0012;

    const interval = setInterval(() => {
      angle += 0.08;

      const lat =
        center[0] + radius * Math.cos(angle);

      const lng =
        center[1] + radius * Math.sin(angle);

      setPosition([lat, lng]);

    }, 100);

    return () => clearInterval(interval);

  }, [center]);
    return (
    <Marker
      position={position}
      icon={droneIcon}
    >
      <Popup>
        🚁 AI Surveillance Drone
        <br />
        Live Monitoring Active
      </Popup>
    </Marker>
  );
}

export default DroneTracker;
