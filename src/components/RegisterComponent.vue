<template>
  <div class="register-container glass fade-in">
    <h2 class="neon-text title-responsive">Inscription</h2>
    <form @submit.prevent="register" class="form-responsive">
      <input v-model="pseudo" type="text" placeholder="Pseudo" required class="input-glass" />
      <div class="accuracy-options">
        <label class="checkbox-container">
          <input type="checkbox" v-model="useHighAccuracy" />
          <span class="checkmark"></span>
          Haute précision GPS (recommandé)
        </label>
        <small v-if="useHighAccuracy" class="text-info">
          La haute précision peut prendre plus de temps mais sera plus précise
        </small>
      </div>
      <button type="submit" class="btn-glass" :disabled="isLoading">
        {{ isLoading ? 'Géolocalisation...' : "S'inscrire" }}
      </button>
      <p v-if="error" class="error neon-text text-responsive">{{ error }}</p>
      <div v-if="lastPosition" class="position-info">
        <small class="text-info">
          Position obtenue avec une précision de {{ Math.round(lastPosition.accuracy) }}m
        </small>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useGeolocation } from '../composables/useGeolocation'
import { useRouter } from 'vue-router'

const pseudo = ref('')
const error = ref('')
const useHighAccuracy = ref(true)
const lastPosition = ref(null)
const userStore = useUserStore()
const router = useRouter()
const { getCurrentPosition, getAccuratePosition, isLoading } = useGeolocation()

async function register() {
  if (!pseudo.value) return (error.value = 'Pseudo requis.')

  try {
    error.value = ''

    // Utiliser la méthode de haute précision avec plusieurs tentatives si activée
    const position = useHighAccuracy.value
      ? await getAccuratePosition(3, 50) // 3 tentatives, précision min 50m
      : await getCurrentPosition(false)

    lastPosition.value = position

    const userData = await userStore.register({
      pseudo: pseudo.value,
      lat: position.lat,
      long: position.long,
    })

    // Vérification que l'utilisateur a bien été créé avec un ID
    if (!userData._id) {
      throw new Error('Utilisateur créé mais sans ID')
    }

    // Redirige vers la carte si succès
    router.push('/map')
  } catch (err) {
    error.value = err.message || "Erreur d'inscription ou de géolocalisation."
    lastPosition.value = null
  }
}
</script>

<style scoped>
@import '../style.css';

.register-container {
  max-width: 400px;
  margin: 2rem auto;
}

.form-responsive {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accuracy-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #00ffe7;
}

.checkbox-container input[type='checkbox'] {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #00ffe7;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
  position: relative;
}

.checkbox-container input[type='checkbox']:checked {
  background: #00ffe7;
}

.checkbox-container input[type='checkbox']:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #222;
  font-weight: bold;
  font-size: 12px;
}

.text-info {
  color: #00ffe7;
  opacity: 0.8;
  font-size: 0.8rem;
}

.position-info {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 255, 231, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 255, 231, 0.3);
}

.btn-glass:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .register-container {
    margin: 1rem auto;
    max-width: 100%;
  }

  .form-responsive {
    gap: 0.75rem;
  }
}

.error {
  margin-top: 1rem;
}
</style>
