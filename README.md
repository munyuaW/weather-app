# 🌤️ Weather App (Vanilla JavaScript): Learning Project

A basic weather application built using plain JavaScript and powered by [Open-Meteo Free Weather API](https://open-meteo.com/).

Users can:

- 🔍 Search weather by city name.
- 📍 Get weather using their current location
- 🌡 View real-time weather details

<br>

## 🚀 Features

- City-based weather search
- Current location weather using Geolocation API
- Real-time weather data
- Responsive UI
- Error handling and feedback

<br>

## 📚 APIs Used

- Open-Meteo [Weather Forecast API](https://open-meteo.com/en/docs)
- Open-Meteo [Geocoding API](https://open-meteo.com/en/docs/geocoding-api)

<br>

## Usage

1. ### Open the app
   - Open `index.html` in your browser
   - Enter a city name (e.g Nakuru)
   - Click search
   - View weather details

   OR
   - Click **Use My Location**
   - Allow location access
   - Weather loads automatically

   NB: **Reverse geocoding is limited due to CORS restrictions from the API. A fallback label is used instead.**

2. ### Clone repository

```
htttps://github.com/munyuaW/weather-app.git
cd weather-app
```

<br>

## ⚠️ Possible Issues

1. Geolocation Not Working
   - Must run on localhost or HTTPS
   - Browser may block location access
   - User may deny permission
2. City Not Found
   - Some city names may not exist in the API
   - Try more specific names (e.g., "Nakuru" instead of "Naks")
3. Network Errors
   - API requires internet connection
   - Slow connections may delay results
4. Incomplete Weather Codes
   - Not all weather codes are mapped to descriptions

<br>

## 📁 Project Structure

weather-app/\
│── index.html \
│── styles.css \
│── script.js \
│── README.md

<br>

## 🧠 Key Concepts Learned

The focus of this project was on core JavaScript fundamentals and working with third-party services (real-world API usage):

1. ### DOM Manipulation

- Selecting elements with getElementById
- Updating UI dynamically using .textContent
- Showing/hiding elements using CSS classes

2. ### Event Handling

- Form submission with addEventListener("submit")
- Button clicks (click event)
- Preventing default browser behavior (preventDefault())

3. ### Asynchronous JavaScript

- Using async/await
- Fetching data from APIs using fetch()
- Handling asynchronous workflows

4. ### Working with APIs

- Geocoding API (City → Coordinates)
- Weather API (Coordinates → Weather data)
- Parsing JSON responses

5. ### Browser APIs

- Geolocation API (navigator.geolocation)
- Handling permissions and errors

6. ### Error Handling

- Graceful UI messages
- Try/catch blocks
- Handling empty or invalid input
