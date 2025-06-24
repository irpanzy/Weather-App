import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Eye, Droplets, Thermometer, Sunrise, Sunset, Cloud, Sun, CloudRain, CloudSnow, Zap } from 'lucide-react';

// Indonesian cities data
const INDONESIAN_CITIES = [
  { name: 'Jakarta', province: 'DKI Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lon: 112.7521 },
  { name: 'Medan', province: 'Sumatera Utara', lat: 3.5952, lon: 98.6722 },
  { name: 'Bandung', province: 'Jawa Barat', lat: -6.9175, lon: 107.6191 },
  { name: 'Bekasi', province: 'Jawa Barat', lat: -6.2383, lon: 106.9756 },
  { name: 'Depok', province: 'Jawa Barat', lat: -6.4025, lon: 106.7942 },
  { name: 'Tangerang', province: 'Banten', lat: -6.1783, lon: 106.6319 },
  { name: 'Palembang', province: 'Sumatera Selatan', lat: -2.9761, lon: 104.7754 },
  { name: 'Semarang', province: 'Jawa Tengah', lat: -6.9667, lon: 110.4167 },
  { name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327 },
  { name: 'Batam', province: 'Kepulauan Riau', lat: 1.1307, lon: 104.0530 },
  { name: 'Bogor', province: 'Jawa Barat', lat: -6.5944, lon: 106.7892 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lon: 101.4478 },
  { name: 'Bandar Lampung', province: 'Lampung', lat: -5.4292, lon: 105.2610 },
  { name: 'Malang', province: 'Jawa Timur', lat: -7.9666, lon: 112.6326 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lon: 110.3695 },
  { name: 'Denpasar', province: 'Bali', lat: -8.6705, lon: 115.2126 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5017, lon: 117.1536 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3194, lon: 114.5906 },
  { name: 'Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lon: 116.8289 },
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lon: 109.3425 },
  { name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lon: 124.8421 },
  { name: 'Mataram', province: 'Nusa Tenggara Barat', lat: -8.5833, lon: 116.1167 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lon: 123.6070 },
  { name: 'Jayapura', province: 'Papua', lat: -2.5489, lon: 140.7137 },
  { name: 'Ambon', province: 'Maluku', lat: -3.6954, lon: 128.1814 },
  { name: 'Padang', province: 'Sumatera Barat', lat: -0.9471, lon: 100.4172 },
  { name: 'Jambi', province: 'Jambi', lat: -1.6101, lon: 103.6131 },
  { name: 'Bengkulu', province: 'Bengkulu', lat: -3.8004, lon: 102.2655 },
  { name: 'Banda Aceh', province: 'Aceh', lat: 5.5483, lon: 95.3238 }
];

// Weather code mapping
const getWeatherIcon = (code, isDay = true) => {
  if (code === 0) return isDay ? <Sun className="w-8 h-8 text-yellow-500" /> : <Sun className="w-8 h-8 text-yellow-300" />;
  if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-gray-500" />;
  if (code === 45 || code === 48) return <Cloud className="w-8 h-8 text-gray-400" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-500" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-blue-300" />;
  if (code >= 80 && code <= 99) return <Zap className="w-8 h-8 text-purple-500" />;
  return <Cloud className="w-8 h-8 text-gray-400" />;
};

const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Cerah',
    1: 'Cerah Sebagian',
    2: 'Berawan Sebagian',
    3: 'Berawan',
    45: 'Berkabut',
    48: 'Kabut Tebal',
    51: 'Gerimis Ringan',
    53: 'Gerimis Sedang',
    55: 'Gerimis Lebat',
    56: 'Gerimis Beku Ringan',
    57: 'Gerimis Beku Lebat',
    61: 'Hujan Ringan',
    63: 'Hujan Sedang',
    65: 'Hujan Lebat',
    66: 'Hujan Beku Ringan',
    67: 'Hujan Beku Lebat',
    71: 'Salju Ringan',
    73: 'Salju Sedang',
    75: 'Salju Lebat',
    77: 'Butiran Salju',
    80: 'Hujan Shower Ringan',
    81: 'Hujan Shower Sedang',
    82: 'Hujan Shower Lebat',
    85: 'Salju Shower Ringan',
    86: 'Salju Shower Lebat',
    95: 'Badai Petir',
    96: 'Badai Petir dengan Hujan Es Ringan',
    99: 'Badai Petir dengan Hujan Es Lebat'
  };
  return descriptions[code] || 'Tidak Diketahui';
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const WeatherApp = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = INDONESIAN_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather and daily forecast
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,weather_code,precipitation_probability&timezone=Asia%2FJakarta&forecast_days=7`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Gagal mengambil data cuaca');
      }
      
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
      setHourlyWeather(weatherData.hourly);
      setSelectedCity(city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city.name);
    setShowDropdown(false);
    fetchWeatherData(city);
  };

  // Load Jakarta weather by default
  useEffect(() => {
    const jakarta = INDONESIAN_CITIES.find(city => city.name === 'Jakarta');
    if (jakarta) {
      fetchWeatherData(jakarta);
      setSearchTerm('Jakarta');
    }
  }, []);

  const getCurrentHourlyData = () => {
    if (!hourlyWeather) return [];
    
    const now = new Date();
    const currentHour = now.getHours();
    
    return hourlyWeather.time.slice(currentHour, currentHour + 24).map((time, index) => ({
      time,
      temperature: hourlyWeather.temperature_2m[currentHour + index],
      weatherCode: hourlyWeather.weather_code[currentHour + index],
      precipitation: hourlyWeather.precipitation_probability[currentHour + index]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Cuaca Indonesia
          </h1>
          <p className="text-white/80 text-lg">Prakiraan cuaca terkini untuk kota-kota di Indonesia</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Cari kota di Indonesia..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-0 shadow-lg bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
            />
          </div>
          
          {/* Dropdown */}
          {showDropdown && searchTerm && (
            <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto">
              {filteredCities.slice(0, 10).map((city) => (
                <button
                  key={`${city.name}-${city.province}`}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <span className="font-medium text-gray-800">{city.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{city.province}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2">Memuat data cuaca...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-300 text-white px-4 py-3 rounded-2xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Weather Data */}
        {weather && selectedCity && (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedCity.name}</h2>
                  <p className="text-white/80">{selectedCity.province}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">
                    {new Date(weather.current.time).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-white/80 text-sm">
                    {formatTime(weather.current.time)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main Temperature */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    {getWeatherIcon(weather.current.weather_code, weather.current.is_day)}
                    <span className="text-6xl md:text-7xl font-light text-white ml-4">
                      {Math.round(weather.current.temperature_2m)}°
                    </span>
                  </div>
                  <p className="text-xl text-white/90 mb-2">
                    {getWeatherDescription(weather.current.weather_code)}
                  </p>
                  <p className="text-white/70">
                    Terasa seperti {Math.round(weather.current.apparent_temperature)}°C
                  </p>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <Wind className="w-5 h-5 text-white/80 mr-2" />
                      <span className="text-white/80 text-sm">Angin</span>
                    </div>
                    <p className="text-white font-semibold">
                      {Math.round(weather.current.wind_speed_10m)} km/h
                    </p>
                    <p className="text-white/70 text-xs">
                      {weather.current.wind_direction_10m}°
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <Droplets className="w-5 h-5 text-white/80 mr-2" />
                      <span className="text-white/80 text-sm">Kelembapan</span>
                    </div>
                    <p className="text-white font-semibold">
                      {weather.current.relative_humidity_2m}%
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <Eye className="w-5 h-5 text-white/80 mr-2" />
                      <span className="text-white/80 text-sm">Tekanan</span>
                    </div>
                    <p className="text-white font-semibold">
                      {Math.round(weather.current.pressure_msl)} hPa
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="flex items-center mb-2">
                      <Cloud className="w-5 h-5 text-white/80 mr-2" />
                      <span className="text-white/80 text-sm">Awan</span>
                    </div>
                    <p className="text-white font-semibold">
                      {weather.current.cloud_cover}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30">
              <h3 className="text-xl font-bold text-white mb-4">Prakiraan Per Jam</h3>
              <div className="overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {getCurrentHourlyData().slice(0, 12).map((hour, index) => (
                    <div key={index} className="flex-shrink-0 bg-white/10 rounded-2xl p-3 text-center min-w-[80px] backdrop-blur-sm">
                      <p className="text-white/80 text-xs mb-2">
                        {index === 0 ? 'Sekarang' : formatTime(hour.time)}
                      </p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(hour.weatherCode, true)}
                      </div>
                      <p className="text-white font-semibold text-sm">
                        {Math.round(hour.temperature)}°
                      </p>
                      <p className="text-white/70 text-xs">
                        {hour.precipitation}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30">
              <h3 className="text-xl font-bold text-white mb-4">Prakiraan 7 Hari</h3>
              <div className="space-y-3">
                {weather.daily.time.map((date, index) => (
                  <div key={date} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center flex-1">
                      <div className="w-16 text-white/80 text-sm">
                        {index === 0 ? 'Hari ini' : new Date(date).toLocaleDateString('id-ID', { weekday: 'short' })}
                      </div>
                      <div className="flex items-center ml-4">
                        {getWeatherIcon(weather.daily.weather_code[index], true)}
                        <span className="ml-2 text-white/90 text-sm">
                          {getWeatherDescription(weather.daily.weather_code[index])}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Droplets className="w-4 h-4 text-blue-300 mr-1" />
                        <span className="text-white/80 text-sm">
                          {weather.daily.precipitation_probability_max[index]}%
                        </span>
                      </div>
                      <div className="text-white text-right">
                        <span className="font-semibold">
                          {Math.round(weather.daily.temperature_2m_max[index])}°
                        </span>
                        <span className="text-white/70 ml-2">
                          {Math.round(weather.daily.temperature_2m_min[index])}°
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sun Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30">
                <div className="flex items-center mb-4">
                  <Sunrise className="w-6 h-6 text-yellow-300 mr-2" />
                  <h3 className="text-lg font-bold text-white">Matahari Terbit</h3>
                </div>
                <p className="text-2xl font-semibold text-white">
                  {formatTime(weather.daily.sunrise[0])}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30">
                <div className="flex items-center mb-4">
                  <Sunset className="w-6 h-6 text-orange-300 mr-2" />
                  <h3 className="text-lg font-bold text-white">Matahari Terbenam</h3>
                </div>
                <p className="text-2xl font-semibold text-white">
                  {formatTime(weather.daily.sunset[0])}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default WeatherApp;