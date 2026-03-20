function getFavoriteCities() {
    return JSON.parse(localStorage.getItem("favoriteCities")) || [];
}

function saveFavoriteCities(cities) {
    localStorage.setItem("favoriteCities", JSON.stringify(cities));
}

function addFavoriteCity(city) {
    const favorites = getFavoriteCities();
    const cityExists = favorites.some(
        (favorite) => favorite.toLowerCase() === city.toLowerCase()
    );

    if (!cityExists) {
        favorites.push(city);
        saveFavoriteCities(favorites);
    }

    return favorites;
}

function removeFavoriteCity(city) {
    const favorites = getFavoriteCities().filter(
        (favorite) => favorite.toLowerCase() !== city.toLowerCase()
    );

    saveFavoriteCities(favorites);
    return favorites;
}

function clearAllFavorites() {
    localStorage.removeItem("favoriteCities");
}

function setSelectedCity(city) {
    localStorage.setItem("selectedCity", city);
}

function getSelectedCity() {
    return localStorage.getItem("selectedCity") || "";
}

function setWeatherData(data) {
    localStorage.setItem("weatherData", JSON.stringify(data));
}

function getWeatherData() {
    return JSON.parse(localStorage.getItem("weatherData")) || null;
}

function createFavoriteCard(city) {
    const card = document.createElement("div");
    card.classList.add("favorite-card");

    const title = document.createElement("h4");
    title.textContent = city;

    const description = document.createElement("p");
    description.textContent = "Open the city's weather information or remove it from your favorites.";

    const actions = document.createElement("div");
    actions.classList.add("favorite-actions");

    const showButton = document.createElement("button");
    showButton.classList.add("primary-btn");
    showButton.textContent = "Show weather";
    showButton.addEventListener("click", () => {
        setSelectedCity(city);
        window.location.href = "weather.html";
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("danger-btn");
    removeButton.textContent = "Delete";
    removeButton.addEventListener("click", () => {
        removeFavoriteCity(city);
        renderFavorites();
    });

    actions.appendChild(showButton);
    actions.appendChild(removeButton);

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(actions);

    return card;
}

function renderFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    const favoritesMessage = document.getElementById("favoritesMessage");

    if (!favoritesContainer || !favoritesMessage) {
        return;
    }

    const favorites = getFavoriteCities();
    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesMessage.style.display = "block";
        return;
    }

    favoritesMessage.style.display = "none";

    favorites.forEach((city) => {
        const card = createFavoriteCard(city);
        favoritesContainer.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const clearFavoritesBtn = document.getElementById("clearFavoritesBtn");

    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener("click", () => {
            clearAllFavorites();
            renderFavorites();
        });
    }

    renderFavorites();
});