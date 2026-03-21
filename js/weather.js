// This file contains the main JavaScript logic for the Weather page
// The code will run once the page has loaded
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve HTML elements
    const cityInput = document.getElementById("weatherCityInput");
    const searchBtn = document.getElementById("weatherSearchBtn");
    const locationBtn = document.getElementById("weatherLocationBtn");
    const errorMessage = document.getElementById("weatherErrorMessage");
    const loader = document.getElementById("loader");
    const errorCard = document.getElementById("weatherErrorCard");
    const successCard = document.getElementById("weatherSuccessCard");
    const successMessage = document.getElementById("weatherSuccessMessage");
    const lastUpdated = document.getElementById("lastUpdated");

    const cityName = document.getElementById("cityName");
    const weatherDescription = document.getElementById("weatherDescription");
    const temperature = document.getElementById("temperature");
    const windSpeed = document.getElementById("windSpeed");
    const humidity = document.getElementById("humidity");
    const feelsLike = document.getElementById("feelsLike");
    const forecastContainer = document.getElementById("forecastContainer");
    const saveFavoriteBtn = document.getElementById("saveFavoriteBtn");

    let currentWeatherData = null;

    // Showing and hiding the loader
    function showLoader() {
        if (loader) {
            loader.classList.remove("hidden");
        }
    }

    function hideLoader() {
        if (loader) {
            loader.classList.add("hidden");
        }
    }

    // Error and success messages
    function showError(message) {
        clearSuccess();

        if (errorMessage) {
            errorMessage.textContent = message;
        }
        
        if (errorCard) {
            errorCard.classList.remove("hidden");
        }
    }

    function clearError() {
        if (errorMessage) {
            errorMessage.textContent = "";
        }
        
        if (errorCard) {
            errorCard.classList.add("hidden");
        }
    }

    function showSuccess(message) {
        clearError();

        if (successMessage) {
            successMessage.textContent = message;
        }

        if (successCard) {
            successCard.classList.remove("hidden");
        }
    }

    function clearSuccess() {
        if (successMessage) {
            successMessage.textContent = "";
        }

        if (successCard) {
            successCard.classList.add("hidden");
        }
    }

    // Date formatting for the forecast
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-EN", {
            weekday: "short",
            day: "numeric",
            month: "numeric"
        });
    }

    // Temperature color
    function getTemperatureColor(temp) {
        if (temp < -10) return "#1d4ed8";
        if (temp < 0) return "#3b82f6";
        if (temp < 10) return "#22c55e";
        if (temp < 20) return "#eab308";
        if (temp < 30) return "#f97316";
        return "#ef4444";
    }

    // Rendering the forecast
    function renderForecast(forecast) {
        if (!forecastContainer) return;

        forecastContainer.innerHTML = "";

        forecast.forEach((day) => {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");

            forecastCard.innerHTML = `
                <img src="assets/icons/cloud.svg" class="icon" alt="Cloud">
                <h4>${formatDate(day.date)}</h4>
                <p><strong>Weather:</strong> ${day.description}</p>
                <p><strong>Max:</strong> ${day.tempMax} °C</p>
                <p><strong>Min:</strong> ${day.tempMin} °C</p>
            `;

            forecastContainer.appendChild(forecastCard);
        });
    }

    // Displaying the current weather
    function renderCurrentWeather(data) {
        if (!data) return;

        cityName.textContent = data.country
            ? `${data.city}, ${data.country}`
            : data.city;

        weatherDescription.textContent = data.current.description;
        const temp = data.current.temperature;
        temperature.textContent = `${temp} °C`;
        temperature.style.color = getTemperatureColor(temp);
        windSpeed.textContent = `${data.current.windSpeed} m/s`;
        humidity.textContent = `${data.current.humidity} %`;
        feelsLike.textContent = `${data.current.feelsLike} °C`;

        renderForecast(data.forecast);

        updateLastUpdated();
    }

    // Loading weather by city name
    async function loadWeather(city) {
        try {
            showLoader();
            clearError();
            clearSuccess();

            const weatherData = await fetchWeatherData(city);
            currentWeatherData = weatherData;

            setSelectedCity(weatherData.city);
            setWeatherData(weatherData);
            localStorage.removeItem("selectedCoordinates");

            renderCurrentWeather(weatherData);
        } catch (error) {
            showError(error.message || "Failed to load weather data.");
        } finally {
            hideLoader();
        }
    }

    // Loading weather data by coordinates
    async function loadWeatherByCoordinates(latitude, longitude) {
        try {
            showLoader();
            clearError();
            clearSuccess();

            const weatherData = await fetchWeatherDataByCoordinates(latitude, longitude);
            currentWeatherData = weatherData;

            setSelectedCity(weatherData.city);
            setWeatherData(weatherData);
            localStorage.setItem("selectedCoordinates", JSON.stringify({
                latitude,
                longitude
            }));

            renderCurrentWeather(weatherData);
        } catch (error) {
            showError(error.message || "Failed to load weather data for your location.");
        } finally {
            hideLoader();
        }
    }

    // Simple search
    function handleSearch() {
        const city = cityInput.value.trim();

        if (city === "") {
            showError("Enter a city name before searching.");
            return;
        }

        loadWeather(city);
    }

    // Use of location
    function handleLocationSearch() {
        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser.");
            return;
        }

        clearError();
        clearSuccess();
        showLoader();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                loadWeatherByCoordinates(lat, lon);
            },
            () => {
                hideLoader();
                showError("Location access was denied.");
            }
        );
    }

    // Last updated
    function updateLastUpdated() {
        if (!lastUpdated) return;
        
        const now = new Date();
        
        const timeString = now.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            day: "numeric",
            month: "numeric"
        });
        
        lastUpdated.textContent = `Last updated: ${timeString}`;
    }

    // Add to Favorites
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

        addFavoriteCity(currentWeatherData.city);
        showSuccess(`"${currentWeatherData.city}" was added to favorites.`);
    }

    if (searchBtn) {
        // Event listeners
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

    // Initial state of the page
    const storedCoordinates = localStorage.getItem("selectedCoordinates");
    const selectedCity = getSelectedCity();

    if (storedCoordinates) {
        const coords = JSON.parse(storedCoordinates);
        loadWeatherByCoordinates(coords.latitude, coords.longitude);
    } else if (selectedCity) {
        loadWeather(selectedCity);
    } else {
        hideLoader();
    }
});