// This file handles the logic for the Recommendations page
// The code runs once the page has loaded
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the page elements
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
    const scoreText = document.getElementById("scoreText");
    const scoreFill = document.getElementById("scoreFill");

    // calculateOutdoorScore(...)
    function calculateOutdoorScore(temp, windSpeed, weatherDescription) {
        let score = 100;
        const description = weatherDescription.toLowerCase();

        if (temp < -15) {
            score -= 45;
        } else if (temp < -5) {
            score -= 30;
        } else if (temp < 5) {
            score -= 15;
        } else if (temp > 30) {
            score -= 35;
        } else if (temp > 25) {
            score -= 20;
        } else if (temp >= 12 && temp <= 22) {
            score += 5;
        }

        if (windSpeed > 20) {
            score -= 35;
        } else if (windSpeed > 12) {
            score -= 20;
        } else if (windSpeed > 8) {
            score -= 10;
        }

        if (description.includes("thunderstorm")) {
            score -= 50;
        } else if (description.includes("heavy rain")) {
            score -= 35;
        } else if (description.includes("rain showers")) {
            score -= 25;
        } else if (description.includes("rain")) {
            score -= 20;
        } else if (description.includes("drizzle")) {
            score -= 15;
        } else if (description.includes("heavy snowfall")) {
            score -= 30;
        } else if (description.includes("snow")) {
            score -= 20;
        } else if (description.includes("fog")) {
            score -= 10;
        } else if (description.includes("clear") || description.includes("mostly clear")) {
            score += 5;
        }

        if (score > 100) {
            score = 100;
        }

        if (score < 0) {
            score = 0;
        }

        return score;
    }

    // getScoreLabel(score)
    function getScoreLabel(score) {
        if (score >= 80) {
            return `🟢 Great day for outdoor activities (${score}/100)`;
        }

        if (score >= 55) {
            return `🟡 Decent conditions for going outside (${score}/100)`;
        }

        return `🔴 Poor outdoor conditions (${score}/100)`;
    }

    // updateScoreUI(score)
    function updateScoreUI(score) {
        if (!scoreText || !scoreFill) {
            return;
        }

        scoreText.textContent = getScoreLabel(score);
        scoreFill.style.width = `${score}%`;

        if (score >= 80) {
            scoreFill.style.backgroundColor = "#22c55e";
        } else if (score >= 55) {
            scoreFill.style.backgroundColor = "#eab308";
        } else {
            scoreFill.style.backgroundColor = "#ef4444";
        }
    }

    // getTemperatureColor(temp)
    function getTemperatureColor(temp) {
        if (temp < -10) return "#1d4ed8";
        if (temp < 0) return "#3b82f6";
        if (temp < 10) return "#22c55e";
        if (temp < 20) return "#eab308";
        if (temp < 30) return "#f97316";
        return "#ef4444";
    }

    // getClothingRecommendation(temp, windSpeed)
    function getClothingRecommendation(temp, windSpeed) {
        if (temp < 0) {
            return "Wear a warm winter coat, gloves, a beanie and insulated shoes.";
        }

        if (temp < 10) {
            return "A jacket or layered clothing is recommended. Mornings may feel chilly.";
        }

        if (temp < 20) {
            return "A light jacket or hoodie should be enough in most cases.";
        }

        if (windSpeed > 10) {
            return "Even if the temperature feels comfortable, the wind may make it feel colder. Wear something windproof.";
        }

        return "Light clothing should work well for today's weather.";
    }

    // getActivityRecommendation(temp, windSpeed, weatherDescription)
    function getActivityRecommendation(temp, windSpeed, weatherDescription) {
        const description = weatherDescription.toLowerCase();

        if (description.includes("thunderstorm")) {
            return "Outdoor activity is not recommended during thunderstorms. Indoor activities are safer.";
        }

        if (description.includes("heavy rain") || description.includes("rain showers")) {
            return "Light outdoor activity may be possible, but indoor exercise is probably more comfortable.";
        }

        if (temp < -10) {
            return "Very cold weather limits long outdoor sessions. Shorter periods outside are recommended.";
        }

        if (temp >= 10 && temp <= 22 && windSpeed < 8) {
            return "Excellent weather for walking, jogging and other outdoor activities.";
        }

        if (temp > 22) {
            return "Warm weather is suitable for outdoor activities, but remember to drink water and avoid heavy exercise during the hottest hours.";
        }

        return "Outdoor activity is possible as long as you dress appropriately for the weather.";
    }

    // getGearRecommendation(temp, windSpeed, weatherDescription)
    function getGearRecommendation(temp, windSpeed, weatherDescription) {
        const description = weatherDescription.toLowerCase();

        if (description.includes("rain") || description.includes("drizzle")) {
            return "Bring an umbrella or wear a waterproof jacket.";
        }

        if (description.includes("snow")) {
            return "Wear shoes with good grip and be prepared for slippery conditions.";
        }

        if (windSpeed > 12) {
            return "Strong wind may affect comfort. A windproof jacket is a good choice.";
        }

        if (temp > 25) {
            return "Bring a water bottle, sunglasses and sunscreen if needed.";
        }

        return "No special extra equipment is necessarily needed.";
    }

    // getSummaryText(temp, windSpeed, weatherDescription)
    function getSummaryText(temp, windSpeed, weatherDescription) {
        const description = weatherDescription.toLowerCase();

        if (description.includes("thunderstorm")) {
            return "Today's weather requires caution. Thunderstorms make outdoor plans riskier.";
        }

        if (description.includes("rain") || description.includes("drizzle")) {
            return "The day is fairly wet, so it is worth preparing for rain.";
        }

        if (temp < 0) {
            return "The weather is cold, so warm clothing is the most important thing today.";
        }

        if (temp >= 10 && temp <= 22 && windSpeed < 8) {
            return "The weather is quite pleasant and works well for many outdoor activities.";
        }

        if (temp > 22) {
            return "The warm day offers good outdoor opportunities as long as you stay hydrated.";
        }

        return "The weather is fairly ordinary, so normal preparation should be enough.";
    }

    // renderRecommendations(weatherData)
    function renderRecommendations(weatherData) {
        const outdoorScore = calculateOutdoorScore(
            weatherData.current.temperature,
            weatherData.current.windSpeed,
            weatherData.current.description
        );

        cityName.textContent = `${weatherData.city}${weatherData.country ? `, ${weatherData.country}` : ""}`;
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

        const temp = weatherData.current.temperature;
        temperature.textContent = `${temp} °C`;
        temperature.style.color = getTemperatureColor(temp);
        wind.textContent = `${weatherData.current.windSpeed} m/s`;
        humidity.textContent = `${weatherData.current.humidity} %`;
        condition.textContent = weatherData.current.description;

        updateScoreUI(outdoorScore);
    }

    // renderEmptyState()
    function renderEmptyState() {
        cityName.textContent = "No city selected";
        weatherText.textContent = "Search for a city on the weather page first.";
        summary.textContent = "Recommendations cannot be shown without weather data.";
        clothingRecommendation.textContent = "No clothing recommendation available yet.";
        activityRecommendation.textContent = "No activity recommendation available yet.";
        gearRecommendation.textContent = "No gear recommendation available yet.";
        temperature.textContent = "-- °C";
        temperature.style.color = "";
        wind.textContent = "-- m/s";
        humidity.textContent = "-- %";
        condition.textContent = "--";

        if (scoreText) {
            scoreText.textContent = "The score will appear here.";
        }

        if (scoreFill) {
            scoreFill.style.width = "0";
        }
    }

    // The data is retrieved from localStorage
    const storedWeatherData = localStorage.getItem("weatherData");

    if (storedWeatherData) {
        const weatherData = JSON.parse(storedWeatherData);
        renderRecommendations(weatherData);
    } else {
        renderEmptyState();
    }
});