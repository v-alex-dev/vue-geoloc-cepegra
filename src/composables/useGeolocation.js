import { ref } from 'vue'
import { GEOLOCATION_CONFIG } from '@/config/constants'

export function useGeolocation() {
  const isLoading = ref(false)
  const error = ref(null)

  const getCurrentPosition = async (useHighAccuracy = true) => {
    isLoading.value = true
    error.value = null

    const options = useHighAccuracy
      ? GEOLOCATION_CONFIG.HIGH_ACCURACY
      : GEOLOCATION_CONFIG.NORMAL_ACCURACY

    try {
      // Première tentative avec les options demandées
      let position
      try {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options)
        })
      } catch (highAccuracyError) {
        // Si la haute précision échoue, essayer avec les options normales
        if (useHighAccuracy) {
          console.warn(
            'Haute précision échouée, tentative avec précision normale:',
            highAccuracyError.message,
          )
          position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              GEOLOCATION_CONFIG.NORMAL_ACCURACY,
            )
          })
        } else {
          throw highAccuracyError
        }
      }

      return {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        accuracy: position.coords.accuracy, // Précision en mètres
        altitude: position.coords.altitude, // Altitude si disponible
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading, // Direction si disponible
        speed: position.coords.speed, // Vitesse si disponible
        timestamp: position.timestamp,
      }
    } catch (err) {
      error.value = err.message || 'Erreur de géolocalisation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Fonction pour surveiller la position en continu
  const watchPosition = (callback, useHighAccuracy = true) => {
    const options = useHighAccuracy
      ? GEOLOCATION_CONFIG.WATCH_OPTIONS
      : GEOLOCATION_CONFIG.NORMAL_ACCURACY

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        })
      },
      (err) => {
        error.value = err.message || 'Erreur de surveillance de position'
        console.error('Erreur watchPosition:', err)
      },
      options,
    )
  }

  // Fonction pour obtenir une position avec plusieurs tentatives
  const getAccuratePosition = async (maxAttempts = 3, minAccuracy = 50) => {
    let bestPosition = null
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const position = await getCurrentPosition(true)

        if (!bestPosition || position.accuracy < bestPosition.accuracy) {
          bestPosition = position
        }

        // Si on a atteint la précision souhaitée, on s'arrête
        if (position.accuracy <= minAccuracy) {
          break
        }

        attempts++

        // Attendre un peu avant la prochaine tentative
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch (err) {
        attempts++
        if (attempts >= maxAttempts) {
          throw err
        }
      }
    }

    return bestPosition
  }

  return {
    getCurrentPosition,
    watchPosition,
    getAccuratePosition,
    isLoading,
    error,
  }
}
