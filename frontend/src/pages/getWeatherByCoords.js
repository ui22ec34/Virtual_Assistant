import axios from "axios";

const getWeatherByCoords = async (lat, lon) => {
  const apiKey = "ffb8e7b87af49d2455a4f1199e2f3da5"

  try {
    // 🌍 Reverse geocoding to get city/locality name
    const reverseGeo = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const city = reverseGeo.data.city || reverseGeo.data.locality || "your location";

    // 🌦️ Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const currentRes = await axios.get(currentUrl);
    const current = currentRes.data;

    // 🔮 3-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastRes = await axios.get(forecastUrl);
    const forecastData = forecastRes.data.list;

    const threeDayForecast = forecastData
      .filter((entry) => entry.dt_txt.includes("12:00:00"))
      .slice(0, 3);

    const forecastText = threeDayForecast
      .map((entry) => {
        const date = new Date(entry.dt_txt).toLocaleDateString("en-IN", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        return `${date}: ${entry.weather[0].description}, ${entry.main.temp}°C`;
      })
      .join(". ");

    const summary = `Currently, it’s ${current.weather[0].description} with ${current.main.temp}°C. Feels like ${current.main.feels_like}°C. Forecast: ${forecastText}.`;

    return { city, weather: summary };
  } catch (error) {
    console.error("Weather fetch error:", error);
    return { city: "your location", weather: "Unable to fetch weather data." };
  }
};

export default getWeatherByCoords;
