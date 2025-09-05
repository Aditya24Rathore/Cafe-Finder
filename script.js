const useProxy = true;
const proxy = "https://cors-anywhere.herokuapp.com/";
const apiKey = 'YOUR_API_KEY'; // Replace with your API key

function getLocation() {
    const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
    const now = Date.now();

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
    fetch(`${url}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayCards(data.results);
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
        if (cafe.photos && cafe.photos.length > 0) {
            const photoReference = cafe.photos[0].photo_reference;
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
            card.style.backgroundImage = `url(${photoUrl})`;
        } else {
            card.style.backgroundColor = '#cccccc'; // Fallback color
        }


        const name = document.createElement('h2');
        name.textContent = cafe.name;

        card.appendChild(name);
        wrapper.appendChild(card);
        container.appendChild(wrapper);

        const hammertime = new Hammer(wrapper);
        hammertime.on('swipeleft', () => {
            wrapper.style.transform = 'translateX(-1000px)';
        });
        hammertime.on('swiperight', () => {
            wrapper.style.transform = 'translateX(1000px)';
        });
    });
}

getLocation();