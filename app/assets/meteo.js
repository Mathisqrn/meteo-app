const resultat = document.getElementById('resultat');
const rechercheVille = document.getElementById('recherche-ville');

// météo avec la position
function afficheMeteo(data) {
    if (data.erreur) {
        resultat.innerHTML = `<p>${data.erreur}</p>`;
        return;
    }

    const ville = data.ville ? `${data.ville}, ${data.pays}` : 'Votre position';

    resultat.innerHTML = `
        <h2>${ville}</h2>
        <p>Température : ${data.temperature}°C</p>
    `;
}

// Demander la position et la récupérer
document.getElementById('btn-position').addEventListener('click', function() {
    rechercheVille.style.display = 'none';
    resultat.innerHTML = '<p>Récupération de votre position...</p>';

    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`/meteo/data?lat=${lat}&lon=${lon}`)
            .then(r => r.json())
            .then(data => afficheMeteo(data));

    }, function() {
        resultat.innerHTML = '<p>Position refusée ou indisponible.</p>';
    });
});


// météo avec la recherche de la ville
document.getElementById('btn-ville').addEventListener('click', function() {
    rechercheVille.style.display = 'block';
});

document.getElementById('btn-chercher').addEventListener('click', function() {
    const nom = document.getElementById('input-ville').value.trim();

    if (!nom) return;

    resultat.innerHTML = '<p>Recherche en cours...</p>';

    fetch(`/meteo/ville?nom=${encodeURIComponent(nom)}`)
        .then(r => r.json())
        .then(data => afficheMeteo(data));
});