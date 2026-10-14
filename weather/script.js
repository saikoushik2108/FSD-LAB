const cityInput = document.getElementById("cityInput");
const searchForm = document.getElementById("searchForm");
const searchBtn = document.getElementById("searchBtn");

const weatherDiv = document.getElementById("weather");
const message = document.getElementById("message");

const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");

const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");

const forecastDiv = document.getElementById("forecast");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    getWeather();
});

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        cityInput.focus();
        return;
    }

    searchBtn.disabled = true;
    message.classList.remove("error");
    message.textContent = `Loading weather for ${city}...`;
    weatherDiv.classList.add("hidden");

    try {
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error(`Location search failed (HTTP ${geoResponse.status}).`);
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`No location found for "${city}". Check the spelling and try again.`);
        }

        const location = geoData.results[0];

        if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
            throw new Error("The location service returned invalid coordinates.");
        }

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${location.latitude}` +
            `&longitude=${location.longitude}` +
            `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
            `&timezone=auto` +
            `&forecast_days=5`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error(`Weather request failed (HTTP ${weatherResponse.status}).`);
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current || !weatherData.daily) {
            throw new Error(weatherData.reason || "The weather service returned incomplete data.");
        }

        displayWeather(location, weatherData);
        weatherDiv.classList.remove("hidden");
        message.textContent = "";

    } catch (error) {
        console.error(error);
        if (error instanceof TypeError) {
            showError("Could not connect to the weather service. Check your internet connection and try again.");
        } else {
            showError(error.message || "Unable to load weather data. Please try again.");
        }
    } finally {
        searchBtn.disabled = false;
    }
}

function showError(text) {
    message.textContent = text;
    message.classList.add("error");
    weatherDiv.classList.add("hidden");
}

function displayWeather(location, data) {
    locationElement.textContent =
        [location.name, location.country].filter(Boolean).join(", ");

    temperatureElement.textContent =
        Math.round(data.current.temperature_2m);

    descriptionElement.textContent =
        getWeatherDescription(data.current.weather_code);

    humidityElement.textContent =
        data.current.relative_humidity_2m;

    windElement.textContent =
        data.current.wind_speed_10m;

    displayForecast(data.daily);
}


function displayForecast(daily) {
    forecastDiv.innerHTML = "";

    const forecastLength = Math.min(
        daily.time?.length || 0,
        daily.weather_code?.length || 0,
        daily.temperature_2m_max?.length || 0,
        daily.temperature_2m_min?.length || 0
    );

    for (let i = 0; i < forecastLength; i++) {
        const date = new Date(daily.time[i] + "T00:00:00");

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        const heading = document.createElement("h3");
        heading.textContent = dayName;

        const description = document.createElement("p");
        description.textContent = getWeatherDescription(daily.weather_code[i]);

        const maximum = document.createElement("p");
        maximum.classList.add("temp");
        maximum.textContent = `${Math.round(daily.temperature_2m_max[i])}°C`;

        const minimum = document.createElement("p");
        minimum.textContent = `Min: ${Math.round(daily.temperature_2m_min[i])}°C`;

        card.append(heading, description, maximum, minimum);

        forecastDiv.appendChild(card);
    }

    if (forecastLength === 0) {
        throw new Error("The weather service returned no forecast data.");
    }
}


// Weather code → description
function getWeatherDescription(code) {

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

        71: "Slight snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        77: "Snow grains",

        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",

        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };

    return weatherCodes[code] || "Unknown weather";
}