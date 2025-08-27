import { defineStore } from 'pinia'
import { API_CONFIG } from '../config/constants'
import { useGeolocation } from '../composables/useGeolocation'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    users: [],
  }),
  getters: {
    userId: (state) => {
      return state.user?._id
    },
    userPseudo: (state) => state.user?.pseudo,
    isLoggedIn: (state) => !!state.user?._id,
  },
  actions: {
    async register({ pseudo, lat, long }) {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { pseudo, lat, long } }),
      })

      if (!res.ok) throw new Error(`Erreur API: ${res.status} - ${res.statusText}`)
      const data = await res.json()

      // Vérification que l'utilisateur créé contient bien un ID
      if (!data._id) {
        throw new Error('ID utilisateur manquant dans la réponse API')
      }

      this.user = data
      return data
    },

    async fetchUsers() {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`)
      if (!res.ok) throw new Error('Erreur API')
      this.users = await res.json()
    },

    async updateUser(id, { pseudo, lat, long }) {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: id,
          data: { pseudo, lat, long },
        }),
      })
      if (res.status === 200) {
        this.user = await res.json()
      } else {
        throw new Error('Erreur API')
      }
    },
    async deleteUser(id) {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Erreur suppression')
      // Remove user from local state instead of refetching all
      this.users = this.users.filter((user) => user._id !== id)
    },

    async updateUserPosition(position) {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            pseudo: this.user?.pseudo,
            lat: position.lat,
            long: position.long,
            _id: this.user?._id,
          },
        }),
      })
      if (res.status === 200) {
        this.user = await res.json()
        // Update user in the users list
        const index = this.users.findIndex((u) => u._id === this.user?._id)
        if (index !== -1) {
          this.users[index] = { ...this.users[index], lat: position.lat, long: position.long }
        }
      } else {
        throw new Error('Erreur lors de la mise à jour de la position')
      }
    },

    // Méthode pour obtenir la position actuelle avec haute précision
    async getCurrentPosition(useHighAccuracy = true) {
      const { getCurrentPosition } = useGeolocation()
      return await getCurrentPosition(useHighAccuracy)
    },

    // Méthode pour obtenir une position très précise avec plusieurs tentatives
    async getAccuratePosition(maxAttempts = 3, minAccuracy = 50) {
      const { getAccuratePosition } = useGeolocation()
      return await getAccuratePosition(maxAttempts, minAccuracy)
    },

    // Méthode pour surveiller la position en continu
    watchUserPosition(callback, useHighAccuracy = true) {
      const { watchPosition } = useGeolocation()
      return watchPosition(callback, useHighAccuracy)
    },
  },
})
