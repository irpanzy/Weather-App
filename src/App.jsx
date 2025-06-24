import { useState } from "react";
import { fetchCoordinates } from "./services/geocodeService";
import { fetchWeather } from "./services/weatherService";
import { mapWeatherCodeToIcon } from "./utils/weatherIcons";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setWeather(null);
    setLocation(null);
    setLoading(true);

    try {
      const loc = await fetchCoordinates(city);
      const w = await fetchWeather(loc.latitude, loc.longitude);
      setLocation(loc);
      setWeather(w);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-lg border shadow-sm"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading weather...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weather && location && (
        <div className="bg-white p-6 rounded-lg shadow text-center w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">
            {location.name}, {location.country}
          </h2>
          <p>
            {mapWeatherCodeToIcon(weather.current.weathercode)}{" "}
            {weather.current.temperature}°C
          </p>
          <p>💨 Wind: {weather.current.windspeed} km/h</p>
          <p>🧭 Direction: {weather.current.winddirection}°</p>
          <p>🕒 Time: {weather.current.time}</p>
        </div>
      )}

      {weather && weather.daily && (
        <div className="mt-6 w-full max-w-4xl">
          <h3 className="text-lg font-semibold mb-2 text-center">
            7-Day Forecast
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {weather.daily.time.map((date, index) => (
              <div
                key={date}
                className="bg-white rounded-xl shadow p-4 text-center"
              >
                <p className="font-medium">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric", 
                    month: "short",
                  })}
                </p>
                <p className="text-blue-600">
                  ⬆ {weather.daily.temperature_2m_max[index]}°C
                </p>
                <p className="text-blue-400">
                  ⬇ {weather.daily.temperature_2m_min[index]}°C
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
export default App;
