import { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// 🚑 Ambulance Icon
const ambulanceIcon = new L.Icon({
  iconUrl: "/icons/ambulance.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// 👮 Police Icon
const policeIcon = new L.Icon({
  iconUrl: "/icons/police-car.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// 🚒 Fire Truck Icon
const fireIcon = new L.Icon({
  iconUrl: "/icons/fire-truck.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function VehicleTracker({
  start,
  destination,
  icon = "🚑",
  title = "Emergency Vehicle",
}) {
  const [position, setPosition] = useState(start);

  useEffect(() => {
    if (!start || !destination) return;

    setPosition(start);

    const interval = setInterval(() => {
      setPosition((prev) => {
        const lat = prev[0] + (destination[0] - prev[0]) * 0.08;
        const lng = prev[1] + (destination[1] - prev[1]) * 0.08;

        if (
          Math.abs(destination[0] - lat) < 0.0002 &&
          Math.abs(destination[1] - lng) < 0.0002
        ) {
          clearInterval(interval);
          return destination;
        }

        return [lat, lng];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [start, destination]);

  let selectedIcon = ambulanceIcon;

  if (title === "Police Vehicle") {
    selectedIcon = policeIcon;
  } else if (title === "Fire Truck") {
    selectedIcon = fireIcon;
  }

  return (
    <Marker
      position={position}
      icon={selectedIcon}
    >
      <Popup>
        <strong>{icon} {title}</strong>
        <br />
        Moving to Incident...
      </Popup>
    </Marker>
  );
}

export default VehicleTracker;