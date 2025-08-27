// Configuration de l'API Cockpit
export const API_CONFIG = {
  BASE_URL: 'https://ingrwf12.cepegra-frontend.xyz/cockpit2/api/content',
  ENDPOINTS: {
    USERS: '/items/users',
    USER: '/item/users',
  },
}

// Configuration par défaut de la carte
export const MAP_CONFIG = {
  DEFAULT_CENTER: [50.4108, 4.4446], // Charleroi
  DEFAULT_ZOOM: 13,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; OpenStreetMap contributors',
}

// Configuration de la géolocalisation
export const GEOLOCATION_CONFIG = {
  HIGH_ACCURACY: {
    enableHighAccuracy: true,
    timeout: 15000, // 15 secondes
    maximumAge: 30000, // Cache 30 secondes
  },
  NORMAL_ACCURACY: {
    enableHighAccuracy: false,
    timeout: 10000, // 10 secondes
    maximumAge: 60000, // Cache 1 minute
  },
  WATCH_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 20000, // 20 secondes pour le suivi
    maximumAge: 10000, // Cache 10 secondes pour le suivi
  },
}

// Intervalle de rafraîchissement automatique (en ms)
export const REFRESH_INTERVAL = 10000
