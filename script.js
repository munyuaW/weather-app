// Cache DOM elements

// Form & buttons
const searchFormEl = document.getElementById("searchForm");
const cityInputEl = document.getElementById("cityInput");
const locationBtnEl = document.getElementById("locationBtn");

// UI display elements
const messageEl = document.getElementById("message");
const weatherResultEl = document.getElementById("weatherResult");

const cityNameEl = document.getElementById("cityName");
const dateTextEl = document.getElementById("dateText");
const temperatureEl = document.getElementById("temperature");
const weatherDescriptionEl = document.getElementById("weatherCodeText");
const weatherIconEl = document.getElementById("weatherIcon");

const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("windSpeed");
const countryNameEl = document.getElementById("countryName");

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  56: "🌧️",
  57: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🌧️",
  67: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  77: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  85: "🌨️",
  86: "❄️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

// Handle city search(form submit)
searchFormEl.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop page reload

  const city = cityInputEl.value.trim();
  if (!city) {
    showMessage("Please enter a city name", true);
    return;
  }

  const location = await getCityCoordinates(city);
  if (!location) return;

  const weatherData = await getWeather(location.latitude, location.longitude);
  if (!weatherData) return;

  displayWeather(location, weatherData);
});

locationBtnEl.addEventListener("click", getLocalWeather);

// a helper function for messages
function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("error", isError);
}

// get location coordinates, using open-meteo geocoding API
async function getCityCoordinates(city) {
  showMessage("Searching location...");
  weatherResultEl.classList.add("hidden");

  try {
    const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetch(endpoint);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found. Try another name.");
    }

    const foundLocation = data.results[0];

    return {
      latitude: foundLocation.latitude,
      longitude: foundLocation.longitude,
      name: foundLocation.name,
      country: foundLocation.country,
      timezone: foundLocation.timezone,
    };
  } catch (error) {
    showMessage(error.message, true);
    console.error(error);
  }
}

// fetch the weather data using the city coordinates
// https://api.open-meteo.com/v1/forecast

// Data requested:
// temperature
// wind speed
// weather code (condition)
// humidity
// “feels like” temp
async function getWeather(latitude, longitude) {
  showMessage("Fetching weather...");

  try {
    const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;

    const response = await fetch(endpoint);
    const data = await response.json();

    return data.current;
  } catch (error) {
    showMessage("Failed to fetch weather", true);
    console.error(error);
  }
}

// display weather in the UI
function displayWeather(location, weatherData) {
  showMessage("Weather updated.");

  cityNameEl.textContent = location.name;
  dateTextEl.textContent = formatLocalDate(location.timezone);
  countryNameEl.textContent = location.country || "--";

  weatherIconEl.textContent = weatherIcons[weatherData.weather_code];
  temperatureEl.textContent = Math.round(weatherData.temperature_2m);
  weatherDescriptionEl.textContent = weatherCodes[weatherData.weather_code];
  feelsLikeEl.textContent = `${Math.round(weatherData.apparent_temperature)}°C`;
  humidityEl.textContent = `${weatherData.relative_humidity_2m}%`;
  windSpeedEl.textContent = `${weatherData.wind_speed_10m} km/h`;

  weatherResultEl.classList.remove("hidden");
}

// getting local weather using geoloction API:
// The Geolocation API is available through the navigator.geolocation object

async function getLocalWeather() {
  // check if the object exists
  if (!("geolocation" in navigator)) {
    showMessage("Geolocation is not supported by this browser.", true);
    return;
  }

  // otherwise, geolocation services are available
  showMessage("Getting your location...");
  weatherResultEl.classList.add("hidden");

  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000, // how long the position stays cached
    timeout: 27000, // how log should the browser attempt to get position
  };

  // getCurrentPosition() initiates an asynchronous request to get user's position
  navigator.geolocation.getCurrentPosition(
    handleLocationSuccess,
    handleLocationError,
    options,
  );
}

async function handleLocationSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const weather = await getWeather(latitude, longitude);
  if (!weather) return;

  const location = await getLocationDetails(latitude, longitude);

  if (!location) return;

  displayWeather(location, weather);
}

function handleLocationError(error) {
  console.error(error);

  switch (error.code) {
    case error.PERMISSION_DENIED:
      showMessage("Location permission denied. Please allow access", true);
      break;

    case error.TIMEOUT:
      showMessage("Location request timed out. Try again", true);
      break;

    default:
      showMessage("Unable to get your location", true);
  }
}

// getCurrentPosition() returns a GeolocationPosition obj instance
// the GeolocationPosition obj has two properties: coords and timestamp
// 1. coords: a GeolocationCoordinates obj instance -> lat and long
// 2. timestamp: unix time in ms, at which the position data was retrieved

async function getLocationDetails(latitude, longitude) {
  try {
    const endpoint = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (!data) return;

    const locationDetails = data.results[0];

    return {
      name: locationDetails?.name || "Your location",
      country: locationDetails?.country || "--",
      timezone: locationDetails?.timezone || "UTC",
    };
  } catch (error) {
    showMessage(error.message || "Unable to determine your location", true);
  }
}

// format local date
function formatLocalDate(timezone) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date());
}
