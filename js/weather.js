document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("weatherCityInput");
    const searchBtn = document.getElementById("weatherSearchBtn");
    const errorMessage = document.getElementById("weatherErrorMessage");

    const cityName = document.getElementById("cityName");
    const weatherDescription = document.getElementById("weatherDescription");
    const temperature = document.getElementById("temperature");
    const windSpeed = document.getElementById("windSpeed");
    const humidity = document.getElementById("humidity");
    const feelsLike = document.getElementById("feelsLike");
    const forecastContainer = document.getElementById("forecastContainer");
    const saveFavoriteBtn = document.getElementById("saveFavoriteBtn");

    let currentWeatherData = null;

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    function clearError() {
        if (errorMessage) {
            errorMessage.textContent = "";
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("fi-FI", {
            weekday: "short",
            day: "numeric",
            month: "numeric"
        });
    }

    function renderForecast(forecast) {
        if (!forecastContainer) {
            return;
        }

        forecastContainer.innerHTML = "";

        forecast.forEach((day) => {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");

            forecastCard.innerHTML = `
                <h4>${formatDate(day.date)}</h4>
                <p><strong>Weather:</strong> ${day.description}</p>
                <p><strong>Highest:</strong> ${day.tempMax} °C</p>
                <p><strong>Lowest:</strong> ${day.tempMin} °C</p>
            `;

            forecastContainer.appendChild(forecastCard);
        });
    }

    function renderCurrentWeather(data) {
        if (!data) {
            return;
        }

        cityName.textContent = `${data.city}, ${data.country}`;
        weatherDescription.textContent = data.current.description;
        temperature.textContent = `${data.current.temperature} °C`;
        windSpeed.textContent = `${data.current.windSpeed} m/s`;
        humidity.textContent = `${data.current.humidity} %`;
        feelsLike.textContent = `${data.current.feelsLike} °C`;

        renderForecast(data.forecast);
    }

    async function loadWeather(city) {
        try {
            clearError();

            const weatherData = await fetchWeatherData(city);
            currentWeatherData = weatherData;

            localStorage.setItem("selectedCity", weatherData.city);
            localStorage.setItem("weatherData", JSON.stringify(weatherData));

            renderCurrentWeather(weatherData);
        } catch (error) {
            showError(error.message || "The weather data failed to load.");
        }
    }

    function handleSearch() {
        const city = cityInput.value.trim();

        if (city === "") {
            showError("Enter the city name before searching.");
            return;
        }

        loadWeather(city);
    }

    function saveFavorite() {
        if (!currentWeatherData) {
            showError("Check the city's weather forecast before saving.");
            return;
        }

        const favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];
        const cityExists = favorites.some(
            (favorite) => favorite.toLowerCase() === currentWeatherData.city.toLowerCase()
        );

        if (cityExists) {
            showError("The city has already been added to your favorites.");
            return;
        }

        favorites.push(currentWeatherData.city);
        localStorage.setItem("favoriteCities", JSON.stringify(favorites));
        showError(`"${currentWeatherData.city}" was added to favorites.`);
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", handleSearch);
    }

    if (cityInput) {
        cityInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                handleSearch();
            }
        });
    }

    if (saveFavoriteBtn) {
        saveFavoriteBtn.addEventListener("click", saveFavorite);
    }

    const selectedCity = localStorage.getItem("selectedCity");

    if (selectedCity) {
        loadWeather(selectedCity);
    }
});