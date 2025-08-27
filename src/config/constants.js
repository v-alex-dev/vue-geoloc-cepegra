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

// Intervalle de rafraîchissement automatique (en ms)
export const REFRESH_INTERVAL = 10000
