document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const errorMessage = document.getElementById("errorMessage");
    const themeBtn = document.getElementById("themeToggleBtn");
    const locationBtn = document.getElementById("locationBtn");
    const historyContainer = document.getElementById("searchHistoryContainer");
    const historyEmptyMessage = document.getElementById("historyEmptyMessage");

    function showMainError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    function getSearchHistory() {
        return JSON.parse(localStorage.getItem("searchHistory")) || [];
    }

    function saveSearchHistory(history) {
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }

    function addToSearchHistory(city) {
        let history = getSearchHistory();

        history = history.filter(
            (item) => item.toLowerCase() !== city.toLowerCase()
        );

        history.unshift(city);

        if (history.length > 5) {
            history = history.slice(0, 5);
        }

        saveSearchHistory(history);
    }

    function handleHistoryClick(city) {
        localStorage.setItem("selectedCity", city);
        localStorage.removeItem("selectedCoordinates");
        window.location.href = "weather.html";
    }

    function renderSearchHistory() {
        if (!historyContainer || !historyEmptyMessage) {
            return;
        }

        const history = getSearchHistory();
        historyContainer.innerHTML = "";

        if (history.length === 0) {
            historyEmptyMessage.style.display = "block";
            historyContainer.appendChild(historyEmptyMessage);
            return;
        }

        historyEmptyMessage.style.display = "none";

        history.forEach((city) => {
            const button = document.createElement("button");
            button.classList.add("history-btn");
            button.textContent = city;
            button.addEventListener("click", () => handleHistoryClick(city));
            historyContainer.appendChild(button);
        });
    }

    function handleSearch() {
        const city = cityInput ? cityInput.value.trim() : "";

        if (city === "") {
            showMainError("Enter the city name before searching.");
            return;
        }

        showMainError("");

        localStorage.setItem("selectedCity", city);
        localStorage.removeItem("selectedCoordinates");
        addToSearchHistory(city);

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

                    addToSearchHistory(weatherData.city);
                    renderSearchHistory();

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

    renderSearchHistory();
});