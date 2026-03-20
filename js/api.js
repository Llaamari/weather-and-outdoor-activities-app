const GEO_API_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

async function getCoordinatesByCity(city) {
    const url = `${GEO_API_BASE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("The search for the city's coordinates failed.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("The city was not found. Please check the spelling.");
    }

    const location = data.results[0];

    return {
        name: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude
    };
}

async function getWeatherByCoordinates(latitude, longitude) {
    const url = `${WEATHER_API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("The weather data retrieval failed.");
    }

    return await response.json();
}

function getWeatherDescription(weatherCode) {
    const weatherDescriptions = {
        0: "Clear",
        1: "Mostly clear",
        2: "Partly cloudy",
        3: "Cloudy",
        45: "Foggy",
        48: "Misty fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Heavy drizzle",
        56: "Weak freezing drizzle",
        57: "Heavy freezing drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Light snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        77: "Snowflakes",
        80: "Light rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        85: "Light snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorms and light hail",
        99: "Thunderstorms and heavy hail"
    };

    return weatherDescriptions[weatherCode] || "Weather conditions unknown";
}

function formatWeatherData(locationData, weatherData) {
    return {
        city: locationData.name,
        country: locationData.country,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        current: {
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            feelsLike: weatherData.current.apparent_temperature,
            windSpeed: weatherData.current.wind_speed_10m,
            weatherCode: weatherData.current.weather_code,
            description: getWeatherDescription(weatherData.current.weather_code),
            time: weatherData.current.time
        },
        forecast: weatherData.daily.time.map((date, index) => ({
            date: date,
            tempMax: weatherData.daily.temperature_2m_max[index],
            tempMin: weatherData.daily.temperature_2m_min[index],
            weatherCode: weatherData.daily.weather_code[index],
            description: getWeatherDescription(weatherData.daily.weather_code[index])
        }))
    };
}

async function fetchWeatherData(city) {
    const locationData = await getCoordinatesByCity(city);
    const weatherData = await getWeatherByCoordinates(
        locationData.latitude,
        locationData.longitude
    );

    return formatWeatherData(locationData, weatherData);
}

async function getLocationNameByCoordinates(latitude, longitude) {
    const url = `${GEO_API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to get location name from coordinates.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return {
            name: "Current location",
            country: ""
        };
    }

    const location = data.results[0];

    return {
        name: location.name || "Current location",
        country: location.country || ""
    };
}

async function fetchWeatherDataByCoordinates(latitude, longitude) {
    const locationData = await getLocationNameByCoordinates(latitude, longitude);
    const weatherData = await getWeatherByCoordinates(latitude, longitude);

    return {
        city: locationData.name,
        country: locationData.country,
        latitude: latitude,
        longitude: longitude,
        current: {
            temperature: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            feelsLike: weatherData.current.apparent_temperature,
            windSpeed: weatherData.current.wind_speed_10m,
            weatherCode: weatherData.current.weather_code,
            description: getWeatherDescription(weatherData.current.weather_code),
            time: weatherData.current.time
        },
        forecast: weatherData.daily.time.map((date, index) => ({
            date: date,
            tempMax: weatherData.daily.temperature_2m_max[index],
            tempMin: weatherData.daily.temperature_2m_min[index],
            weatherCode: weatherData.daily.weather_code[index],
            description: getWeatherDescription(weatherData.daily.weather_code[index])
        }))
    };
}