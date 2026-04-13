<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MeteoController extends AbstractController
{
    // Route principale : Renvoie vers la vue twig de la page web
    #[Route('/meteo', name: 'meteo')]
    public function index(): Response
    {
        return $this->render('meteo/index.html.twig');
    }

    // Route API : Si l'utilisateur active sa localisation alors elle reçoit lat/lon en paramètre, interroge Open-Meteo et retourne la météo en JSON
    #[Route('/meteo/data', name: 'meteo_data')]
    public function data(Request $request, HttpClientInterface $http): JsonResponse
    {
        $latitude = $request->query->get('lat');
        $longitude = $request->query->get('lon');

        $meteo = $http->request('GET', 'https://api.open-meteo.com/v1/forecast', [
            'query' => [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'current' => 'temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature',
                'timezone' => 'auto',
            ]
        ])->toArray();

        return $this->json([
            'temperature' => $meteo['current']['temperature_2m'],
            'weathercode' => $meteo['current']['weathercode'],
            'windspeed' => $meteo['current']['windspeed_10m'],
            'humidity' => $meteo['current']['relativehumidity_2m'],
            'apparent_temperature' => $meteo['current']['apparent_temperature'],
        ]);
    }

    // Route API : Grâce à la barre de recherche elle reçoit un nom de ville, récupère ses coordonnées via geocoding puis retourne la météo en JSON
    #[Route('/meteo/ville', name: 'meteo_ville')]
    public function ville(Request $request, HttpClientInterface $http): JsonResponse
    {
        $nom = $request->query->get('nom');

        $geo = $http->request('GET', 'https://geocoding-api.open-meteo.com/v1/search', [
            'query' => [
                'name' => $nom,
                'count' => 1,
                'language' => 'fr',
            ]
        ])->toArray();

        if (empty($geo['results'])) {
            return $this->json(['erreur' => 'Ville introuvable'], 404);
        }

        $ville = $geo['results'][0];

        $meteo = $http->request('GET', 'https://api.open-meteo.com/v1/forecast', [
            'query' => [
                'latitude' => $ville['latitude'],
                'longitude' => $ville['longitude'],
                'current' => 'temperature_2m,weathercode',
                'timezone' => 'auto',
            ]
        ])->toArray();

        return $this->json([
            'ville' => $ville['name'],
            'pays' => $ville['country'],
            'temperature' => $meteo['current']['temperature_2m'],
            'weathercode' => $meteo['current']['weathercode'],
        ]);
    }
}
