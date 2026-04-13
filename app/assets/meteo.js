const resultat = document.getElementById('resultat');
const rechercheVille = document.getElementById('recherche-ville');

function obtenirCondition(weathercode) {
    if (weathercode === 0) {
        return "Ensoleillé ☀️";
    }else if (weathercode <= 3 ) {
        return "Nuageux ⛅";
    }else if (weathercode <= 48) {
        return "Brouillard 🌫️";
    } else if (weathercode <= 65) {
        return "Pluvieux 🌧️";
    } else if (weathercode <= 75) {
        return "Neige ❄️";
    } else {
        return "Orageux ⛈️";
    }
}

// function qui affiche la météo
function afficheMeteo(data) {
    if (data.erreur) {
        resultat.innerHTML = `<p>${data.erreur}</p>`;
        return;
    }

    appliquerFond(data.weathercode);

    const ville = data.ville ? `${data.ville}, ${data.pays}` : 'Votre position';

    resultat.innerHTML = `
        <div class="infos-principales">
        <p class="ville-nom">${ville}</p>
        <p class="temperature">${data.temperature}°</p>
        <p class="condition">${obtenirCondition(data.weathercode)}</p>
        </div>
        <div class="infos-sup">
        <div class="card">
        <p>Température ressentie : </p>
        <p class="apparent_temperature">${data.apparent_temperature}°</p>
        </div>
        <div class="card">
        <p>Humidité :</p>
        <p class="humidity"> ${data.humidity} %</p>
        </div>
        <div class="card">
        <p>Vitesse du vent :<p>
        <p class="windspeed"> ${data.windspeed} km/h</p>
        </div>
        <div class="card">
        <p>Précipitation :</p>
        <p class="precipitation">${data.precipitation} mm </p>
        </div>
        </div>
    `;
}

// Demander la position et la récupérer
document.getElementById('btn-position').addEventListener('click', function () {
    rechercheVille.style.display = 'none';
    resultat.innerHTML = '<p>Récupération de votre position...</p>';

    navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`/meteo/data?lat=${lat}&lon=${lon}`)
            .then(r => r.json())
            .then(data => afficheMeteo(data));

    }, function () {
        resultat.innerHTML = '<p>Position refusée ou indisponible.</p>';
    });
});


// récupère les données avec la recherche de la ville
document.getElementById('btn-ville').addEventListener('click', function () {
    rechercheVille.style.display = 'block';
});

document.getElementById('btn-chercher').addEventListener('click', function () {
    const nom = document.getElementById('input-ville').value.trim();

    if (!nom) return;

    resultat.innerHTML = '<p>Recherche en cours...</p>';

    fetch(`/meteo/ville?nom=${encodeURIComponent(nom)}`)
        .then(r => r.json())
        .then(data => afficheMeteo(data));
});

// OpenMeteo renvoie un wheathercode et on s'en sert pour changer le fond
function appliquerFond(weathercode) {
    const body = document.body;

    if (weathercode === 0) {
        body.className = 'meteo-soleil';
    } else if (weathercode <= 3) {
        body.className = 'meteo-nuages';
    } else if (weathercode <= 65) {
        body.className = 'meteo-pluie';
    } else if (weathercode <= 75) {
        body.className = 'meteo-neige';
    } else {
        body.className = 'meteo-orage';
    }
}