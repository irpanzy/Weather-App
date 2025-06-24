export const fetchWeather = async (latitude, longitude) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    current: data.current_weather,
    daily: data.daily,
  };
};
