// You probably don't need the proxy since you registered your domain.
const useProxy = true;
const proxy = "https://cors-anywhere.herokuapp.com/";

// 1. IMPORTANT: Paste your MapmyIndia API key here as a string.
const apiKey = 'erkwxrceapsemtqdjvqvqxupnrtjyznldmdi';

function getLocation() {
    const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
    const now = Date.now();

    // Use cached location if it's less than 10 minutes old
    if (cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
        useLocation(cache.lat, cache.lng);
    } else {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now }));
            useLocation(lat, lng);
        });
    }
}

function useLocation(lat, lng) {
    const url = useProxy ? proxy : '';

    // 2. This URL is now for the MapmyIndia Nearby Places API.
    const mapplsApiUrl = `https://apis.mappls.com/advancedmaps/v1/${apiKey}/nearby_search?keywords=cafe&location=${lat},${lng}`;

    fetch(url + mapplsApiUrl)
        .then(response => response.json())
        .then(data => {
            // 3. MapmyIndia returns results in a 'suggestedLocations' array.
            console.log(data); // Good for checking the response in the browser console!
            displayCards(data.suggestedLocations || []);
        });
}

function displayCards(cafes) {
    const container = document.querySelector('.cards');
    container.innerHTML = '';

    cafes.forEach((cafe, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'swipe-wrapper';
        wrapper.style.zIndex = cafes.length - i;

        const card = document.createElement('div');
        card.className = 'card';
        // 4. Removed the photo logic as MapmyIndia handles it differently.
        // We'll just use a fallback color for all cards to keep it simple.
        card.style.backgroundColor = '#62b3a5'; // A nice teal color

        const name = document.createElement('h2');
        name.textContent = cafe.placeName; // The property is 'placeName'

        const address = document.createElement('p');
        address.textContent = cafe.address; // Also display the address
        address.style.color = 'white';
        address.style.padding = '0 15px';
        address.style.fontSize = '14px';

        card.appendChild(name);
        card.appendChild(address);
        wrapper.appendChild(card);
        container.appendChild(wrapper);

        // Hammer.js swipe functionality remains the same
        const hammertime = new Hammer(wrapper);
        hammertime.on('swipeleft', () => {
            wrapper.style.transform = 'translateX(-1000px)';
        });
        hammertime.on('swiperight', () => {
            wrapper.style.transform = 'translateX(1000px)';
        });
    });
}

// Start the app
getLocation();


