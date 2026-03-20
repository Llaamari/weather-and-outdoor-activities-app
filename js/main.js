document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const errorMessage = document.getElementById("errorMessage");
    const themeBtn = document.getElementById("themeToggleBtn");

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
});