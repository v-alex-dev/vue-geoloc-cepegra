import { ref } from 'vue'

export function useGeolocation() {
  const isLoading = ref(false)
  const error = ref(null)

  const getCurrentPosition = async () => {
    isLoading.value = true
    error.value = null

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      return {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      }
    } catch (err) {
      error.value = err.message || 'Erreur de géolocalisation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    getCurrentPosition,
    isLoading,
    error,
  }
}
