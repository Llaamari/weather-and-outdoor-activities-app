document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const errorMessage = document.getElementById("errorMessage");

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
});