import { useEffect, useState } from "react";

function WeatherCard({ location }) {
  const [weather, setWeather] = useState(null);

  console.log("WeatherCard Rendered:", location);

  useEffect(() => {
    if (!location) return;

    const getWeather = async () => {
      try {
        // 1. Get latitude & longitude
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}`
        );

        const geoData = await geoRes.json();

        console.log("Geo Data:", geoData);

        if (!geoData.length) return;

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // 2. Get weather
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0e351543a7ffcb9ca9a2790bf4671986&units=metric`
        );

        const weatherData = await weatherRes.json();

        console.log("Weather API Response:", weatherData);

        if (
          weatherData.cod === 200 ||
          weatherData.cod === "200"
        ) {
          setWeather(weatherData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getWeather();
  }, [location]);

  if (!weather) return <div>Loading Weather...</div>;

  return (
    <div
      className="card"
      style={{ marginTop: "20px" }}
    >
      <h2>🌦 Live Weather</h2>

      <p>
        <b>📍 Location:</b> {weather.name}
      </p>

      <p>
        <b>🌡 Temperature:</b> {weather.main.temp} °C
      </p>

      <p>
        <b>☁ Condition:</b> {weather.weather[0].description}
      </p>

      <p>
        <b>💧 Humidity:</b> {weather.main.humidity}%
      </p>

      <p>
        <b>💨 Wind:</b> {weather.wind.speed} m/s
      </p>
    </div>
  );
}

export default WeatherCard;