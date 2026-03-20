document.addEventListener("DOMContentLoaded", () => {
    const cityName = document.getElementById("recommendationCityName");
    const weatherText = document.getElementById("recommendationWeatherText");
    const summary = document.getElementById("recommendationSummary");
    const clothingRecommendation = document.getElementById("clothingRecommendation");
    const activityRecommendation = document.getElementById("activityRecommendation");
    const gearRecommendation = document.getElementById("gearRecommendation");
    const temperature = document.getElementById("recommendationTemperature");
    const wind = document.getElementById("recommendationWind");
    const humidity = document.getElementById("recommendationHumidity");
    const condition = document.getElementById("recommendationCondition");

    function getClothingRecommendation(temp, windSpeed) {
        if (temp < 0) {
            return "Put on a warm winter coat, gloves, a hat and warm shoes.";
        }

        if (temp < 10) {
            return "Wear a jacket or dress in layers. It might be chilly in the morning.";
        }

        if (temp < 20) {
            return "A light jacket or hoodie is usually enough.";
        }

        if (windSpeed > 10) {
            return "Even if the temperature is pleasant, the wind feels chilly. Be sure to bring a windproof jacket.";
        }

        return "Light clothing is perfect for today's weather.";
    }

    function getActivityRecommendation(temp, windSpeed, weatherDescription) {
        const description = weatherDescription.toLowerCase();

        if (description.includes("thunderstorm")) {
            return "Outdoor exercise is not recommended during a thunderstorm. Indoor activities are a safer option.";
        }

        if (description.includes("heavy rain") || description.includes("rain showers")) {
            return "Light outdoor exercise might be possible, but because of the rain, indoor exercise is probably a more comfortable option.";
        }

        if (temp < -10) {
            return "Very cold weather limits the amount of time you can spend outdoors. Stick to short outings.";
        }

        if (temp >= 10 && temp <= 22 && windSpeed < 8) {
            return "Perfect weather for walking, jogging and other outdoor activities.";
        }

        if (temp > 22) {
            return "Warm weather is perfect for outdoor activities, but remember to drink plenty of water and avoid overexertion during the hottest part of the day.";
        }

        return "You can go outside as usual as long as you dress for the weather.";
    }

    function getGearRecommendation(temp, windSpeed, weatherDescription) {
        const description = weatherDescription.toLowerCase();

        if (description.includes("rain") || description.includes("drizzle")) {
            return "Bring an umbrella or a waterproof jacket.";
        }

        if (description.includes("snow")) {
            return "Wear shoes with good traction and be prepared for slippery conditions.";
        }

        if (windSpeed > 12) {
            return "Strong winds can affect your comfort. A windproof jacket is a good choice.";
        }

        if (temp > 25) {
            return "Bring a water bottle, sunglasses and sunscreen if needed.";
        }

        return "No special accessories are necessarily required.";
    }

    function getSummaryText(temp, windSpeed, weatherDescription) {
        const description = weatherDescription.toLowerCase();

        if (description.includes("thunderstorm")) {
            return "Today's weather calls for caution. Thunderstorms make being outdoors more risky.";
        }

        if (description.includes("rain") || description.includes("drizzle")) {
            return "It's going to be a pretty damp day, so you should be prepared for rain.";
        }

        if (temp < 0) {
            return "It's cold out, so dressing warmly is the most important thing today.";
        }

        if (temp >= 10 && temp <= 22 && windSpeed < 8) {
            return "The weather is quite pleasant and ideal for a variety of outdoor activities.";
        }

        if (temp > 22) {
            return "A warm day offers great opportunities for outdoor activities, as long as you remember to stay hydrated.";
        }

        return "The weather is fairly typical, so you can plan your day just fine with the usual precautions.";
    }

    function renderRecommendations(weatherData) {
        cityName.textContent = `${weatherData.city}, ${weatherData.country}`;
        weatherText.textContent = `Current weather: ${weatherData.current.description}.`;
        summary.textContent = getSummaryText(
            weatherData.current.temperature,
            weatherData.current.windSpeed,
            weatherData.current.description
        );

        clothingRecommendation.textContent = getClothingRecommendation(
            weatherData.current.temperature,
            weatherData.current.windSpeed
        );

        activityRecommendation.textContent = getActivityRecommendation(
            weatherData.current.temperature,
            weatherData.current.windSpeed,
            weatherData.current.description
        );

        gearRecommendation.textContent = getGearRecommendation(
            weatherData.current.temperature,
            weatherData.current.windSpeed,
            weatherData.current.description
        );

        temperature.textContent = `${weatherData.current.temperature} °C`;
        wind.textContent = `${weatherData.current.windSpeed} m/s`;
        humidity.textContent = `${weatherData.current.humidity} %`;
        condition.textContent = weatherData.current.description;
    }

    function renderEmptyState() {
        cityName.textContent = "No city selected";
        weatherText.textContent = "First, check the city's weather page.";
        summary.textContent = "The recommendations could not be displayed without weather data.";
        clothingRecommendation.textContent = "No dress code yet.";
        activityRecommendation.textContent = "No activity recommendations yet.";
        gearRecommendation.textContent = "No equipment recommendations yet.";
        temperature.textContent = "-- °C";
        wind.textContent = "-- m/s";
        humidity.textContent = "-- %";
        condition.textContent = "--";
    }

    const storedWeatherData = localStorage.getItem("weatherData");

    if (storedWeatherData) {
        const weatherData = JSON.parse(storedWeatherData);
        renderRecommendations(weatherData);
    } else {
        renderEmptyState();
    }
});