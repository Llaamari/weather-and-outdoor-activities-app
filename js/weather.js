document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("weatherCityInput");
    const searchBtn = document.getElementById("weatherSearchBtn");
    const locationBtn = document.getElementById("weatherLocationBtn");
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
        return date.toLocaleDateString("en-EN", {
            weekday: "short",
            day: "numeric",
            month: "numeric"
        });
    }

    function renderForecast(forecast) {
        if (!forecastContainer) return;

        forecastContainer.innerHTML = "";

        forecast.forEach((day) => {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");

            forecastCard.innerHTML = `
                <img src="assets/icons/cloud.svg" class="icon">
                <h4>${formatDate(day.date)}</h4>
                <p><strong>Weather:</strong> ${day.description}</p>
                <p><strong>Max:</strong> ${day.tempMax} °C</p>
                <p><strong>Min:</strong> ${day.tempMin} °C</p>
            `;

            forecastContainer.appendChild(forecastCard);
        });
    }

    function renderCurrentWeather(data) {
        if (!data) return;

        cityName.textContent = data.country
            ? `${data.city}, ${data.country}`
            : data.city;

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

            setSelectedCity(weatherData.city);
            setWeatherData(weatherData);
            localStorage.removeItem("selectedCoordinates");

            renderCurrentWeather(weatherData);
        } catch (error) {
            showError(error.message || "Failed to load weather data.");
        }
    }

    async function loadWeatherByCoordinates(latitude, longitude) {
        try {
            clearError();

            const weatherData = await fetchWeatherDataByCoordinates(latitude, longitude);
            currentWeatherData = weatherData;

            // uses functions from storage.js
            setSelectedCity(weatherData.city);
            setWeatherData(weatherData);
            localStorage.setItem("selectedCoordinates", JSON.stringify({
                latitude,
                longitude
            }));

            renderCurrentWeather(weatherData);
        } catch (error) {
            showError(error.message || "Failed to load weather data for your location.");
        }
    }

    function handleSearch() {
        const city = cityInput.value.trim();

        if (city === "") {
            showError("Enter a city name before searching.");
            return;
        }

        loadWeather(city);
    }

    function handleLocationSearch() {
        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser.");
            return;
        }

        clearError();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                loadWeatherByCoordinates(lat, lon);
            },
            () => {
                showError("Location access was denied.");
            }
        );
    }

    function saveFavorite() {
        if (!currentWeatherData) {
            showError("Search weather first before saving favorites.");
            return;
        }

        const favorites = getFavoriteCities();

        const exists = favorites.some(
            (fav) => fav.toLowerCase() === currentWeatherData.city.toLowerCase()
        );

        if (exists) {
            showError("This city is already in favorites.");
            return;
        }

        // use the storage.js function
        addFavoriteCity(currentWeatherData.city);

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

    if (locationBtn) {
        locationBtn.addEventListener("click", handleLocationSearch);
    }

    if (saveFavoriteBtn) {
        saveFavoriteBtn.addEventListener("click", saveFavorite);
    }

    const storedCoordinates = localStorage.getItem("selectedCoordinates");
    const selectedCity = getSelectedCity();

    if (storedCoordinates) {
        const coords = JSON.parse(storedCoordinates);
        loadWeatherByCoordinates(coords.latitude, coords.longitude);
    } else if (selectedCity) {
        loadWeather(selectedCity);
    }
});