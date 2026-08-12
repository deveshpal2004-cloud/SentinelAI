import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import VehicleTracker from "./VehicleTracker";
import DroneTracker from "./DroneTracker";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.setView(position, 15, {
      animate: true,
    });
  }, [position, map]);

  return null;
}

function EmergencyMap({ location }) {
  const [incidentPos, setIncidentPos] = useState([
    28.6139,
    77.2090,
  ]);

  const [hospitalPos, setHospitalPos] = useState(null);
  const [policePos, setPolicePos] = useState(null);
  const [firePos, setFirePos] = useState(null);

  const [hospitalName, setHospitalName] =
    useState("Nearest Hospital");

  const [policeName, setPoliceName] =
    useState("Nearest Police Station");

  const [fireName, setFireName] =
    useState("Nearest Fire Station");

  const GEOAPIFY_KEY =
    import.meta.env.VITE_GEOAPIFY_KEY;

  useEffect(() => {
    if (!location || !GEOAPIFY_KEY) return;

    const findPlaces = async () => {
      try {
        console.log("Searching location:", location);

        // =========================================
        // 1. GEOCODE INCIDENT LOCATION
        // =========================================

        const geoUrl =
          `https://api.geoapify.com/v1/geocode/search?` +
          `text=${encodeURIComponent(location)}` +
          `&apiKey=${GEOAPIFY_KEY}`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
          throw new Error(
            `Geocoding failed: ${geoResponse.status}`
          );
        }

        const geoData = await geoResponse.json();

        console.log("Geoapify Location:", geoData);

        if (
          !geoData.features ||
          geoData.features.length === 0
        ) {
          console.log("Location not found");
          return;
        }

        const coordinates =
          geoData.features[0].geometry.coordinates;

        const lon = coordinates[0];
        const lat = coordinates[1];

        const incident = [lat, lon];

        setIncidentPos(incident);

        // =========================================
        // 2. SEARCH NEARBY PLACES
        // =========================================

        const categories =
          "healthcare.hospital,service.police,service.fire_station";

        const placesUrl =
          `https://api.geoapify.com/v2/places?` +
          `categories=${categories}` +
          `&filter=circle:${lon},${lat},10000` +
          `&limit=50` +
          `&apiKey=${GEOAPIFY_KEY}`;

        const placesResponse =
          await fetch(placesUrl);

        if (!placesResponse.ok) {
          throw new Error(
            `Places search failed: ${placesResponse.status}`
          );
        }

        const placesData =
          await placesResponse.json();

        console.log(
          "Geoapify Nearby Places:",
          placesData
        );

        const features =
          placesData.features || [];

        let nearestHospital = null;
        let nearestPolice = null;
        let nearestFire = null;

        // =========================================
        // 3. FIND NEAREST SERVICES
        // =========================================

        features.forEach((place) => {
          const categories =
            place.properties?.categories || [];

          const coords =
            place.geometry?.coordinates;

          if (!coords || coords.length < 2) return;

          const placePos = [
            coords[1],
            coords[0],
          ];

          const name =
            place.properties?.name ||
            place.properties?.address_line1 ||
            "Emergency Service";

          // =========================================
          // HOSPITAL
          // =========================================

          if (
            categories.some((c) =>
              c.toLowerCase().includes("hospital")
            ) &&
            !nearestHospital
          ) {
            nearestHospital = {
              position: placePos,
              name: name,
            };
          }

          // =========================================
          // POLICE
          // =========================================

          if (
            categories.some((c) =>
              c.toLowerCase().includes("police")
            ) &&
            !nearestPolice
          ) {
            nearestPolice = {
              position: placePos,
              name: name,
            };
          }

          // =========================================
          // FIRE STATION
          // =========================================

          if (
            categories.some((c) =>
              c.toLowerCase().includes("fire")
            ) &&
            !nearestFire
          ) {
            nearestFire = {
              position: placePos,
              name: name,
            };
          }
        });

        console.log("Nearest Hospital:", nearestHospital);
        console.log("Nearest Police:", nearestPolice);
        console.log("Nearest Fire:", nearestFire);

        // =========================================
        // 4. SET HOSPITAL
        // =========================================

        if (nearestHospital) {
          setHospitalPos(
            nearestHospital.position
          );

          setHospitalName(
            nearestHospital.name
          );
        } else {
          setHospitalPos(null);
          setHospitalName(
            "Hospital not found nearby"
          );
        }

        // =========================================
        // 5. SET POLICE
        // =========================================

        if (nearestPolice) {
          setPolicePos(
            nearestPolice.position
          );

          setPoliceName(
            nearestPolice.name
          );
        } else {
          setPolicePos(null);
          setPoliceName(
            "Police station not found nearby"
          );
        }

        // =========================================
        // 6. SET FIRE STATION
        // =========================================

        if (nearestFire) {
          setFirePos(
            nearestFire.position
          );

          setFireName(
            nearestFire.name
          );
        } else {
          setFirePos(null);
          setFireName(
            "Fire station not found nearby"
          );
        }

      } catch (error) {
        console.error(
          "Emergency service search error:",
          error
        );
      }
    };

    findPlaces();

  }, [location, GEOAPIFY_KEY]);

  return (
    <div style={{ marginTop: "30px" }}>

      <h2>🗺 Live Incident Map</h2>

      <MapContainer
        center={incidentPos}
        zoom={15}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
        }}
      >

        <ChangeMap position={incidentPos} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* ===================================== */}
        {/* HOSPITAL ROUTE */}
        {/* ===================================== */}

        {hospitalPos && (
          <Polyline
            positions={[
              hospitalPos,
              incidentPos,
            ]}
            pathOptions={{
              color: "green",
              weight: 6,
            }}
          />
        )}

        {/* ===================================== */}
        {/* DANGER RADIUS */}
        {/* ===================================== */}

        <Circle
          center={incidentPos}
          radius={250}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 0.25,
            weight: 2,
          }}
        />

        {/* ===================================== */}
        {/* INCIDENT */}
        {/* ===================================== */}

        <Marker position={incidentPos}>
          <Popup>
            🚨 <b>Emergency Incident</b>
            <br />
            {location}
          </Popup>
        </Marker>

        {/* ===================================== */}
        {/* HOSPITAL */}
        {/* ===================================== */}

        {hospitalPos && (
          <Marker position={hospitalPos}>
            <Popup>
              🏥 <b>{hospitalName}</b>
              <br />
              Nearest Hospital
            </Popup>
          </Marker>
        )}

        {/* ===================================== */}
        {/* POLICE */}
        {/* ===================================== */}

        {policePos && (
          <Marker position={policePos}>
            <Popup>
              👮 <b>{policeName}</b>
              <br />
              Nearest Police Station
            </Popup>
          </Marker>
        )}

        {/* ===================================== */}
        {/* FIRE STATION */}
        {/* ===================================== */}

        {firePos && (
          <Marker position={firePos}>
            <Popup>
              🚒 <b>{fireName}</b>
              <br />
              Nearest Fire Station
            </Popup>
          </Marker>
        )}

        {/* ===================================== */}
        {/* AMBULANCE */}
        {/* ===================================== */}

        {hospitalPos && (
          <VehicleTracker
            start={hospitalPos}
            destination={incidentPos}
            icon="🚑"
            title="Ambulance"
          />
        )}

        {/* ===================================== */}
        {/* POLICE VEHICLE */}
        {/* ===================================== */}

        {policePos && (
          <VehicleTracker
            start={policePos}
            destination={incidentPos}
            icon="👮"
            title="Police Vehicle"
          />
        )}

        {/* ===================================== */}
        {/* FIRE TRUCK */}
        {/* ===================================== */}

        {firePos && (
          <VehicleTracker
            start={firePos}
            destination={incidentPos}
            icon="🚒"
            title="Fire Truck"
          />
        )}

        {/* ===================================== */}
        {/* AI DRONE */}
        {/* ===================================== */}

        <DroneTracker
          center={incidentPos}
        />

      </MapContainer>

    </div>
  );
}

export default EmergencyMap;