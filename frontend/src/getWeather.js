import axios from "axios";

const getCityFromCommand = async (command = "") => {

  const cityMatch = command.match(/(?:weather|forecast)?\s*(?:in|at|for)?\s*([a-zA-Z\s]+)$/i);

  if (cityMatch && cityMatch[1]) {
    const city = cityMatch[1].trim();
    if (city && city.toLowerCase() !== "weather") {
      return city;
    }
  }

  
  try {
    const loc = await axios.get("https://ipapi.co/json/");
    return loc.data.city || "Warangal";
  } catch {
    return "Warangal";
  }
};

const getWeather = async (command = "") => {
  const apiKey = "ffb8e7b87af49d2455a4f1199e2f3da5";
  const city = await getCityFromCommand(command);

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;
    const currentRes = await axios.get(currentUrl);
    const current = currentRes.data;

    
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;
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
        })
        return `${date}: ${entry.weather[0].description}, ${entry.main.temp}°C`;
      })
      .join(". ");

    const summary = `Currently in ${city}, it’s ${current.weather[0].description} with ${current.main.temp}°C. It feels like ${current.main.feels_like}°C. Here's the forecast: ${forecastText}.`;

    return summary;
  } catch (error) {
    console.error("Weather API error:", error);
    return `Sorry, I couldn't fetch the weather for ${city}. Please check the city name.`;
  }
};

export default getWeather;
