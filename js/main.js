document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const errorMessage = document.getElementById("errorMessage");
    const themeBtn = document.getElementById("themeToggleBtn");
    const locationBtn = document.getElementById("locationBtn");

    function handleSearch() {
        const city = cityInput.value.trim();

        if (city === "") {
            errorMessage.textContent = "Enter the city name before searching.";
            return;
        }

        errorMessage.textContent = "";

        localStorage.setItem("selectedCity", city);

        const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        }

        window.location.href = "weather.html";
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

    function setTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark");
            if (themeBtn) themeBtn.textContent = "☀️";
        } else {
            document.body.classList.remove("dark");
            if (themeBtn) themeBtn.textContent = "🌙";
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem("theme");

        if (currentTheme === "dark") {
            localStorage.setItem("theme", "light");
            setTheme("light");
        } else {
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    function showMainError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }
    
    function handleLocationSearch() {
        if (!navigator.geolocation) {
            showMainError("Geolocation is not supported by your browser.");
            return;
        }
        
        showMainError("");
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    const weatherData = await fetchWeatherDataByCoordinates(lat, lon);
                    
                    localStorage.setItem("selectedCity", weatherData.city);
                    localStorage.setItem("weatherData", JSON.stringify(weatherData));
                    localStorage.setItem("selectedCoordinates", JSON.stringify({
                        latitude: lat,
                        longitude: lon
                    }));
                    
                    window.location.href = "weather.html";
                } catch (error) {
                    showMainError(error.message || "Failed to fetch weather for your location.");
                }
            },
            () => {
                showMainError("Location access was denied.");
            }
        );
    }
    
    if (locationBtn) {
        locationBtn.addEventListener("click", handleLocationSearch);
    }
});