# meteo-app
Ce projet est une application météo permettant de savoir la température et la météo d'une ville recherché ou de notre position.
Ce projet a été fait dans le but de découvrir FrankenPHP et Symfony ainsi que l'outil Docker.

## Stack technique
- FrankenPHP
- Symfony
- API Open-Meteo
- Docker

## Prérequis
- Docker Desktop installé et lancé
- Un navigateur moderne (Chrome, Firefox, Safari)
  
## Installation
# Cloner le projet
```bash
git clone https://github.com/Mathisqrn/meteo-app.git
cd meteo-app
```

# Installer les dépendances PHP
```bash
docker run --rm -v $(pwd)/app:/app -w /app composer install
```

# Lancer le projet
```bash
docker compose up
```

Puis visiter http://localhost:8080/meteo.

## Utilisation
Vous pouvez appuyer sur le bouton "Ma position" en acceptant la demande de position du navigateur vous connaitrez la météo de votre position. 
Vous pouvez également cliquer sur le bouton "Rechercher une ville" pour insérer le nom d'une ville et connaitre également sa météo.

## Structure du projet
- `app/src/Controller/` — Controllers Symfony (logique métier)
- `app/templates/` — Templates Twig (vues HTML)
- `app/assets/` — Fichiers JavaScript et CSS
- `docker-compose.yml` — Configuration Docker
- `Caddyfile` — Configuration du serveur FrankenPHP

## Démarche Git

Ce projet a été versionné avec Git dès le début, avec un commit par étape significative.

Les nouvelles fonctionnalités ont été développées sur une branche dédiée `feature/nouvelles-donnees` puis fusionnées sur `main` une fois validées.

## Auteur
Mathisqrn https://github.com/Mathisqrn
