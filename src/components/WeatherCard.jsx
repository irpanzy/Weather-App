export default function WeatherCard({ data }) {
  const { name, main, weather, wind } = data;

  return (
    <div className="p-6 border rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-xl">
        {weather[0].main} - {weather[0].description}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
        alt="weather icon"
        className="mx-auto"
      />
      <p className="text-3xl font-semibold">{main.temp}°C</p>
      <div className="flex justify-between mt-4 text-sm text-gray-700">
        <span>Humidity: {main.humidity}%</span>
        <span>Wind: {wind.speed} m/s</span>
      </div>
    </div>
  );
}
